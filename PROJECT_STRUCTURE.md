# 📁 Re-Focus Project Structure

## 🎯 Main Project Files

```
Re-Focus/
├── 📂 backend/              # Django Backend (REST API)
├── 📂 src/                  # React Frontend (UI)
├── 📂 public/               # Static assets (images, icons)
├── 📄 README.md             # Project documentation
├── 📄 package.json          # Frontend dependencies
├── 📄 vite.config.ts        # Vite build configuration
├── 📄 tailwind.config.ts    # Tailwind CSS configuration
└── 📄 tsconfig.json         # TypeScript configuration
```

## 🔧 Backend Structure (`/backend`)

```
backend/
├── 📂 api/                  # Main Django app
│   ├── 📂 migrations/       # Database migrations
│   ├── 📄 models.py         # Database models (Goal, Mood, User, etc.)
│   ├── 📄 views.py          # API endpoints
│   ├── 📄 serializers.py    # Data serialization
│   ├── 📄 urls.py           # API routes
│   └── 📄 tasks.py          # Celery background tasks
├── 📂 backend/              # Django settings
│   ├── 📄 settings.py       # Project configuration
│   ├── 📄 urls.py           # Main URL routing
│   └── 📄 wsgi.py           # WSGI configuration
├── 📄 manage.py             # Django management script
├── 📄 requirements.txt      # Python dependencies
├── 📄 .env                  # Environment variables (not in Git)
└── 📄 setup.py              # Database setup script
```

## 🎨 Frontend Structure (`/src`)

```
src/
├── 📂 components/           # Reusable UI components
│   └── 📂 ui/               # shadcn/ui components
├── 📂 pages/                # Main application pages
│   ├── 📄 Home.tsx          # Landing page
│   ├── 📄 Login.tsx         # Login page
│   ├── 📄 Signup.tsx        # Registration page
│   ├── 📄 Dashboard.tsx     # User dashboard
│   ├── 📄 Goals.tsx         # Goal tracking page
│   ├── 📄 Mood.tsx          # Mood tracking page
│   ├── 📄 Analytics.tsx     # Analytics & insights
│   ├── 📄 Focus.tsx         # Pomodoro timer
│   └── 📄 Motivation.tsx    # Motivational content
├── 📂 context/              # React Context (Auth, etc.)
├── 📂 lib/                  # Utility functions
│   ├── 📄 authFetch.ts      # Authenticated API calls
│   └── 📄 utils.ts          # Helper functions
├── 📄 App.tsx               # Main app component
├── 📄 main.tsx              # App entry point
└── 📄 index.css             # Global styles
```

## 🗄️ Database Models

### Goal Model
- User (foreign key)
- Title, Description, Category
- Priority (low/medium/high)
- Status (not_started/in_progress/completed/paused)
- Progress (0-100%)
- Target Date
- Created/Updated timestamps

### EmotionalCheckIn (Mood) Model
- User (foreign key)
- Mood (excellent/good/okay/bad/terrible)
- Energy Level (1-10)
- Stress Level (1-10)
- Notes, Activities, Tags
- Timestamp

### FocusSession Model
- User (foreign key)
- Session Type (pomodoro/custom/break)
- Duration
- Goal (optional link)
- Completed status

## 🔌 API Endpoints

### Authentication
- `POST /api/token/` - Login (get JWT token)
- `POST /api/token/refresh/` - Refresh token
- `POST /api/register/` - User registration

### Goals
- `GET /api/goals/` - List all goals
- `POST /api/goals/` - Create new goal
- `GET /api/goals/{id}/` - Get goal details
- `PATCH /api/goals/{id}/` - Update goal
- `DELETE /api/goals/{id}/` - Delete goal

### Mood Tracking
- `GET /api/emotional-checkins/` - List mood entries
- `POST /api/emotional-checkins/` - Create mood entry

### Focus Sessions
- `GET /api/focus-sessions/` - List sessions
- `POST /api/focus-sessions/` - Create session

### Analytics
- `GET /api/dashboard/stats/` - Dashboard statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API
- **MySQL** - Database
- **JWT** - Authentication
- **Celery** - Background tasks
- **Redis** - Task queue

## 📦 Key Dependencies

### Frontend (`package.json`)
```json
{
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "tailwindcss": "^3.4.17",
  "vite": "^5.4.19",
  "@radix-ui/*": "UI components",
  "recharts": "^2.15.0"
}
```

### Backend (`requirements.txt`)
```
Django==5.2.5
djangorestframework==3.15.2
djangorestframework-simplejwt==5.4.0
mysqlclient==2.2.8
celery==5.4.0
redis==5.2.1
```

## 🚀 Running the Project

### Backend
```bash
cd backend
python manage.py runserver
```

### Frontend
```bash
npm run dev
```

## 🎯 Key Features to Explain

1. **Goal Tracking** - Create, update, track progress
2. **Mood Tracking** - Log emotions and energy levels
3. **Focus Timer** - Pomodoro technique implementation
4. **Analytics** - Visualize progress and patterns
5. **Motivation** - Email reminders and quotes
6. **Authentication** - JWT-based secure login

## 📝 Important Files to Understand

1. **src/pages/Goals.tsx** - Goal management UI
2. **backend/api/models.py** - Database schema
3. **backend/api/views.py** - API logic
4. **src/lib/authFetch.ts** - API authentication
5. **backend/backend/settings.py** - Django configuration

---

**This is a clean, production-ready structure!** 🎉
