import uuid
from django.db import models
from django.utils import timezone


class InvalidStateTransition(Exception):
    pass


class Payout(models.Model):
    PENDING = 'pending'
    PROCESSING = 'processing'
    COMPLETED = 'completed'
    FAILED = 'failed'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (PROCESSING, 'Processing'),
        (COMPLETED, 'Completed'),
        (FAILED, 'Failed'),
    ]

    # Legal state transitions only
    VALID_TRANSITIONS = {
        PENDING:    [PROCESSING],
        PROCESSING: [COMPLETED, FAILED],
        COMPLETED:  [],   # terminal
        FAILED:     [],   # terminal
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    merchant = models.ForeignKey(
        'merchants.Merchant', on_delete=models.PROTECT, related_name='payouts'
    )
    amount_paise = models.BigIntegerField()
    bank_account_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    idempotency_key = models.ForeignKey(
        'merchants.IdempotencyKey', on_delete=models.SET_NULL, null=True
    )
    attempts = models.IntegerField(default=0)
    processing_started_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payout {self.id} ({self.status}) — {self.amount_paise} paise"

    def transition(self, new_status):
        """
        Enforce state machine. Must be called inside select_for_update() transaction.
        Raises InvalidStateTransition for illegal moves.
        """
        allowed = self.VALID_TRANSITIONS.get(self.status, [])
        if new_status not in allowed:
            raise InvalidStateTransition(
                f"Cannot transition payout {self.id} from '{self.status}' to '{new_status}'. "
                f"Allowed: {allowed}"
            )
        self.status = new_status
        if new_status == self.PROCESSING:
            self.processing_started_at = timezone.now()
