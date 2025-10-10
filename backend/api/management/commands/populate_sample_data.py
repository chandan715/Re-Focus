from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta
from api.models import (
    UserProfile, Goal, FocusSession, DistractionLog, 
    EmotionalCheckIn, MotivationalNudge, StudyStreak
)

class Command(BaseCommand):
    help = 'Populate the database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create sample user
        user, created = User.objects.get_or_create(
            username='demo_student',
            defaults={
                'email': 'demo@refocus.com',
                'first_name': 'Demo',
                'last_name': 'Student',
                'password': 'demo123456'
            }
        )
        
        if created:
            user.set_password('demo123456')
            user.save()
            self.stdout.write(f'Created user: {user.username}')
        else:
            self.stdout.write(f'User already exists: {user.username}')
        
        # Create user profile
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'bio': 'A dedicated student working towards academic excellence',
                'daily_goal_hours': 6,
                'timezone': 'UTC'
            }
        )
        
        # Create sample goals
        goals_data = [
            {
                'title': 'Complete Python Course',
                'description': 'Finish the complete Python programming course on Coursera',
                'category': 'Programming',
                'priority': 'high',
                'status': 'in_progress'
            },
            {
                'title': 'Read 5 Books This Semester',
                'description': 'Read at least 5 academic books related to my field of study',
                'category': 'Reading',
                'priority': 'medium',
                'status': 'not_started'
            },
            {
                'title': 'Improve Time Management',
                'description': 'Develop better study habits and time management skills',
                'category': 'Personal Development',
                'priority': 'high',
                'status': 'in_progress'
            }
        ]
        
        for goal_data in goals_data:
            goal, created = Goal.objects.get_or_create(
                user=user,
                title=goal_data['title'],
                defaults=goal_data
            )
            if created:
                self.stdout.write(f'Created goal: {goal.title}')
        
        # Create sample focus sessions
        sessions_data = [
            {'duration_minutes': 25, 'session_type': 'pomodoro', 'completed': True},
            {'duration_minutes': 25, 'session_type': 'pomodoro', 'completed': True},
            {'duration_minutes': 15, 'session_type': 'break', 'completed': True},
            {'duration_minutes': 45, 'session_type': 'custom', 'completed': False},
        ]
        
        for i, session_data in enumerate(sessions_data):
            session, created = FocusSession.objects.get_or_create(
                user=user,
                start_time=timezone.now() - timedelta(hours=i+1),
                defaults=session_data
            )
            if created:
                if session.completed:
                    session.end_time = session.start_time + timedelta(minutes=session.duration_minutes)
                    session.save()
                self.stdout.write(f'Created focus session: {session.session_type}')
        
        # Create sample distraction logs
        distractions_data = [
            {'distraction_type': 'social_media', 'duration_minutes': 5, 'description': 'Checked Instagram'},
            {'distraction_type': 'phone', 'duration_minutes': 3, 'description': 'Phone call'},
            {'distraction_type': 'noise', 'duration_minutes': 2, 'description': 'Loud conversation nearby'},
        ]
        
        for distraction_data in distractions_data:
            distraction, created = DistractionLog.objects.get_or_create(
                user=user,
                timestamp=timezone.now() - timedelta(hours=1),
                defaults=distraction_data
            )
            if created:
                self.stdout.write(f'Created distraction log: {distraction.distraction_type}')
        
        # Create sample emotional check-ins
        emotions_data = [
            {'mood': 'good', 'energy_level': 8, 'stress_level': 3, 'notes': 'Feeling productive today!'},
            {'mood': 'okay', 'energy_level': 6, 'stress_level': 5, 'notes': 'A bit tired but managing'},
        ]
        
        for emotion_data in emotions_data:
            emotion, created = EmotionalCheckIn.objects.get_or_create(
                user=user,
                timestamp=timezone.now() - timedelta(hours=2),
                defaults=emotion_data
            )
            if created:
                self.stdout.write(f'Created emotional check-in: {emotion.mood} mood')
        
        # Create sample motivational nudges
        nudges_data = [
            {
                'nudge_type': 'quote',
                'title': 'Daily Motivation',
                'content': 'The only way to do great work is to love what you do. - Steve Jobs'
            },
            {
                'nudge_type': 'tip',
                'title': 'Productivity Tip',
                'title': 'Take short breaks every 25 minutes to maintain focus and prevent burnout.'
            }
        ]
        
        for nudge_data in nudges_data:
            nudge, created = MotivationalNudge.objects.get_or_create(
                user=user,
                title=nudge_data['title'],
                defaults=nudge_data
            )
            if created:
                self.stdout.write(f'Created motivational nudge: {nudge.title}')
        
        # Create study streak
        streak, created = StudyStreak.objects.get_or_create(
            user=user,
            defaults={
                'current_streak': 3,
                'longest_streak': 7,
                'total_study_days': 15,
                'last_study_date': date.today() - timedelta(days=1)
            }
        )
        
        if created:
            self.stdout.write(f'Created study streak: {streak.current_streak} days')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
        self.stdout.write(f'Demo user: {user.username}')
        self.stdout.write(f'Demo password: demo123456')
        self.stdout.write('You can now log in and explore the app!') 