from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from .models import (
    UserProfile, Goal, FocusSession, DistractionLog, 
    EmotionalCheckIn, MotivationalNudge, StudyStreak
)

class ReFocusModelsTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_user_profile_creation(self):
        """Test UserProfile model creation"""
        profile = UserProfile.objects.create(
            user=self.user,
            bio='Test bio',
            daily_goal_hours=8,
            timezone='UTC'
        )
        
        self.assertEqual(profile.user, self.user)
        self.assertEqual(profile.bio, 'Test bio')
        self.assertEqual(profile.daily_goal_hours, 8)
        self.assertEqual(str(profile), f"{self.user.username}'s Profile")
    
    def test_goal_creation(self):
        """Test Goal model creation"""
        goal = Goal.objects.create(
            user=self.user,
            title='Test Goal',
            description='Test description',
            category='Test Category',
            priority='high',
            status='in_progress'
        )
        
        self.assertEqual(goal.user, self.user)
        self.assertEqual(goal.title, 'Test Goal')
        self.assertEqual(goal.priority, 'high')
        self.assertEqual(goal.status, 'in_progress')
        self.assertFalse(goal.completed)
        self.assertEqual(str(goal), f"{self.user.username}: {goal.title}")
    
    def test_focus_session_creation(self):
        """Test FocusSession model creation"""
        goal = Goal.objects.create(
            user=self.user,
            title='Test Goal'
        )
        
        session = FocusSession.objects.create(
            user=self.user,
            session_type='pomodoro',
            duration_minutes=25,
            goal=goal
        )
        
        self.assertEqual(session.user, self.user)
        self.assertEqual(session.session_type, 'pomodoro')
        self.assertEqual(session.duration_minutes, 25)
        self.assertEqual(session.goal, goal)
        self.assertFalse(session.completed)
        self.assertIsNotNone(session.start_time)
    
    def test_distraction_log_creation(self):
        """Test DistractionLog model creation"""
        distraction = DistractionLog.objects.create(
            user=self.user,
            distraction_type='social_media',
            duration_minutes=5,
            description='Test distraction'
        )
        
        self.assertEqual(distraction.user, self.user)
        self.assertEqual(distraction.distraction_type, 'social_media')
        self.assertEqual(distraction.duration_minutes, 5)
        self.assertEqual(distraction.description, 'Test distraction')
        self.assertIsNotNone(distraction.timestamp)
    
    def test_emotional_checkin_creation(self):
        """Test EmotionalCheckIn model creation"""
        checkin = EmotionalCheckIn.objects.create(
            user=self.user,
            mood='good',
            energy_level=8,
            stress_level=3,
            notes='Feeling good today!'
        )
        
        self.assertEqual(checkin.user, self.user)
        self.assertEqual(checkin.mood, 'good')
        self.assertEqual(checkin.energy_level, 8)
        self.assertEqual(checkin.stress_level, 3)
        self.assertEqual(checkin.notes, 'Feeling good today!')
        self.assertIsNotNone(checkin.timestamp)
    
    def test_motivational_nudge_creation(self):
        """Test MotivationalNudge model creation"""
        nudge = MotivationalNudge.objects.create(
            user=self.user,
            nudge_type='quote',
            title='Test Quote',
            content='This is a test motivational quote.'
        )
        
        self.assertEqual(nudge.user, self.user)
        self.assertEqual(nudge.nudge_type, 'quote')
        self.assertEqual(nudge.title, 'Test Quote')
        self.assertEqual(nudge.content, 'This is a test motivational quote.')
        self.assertFalse(nudge.read)
        self.assertIsNotNone(nudge.created_at)
    
    def test_study_streak_creation(self):
        """Test StudyStreak model creation"""
        streak = StudyStreak.objects.create(
            user=self.user,
            current_streak=5,
            longest_streak=10,
            total_study_days=25
        )
        
        self.assertEqual(streak.user, self.user)
        self.assertEqual(streak.current_streak, 5)
        self.assertEqual(streak.longest_streak, 10)
        self.assertEqual(streak.total_study_days, 25)
        self.assertEqual(str(streak), f"{self.user.username} - {streak.current_streak} day streak")
    
    def test_goal_status_transitions(self):
        """Test goal status transitions"""
        goal = Goal.objects.create(
            user=self.user,
            title='Test Goal',
            status='not_started'
        )
        
        # Test status transition
        goal.status = 'in_progress'
        goal.save()
        self.assertEqual(goal.status, 'in_progress')
        
        # Test completion
        goal.completed = True
        goal.status = 'completed'
        goal.save()
        self.assertTrue(goal.completed)
        self.assertEqual(goal.status, 'completed')
    
    def test_focus_session_completion(self):
        """Test focus session completion"""
        session = FocusSession.objects.create(
            user=self.user,
            session_type='pomodoro',
            duration_minutes=25
        )
        
        # Complete the session
        session.completed = True
        session.end_time = timezone.now()
        session.save()
        
        self.assertTrue(session.completed)
        self.assertIsNotNone(session.end_time)
