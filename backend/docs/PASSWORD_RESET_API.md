# Password Reset API Documentation

This document describes the password reset functionality implemented in the authentication API.

## Overview

The password reset flow allows users to securely reset their passwords through a two-step process:

1. Request a password reset (sends email with reset token)
2. Reset password using the token

## Security Features

- **Token expires after 1 hour** for security
- **Rate limited**: 3 requests per hour per IP address
- **Email enumeration protection**: Always returns success message
- **Strong password requirements**: Enforced on reset
- **Token invalidation**: Single-use tokens that are cleared after use
- **Session invalidation**: All refresh tokens are invalidated on password reset

## API Endpoints

### 1. Request Password Reset

**Endpoint:** `POST /api/auth/forgot-password`

**Rate Limit:** 3 requests per hour per IP

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid email format

```json
{
  "success": false,
  "error": "Valid email is required"
}
```

- **429 Too Many Requests** - Rate limit exceeded

```json
{
  "success": false,
  "error": "Too many password reset requests, please try again later",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

**Example using cURL:**

```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Example using JavaScript/Fetch:**

```javascript
const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
  }),
});

const data = await response.json();
console.log(data);
```

---

### 2. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**

```json
{
  "token": "abc123...def456",
  "newPassword": "NewSecureP@ssw0rd"
}
```

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%\*?&)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Missing token or password

```json
{
  "success": false,
  "error": "Token and new password are required"
}
```

- **400 Bad Request** - Invalid or expired token

```json
{
  "success": false,
  "error": "Invalid or expired reset token"
}
```

- **400 Bad Request** - Weak password

```json
{
  "success": false,
  "error": "Password must be at least 8 characters long"
}
```

or

```json
{
  "success": false,
  "error": "Password must contain uppercase, lowercase, number, and special character"
}
```

**Example using cURL:**

```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"abc123...def456",
    "newPassword":"NewSecureP@ssw0rd"
  }'
```

**Example using JavaScript/Fetch:**

```javascript
const response = await fetch('http://localhost:3001/api/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'abc123...def456',
    newPassword: 'NewSecureP@ssw0rd',
  }),
});

const data = await response.json();
console.log(data);
```

---

## Email Service

### Development Mode

In development mode (`NODE_ENV=development`), password reset emails are logged to the console instead of being sent:

```
==============================================
PASSWORD RESET EMAIL (DEVELOPMENT MODE)
==============================================
To: user@example.com
Subject: Reset Your Password

Reset URL: http://localhost:3000/reset-password?token=abc123...
==============================================
```

### Production Mode

In production, you need to configure an email service provider. The email service supports:

- **SendGrid**
- **AWS SES**
- **Mailgun**
- **Postmark**

To implement email sending in production:

1. Install the email provider's SDK (e.g., `npm install @sendgrid/mail`)
2. Configure API keys in environment variables
3. Update `backend/src/services/email.service.ts` with provider integration

Example SendGrid implementation:

```typescript
// In email.service.ts
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send(emailContent);
```

---

## Database Schema

The password reset functionality uses the following columns in the `users` table:

```sql
reset_token TEXT                    -- 64-character hex token
reset_token_expires TIMESTAMPTZ     -- Expiration timestamp (1 hour from creation)
```

These columns are automatically managed by the application and should not be modified manually.

---

## Complete Flow Example

### Frontend Implementation

```javascript
// Step 1: User requests password reset
async function requestPasswordReset(email) {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (data.success) {
    // Show success message to user
    alert('Check your email for reset instructions');
  }
}

// Step 2: User clicks link in email and is directed to reset form
// Extract token from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Step 3: User submits new password
async function resetPassword(token, newPassword) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await response.json();

  if (data.success) {
    // Redirect to login page
    window.location.href = '/login';
  } else {
    // Show error message
    alert(data.error);
  }
}
```

---

## Testing

### Manual Testing (Development)

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Request a password reset:

   ```bash
   curl -X POST http://localhost:3001/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. Check the console output for the reset token URL

4. Extract the token from the URL and reset the password:

   ```bash
   curl -X POST http://localhost:3001/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{
       "token":"<TOKEN_FROM_EMAIL>",
       "newPassword":"NewP@ssw0rd123"
     }'
   ```

5. Verify you can login with the new password

---

## Security Considerations

1. **Token Security**
   - Tokens are 32-byte cryptographically secure random values
   - Tokens are hashed before comparison (when using bcrypt in production)
   - Tokens expire after 1 hour
   - Tokens are single-use and invalidated after password reset

2. **Email Enumeration Protection**
   - Same response returned whether or not email exists
   - Prevents attackers from discovering valid email addresses

3. **Rate Limiting**
   - Prevents brute force attacks
   - Limits abuse of email sending

4. **Password Strength**
   - Enforces strong password requirements
   - Same validation as registration

5. **Session Security**
   - All refresh tokens invalidated on password reset
   - Forces user to log in again on all devices

---

## Environment Variables

Required environment variables:

```env
# Frontend URL for password reset links
FRONTEND_URL=http://localhost:3000

# Email service configuration (production only)
SENDGRID_API_KEY=your_sendgrid_api_key
# or
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key
```

---

## Troubleshooting

### Token Invalid or Expired

**Possible causes:**

- Token has expired (> 1 hour old)
- Token has already been used
- Token was not found in database
- Token was malformed

**Solution:** Request a new password reset

### Email Not Received

**Development mode:**

- Check server console output for the reset URL

**Production mode:**

- Check email service provider logs
- Verify email service API keys are configured
- Check spam/junk folder
- Verify email address is correct

### Rate Limit Exceeded

**Solution:** Wait for the rate limit window to expire (1 hour) before trying again

---

## Implementation Files

The password reset functionality is implemented across these files:

- `backend/src/routes/auth.routes.ts` - Route definitions
- `backend/src/controllers/auth.controller.ts` - Request handlers (forgotPassword, resetPassword)
- `backend/src/models/user.model.ts` - Database operations
- `backend/src/services/email.service.ts` - Email sending
- `backend/src/utils/validators.ts` - Input validation
- `backend/src/middleware/rate-limit.middleware.ts` - Rate limiting
- `backend/database/migrations/001_create_users.sql` - Database schema
