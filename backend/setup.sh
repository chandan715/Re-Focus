#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Install Python dependencies
pip install -r requirements.txt

# Make sure the database is ready
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start the application with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --log-file -