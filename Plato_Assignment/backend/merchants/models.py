import uuid
from django.db import models
from django.db.models import Sum, Case, When, F, BigIntegerField, Value
from django.db.models.functions import Coalesce


class Merchant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    bank_account_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def get_balance_summary(self):
        """
        Compute balance entirely at the database level using aggregation.
        Never fetches rows and sums in Python.
        Returns dict with available_paise and held_paise.
        """
        from payouts.models import Payout

        agg = self.ledger_entries.aggregate(
            total_credits=Coalesce(
                Sum('amount_paise', filter=models.Q(entry_type='credit')),
                Value(0),
                output_field=BigIntegerField()
            ),
            total_debits=Coalesce(
                Sum('amount_paise', filter=models.Q(entry_type='debit')),
                Value(0),
                output_field=BigIntegerField()
            ),
        )

        held = Coalesce(
            Payout.objects.filter(
                merchant=self,
                status__in=['pending', 'processing']
            ).aggregate(h=Sum('amount_paise'))['h'],
            0
        )

        total_credits = agg['total_credits']
        total_debits = agg['total_debits']
        net = total_credits - total_debits

        return {
            'available_paise': net,
            'held_paise': held,
            'total_credited_paise': total_credits,
            'total_debited_paise': total_debits,
        }


class IdempotencyKey(models.Model):
    """Stores merchant-scoped idempotency keys for payout requests."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.UUIDField()
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name='idempotency_keys')
    response_body = models.JSONField(default=dict)
    status_code = models.IntegerField(default=201)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('key', 'merchant')]

    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta
        return self.created_at < timezone.now() - timedelta(hours=24)


class LedgerEntry(models.Model):
    CREDIT = 'credit'
    DEBIT = 'debit'
    ENTRY_TYPE_CHOICES = [(CREDIT, 'Credit'), (DEBIT, 'Debit')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT, related_name='ledger_entries')
    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPE_CHOICES)
    # BIGINT — never FloatField, never DecimalField
    amount_paise = models.BigIntegerField()
    description = models.CharField(max_length=255, blank=True)
    payout = models.ForeignKey(
        'payouts.Payout',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='ledger_entries'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.entry_type} {self.amount_paise} paise for {self.merchant.name}"
