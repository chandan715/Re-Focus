# Re-Focus API Documentation

This document provides comprehensive information about the Re-Focus Django REST API endpoints.

## Base URL
```
http://127.0.0.1:8000/api/
```

## Authentication
Most endpoints require authentication. Use Token Authentication:
- Include `Authorization: Token <your_token>` in request headers
- Get token by creating a user and using the admin interface

## Endpoints

### 1. User Management

#### Create User
```
POST /api/users/create/
```
**Request Body:**
```json
{
    "username": "student123",
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123"
}
```
**Response:** User object with profile and study streak automatically created

#### Get/Update Profile
```
GET /api/profile/
PUT /api/profile/
```
**Response:**
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "student123",
        "email": "student@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "date_joined": "2024-01-15T10:00:00Z"
    },
    "bio": "A dedicated student",
    "avatar": null,
    "timezone": "UTC",
    "daily_goal_hours": 8,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
}
```

### 2. Goals

#### List/Create Goals
```
GET /api/goals/
POST /api/goals/
```
**POST Request Body:**
```json
{
    "title": "Learn Django",
    "description": "Master Django web framework",
    "category": "Programming",
    "priority": "high",
    "status": "not_started",
    "target_date": "2024-06-15"
}
```

#### Goal Details
```
GET /api/goals/{id}/
PUT /api/goals/{id}/
DELETE /api/goals/{id}/
```

**Goal Status Options:**
- `not_started`
- `in_progress`
- `completed`
- `paused`

**Priority Options:**
- `low`
- `medium`
- `high`

### 3. Focus Sessions

#### List/Create Focus Sessions
```
GET /api/focus-sessions/
POST /api/focus-sessions/
```
**POST Request Body:**
```json
{
    "session_type": "pomodoro",
    "duration_minutes": 25,
    "goal": 1,
    "notes": "Working on Django models"
}
```

**Session Types:**
- `pomodoro` - Standard Pomodoro technique
- `custom` - Custom duration session
- `break` - Break session

#### Session Details
```
GET /api/focus-sessions/{id}/
PUT /api/focus-sessions/{id}/
DELETE /api/focus-sessions/{id}/
```

#### Complete Session
```
POST /api/focus-sessions/{id}/complete/
```
Automatically updates study streak when called.

### 4. Distraction Logs

#### List/Create Distraction Logs
```
GET /api/distractions/
POST /api/distractions/
```
**POST Request Body:**
```json
{
    "distraction_type": "social_media",
    "duration_minutes": 5,
    "description": "Checked Instagram",
    "focus_session": 1
}
```

**Distraction Types:**
- `social_media`
- `phone`
- `noise`
- `people`
- `thoughts`
- `other`

#### Distraction Details
```
GET /api/distractions/{id}/
PUT /api/distractions/{id}/
DELETE /api/distractions/{id}/
```

### 5. Emotional Check-ins

#### List/Create Emotional Check-ins
```
GET /api/emotional-checkins/
POST /api/emotional-checkins/
```
**POST Request Body:**
```json
{
    "mood": "good",
    "energy_level": 8,
    "stress_level": 3,
    "notes": "Feeling productive today!"
}
```

**Mood Options:**
- `excellent`
- `good`
- `okay`
- `bad`
- `terrible`

**Energy & Stress Levels:** 1-10 scale

#### Check-in Details
```
GET /api/emotional-checkins/{id}/
PUT /api/emotional-checkins/{id}/
DELETE /api/emotional-checkins/{id}/
```

### 6. Motivational Nudges

#### List Nudges
```
GET /api/motivational-nudges/
```
Returns unread nudges for the authenticated user.

#### Nudge Details
```
GET /api/motivational-nudges/{id}/
PUT /api/motivational-nudges/{id}/
```

**Nudge Types:**
- `quote` - Motivational quotes
- `tip` - Productivity tips
- `reminder` - Study reminders
- `achievement` - Milestone celebrations

### 7. Study Streaks

#### Get Study Streak
```
GET /api/study-streak/
```
**Response:**
```json
{
    "id": 1,
    "user": 1,
    "current_streak": 5,
    "longest_streak": 12,
    "last_study_date": "2024-01-15",
    "total_study_days": 25,
    "updated_at": "2024-01-15T10:00:00Z"
}
```

### 8. Dashboard

#### Get Dashboard Statistics
```
GET /api/dashboard/stats/
```
**Response:**
```json
{
    "today_minutes": 120,
    "weekly_minutes": 480,
    "total_goals": 5,
    "completed_goals": 2,
    "current_streak": 5,
    "longest_streak": 12,
    "total_study_days": 25
}
```

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["This field is required."]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Testing the API

### Using curl

#### Create a user:
```bash
curl -X POST http://127.0.0.1:8000/api/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

#### Get goals (requires authentication):
```bash
curl -X GET http://127.0.0.1:8000/api/goals/ \
  -H "Authorization: Token <your_token>"
```

### Using Postman

1. Import the collection (if available)
2. Set the base URL to `http://127.0.0.1:8000/api/`
3. Add your authentication token to headers
4. Test each endpoint

### Using the Django Admin

1. Visit `http://127.0.0.1:8000/admin/`
2. Log in with your superuser credentials
3. Explore and manage data through the admin interface

## Sample Data

Use the management command to populate sample data:
```bash
python manage.py populate_sample_data
```

This creates:
- Demo user: `demo_student` / `demo123456`
- Sample goals, focus sessions, and other data
- Perfect for testing the API endpoints

## Development Tips

1. **Start with simple endpoints**: Test basic CRUD operations first
2. **Use the admin interface**: Great for data management and testing
3. **Check the console**: Django provides helpful debug information
4. **Test authentication**: Ensure your tokens are working correctly
5. **Validate data**: Test with various input combinations

## Common Issues

### CORS Errors
- Ensure `django-cors-headers` is installed
- Check CORS settings in `settings.py`

### Authentication Issues
- Verify token is included in headers
- Check if user exists and is active

### Database Errors
- Run migrations: `python manage.py migrate`
- Check model relationships and constraints

## Next Steps

1. **Test all endpoints** to ensure they work correctly
2. **Build the frontend** to consume these APIs
3. **Add validation** and error handling
4. **Implement real-time features** with WebSockets
5. **Add data visualization** for progress tracking 