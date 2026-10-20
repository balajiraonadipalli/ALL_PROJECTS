from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Value, BigIntegerField
from django.db.models.functions import Coalesce

from .models import Merchant, LedgerEntry
from .serializers import MerchantSerializer, LedgerEntrySerializer


class MerchantListView(APIView):
    def get(self, request):
        merchants = Merchant.objects.all().order_by('name')
        serializer = MerchantSerializer(merchants, many=True)
        return Response(serializer.data)


class MerchantBalanceView(APIView):
    def get(self, request, merchant_id):
        try:
            merchant = Merchant.objects.get(pk=merchant_id)
        except Merchant.DoesNotExist:
            return Response({'error': 'Merchant not found'}, status=status.HTTP_404_NOT_FOUND)

        summary = merchant.get_balance_summary()
        return Response({
            'merchant_id': str(merchant.id),
            'merchant_name': merchant.name,
            **summary,
        })


class MerchantLedgerView(APIView):
    def get(self, request, merchant_id):
        try:
            merchant = Merchant.objects.get(pk=merchant_id)
        except Merchant.DoesNotExist:
            return Response({'error': 'Merchant not found'}, status=status.HTTP_404_NOT_FOUND)

        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))
        offset = (page - 1) * page_size

        entries = merchant.ledger_entries.select_related('payout').all()
        total = entries.count()
        entries = entries[offset: offset + page_size]

        serializer = LedgerEntrySerializer(entries, many=True)
        return Response({
            'count': total,
            'page': page,
            'page_size': page_size,
            'results': serializer.data,
        })
