#!/bin/bash

# Database Migration Script
# CompTIA Network+ Learning Platform

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Running database migrations..."

# Check if PostgreSQL container is running
if docker-compose ps postgres | grep -q "Up"; then
    # Run initialization script
    echo "Applying database schema..."
    docker-compose exec -T postgres psql \
        -U ${DB_USER:-postgres} \
        -d ${DB_NAME:-comptia_network} \
        -f /docker-entrypoint-initdb.d/init.sql

    echo "Migrations completed successfully!"
else
    echo "Error: PostgreSQL container is not running"
    echo "Run 'docker-compose up -d postgres' first"
    exit 1
fi

# Verify migrations
echo "Verifying database schema..."
TABLE_COUNT=$(docker-compose exec -T postgres psql \
    -U ${DB_USER:-postgres} \
    -d ${DB_NAME:-comptia_network} \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")

echo "Number of tables: ${TABLE_COUNT}"
echo "Migration verification completed!"
