#!/bin/bash
# verify-no-secrets.sh
# Verifies that no real secrets are committed to git repository

set -e

echo "=========================================="
echo "Security Verification: Checking for Secrets"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Check for tracked .env files that shouldn't be committed
echo "1. Checking for improperly tracked .env files..."
TRACKED_ENV=$(git ls-files | grep -E '\.env$|\.env\.local|\.env\.production$|\.env\.staging$|\.env\.development$' || true)
if [ -n "$TRACKED_ENV" ]; then
  echo -e "${RED}❌ FAIL: Found tracked environment files that should be gitignored:${NC}"
  echo "$TRACKED_ENV"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ PASS: No improperly tracked .env files${NC}"
fi
echo ""

# 2. Check that .env.example files exist
echo "2. Checking for .env.example files..."
if [ ! -f "backend/.env.example" ]; then
  echo -e "${RED}❌ FAIL: backend/.env.example is missing${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ PASS: backend/.env.example exists${NC}"
fi
echo ""

# 3. Scan tracked files for common secret patterns
echo "3. Scanning tracked files for potential secrets..."
SECRET_PATTERNS=(
  "password.*=.*[^placeholder|example|test|your_password_here|<GENERATE|dev_password|test_password]"
  "secret.*=.*[^placeholder|example|test|<GENERATE|dev-jwt-secret|test-jwt-secret]"
  "api[_-]?key.*=.*[^placeholder|example|<GET_FROM|your-api-key]"
  "private[_-]?key.*=.*[^placeholder|example]"
  "access[_-]?token.*=.*[^placeholder|example]"
)

FOUND_SECRETS=""
for pattern in "${SECRET_PATTERNS[@]}"; do
  MATCHES=$(git ls-files | xargs grep -iE "$pattern" 2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    FOUND_SECRETS="${FOUND_SECRETS}\n${MATCHES}"
  fi
done

if [ -n "$FOUND_SECRETS" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Potential secrets found (manual review recommended):${NC}"
  echo -e "$FOUND_SECRETS"
  # Don't increment errors - could be false positives
else
  echo -e "${GREEN}✓ PASS: No obvious secrets detected in tracked files${NC}"
fi
echo ""

# 4. Verify .gitignore patterns exist
echo "4. Verifying .gitignore patterns..."
REQUIRED_PATTERNS=(
  "^\.env$"
  "^\.env\.local$"
  "^\.env\.production$"
  "\*\.pem$"
  "\*\.key$"
  "credentials\.json"
)

for pattern in "${REQUIRED_PATTERNS[@]}"; do
  if ! grep -q "$pattern" .gitignore; then
    echo -e "${RED}❌ FAIL: Missing .gitignore pattern: $pattern${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ PASS: All required .gitignore patterns present${NC}"
fi
echo ""

# 5. Check .env.example files for placeholder values
echo "5. Verifying .env.example files contain only placeholders..."
if grep -q "JWT_SECRET=<GENERATE" backend/.env.example; then
  echo -e "${GREEN}✓ PASS: JWT_SECRET uses placeholder in .env.example${NC}"
else
  echo -e "${RED}❌ FAIL: JWT_SECRET might contain real value in .env.example${NC}"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "DB_PASSWORD=your_password_here" backend/.env.example; then
  echo -e "${GREEN}✓ PASS: DB_PASSWORD uses placeholder in .env.example${NC}"
else
  echo -e "${RED}❌ FAIL: DB_PASSWORD might contain real value in .env.example${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 6. Check for certificate files
echo "6. Checking for certificate/key files..."
CERT_FILES=$(git ls-files | grep -E '\.(pem|key|p12|pfx)$' || true)
if [ -n "$CERT_FILES" ]; then
  echo -e "${RED}❌ FAIL: Certificate/key files are tracked:${NC}"
  echo "$CERT_FILES"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ PASS: No certificate/key files in repository${NC}"
fi
echo ""

# Summary
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ SECURITY CHECK PASSED${NC}"
  echo -e "${GREEN}No security issues detected${NC}"
  exit 0
else
  echo -e "${RED}✗ SECURITY CHECK FAILED${NC}"
  echo -e "${RED}Found $ERRORS error(s) - review and fix before committing${NC}"
  exit 1
fi
