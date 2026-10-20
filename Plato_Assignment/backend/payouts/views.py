import uuid
from datetime import timedelta

from django.db import transaction, IntegrityError
from django.db.models import Q, Sum, Value, BigIntegerField
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from merchants.models import Merchant, LedgerEntry, IdempotencyKey
from .models import Payout, InvalidStateTransition
from .serializers import PayoutSerializer, CreatePayoutSerializer


def _compute_available_balance(merchant):
    """
    Computes available balance entirely at the DB level.
    Uses SUM aggregation — never Python arithmetic on fetched rows.
    """
    agg = LedgerEntry.objects.filter(merchant=merchant).aggregate(
        credits=Coalesce(
            Sum('amount_paise', filter=Q(entry_type='credit')),
            Value(0), output_field=BigIntegerField()
        ),
        debits=Coalesce(
            Sum('amount_paise', filter=Q(entry_type='debit')),
            Value(0), output_field=BigIntegerField()
        ),
    )
    return agg['credits'] - agg['debits']


class PayoutListCreateView(APIView):
    """
    GET  /api/v1/payouts/?merchant_id=<uuid>  — list payouts for a merchant
    POST /api/v1/payouts/                      — create a payout request
    """

    def get(self, request):
        merchant_id = request.query_params.get('merchant_id')
        if not merchant_id:
            return Response({'error': 'merchant_id query param is required'}, status=400)
        payouts = Payout.objects.filter(merchant_id=merchant_id).select_related('merchant')
        serializer = PayoutSerializer(payouts, many=True)
        return Response(serializer.data)

    def post(self, request):
        # --- Validate idempotency key header ---
        raw_key = request.headers.get('Idempotency-Key', '').strip()
        if not raw_key:
            return Response(
                {'error': 'Idempotency-Key header is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            idempotency_key_uuid = uuid.UUID(raw_key)
        except ValueError:
            return Response(
                {'error': 'Idempotency-Key must be a valid UUID'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Validate request body ---
        ser = CreatePayoutSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        merchant_id = ser.validated_data['merchant_id']
        amount_paise = ser.validated_data['amount_paise']
        bank_account_id = ser.validated_data['bank_account_id']

        try:
            merchant = Merchant.objects.get(pk=merchant_id)
        except Merchant.DoesNotExist:
            return Response({'error': 'Merchant not found'}, status=status.HTTP_404_NOT_FOUND)

        # -----------------------------------------------------------------------
        # IDEMPOTENCY CHECK (outside main transaction for fast path)
        # -----------------------------------------------------------------------
        try:
            existing_ik = IdempotencyKey.objects.get(
                key=idempotency_key_uuid,
                merchant=merchant
            )
            if not existing_ik.is_expired():
                # Return cached response — same status code, same body
                if existing_ik.response_body:
                    return Response(existing_ik.response_body, status=existing_ik.status_code)
                # Key exists but response not yet written — concurrent request in progress
                return Response(
                    {'error': 'A request with this idempotency key is already in progress'},
                    status=status.HTTP_409_CONFLICT
                )
            else:
                # Expired key — delete and reprocess
                existing_ik.delete()
        except IdempotencyKey.DoesNotExist:
            pass

        # -----------------------------------------------------------------------
        # MAIN TRANSACTION — atomic, serialised via SELECT FOR UPDATE
        # -----------------------------------------------------------------------
        with transaction.atomic():
            # Step 1: Reserve the idempotency key slot (unique constraint is our gate)
            try:
                with transaction.atomic():   # savepoint to catch IntegrityError cleanly
                    ik = IdempotencyKey.objects.create(
                        key=idempotency_key_uuid,
                        merchant=merchant,
                        response_body={},    # empty until we finish
                        status_code=201,
                    )
            except IntegrityError:
                # Another request with the same key just beat us to it
                ik = IdempotencyKey.objects.get(key=idempotency_key_uuid, merchant=merchant)
                if ik.response_body:
                    return Response(ik.response_body, status=ik.status_code)
                return Response(
                    {'error': 'A request with this idempotency key is already in progress'},
                    status=status.HTTP_409_CONFLICT
                )

            # Step 2: Lock the merchant row — this serialises concurrent payout requests
            # for the SAME merchant. If two 60₹ requests race on a 100₹ balance,
            # the second request blocks here until the first commits.
            merchant = Merchant.objects.select_for_update().get(pk=merchant_id)

            # Step 3: Compute available balance using DB-level aggregation (inside lock)
            agg = LedgerEntry.objects.filter(merchant=merchant).aggregate(
                credits=Coalesce(
                    Sum('amount_paise', filter=Q(entry_type='credit')),
                    Value(0), output_field=BigIntegerField()
                ),
                debits=Coalesce(
                    Sum('amount_paise', filter=Q(entry_type='debit')),
                    Value(0), output_field=BigIntegerField()
                ),
            )
            available = agg['credits'] - agg['debits']

            # Step 4: Insufficient funds — cache this failure in the idempotency key
            if available < amount_paise:
                error_body = {
                    'error': 'Insufficient funds',
                    'available_paise': available,
                    'requested_paise': amount_paise,
                }
                ik.response_body = error_body
                ik.status_code = 402
                ik.save(update_fields=['response_body', 'status_code'])
                return Response(error_body, status=status.HTTP_402_PAYMENT_REQUIRED)

            # Step 5: Create payout + debit ledger entry atomically
            payout = Payout.objects.create(
                merchant=merchant,
                amount_paise=amount_paise,
                bank_account_id=bank_account_id,
                idempotency_key=ik,
                status=Payout.PENDING,
            )

            LedgerEntry.objects.create(
                merchant=merchant,
                entry_type=LedgerEntry.DEBIT,
                amount_paise=amount_paise,
                payout=payout,
                description=f'Payout hold — bank account {bank_account_id}',
            )

            # Step 6: Cache the successful response in the idempotency key
            response_data = PayoutSerializer(payout).data
            ik.response_body = response_data
            ik.status_code = 201
            ik.save(update_fields=['response_body', 'status_code'])

        return Response(response_data, status=status.HTTP_201_CREATED)


class PayoutDetailView(APIView):
    """GET /api/v1/payouts/<uuid>/"""

    def get(self, request, payout_id):
        try:
            payout = Payout.objects.select_related('merchant').get(pk=payout_id)
        except Payout.DoesNotExist:
            return Response({'error': 'Payout not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(PayoutSerializer(payout).data)
