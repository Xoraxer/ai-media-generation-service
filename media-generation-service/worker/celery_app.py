from celery import Celery
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Create Celery app
celery_app = Celery(
    "media_generation_worker",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.celery_tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    task_routes={
        "app.tasks.celery_tasks.process_media_generation": {"queue": "media_generation"},
    },
    task_default_queue="default",
    task_default_exchange="default",
    task_default_exchange_type="direct",
    task_default_routing_key="default",
)

# Configure retry settings
celery_app.conf.task_annotations = {
    "*": {
        "rate_limit": "10/s",
        "time_limit": 30 * 60,
        "soft_time_limit": 25 * 60,
    },
    "app.tasks.celery_tasks.process_media_generation": {
        "rate_limit": "5/s",
        "max_retries": settings.max_retries,
        "default_retry_delay": 60,
        "retry_backoff": True,
        "retry_backoff_max": 600,
        "retry_jitter": True,
    }
}

if __name__ == "__main__":
    celery_app.start() 