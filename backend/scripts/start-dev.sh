#!/bin/bash

# Start Development Environment Script
# CompTIA Network+ Learning Platform

set -e

echo "Starting CompTIA Network+ Development Environment..."

# Load environment variables
if [ -f .env.development ]; then
    export $(cat .env.development | grep -v '^#' | xargs)
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create necessary directories
mkdir -p logs backups

# Start services
echo "Starting Docker services..."
docker-compose up -d postgres redis

# Wait for services to be healthy
echo "Waiting for services to be ready..."
timeout 60 bash -c 'until docker-compose ps postgres | grep -q "healthy"; do sleep 2; done'
timeout 60 bash -c 'until docker-compose ps redis | grep -q "healthy"; do sleep 2; done'

echo "Services are ready!"

# Run database migrations
echo "Running database migrations..."
npm run db:migrate

# Start backend in development mode
echo "Starting backend development server..."
docker-compose --profile dev up backend-dev

echo "Development environment is running!"
echo "Backend API: http://localhost:3000"
echo "PostgreSQL: localhost:5432"
echo "Redis: localhost:6379"
