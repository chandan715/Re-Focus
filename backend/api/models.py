from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, max_length=500)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    timezone = models.CharField(max_length=50, default='UTC')
    daily_goal_hours = models.PositiveIntegerField(default=8)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Goal(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    target_date = models.DateField(blank=True, null=True)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}: {self.title}"

class FocusSession(models.Model):
    SESSION_TYPE_CHOICES = [
        ('pomodoro', 'Pomodoro'),
        ('custom', 'Custom'),
        ('break', 'Break'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='focus_sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES, default='pomodoro')
    duration_minutes = models.PositiveIntegerField()
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, blank=True, related_name='focus_sessions')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.session_type} ({self.duration_minutes}min)"

class DistractionLog(models.Model):
    DISTRACTION_TYPE_CHOICES = [
        ('social_media', 'Social Media'),
        ('phone', 'Phone'),
        ('noise', 'Noise'),
        ('people', 'People'),
        ('thoughts', 'Thoughts'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='distraction_logs')
    distraction_type = models.CharField(max_length=20, choices=DISTRACTION_TYPE_CHOICES)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    focus_session = models.ForeignKey(FocusSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='distractions')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.distraction_type} at {self.timestamp}"

class EmotionalCheckIn(models.Model):
    MOOD_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('okay', 'Okay'),
        ('bad', 'Bad'),
        ('terrible', 'Terrible'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emotional_checkins')
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    energy_level = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 11)])
    stress_level = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 11)])
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} mood at {self.timestamp}"

class MotivationalNudge(models.Model):
    NUDGE_TYPE_CHOICES = [
        ('quote', 'Quote'),
        ('tip', 'Tip'),
        ('reminder', 'Reminder'),
        ('achievement', 'Achievement'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='motivational_nudges')
    nudge_type = models.CharField(max_length=20, choices=NUDGE_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    content = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_for = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.nudge_type}: {self.title}"

class StudyStreak(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_streaks')
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_study_date = models.DateField(blank=True, null=True)
    total_study_days = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.current_streak} day streak"

# Hourly motivational email subscription per user/goal label
class MotivationSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='motivation_subscriptions')
    goal_label = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    interval_minutes = models.PositiveIntegerField(default=60)
    next_send_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["active", "next_send_at"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.goal_label} ({'active' if self.active else 'inactive'})"

class MotivationalQuote(models.Model):
    CATEGORY_CHOICES = [
        ('success', 'Success'),
        ('perseverance', 'Perseverance'),
        ('learning', 'Learning'),
        ('focus', 'Focus'),
        ('motivation', 'Motivation'),
        ('productivity', 'Productivity'),
        ('general', 'General'),
    ]
    
    text = models.TextField()
    author = models.CharField(max_length=100, blank=True, default='Unknown')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['?']  # Random ordering
    
    def __str__(self):
        return f"{self.text[:50]}... - {self.author}"
