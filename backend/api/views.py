from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import date, timedelta
from .models import (
    UserProfile, Goal, FocusSession, DistractionLog, 
    EmotionalCheckIn, MotivationalNudge, StudyStreak
)
from .serializers import (
    UserSerializer, UserCreateSerializer, UserProfileSerializer, GoalSerializer, FocusSessionSerializer,
    DistractionLogSerializer, EmotionalCheckInSerializer, MotivationalNudgeSerializer,
    StudyStreakSerializer, GoalDetailSerializer, UserDetailSerializer
)

# User Profile Views
class UserProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)

# Goal Views
class GoalListCreate(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

# Focus Session Views
class FocusSessionListCreate(generics.ListCreateAPIView):
    serializer_class = FocusSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FocusSession.objects.filter(user=self.request.user).order_by('-start_time')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FocusSessionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FocusSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FocusSession.objects.filter(user=self.request.user)

class FocusSessionComplete(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        session = get_object_or_404(FocusSession, pk=pk, user=request.user)
        session.completed = True
        session.end_time = timezone.now()
        session.save()
        
        # Update study streak
        self.update_study_streak(request.user)
        
        return Response({'message': 'Session completed successfully'})
    
    def update_study_streak(self, user):
        today = date.today()
        streak, created = StudyStreak.objects.get_or_create(user=user)
        
        if not streak.last_study_date or streak.last_study_date < today:
            if streak.last_study_date == today - timedelta(days=1):
                streak.current_streak += 1
            else:
                streak.current_streak = 1
            
            streak.last_study_date = today
            streak.total_study_days += 1
            streak.longest_streak = max(streak.current_streak, streak.longest_streak)
            streak.save()

# Distraction Log Views
class DistractionLogListCreate(generics.ListCreateAPIView):
    serializer_class = DistractionLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return DistractionLog.objects.filter(user=self.request.user).order_by('-timestamp')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DistractionLogDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DistractionLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return DistractionLog.objects.filter(user=self.request.user)

# Emotional Check-in Views
class EmotionalCheckInListCreate(generics.ListCreateAPIView):
    serializer_class = EmotionalCheckInSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EmotionalCheckIn.objects.filter(user=self.request.user).order_by('-timestamp')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EmotionalCheckInDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmotionalCheckInSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EmotionalCheckIn.objects.filter(user=self.request.user)

# Motivational Nudge Views
class MotivationalNudgeList(generics.ListAPIView):
    serializer_class = MotivationalNudgeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MotivationalNudge.objects.filter(
            user=self.request.user,
            read=False
        ).order_by('-created_at')

class MotivationalNudgeDetail(generics.RetrieveUpdateAPIView):
    serializer_class = MotivationalNudgeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MotivationalNudge.objects.filter(user=self.request.user)

# Study Streak Views
class StudyStreakDetail(generics.RetrieveAPIView):
    serializer_class = StudyStreakSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        streak, created = StudyStreak.objects.get_or_create(user=self.request.user)
        return streak

# Dashboard Views
class DashboardStats(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        today = date.today()
        
        # Today's stats
        today_sessions = FocusSession.objects.filter(
            user=user,
            start_time__date=today,
            completed=True
        )
        today_minutes = sum(session.duration_minutes for session in today_sessions)
        
        # Weekly stats
        week_ago = today - timedelta(days=7)
        weekly_sessions = FocusSession.objects.filter(
            user=user,
            start_time__date__gte=week_ago,
            completed=True
        )
        weekly_minutes = sum(session.duration_minutes for session in weekly_sessions)
        
        # Goals progress
        total_goals = Goal.objects.filter(user=user).count()
        completed_goals = Goal.objects.filter(user=user, completed=True).count()
        
        # Study streak
        streak, created = StudyStreak.objects.get_or_create(user=user)
        
        return Response({
            'today_minutes': today_minutes,
            'weekly_minutes': weekly_minutes,
            'total_goals': total_goals,
            'completed_goals': completed_goals,
            'current_streak': streak.current_streak,
            'longest_streak': streak.longest_streak,
            'total_study_days': streak.total_study_days
        })

# User Registration and Authentication
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Disable SessionAuthentication to avoid CSRF on public signup
    
    def perform_create(self, serializer):
        user = serializer.save()
        UserProfile.objects.create(user=user)
        StudyStreak.objects.create(user=user)
