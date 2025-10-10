# Re-Focus - Productivity & Motivation Companion App

Re-Focus is a web-based productivity companion designed to help students stay motivated, avoid distractions, and maintain focus on their career goals. It provides simple yet effective tools to track goals, manage focus sessions, and build better study habits.
Re-Focus was built with the help of AI tools and Vibe Coding. This project gave me a chance to explore how AI can speed up building real applications. I am still learning the frameworks and libraries behind it, but this project shows my interest in productivity tools and my eagerness to learn new technologies.

## 🎯 Project Overview

The idea for this project comes from observing that many students struggle to maintain consistency in their studies due to:
- Constant exposure to social media
- Poor time management
- Absence of a structured support system

By combining goal tracking, daily motivational nudges, focus sessions (Pomodoro), distraction reduction tools, and emotional check-ins, Re-Focus aims to create a personalized environment that keeps students disciplined, inspired, and connected with like-minded peers.

## ✨ Features

### Core Features
- **Goal Management**: Set, track, and manage academic and career goals
- **Focus Sessions**: Pomodoro timer with customizable session lengths
- **Distraction Logging**: Track and analyze what's distracting you
- **Emotional Check-ins**: Monitor your mood, energy, and stress levels
- **Motivational Nudges**: Daily inspiration and productivity tips
- **Study Streaks**: Build and maintain consistent study habits
- **Progress Dashboard**: Visualize your productivity journey

### Technical Features
- **Django REST API**: Robust backend with comprehensive endpoints
- **User Authentication**: Secure user management and profiles
- **Real-time Updates**: Live progress tracking and statistics
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Data Analytics**: Insights into your productivity patterns

## 🏗️ Architecture

### Backend (Django)
- **Django 5.2.5**: Modern Python web framework
- **Django REST Framework**: Powerful API development
- **MySQL Database**: Production-ready relational database
- **JWT Authentication**: Secure API access with JSON Web Tokens
- **CORS Support**: Frontend-backend communication
- **Environment Variables**: Secure configuration management

### Frontend (React + TypeScript)
- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- Node.js 16+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE refocus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`
   ```env
   DB_NAME=refocus_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/users/create/` - User registration
- `POST /api/token/` - User login (Obtain JWT tokens)
- `POST /api/token/refresh/` - Refresh access token
- `GET /api/profile/` - User profile

### Goals
- `GET/POST /api/goals/` - List/Create goals
- `GET/PUT/DELETE /api/goals/{id}/` - Goal details

### Focus Sessions
- `GET/POST /api/focus-sessions/` - List/Create sessions
- `GET/PUT/DELETE /api/focus-sessions/{id}/` - Session details
- `POST /api/focus-sessions/{id}/complete/` - Complete session

### Distractions
- `GET/POST /api/distractions/` - List/Create distraction logs
- `GET/PUT/DELETE /api/distractions/{id}/` - Distraction details

### Emotional Check-ins
- `GET/POST /api/emotional-checkins/` - List/Create check-ins
- `GET/PUT/DELETE /api/emotional-checkins/{id}/` - Check-in details

### Dashboard
- `GET /api/dashboard/stats/` - User statistics
- `GET /api/study-streak/` - Study streak information

## 🎨 Learning Objectives

During the developement i learned the below concepts
### Django Concepts
- **Models & Migrations**: Database design and schema management
- **Views & Serializers**: API development with DRF
- **Authentication & Permissions**: User management and security
- **Admin Interface**: Data management and administration
- **URL Routing**: API endpoint organization

### Best Practices
- **Code Organization**: Clean, maintainable code structure
- **API Design**: RESTful API principles
- **Security**: Authentication and authorization
- **Testing**: Writing tests for your code
- **Documentation**: Clear project documentation

## 🔧 Development Workflow

1. **Plan Features**: Define what you want to build
2. **Design Models**: Create Django models for data structure
3. **Build API**: Implement views and serializers
4. **Test Endpoints**: Use tools like Postman or curl
5. **Frontend Integration**: Connect React to Django API
6. **Iterate**: Improve based on testing and feedback

## 📱 Frontend Components

The React frontend includes:
- **Dashboard**: Overview of progress and statistics
- **Goal Tracker**: Manage and monitor goals
- **Pomodoro Timer**: Focus session management
- **Mood Tracker**: Emotional well-being monitoring

## 🚧 Next Steps

After setting up the basic structure, consider adding:
- **Real-time Notifications**: WebSocket integration
- **Data Visualization**: Charts and graphs for progress
- **Social Features**: Connect with study buddies
- **Mobile App**: React Native or Flutter
- **Advanced Analytics**: Machine learning insights
- **Export Features**: Data backup and sharing

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve existing code
- Fix bugs
- Enhance documentation
- Share your learning journey

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Happy Coding! 🚀**
