from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task
def cleanup_expired_idempotency_keys():
    """Runs every hour. Removes idempotency keys older than 24 hours."""
    from .models import IdempotencyKey
    cutoff = timezone.now() - timedelta(hours=24)
    deleted_count, _ = IdempotencyKey.objects.filter(created_at__lt=cutoff).delete()
    logger.info(f"Cleaned up {deleted_count} expired idempotency keys.")
