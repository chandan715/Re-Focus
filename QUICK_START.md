# 🚀 Re-Focus Quick Start Guide

Get your Re-Focus Django backend up and running in minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

**On Windows:**
```bash
venv\Scripts\activate
```

**On Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Setup Script (Recommended)
```bash
python setup.py
```

This will automatically:
- ✅ Install dependencies
- ✅ Create database migrations
- ✅ Run migrations
- ✅ Create sample data
- ✅ Run tests

### 5. Start the Server
```bash
python manage.py runserver
```

## 🎯 What You'll Get

Visit these URLs to explore your app:

- **Main API**: http://127.0.0.1:8000/api/
- **Admin Interface**: http://127.0.0.1:8000/admin/
- **API Documentation**: Check `backend/API_DOCUMENTATION.md`

## 🔑 Demo Login

If you used the setup script, you can log in with:
- **Username**: `demo_student`
- **Password**: `demo123456`

## 📚 What You've Built

Your Re-Focus app now includes:

### 🎯 Core Features
- **User Management**: Registration, profiles, authentication
- **Goal Tracking**: Set, monitor, and complete academic goals
- **Focus Sessions**: Pomodoro timer with session management
- **Distraction Logging**: Track what's interrupting your focus
- **Emotional Check-ins**: Monitor mood, energy, and stress
- **Motivational Nudges**: Daily inspiration and tips
- **Study Streaks**: Build consistent study habits
- **Dashboard**: Progress overview and statistics

### 🏗️ Technical Features
- **Django 5.2.5**: Modern Python web framework
- **REST API**: 20+ endpoints for all features
- **Admin Interface**: Easy data management
- **Authentication**: Secure user access
- **Database**: SQLite with proper relationships
- **Testing**: Comprehensive test suite

## 🧪 Test Your API

### Create a User
```bash
curl -X POST http://127.0.0.1:8000/api/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get Goals (requires auth)
```bash
curl -X GET http://127.0.0.1:8000/api/goals/ \
  -H "Authorization: Token <your_token>"
```

## 🔧 Manual Setup (if needed)

If the setup script doesn't work:

```bash
# Create migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python manage.py populate_sample_data
```

## 🎓 Learning Path

### Week 1: Foundation
1. **Explore the models** in `api/models.py`
2. **Understand the API** in `api/views.py`
3. **Test endpoints** using the admin interface
4. **Read the documentation** in `API_DOCUMENTATION.md`

### Week 2: Customization
1. **Add new fields** to existing models
2. **Create new API endpoints**
3. **Customize the admin interface**
4. **Add validation and business logic**

### Week 3: Frontend Integration
1. **Connect React to Django API**
2. **Build user interface components**
3. **Implement real-time updates**
4. **Add data visualization**

### Week 4: Advanced Features
1. **Add notifications**
2. **Implement data export**
3. **Add social features**
4. **Performance optimization**

## 🐛 Troubleshooting

### Common Issues

**"No module named 'django'"**
```bash
pip install -r requirements.txt
```

**"Database table doesn't exist"**
```bash
python manage.py migrate
```

**"Permission denied"**
```bash
python manage.py createsuperuser
```

**CORS errors**
- Check if `django-cors-headers` is installed
- Verify CORS settings in `settings.py`

## 📱 Next Steps

1. **Test all features** in the admin interface
2. **Explore the API** with Postman or curl
3. **Customize models** for your specific needs
4. **Build the frontend** to consume your API
5. **Deploy to production** when ready

## 🎉 Congratulations!

You now have a fully functional Django backend for Re-Focus! 

**What you've learned:**
- ✅ Django project structure
- ✅ Model design and relationships
- ✅ API development with DRF
- ✅ Admin interface customization
- ✅ Authentication and permissions
- ✅ Database migrations
- ✅ Testing and documentation

**Keep learning and building! 🚀**

---

**Need help?** Check the main README.md and API_DOCUMENTATION.md files for detailed information. 

## 🚀 **Quick Start - See Your App in Action!**

### **1. Start the Django Server**
```bash
cd backend
python manage.py runserver
```

You should see output like:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
January 15, 2024 - 15:30:00
Django version 5.2.5, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### **2. Open Your Browser and Visit:**

#### **🌐 Main API Root**
- **URL**: http://127.0.0.1:8000/api/
- **What you'll see**: List of all available API endpoints

#### **⚙️ Admin Interface**
- **URL**: http://127.0.0.1:8000/admin/
- **What you'll see**: Django admin panel to manage data

#### ** Dashboard Stats**
- **URL**: http://127.0.0.1:8000/api/dashboard/stats/
- **What you'll see**: User statistics (requires authentication)

## 🔑 **Get Sample Data First**

Before you can see meaningful output, you need to populate your database:

### **Option A: Use the Setup Script (Recommended)**
```bash
cd backend
python setup.py
```

### **Option B: Manual Setup**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py populate_sample_data
```

## 📱 **What You'll See in Each Interface**

### **1. API Root (http://127.0.0.1:8000/api/)**
```json
{
    "users": "http://127.0.0.1:8000/api/users/",
    "goals": "http://127.0.0.1:8000/api/goals/",
    "focus-sessions": "http://127.0.0.1:8000/api/focus-sessions/",
    "distractions": "http://127.0.0.1:8000/api/distractions/",
    "emotional-checkins": "http://127.0.0.1:8000/api/emotional-checkins/",
    "motivational-nudges": "http://127.0.0.1:8000/api/motivational-nudges/",
    "study-streak": "http://127.0.0.1:8000/api/study-streak/",
    "dashboard": "http://127.0.0.1:8000/api/dashboard/"
}
```

### **2. Admin Interface (http://127.0.0.1:8000/admin/)**
- **Login**: Use your superuser credentials or demo account
- **Demo Login**: `demo_student` / `demo123456`
- **What you'll see**: 
  - User management
  - Goals, focus sessions, distractions
  - Emotional check-ins and motivational nudges
  - Study streaks and statistics

### **3. Specific API Endpoints**

#### **View All Goals**
- **URL**: http://127.0.0.1:8000/api/goals/
- **Method**: GET
- **Headers**: `Authorization: Token <your_token>`

#### **View Dashboard Stats**
- **URL**: http://127.0.0.1:8000/api/dashboard/stats/
- **Method**: GET
- **Headers**: `Authorization: Token <your_token>`

## 🧪 **Test with Command Line**

### **Create a User**
```bash
curl -X POST http://127.0.0.1:8000/api/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### **Get Authentication Token**
1. Go to http://127.0.0.1:8000/admin/
2. Log in with your superuser account
3. Go to "Tokens" section
4. Create a token for your user

### **Test Authenticated Endpoint**
```bash
curl -X GET http://127.0.0.1:8000/api/goals/ \
  -H "Authorization: Token <your_token>"
```

## 🎯 **Step-by-Step to See Output**

### **Step 1: Start the Server**
```bash
cd backend
python manage.py runserver
```

### **Step 2: Open Browser**
Visit: http://127.0.0.1:8000/api/

### **Step 3: See the API Structure**
You'll see all available endpoints listed

### **Step 4: Explore Admin Interface**
Visit: http://127.0.0.1:8000/admin/
- Login with demo credentials: `demo_student` / `demo123456`
- Explore the data models

### **Step 5: Test API Endpoints**
Use Postman, curl, or your browser to test specific endpoints

## 🔍 **Troubleshooting - If You Don't See Output**

### **"No module named 'django'"**
```bash
pip install -r requirements.txt
```

### **"Database table doesn't exist"**
```bash
python manage.py migrate
```

### **"Page not found"**
- Make sure the server is running
- Check the URL spelling
- Verify you're in the backend directory

### **"Permission denied"**
```bash
python manage.py createsuperuser
```

## 📊 **Expected Output Examples**

### **Dashboard Stats Response**
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

### **Goals List Response**
```json
[
    {
        "id": 1,
        "title": "Complete Python Course",
        "description": "Finish the complete Python programming course on Coursera",
        "category": "Programming",
        "priority": "high",
        "status": "in_progress",
        "completed": false
    }
]
```

## 🎉 **You're Ready to See Your App!**

1. **Start the server**: `python manage.py runserver`
2. **Open your browser**: Visit http://127.0.0.1:8000/api/
3. **Explore the admin**: Visit http://127.0.0.1:8000/admin/
4. **Test the endpoints**: Use the API documentation to try different features

Your Re-Focus app is fully functional and ready to show you all the productivity features you've built! 🚀 