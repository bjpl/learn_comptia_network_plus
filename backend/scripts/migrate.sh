#!/bin/bash

# Database Migration Script for Docker
# Runs migrations inside the database container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Running Database Migrations${NC}"

# Container name
BACKEND_CONTAINER="comptia-backend"
DB_CONTAINER="comptia-postgres"

# Check if backend container is running
if ! docker ps | grep -q "${BACKEND_CONTAINER}"; then
    echo -e "${RED}Error: Backend container is not running${NC}"
    echo -e "${YELLOW}Start with: docker-compose up -d${NC}"
    exit 1
fi

# Check if database container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
    echo -e "${RED}Error: Database container is not running${NC}"
    echo -e "${YELLOW}Start with: docker-compose up -d${NC}"
    exit 1
fi

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
docker-compose exec -T postgres pg_isready -U admin -d comptia_network
sleep 2

# Run migrations
echo -e "${GREEN}Running migrations...${NC}"
docker-compose exec backend npm run migrate

# Check migration status
echo -e "${GREEN}Checking database schema...${NC}"
docker-compose exec -T postgres psql -U admin -d comptia_network -c "\dt"

echo -e "${GREEN}Migrations completed successfully!${NC}"
