# Email Verification Testing Guide

## Prerequisites

1. Backend server running: `npm run dev`
2. Database running and migrated
3. Environment variables configured

## Test Scenarios

### Scenario 1: User Registration with Email Verification

**Step 1: Register New User**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Test123!@#"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "newuser@example.com",
      "role": "student",
      "email_verified": false
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Console Output (Development Mode):**

```
========================================
EMAIL VERIFICATION (DEVELOPMENT MODE)
========================================
To: newuser@example.com
Verification URL: http://localhost:3000/verify-email?token=abc123def456...
========================================
```

**Step 2: Copy Verification Token**
From the console output, copy the token from the URL (the part after `token=`)

---

### Scenario 2: Verify Email

**Step 3: Verify Email with Token**

```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "PASTE_TOKEN_HERE"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Scenario 3: Login with Verified Email

**Step 4: Login After Verification**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Test123!@#"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "newuser@example.com",
      "role": "student",
      "email_verified": true
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Note:** No warning message because email is verified.

---

### Scenario 4: Login with Unverified Email

**Step 5: Register Another User**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unverified@example.com",
    "password": "Test123!@#"
  }'
```

**Step 6: Login Without Verification**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unverified@example.com",
    "password": "Test123!@#"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "email": "unverified@example.com",
      "role": "student",
      "email_verified": false
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "warning": "Please verify your email address to access all features."
}
```

---

### Scenario 5: Resend Verification Email

**Step 7: Request New Verification Email**

```bash
curl -X POST http://localhost:4000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unverified@example.com"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

**Console Output:**
New verification token will be logged to console.

---

### Scenario 6: Invalid Token

**Step 8: Verify with Invalid Token**

```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalidtoken123"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Invalid or expired verification token"
}
```

---

### Scenario 7: Already Verified Email

**Step 9: Try to Verify Again**

```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ALREADY_USED_TOKEN"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Invalid or expired verification token"
}
```

---

### Scenario 8: Resend for Already Verified Email

**Step 10: Request Resend for Verified Email**

```bash
curl -X POST http://localhost:4000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Email is already verified"
}
```

---

### Scenario 9: Resend for Non-Existent Email

**Step 11: Request Resend for Non-Existent Email**

```bash
curl -X POST http://localhost:4000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "If an account exists with this email, a verification email has been sent."
}
```

**Note:** Response doesn't reveal if email exists (security best practice).

---

### Scenario 10: Check User Profile

**Step 12: Get Current User (with Token)**

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "newuser@example.com",
    "role": "student",
    "email_verified": true,
    "profile": {},
    "created_at": "2025-11-28T..."
  }
}
```

---

## Automated Test Script

Create a test script `backend/scripts/test-email-verification.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:4000/api/auth"
EMAIL="test$(date +%s)@example.com"
PASSWORD="Test123!@#"

echo "Testing Email Verification Flow"
echo "================================"

# 1. Register
echo -e "\n1. Registering user: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$REGISTER_RESPONSE" | jq .

# Extract token from console (manual step in dev)
echo -e "\n2. Check console for verification token"
read -p "Enter verification token: " TOKEN

# 3. Verify Email
echo -e "\n3. Verifying email with token"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/verify-email" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\"}")

echo "$VERIFY_RESPONSE" | jq .

# 4. Login
echo -e "\n4. Logging in"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq .

# Extract access token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')

# 5. Get Profile
echo -e "\n5. Getting user profile"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$PROFILE_RESPONSE" | jq .

echo -e "\nTest completed!"
```

---

## Database Queries for Verification

### Check User Verification Status

```sql
SELECT id, email, email_verified, verification_token
FROM users
WHERE email = 'newuser@example.com';
```

### Manually Verify User (for testing)

```sql
UPDATE users
SET email_verified = true, verification_token = NULL
WHERE email = 'newuser@example.com';
```

### View All Unverified Users

```sql
SELECT id, email, created_at
FROM users
WHERE email_verified = false
ORDER BY created_at DESC;
```

### Count Verification Status

```sql
SELECT
  COUNT(*) FILTER (WHERE email_verified = true) as verified,
  COUNT(*) FILTER (WHERE email_verified = false) as unverified
FROM users;
```

---

## Common Issues & Solutions

### Issue 1: Email not being logged to console

**Solution:** Check NODE_ENV is set to 'development'

### Issue 2: Token validation fails

**Solution:** Ensure token is exactly as shown (no extra spaces/characters)

### Issue 3: Database error on verification

**Solution:** Check that `email_verified` and `verification_token` columns exist

### Issue 4: Cannot find EmailService

**Solution:** Ensure email.service.ts exists in src/services/

---

## Production Checklist

Before deploying to production:

- [ ] Set NODE_ENV=production
- [ ] Configure real email service (SendGrid/AWS SES)
- [ ] Set FRONTEND_URL environment variable
- [ ] Add token expiration logic
- [ ] Add rate limiting for resend endpoint
- [ ] Set up email templates
- [ ] Configure SMTP credentials
- [ ] Test with real email addresses
- [ ] Monitor email delivery rates
- [ ] Set up email bounce/complaint handling
