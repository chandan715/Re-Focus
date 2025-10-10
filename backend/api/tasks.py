from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import requests
from .models import MotivationSubscription


LOCAL_QUOTES = [
    "Believe you can and you're halfway there.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The secret of getting ahead is getting started.",
    "Don’t watch the clock; do what it does. Keep going.",
    "What we fear of doing most is usually what we most need to do.",
]


def fetch_quote() -> str:
    try:
        # Free API option; no key required. If rate-limited, fall back.
        resp = requests.get("https://zenquotes.io/api/random", timeout=5)
        if resp.ok:
            data = resp.json()
            if isinstance(data, list) and data:
                q = data[0]
                return f"{q.get('q', '').strip()} — {q.get('a', '').strip()}".strip()
    except Exception:
        pass
    # Fallback local list
    return LOCAL_QUOTES[timezone.now().minute % len(LOCAL_QUOTES)]


@shared_task
def process_motivation_subscriptions():
    now = timezone.now()
    due = MotivationSubscription.objects.filter(active=True, next_send_at__lte=now)
    for sub in due.select_related('user'):
        # Prepare email
        subject = f"Motivation for your goal: {sub.goal_label}"
        quote = fetch_quote()
        message = (
            f"Hi {sub.user.username},\n\n"
            f"Here's your hourly motivation for goal '{sub.goal_label}':\n\n"
            f"{quote}\n\n"
            f"Stay focused!\n"
        )
        recipient = [sub.user.email] if sub.user.email else []
        if recipient:
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient, fail_silently=True)
            except Exception:
                # Ignore email errors; we will still reschedule
                pass

        # Schedule next
        sub.next_send_at = now + timezone.timedelta(minutes=sub.interval_minutes)
        sub.save(update_fields=["next_send_at", "updated_at"])
