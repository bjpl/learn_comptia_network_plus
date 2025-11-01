#!/bin/bash

# Docker Development Environment Script
# Starts the development environment with hot-reloading

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting CompTIA Network+ Backend Development Environment${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Check if .env file exists, create if not
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template${NC}"
    cat > .env << EOF
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://admin:changeme@localhost:5432/comptia_network
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_secret_change_in_production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=debug
EOF
fi

# Stop any existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down

# Build and start services
echo -e "${GREEN}Building and starting services...${NC}"
docker-compose up --build -d

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Check if services are running
echo -e "${GREEN}Checking service health...${NC}"
docker-compose ps

# Show logs
echo -e "${GREEN}Services started successfully!${NC}"
echo -e "${YELLOW}View logs with: docker-compose logs -f${NC}"
echo -e "${YELLOW}Stop services with: docker-compose down${NC}"
echo ""
echo -e "${GREEN}Service URLs:${NC}"
echo "  Backend API: http://localhost:3001"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo "  Adminer: http://localhost:8080"
echo ""
echo -e "${GREEN}Database Credentials:${NC}"
echo "  Database: comptia_network"
echo "  User: admin"
echo "  Password: changeme"

# Follow logs
echo ""
echo -e "${GREEN}Following logs (Ctrl+C to exit)...${NC}"
docker-compose logs -f
