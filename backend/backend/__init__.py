try:
    from .celery import app as celery_app  # Optional: only if Celery is installed
except Exception:
    celery_app = None

__all__ = ("celery_app",)
