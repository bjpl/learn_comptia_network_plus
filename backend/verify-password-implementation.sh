#!/bin/bash

echo "=== Password Security Implementation Verification ==="
echo ""

echo "1. Checking bcrypt dependency..."
if grep -q '"bcrypt"' package.json; then
    echo "   ✓ bcrypt found in package.json"
    grep "bcrypt" package.json | head -2
else
    echo "   ✗ bcrypt NOT found"
fi
echo ""

echo "2. Checking password utility module..."
if [ -f "src/utils/password.ts" ]; then
    echo "   ✓ password.ts exists"
    echo "   Lines: $(wc -l < src/utils/password.ts)"
    echo "   Functions exported:"
    grep "export.*function" src/utils/password.ts | sed 's/export //g' | sed 's/{.*//g'
else
    echo "   ✗ password.ts NOT found"
fi
echo ""

echo "3. Checking test file..."
if [ -f "tests/utils/password.test.ts" ]; then
    echo "   ✓ password.test.ts exists"
    echo "   Lines: $(wc -l < tests/utils/password.test.ts)"
    echo "   Test suites: $(grep -c "describe(" tests/utils/password.test.ts)"
    echo "   Test cases: $(grep -c "it(" tests/utils/password.test.ts)"
else
    echo "   ✗ password.test.ts NOT found"
fi
echo ""

echo "4. Checking auth service integration..."
if grep -q "from '../utils/password'" src/services/auth.service.ts; then
    echo "   ✓ Auth service imports password utils"
else
    echo "   ✗ Auth service NOT using password utils"
fi
echo ""

echo "5. Checking salt rounds upgrade..."
if grep -q "SALT_ROUNDS = 12" src/utils/password.ts; then
    echo "   ✓ Using 12 salt rounds (production security)"
else
    echo "   ⚠ Not using 12 salt rounds"
fi
echo ""

echo "6. Checking auto-upgrade feature..."
if grep -q "checkAndRehashPassword" src/controllers/auth.controller.ts; then
    echo "   ✓ Auto-upgrade enabled in login controller"
else
    echo "   ⚠ Auto-upgrade NOT enabled"
fi
echo ""

echo "7. Checking documentation..."
if [ -f "docs/PASSWORD_SECURITY.md" ]; then
    echo "   ✓ Documentation exists"
    echo "   Lines: $(wc -l < docs/PASSWORD_SECURITY.md)"
else
    echo "   ✗ Documentation NOT found"
fi
echo ""

echo "=== Verification Complete ==="
