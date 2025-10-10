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
    EmotionalCheckIn, MotivationalNudge, StudyStreak, MotivationSubscription,
    MotivationalQuote
)
from .serializers import (
    UserSerializer, UserCreateSerializer, UserProfileSerializer, GoalSerializer, FocusSessionSerializer,
    DistractionLogSerializer, EmotionalCheckInSerializer, MotivationalNudgeSerializer,
    StudyStreakSerializer, GoalDetailSerializer, UserDetailSerializer, MotivationSubscriptionSerializer,
    MotivationalQuoteSerializer
)

# User Profile Views
class UserProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class UserProfileAvatarUpload(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            profile = get_object_or_404(UserProfile, user=request.user)
            
            if 'avatar' not in request.FILES:
                return Response(
                    {'detail': 'No avatar file provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            avatar_file = request.FILES['avatar']
            
            # Validate file size (5MB max)
            if avatar_file.size > 5 * 1024 * 1024:
                return Response(
                    {'detail': 'File size should be less than 5MB'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            if avatar_file.content_type not in allowed_types:
                return Response(
                    {'detail': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Delete old avatar if exists
            if profile.avatar:
                profile.avatar.delete(save=False)
            
            # Save new avatar
            profile.avatar = avatar_file
            profile.save()
            
            return Response({
                'detail': 'Avatar uploaded successfully',
                'avatar_url': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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


# Motivation email subscription endpoints
class MotivationStart(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        goal_label = request.data.get('goal_label')
        interval_minutes = request.data.get('interval_minutes', 60)
        if not goal_label:
            return Response({'detail': 'goal_label is required'}, status=400)
        try:
            interval_minutes = int(interval_minutes)
        except Exception:
            interval_minutes = 60

        sub, created = MotivationSubscription.objects.get_or_create(
            user=request.user,
            goal_label=goal_label,
            defaults={
                'active': True,
                'interval_minutes': interval_minutes,
                'next_send_at': timezone.now(),
            }
        )
        if not created:
            sub.active = True
            sub.interval_minutes = interval_minutes
            sub.next_send_at = timezone.now()
            sub.save()

        return Response(MotivationSubscriptionSerializer(sub).data)


class MotivationStop(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        goal_label = request.data.get('goal_label')
        if not goal_label:
            return Response({'detail': 'goal_label is required'}, status=400)
        try:
            sub = MotivationSubscription.objects.get(user=request.user, goal_label=goal_label)
            sub.active = False
            sub.save(update_fields=['active', 'updated_at'])
            return Response({'detail': 'stopped'})
        except MotivationSubscription.DoesNotExist:
            return Response({'detail': 'not found'}, status=404)

# Motivational Quotes Views
class MotivationalQuoteList(generics.ListAPIView):
    """
    Get random motivational quotes
    """
    serializer_class = MotivationalQuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Return active quotes, randomly ordered
        queryset = MotivationalQuote.objects.filter(is_active=True)
        
        # Optional: filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Limit to 10 random quotes
        return queryset.order_by('?')[:10]

class RandomMotivationalQuote(APIView):
    """
    Get a single random motivational quote
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        quote = MotivationalQuote.objects.filter(is_active=True).order_by('?').first()
        if quote:
            serializer = MotivationalQuoteSerializer(quote)
            return Response(serializer.data)
        return Response({'detail': 'No quotes available'}, status=404)
