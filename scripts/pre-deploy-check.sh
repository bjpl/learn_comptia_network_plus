#!/bin/bash
# Pre-deployment checklist script
# Run this before deploying to catch common issues

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}  ✓ $1${NC}"
}

print_fail() {
    echo -e "${RED}  ✗ $1${NC}"
    ((ERRORS++))
}

print_warn() {
    echo -e "${YELLOW}  ⚠ $1${NC}"
    ((WARNINGS++))
}

echo "=================================="
echo "Pre-Deployment Checklist"
echo "=================================="
echo ""

# 1. Check Node.js version
print_check "Node.js version"
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ "$NODE_MAJOR" -ge 18 ]; then
    print_pass "Node.js $NODE_VERSION (>= 18.0.0)"
else
    print_fail "Node.js $NODE_VERSION is too old. Requires >= 18.0.0"
fi

# 2. Check npm version
print_check "npm version"
NPM_VERSION=$(npm -v)
NPM_MAJOR=$(echo $NPM_VERSION | cut -d'.' -f1)
if [ "$NPM_MAJOR" -ge 9 ]; then
    print_pass "npm $NPM_VERSION (>= 9.0.0)"
else
    print_fail "npm $NPM_VERSION is too old. Requires >= 9.0.0"
fi

# 3. Check Git status
print_check "Git repository"
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_pass "Git repository detected"

    # Check for uncommitted changes
    if [[ -z $(git status -s) ]]; then
        print_pass "No uncommitted changes"
    else
        print_warn "Uncommitted changes detected"
        git status -s | head -5
    fi

    # Check current branch
    BRANCH=$(git branch --show-current)
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
        print_pass "On main branch: $BRANCH"
    else
        print_warn "Not on main branch. Current: $BRANCH"
    fi
else
    print_fail "Not a Git repository"
fi

# 4. Check environment files
print_check "Environment configuration"
if [ -f "backend/.env.production.template" ]; then
    print_pass "Backend template found"
else
    print_warn "Backend .env template not found"
fi

if [ -f "backend/.env.production" ]; then
    print_pass "Backend production config found"

    # Check for placeholder values
    if grep -q "CHANGEME\|your-password\|example.com" backend/.env.production 2>/dev/null; then
        print_fail "Environment file contains placeholder values!"
    else
        print_pass "No obvious placeholder values detected"
    fi
else
    print_fail "Backend production config NOT found"
fi

if [ -f ".env.production" ]; then
    print_pass "Frontend production config found"
else
    print_warn "Frontend production config not found"
fi

# 5. Check dependencies
print_check "Dependencies"
if [ -f "package-lock.json" ]; then
    print_pass "Frontend package-lock.json exists"
else
    print_warn "Frontend package-lock.json missing"
fi

if [ -f "backend/package-lock.json" ]; then
    print_pass "Backend package-lock.json exists"
else
    print_warn "Backend package-lock.json missing"
fi

# Check if node_modules is up to date
if [ -f "package-lock.json" ] && [ -d "node_modules" ]; then
    if [ "package-lock.json" -nt "node_modules" ]; then
        print_warn "Frontend dependencies may be outdated"
    else
        print_pass "Frontend dependencies up to date"
    fi
fi

# 6. Check TypeScript configuration
print_check "TypeScript configuration"
if [ -f "tsconfig.json" ]; then
    print_pass "Frontend tsconfig.json found"
else
    print_warn "Frontend tsconfig.json not found"
fi

if [ -f "backend/tsconfig.json" ]; then
    print_pass "Backend tsconfig.json found"
else
    print_warn "Backend tsconfig.json not found"
fi

# 7. Check build scripts
print_check "Build scripts"
if grep -q '"build"' package.json 2>/dev/null; then
    print_pass "Frontend build script found"
else
    print_fail "Frontend build script not found"
fi

if grep -q '"build"' backend/package.json 2>/dev/null; then
    print_pass "Backend build script found"
else
    print_fail "Backend build script not found"
fi

# 8. Check test scripts
print_check "Test configuration"
if grep -q '"test"' package.json 2>/dev/null; then
    print_pass "Frontend test script found"
else
    print_warn "Frontend test script not found"
fi

if grep -q '"test"' backend/package.json 2>/dev/null; then
    print_pass "Backend test script found"
else
    print_warn "Backend test script not found"
fi

# 9. Check database configuration
print_check "Database configuration"
if [ -d "backend/database" ] || [ -d "backend/migrations" ]; then
    print_pass "Database directory found"
else
    print_warn "Database directory not found"
fi

if [ -f "backend/scripts/migrate.sh" ]; then
    print_pass "Migration script found"
    if [ -x "backend/scripts/migrate.sh" ]; then
        print_pass "Migration script is executable"
    else
        print_warn "Migration script is not executable"
    fi
else
    print_warn "Migration script not found"
fi

# 10. Check Docker configuration (if applicable)
print_check "Docker configuration"
if command -v docker &> /dev/null; then
    print_pass "Docker is installed"

    if [ -f "docker-compose.yml" ] || [ -f "docker-compose.prod.yml" ]; then
        print_pass "Docker Compose file found"
    else
        print_warn "No Docker Compose file found"
    fi

    if [ -f "backend/Dockerfile" ]; then
        print_pass "Backend Dockerfile found"
    else
        print_warn "Backend Dockerfile not found"
    fi
else
    print_warn "Docker not installed"
fi

# 11. Check Nginx configuration
print_check "Web server configuration"
if [ -f "docs/deployment/nginx.conf.example" ]; then
    print_pass "Nginx example config found"
else
    print_warn "Nginx example config not found"
fi

# 12. Check SSL/TLS setup
print_check "SSL/TLS configuration"
if [ -d "/etc/letsencrypt/live" ]; then
    print_pass "Let's Encrypt directory exists"
else
    print_warn "Let's Encrypt not configured (expected for first deployment)"
fi

# 13. Check disk space
print_check "Disk space"
DISK_AVAIL=$(df . | tail -1 | awk '{print $4}')
DISK_AVAIL_GB=$((DISK_AVAIL / 1024 / 1024))
if [ "$DISK_AVAIL_GB" -gt 5 ]; then
    print_pass "Sufficient disk space: ${DISK_AVAIL_GB}GB available"
else
    print_warn "Low disk space: ${DISK_AVAIL_GB}GB available"
fi

# 14. Check memory
print_check "System memory"
if command -v free &> /dev/null; then
    MEM_AVAIL=$(free -g | awk '/^Mem:/{print $7}')
    if [ "$MEM_AVAIL" -gt 1 ]; then
        print_pass "Sufficient memory: ${MEM_AVAIL}GB available"
    else
        print_warn "Low memory: ${MEM_AVAIL}GB available"
    fi
fi

# 15. Check ports
print_check "Port availability"
if command -v netstat &> /dev/null || command -v ss &> /dev/null; then
    # Check common ports
    for port in 80 443 3001 5432 6379; do
        if netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port "; then
            print_warn "Port $port is already in use"
        fi
    done
fi

# 16. Check documentation
print_check "Documentation"
if [ -f "README.md" ]; then
    print_pass "README.md exists"
else
    print_warn "README.md not found"
fi

if [ -f "docs/DEPLOYMENT_GUIDE.md" ]; then
    print_pass "Deployment guide exists"
else
    print_warn "Deployment guide not found"
fi

# 17. Security checks
print_check "Security configuration"
if [ -f ".env" ]; then
    print_fail ".env file in root (should be .env.production)"
fi

if [ -f "backend/.env" ]; then
    print_fail "backend/.env file exists (should be .env.production)"
fi

if [ -f ".gitignore" ]; then
    if grep -q "\.env" .gitignore; then
        print_pass ".env files are in .gitignore"
    else
        print_warn ".env files not in .gitignore"
    fi
fi

# Summary
echo ""
echo "=================================="
echo "Summary"
echo "=================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Ready for deployment."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Deployment is possible but review warnings first."
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Fix errors before deploying."
    exit 1
fi
