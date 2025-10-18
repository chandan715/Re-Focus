#!/bin/bash

# Exit on error
set -e

# Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install Node.js dependencies and build frontend
npm install
npm run build
