#!/bin/bash

echo "🔍 Secrets Verification Script"
echo "=============================="
echo ""
echo "This script verifies that all required secrets are set and meet security requirements."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0
WARNINGS=0

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Run: cp .env.example .env"
    exit 1
fi

# Load .env file
set -a
source .env
set +a

echo "Environment: ${NODE_ENV:-development}"
echo ""

# Function to check if variable exists
check_exists() {
    local var_name=$1
    local var_value=${!var_name}

    TOTAL=$((TOTAL + 1))

    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name is not set${NC}"
        FAILED=$((FAILED + 1))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name is set"
        PASSED=$((PASSED + 1))
        return 0
    fi
}

# Function to check minimum length
check_length() {
    local var_name=$1
    local min_length=$2
    local var_value=${!var_name}

    if [ ${#var_value} -lt $min_length ]; then
        echo -e "${YELLOW}⚠️  $var_name is too short (${#var_value} chars, minimum $min_length)${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
    return 0
}

# Function to check if value is not default/example
check_not_default() {
    local var_name=$1
    local var_value=${!var_name}

    # Check for common placeholder values
    if [[ "$var_value" =~ (change|replace|example|test|demo|your|xxx|placeholder|\[.*\]) ]]; then
        echo -e "${YELLOW}⚠️  $var_name appears to be a placeholder value${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
    return 0
}

# Function to check secret strength
check_strength() {
    local var_name=$1
    local var_value=${!var_name}

    # Check for character diversity
    has_lower=false
    has_upper=false
    has_number=false
    has_special=false

    [[ "$var_value" =~ [a-z] ]] && has_lower=true
    [[ "$var_value" =~ [A-Z] ]] && has_upper=true
    [[ "$var_value" =~ [0-9] ]] && has_number=true
    [[ "$var_value" =~ [^a-zA-Z0-9] ]] && has_special=true

    strength=0
    $has_lower && strength=$((strength + 1))
    $has_upper && strength=$((strength + 1))
    $has_number && strength=$((strength + 1))
    $has_special && strength=$((strength + 1))

    if [ $strength -lt 3 ]; then
        echo -e "${YELLOW}⚠️  $var_name has low character diversity (score: $strength/4)${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
    return 0
}

echo "📋 Checking Required Secrets"
echo "============================"
echo ""

# JWT Secrets
echo "🔐 JWT Configuration:"
if check_exists "JWT_SECRET"; then
    check_length "JWT_SECRET" 32
    check_not_default "JWT_SECRET"
    check_strength "JWT_SECRET"
fi

if check_exists "REFRESH_TOKEN_SECRET"; then
    check_length "REFRESH_TOKEN_SECRET" 32
    check_not_default "REFRESH_TOKEN_SECRET"
    check_strength "REFRESH_TOKEN_SECRET"
fi
echo ""

# Database
echo "🗄️  Database Configuration:"
if check_exists "DATABASE_URL"; then
    check_not_default "DATABASE_URL"
    # Check if using SSL
    if [[ ! "$DATABASE_URL" =~ sslmode=require ]]; then
        echo -e "${YELLOW}⚠️  DATABASE_URL should include sslmode=require for production${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

if check_exists "DB_PASSWORD"; then
    check_length "DB_PASSWORD" 16
    check_not_default "DB_PASSWORD"
    check_strength "DB_PASSWORD"
fi
echo ""

# Session & Cookies
echo "🍪 Session Configuration:"
if check_exists "SESSION_SECRET"; then
    check_length "SESSION_SECRET" 64
    check_not_default "SESSION_SECRET"
fi

if check_exists "COOKIE_SECRET"; then
    check_length "COOKIE_SECRET" 32
    check_not_default "COOKIE_SECRET"
fi
echo ""

# Encryption
echo "🔑 Encryption Configuration:"
if check_exists "ENCRYPTION_KEY"; then
    check_length "ENCRYPTION_KEY" 64
    check_not_default "ENCRYPTION_KEY"
fi
echo ""

# Security
echo "🛡️  Security Configuration:"
if check_exists "CSRF_SECRET"; then
    check_length "CSRF_SECRET" 64
    check_not_default "CSRF_SECRET"
fi

# Check BCRYPT_ROUNDS
if check_exists "BCRYPT_ROUNDS"; then
    if [ "$BCRYPT_ROUNDS" -lt 10 ]; then
        echo -e "${YELLOW}⚠️  BCRYPT_ROUNDS should be at least 10 (current: $BCRYPT_ROUNDS)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

# Check environment-specific settings
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production-Specific Checks:"

    # CORS
    if [ "$CORS_ORIGIN" = "*" ]; then
        echo -e "${RED}❌ CORS_ORIGIN should not be '*' in production${NC}"
        FAILED=$((FAILED + 1))
    fi

    # Cookie security
    if [ "$COOKIE_SECURE" != "true" ]; then
        echo -e "${RED}❌ COOKIE_SECURE should be 'true' in production${NC}"
        FAILED=$((FAILED + 1))
    fi

    # Database SSL
    if [ "$DB_SSL" != "true" ]; then
        echo -e "${YELLOW}⚠️  DB_SSL should be 'true' in production${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi

    echo ""
fi

# Summary
echo "=============================="
echo "📊 Verification Summary"
echo "=============================="
echo -e "Total Checks: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

# Exit code based on results
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Verification FAILED - Please fix the errors above${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Verification PASSED with warnings - Review warnings above${NC}"
    exit 0
else
    echo -e "${GREEN}✅ All secrets verified successfully!${NC}"
    exit 0
fi
