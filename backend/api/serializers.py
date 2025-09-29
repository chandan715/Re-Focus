from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Goal, FocusSession, DistractionLog, 
    EmotionalCheckIn, MotivationalNudge, StudyStreak
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class GoalSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class FocusSessionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    goal = GoalSerializer(read_only=True)
    
    class Meta:
        model = FocusSession
        fields = '__all__'
        read_only_fields = ['start_time', 'end_time']

class DistractionLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    focus_session = FocusSessionSerializer(read_only=True)
    
    class Meta:
        model = DistractionLog
        fields = '__all__'
        read_only_fields = ['timestamp']

class EmotionalCheckInSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = EmotionalCheckIn
        fields = '__all__'
        read_only_fields = ['timestamp']

class MotivationalNudgeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = MotivationalNudge
        fields = '__all__'
        read_only_fields = ['created_at']

class StudyStreakSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudyStreak
        fields = '__all__'
        read_only_fields = ['updated_at']

# Nested serializers for detailed views
class GoalDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    focus_sessions = FocusSessionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    goals = GoalSerializer(many=True, read_only=True)
    focus_sessions = FocusSessionSerializer(many=True, read_only=True)
    study_streak = StudyStreakSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 
                 'profile', 'goals', 'focus_sessions', 'study_streak']
        read_only_fields = ['id', 'date_joined']
