from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse
from django.urls import reverse

def home(request):
    return HttpResponse("Welcome to Re-Focus API backend!")

def api_root(request):
    """API root view that shows all available endpoints"""
    api_endpoints = {
        "users": {
            "create": reverse('user-create'),
            "profile": reverse('profile-detail'),
        },
        "goals": {
            "list_create": reverse('goal-list-create'),
            "detail": reverse('goal-detail', args=[1]).replace('/1/', '/{id}/'),
        },
        "focus_sessions": {
            "list_create": reverse('focus-session-list-create'),
            "detail": reverse('focus-session-detail', args=[1]).replace('/1/', '/{id}/'),
            "complete": reverse('focus-session-complete', args=[1]).replace('/1/', '/{id}/'),
        },
        "distractions": {
            "list_create": reverse('distraction-list-create'),
            "detail": reverse('distraction-detail', args=[1]).replace('/1/', '/{id}/'),
        },
        "emotional_checkins": {
            "list_create": reverse('emotional-checkin-list-create'),
            "detail": reverse('emotional-checkin-detail', args=[1]).replace('/1/', '/{id}/'),
        },
        "motivational_nudges": {
            "list": reverse('motivational-nudge-list'),
            "detail": reverse('motivational-nudge-detail', args=[1]).replace('/1/', '/{id}/'),
        },
        "study_streak": {
            "detail": reverse('study-streak-detail'),
        },
        "dashboard": {
            "stats": reverse('dashboard-stats'),
        },
        "admin": reverse('admin:index'),
        "documentation": "Check API_DOCUMENTATION.md for detailed endpoint information"
    }
    
    return JsonResponse({
        "message": "Welcome to Re-Focus API!",
        "description": "Productivity and motivation companion app for students",
        "endpoints": api_endpoints,
        "usage": {
            "authentication": "Most endpoints require authentication. Use Token Authentication.",
            "headers": "Include 'Authorization: Token <your_token>' in request headers",
            "demo_user": "demo_student / demo123456 (after running setup.py)"
        }
    }, json_dumps_params={'indent': 2})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),  # API root view
    path('api/', include('api.urls')),  # API endpoints
    path('', home),  # Home page
] 