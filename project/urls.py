
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import GoalViewSet, PomodoroViewSet, MoodViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goals')
router.register(r'pomodoros', PomodoroViewSet, basename='pomodoros')
router.register(r'moods', MoodViewSet, basename='moods')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
