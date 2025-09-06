#!/usr/bin/env python3
"""
Setup script for Re-Focus Django backend
This script helps you get started with the Django backend
"""

import os
import sys
import subprocess
import django
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def setup_django():
    """Set up Django environment and run initial setup"""
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("❌ Error: Please run this script from the backend directory")
        return False
    
    print("🚀 Setting up Re-Focus Django Backend...")
    print("=" * 50)
    
    # Step 1: Install requirements
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    # Step 2: Make migrations
    if not run_command("python manage.py makemigrations", "Creating database migrations"):
        return False
    
    # Step 3: Run migrations
    if not run_command("python manage.py migrate", "Running database migrations"):
        return False
    
    # Step 4: Create superuser (optional)
    print("\n🤔 Would you like to create a superuser? (y/n): ", end="")
    create_superuser = input().lower().strip()
    
    if create_superuser in ['y', 'yes']:
        if not run_command("python manage.py createsuperuser", "Creating superuser"):
            print("⚠️  Superuser creation failed, but you can create one later with:")
            print("   python manage.py createsuperuser")
    
    # Step 5: Populate sample data
    print("\n🤔 Would you like to populate the database with sample data? (y/n): ", end="")
    populate_data = input().lower().strip()
    
    if populate_data in ['y', 'yes']:
        if not run_command("python manage.py populate_sample_data", "Populating sample data"):
            print("⚠️  Sample data population failed, but you can try again later with:")
            print("   python manage.py populate_sample_data")
    
    # Step 6: Run tests
    print("\n🧪 Running tests to ensure everything works...")
    if not run_command("python manage.py test", "Running tests"):
        print("⚠️  Some tests failed, but the setup may still work")
    
    print("\n" + "=" * 50)
    print("🎉 Django Backend Setup Complete!")
    print("\n📋 Next Steps:")
    print("1. Start the Django server: python manage.py runserver")
    print("2. Visit http://127.0.0.1:8000/admin/ to access the admin interface")
    print("3. Visit http://127.0.0.1:8000/api/ to explore the API endpoints")
    print("4. If you created sample data, you can log in with:")
    print("   Username: demo_student")
    print("   Password: demo123456")
    
    return True

if __name__ == "__main__":
    setup_django() 