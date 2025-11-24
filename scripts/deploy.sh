#!/bin/bash
# CompTIA Network+ Learning Platform - Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV=${1:-production}
BACKEND_PATH="./backend"
FRONTEND_PATH="."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Banner
print_header "CompTIA Network+ Deployment Script"
echo "Environment: $ENV"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Validate environment
if [[ "$ENV" != "production" && "$ENV" != "staging" ]]; then
    print_error "Invalid environment: $ENV"
    echo "Usage: $0 [production|staging]"
    exit 1
fi

# Step 1: Pre-deployment checks
print_header "Step 1: Running Pre-Deployment Checks"

# Check required commands
print_info "Checking required commands..."
check_command "node"
check_command "npm"
check_command "git"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi
print_success "Node.js version: $(node -v)"

# Check if .env file exists
if [ ! -f "$BACKEND_PATH/.env.$ENV" ]; then
    print_error "Environment file not found: $BACKEND_PATH/.env.$ENV"
    print_info "Please create it from .env.$ENV.template"
    exit 1
fi
print_success "Environment file found"

# Check if on correct git branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$ENV" = "production" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "Not on main branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes"
    git status -s
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
print_success "Pre-deployment checks passed"

# Step 2: Run tests
print_header "Step 2: Running Tests"

print_info "Running frontend tests..."
cd "$PROJECT_ROOT"
if npm test -- --run > /dev/null 2>&1; then
    print_success "Frontend tests passed"
else
    print_error "Frontend tests failed"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_info "Running backend tests..."
cd "$PROJECT_ROOT/$BACKEND_PATH"
if npm test > /dev/null 2>&1; then
    print_success "Backend tests passed"
else
    print_error "Backend tests failed"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

cd "$PROJECT_ROOT"

# Step 3: Install dependencies
print_header "Step 3: Installing Dependencies"

print_info "Installing frontend dependencies..."
npm ci --production
print_success "Frontend dependencies installed"

print_info "Installing backend dependencies..."
cd "$BACKEND_PATH"
npm ci --production
cd "$PROJECT_ROOT"
print_success "Backend dependencies installed"

# Step 4: Build frontend
print_header "Step 4: Building Frontend"

print_info "Building frontend for $ENV..."
if [ -f ".env.$ENV" ]; then
    cp ".env.$ENV" ".env.production"
fi

npm run build

if [ ! -d "dist" ]; then
    print_error "Frontend build failed - dist directory not found"
    exit 1
fi

print_success "Frontend built successfully"
print_info "Build output: $(du -sh dist | cut -f1)"

# Step 5: Build backend
print_header "Step 5: Building Backend"

print_info "Building backend..."
cd "$BACKEND_PATH"
npm run build

if [ ! -d "dist" ]; then
    print_error "Backend build failed - dist directory not found"
    exit 1
fi

print_success "Backend built successfully"
cd "$PROJECT_ROOT"

# Step 6: Database migrations
print_header "Step 6: Running Database Migrations"

print_info "Running database migrations..."
cd "$BACKEND_PATH"

# Set environment variables
export NODE_ENV=$ENV

if ./scripts/migrate.sh; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

cd "$PROJECT_ROOT"

# Step 7: Deploy
print_header "Step 7: Deploying Application"

if [ "$ENV" = "production" ]; then
    print_info "Deploying to production..."

    # Check deployment method
    if [ -f "docker-compose.prod.yml" ]; then
        print_info "Using Docker deployment..."

        # Build Docker images
        docker compose -f docker-compose.prod.yml build

        # Deploy with zero-downtime
        docker compose -f docker-compose.prod.yml up -d --no-deps --build

        print_success "Docker deployment completed"
    elif command -v pm2 &> /dev/null; then
        print_info "Using PM2 deployment..."

        # Deploy frontend
        print_info "Deploying frontend..."
        sudo rm -rf /var/www/comptia-network/*
        sudo cp -r dist/* /var/www/comptia-network/
        sudo chown -R www-data:www-data /var/www/comptia-network

        # Deploy backend
        print_info "Deploying backend..."
        cd "$BACKEND_PATH"
        pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
        cd "$PROJECT_ROOT"

        # Reload Nginx
        if command -v nginx &> /dev/null; then
            sudo nginx -t && sudo systemctl reload nginx
            print_success "Nginx reloaded"
        fi

        print_success "PM2 deployment completed"
    else
        print_error "No deployment method found (Docker or PM2)"
        exit 1
    fi

elif [ "$ENV" = "staging" ]; then
    print_info "Deploying to staging..."
    # Add staging deployment logic here
    print_warning "Staging deployment not fully configured"
fi

# Step 8: Post-deployment verification
print_header "Step 8: Post-Deployment Verification"

# Wait for services to start
print_info "Waiting for services to start..."
sleep 10

# Health checks
print_info "Running health checks..."

# Check backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    print_success "Backend health check passed"
else
    print_error "Backend health check failed (HTTP $BACKEND_HEALTH)"
fi

# Check frontend
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ] || [ "$FRONTEND_HEALTH" = "301" ]; then
    print_success "Frontend health check passed"
else
    print_error "Frontend health check failed (HTTP $FRONTEND_HEALTH)"
fi

# Check SSL (if configured)
if [ "$ENV" = "production" ]; then
    SSL_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://localhost/ 2>/dev/null || echo "000")
    if [ "$SSL_CHECK" = "200" ]; then
        print_success "SSL check passed"
    else
        print_warning "SSL check failed or not configured"
    fi
fi

# Step 9: Cleanup
print_header "Step 9: Cleanup"

print_info "Cleaning up temporary files..."
rm -f .env.production 2>/dev/null || true
print_success "Cleanup completed"

# Final summary
print_header "Deployment Summary"

echo "Environment: $ENV"
echo "Git Commit: $(git rev-parse --short HEAD)"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

if [ "$BACKEND_HEALTH" = "200" ] && [ "$FRONTEND_HEALTH" = "200" ] || [ "$FRONTEND_HEALTH" = "301" ]; then
    print_success "Deployment completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "  1. Verify the application is working correctly"
    echo "  2. Check logs: pm2 logs or docker compose logs"
    echo "  3. Monitor performance and errors"
    echo "  4. Update documentation if needed"
else
    print_error "Deployment completed with errors"
    echo ""
    print_info "Troubleshooting:"
    echo "  1. Check application logs"
    echo "  2. Verify environment variables"
    echo "  3. Check database connection"
    echo "  4. Review deployment documentation"
    exit 1
fi

exit 0
