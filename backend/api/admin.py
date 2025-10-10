from django.contrib import admin
from .models import (
    UserProfile, Goal, FocusSession, DistractionLog, 
    EmotionalCheckIn, MotivationalNudge, StudyStreak
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'daily_goal_hours', 'timezone', 'created_at']
    list_filter = ['daily_goal_hours', 'timezone', 'created_at']
    search_fields = ['user__username', 'user__email', 'bio']

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'category', 'priority', 'status', 'completed', 'created_at']
    list_filter = ['priority', 'status', 'completed', 'category', 'created_at']
    search_fields = ['title', 'description', 'user__username']
    date_hierarchy = 'created_at'

@admin.register(FocusSession)
class FocusSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_type', 'duration_minutes', 'goal', 'start_time', 'completed']
    list_filter = ['session_type', 'completed', 'start_time']
    search_fields = ['user__username', 'notes', 'goal__title']
    date_hierarchy = 'start_time'

@admin.register(DistractionLog)
class DistractionLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'distraction_type', 'duration_minutes', 'focus_session', 'timestamp']
    list_filter = ['distraction_type', 'timestamp']
    search_fields = ['user__username', 'description']
    date_hierarchy = 'timestamp'

@admin.register(EmotionalCheckIn)
class EmotionalCheckInAdmin(admin.ModelAdmin):
    list_display = ['user', 'mood', 'energy_level', 'stress_level', 'timestamp']
    list_filter = ['mood', 'energy_level', 'stress_level', 'timestamp']
    search_fields = ['user__username', 'notes']
    date_hierarchy = 'timestamp'

@admin.register(MotivationalNudge)
class MotivationalNudgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'nudge_type', 'title', 'read', 'created_at', 'scheduled_for']
    list_filter = ['nudge_type', 'read', 'created_at', 'scheduled_for']
    search_fields = ['title', 'content', 'user__username']
    date_hierarchy = 'created_at'

@admin.register(StudyStreak)
class StudyStreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak', 'longest_streak', 'total_study_days', 'last_study_date']
    list_filter = ['current_streak', 'longest_streak', 'last_study_date']
    search_fields = ['user__username'] 