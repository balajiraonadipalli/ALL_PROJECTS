import random
import logging
from datetime import timedelta

from celery import shared_task
from django.db import transaction
from django.db.models import Sum, Value, BigIntegerField
from django.db.models.functions import Coalesce
from django.utils import timezone

logger = logging.getLogger(__name__)


def _fail_payout_atomically(payout, reason: str):
    """
    Transitions a payout to 'failed' and returns funds to the merchant
    in a single atomic operation. Must be called with payout already
    locked via select_for_update().
    """
    from merchants.models import LedgerEntry
    from .models import InvalidStateTransition

    try:
        payout.transition('failed')
    except InvalidStateTransition as e:
        logger.warning(f"Cannot fail payout {payout.id}: {e}")
        return

    payout.failure_reason = reason
    payout.save(update_fields=['status', 'failure_reason', 'updated_at'])

    # Return funds — atomic with state transition
    LedgerEntry.objects.create(
        merchant=payout.merchant,
        entry_type='credit',
        amount_paise=payout.amount_paise,
        payout=payout,
        description=f'Payout failed ({reason}) — funds returned',
    )
    logger.info(f"Payout {payout.id} failed. {payout.amount_paise} paise returned to merchant {payout.merchant_id}.")


@shared_task(bind=True, max_retries=0)
def process_pending_payouts(self):
    """
    Celery Beat task — runs every 10 seconds.
    Picks up PENDING payouts, transitions them to PROCESSING,
    then enqueues individual processing tasks.
    """
    from .models import Payout

    payout_ids = []

    with transaction.atomic():
        # skip_locked=True so multiple workers don't step on each other
        pending = list(
            Payout.objects.select_for_update(skip_locked=True)
            .filter(status=Payout.PENDING)
        )
        for payout in pending:
            payout.transition('processing')
            payout.attempts += 1
            payout.save(update_fields=['status', 'processing_started_at', 'attempts', 'updated_at'])
            payout_ids.append(str(payout.id))

    # Enqueue outside the transaction so the IDs are committed
    for pid in payout_ids:
        process_single_payout.delay(pid)

    if payout_ids:
        logger.info(f"Dispatched {len(payout_ids)} payout(s) to processing: {payout_ids}")


@shared_task(bind=True, max_retries=0)
def process_single_payout(self, payout_id: str):
    """
    Simulates bank settlement:
      70% → success (completed)
      20% → failure (failed + refund, atomic)
      10% → hang (no-op — retry_stuck_payouts will catch it after 30s)
    """
    from .models import Payout, InvalidStateTransition

    roll = random.random()

    with transaction.atomic():
        try:
            payout = Payout.objects.select_for_update().get(pk=payout_id)
        except Payout.DoesNotExist:
            logger.error(f"process_single_payout: payout {payout_id} not found")
            return

        if payout.status != Payout.PROCESSING:
            logger.info(f"Payout {payout_id} is already {payout.status}, skipping.")
            return

        if roll < 0.70:
            # SUCCESS
            try:
                payout.transition('completed')
                payout.save(update_fields=['status', 'updated_at'])
                logger.info(f"Payout {payout_id} COMPLETED (roll={roll:.2f})")
            except InvalidStateTransition as e:
                logger.warning(f"State transition error for {payout_id}: {e}")

        elif roll < 0.90:
            # FAILURE — atomic refund inside this transaction
            _fail_payout_atomically(payout, reason='Bank rejected the transfer')
            logger.info(f"Payout {payout_id} FAILED (roll={roll:.2f})")

        else:
            # HANG — do nothing; retry_stuck_payouts will handle after 30s
            logger.info(f"Payout {payout_id} is HANGING (roll={roll:.2f}), will be retried.")


@shared_task(bind=True, max_retries=0)
def retry_stuck_payouts(self):
    """
    Celery Beat task — runs every 30 seconds.
    Finds payouts stuck in PROCESSING for > 30s.
    Retries with exponential backoff up to 3 attempts, then fails.
    """
    from .models import Payout

    cutoff = timezone.now() - timedelta(seconds=30)

    with transaction.atomic():
        stuck = list(
            Payout.objects.select_for_update(skip_locked=True)
            .filter(status=Payout.PROCESSING, processing_started_at__lt=cutoff)
        )

        for payout in stuck:
            if payout.attempts < 3:
                backoff_seconds = 2 ** payout.attempts   # 2, 4, 8 seconds
                payout.attempts += 1
                # Reset to pending so process_pending_payouts picks it up
                payout.status = Payout.PENDING
                payout.processing_started_at = None
                payout.save(update_fields=['status', 'attempts', 'processing_started_at', 'updated_at'])
                logger.info(
                    f"Payout {payout.id} stuck — retrying (attempt {payout.attempts}, "
                    f"backoff {backoff_seconds}s)"
                )
                process_single_payout.apply_async(
                    args=[str(payout.id)],
                    countdown=backoff_seconds
                )
            else:
                _fail_payout_atomically(payout, reason='Max retries exceeded after bank timeout')
                logger.warning(f"Payout {payout.id} permanently FAILED after {payout.attempts} attempts.")
