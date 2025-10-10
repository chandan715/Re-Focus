from django.urls import path
from . import views

urlpatterns = [
    # User management
    path('users/create/', views.UserCreate.as_view(), name='user-create'),
    path('profile/', views.UserProfileDetail.as_view(), name='profile-detail'),
    path('profile/avatar/', views.UserProfileAvatarUpload.as_view(), name='profile-avatar-upload'),
    
    # Goals
    path('goals/', views.GoalListCreate.as_view(), name='goal-list-create'),
    path('goals/<int:pk>/', views.GoalDetail.as_view(), name='goal-detail'),
    
    # Focus Sessions
    path('focus-sessions/', views.FocusSessionListCreate.as_view(), name='focus-session-list-create'),
    path('focus-sessions/<int:pk>/', views.FocusSessionDetail.as_view(), name='focus-session-detail'),
    path('focus-sessions/<int:pk>/complete/', views.FocusSessionComplete.as_view(), name='focus-session-complete'),
    
    # Distraction Logs
    path('distractions/', views.DistractionLogListCreate.as_view(), name='distraction-list-create'),
    path('distractions/<int:pk>/', views.DistractionLogDetail.as_view(), name='distraction-detail'),
    
    # Emotional Check-ins
    path('emotional-checkins/', views.EmotionalCheckInListCreate.as_view(), name='emotional-checkin-list-create'),
    path('emotional-checkins/<int:pk>/', views.EmotionalCheckInDetail.as_view(), name='emotional-checkin-detail'),
    
    # Motivational Nudges
    path('motivational-nudges/', views.MotivationalNudgeList.as_view(), name='motivational-nudge-list'),
    path('motivational-nudges/<int:pk>/', views.MotivationalNudgeDetail.as_view(), name='motivational-nudge-detail'),
    
    # Study Streaks
    path('study-streak/', views.StudyStreakDetail.as_view(), name='study-streak-detail'),
    
    # Dashboard
    path('dashboard/stats/', views.DashboardStats.as_view(), name='dashboard-stats'),
    
    # Motivation email automation
    path('motivation/start/', views.MotivationStart.as_view(), name='motivation-start'),
    path('motivation/stop/', views.MotivationStop.as_view(), name='motivation-stop'),
    
    # Motivational Quotes
    path('quotes/', views.MotivationalQuoteList.as_view(), name='quote-list'),
    path('quotes/random/', views.RandomMotivationalQuote.as_view(), name='quote-random'),
]
