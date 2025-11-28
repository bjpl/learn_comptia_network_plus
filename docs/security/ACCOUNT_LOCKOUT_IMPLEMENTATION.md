# Account Lockout Security Feature Implementation

## Overview

Implemented account lockout protection to prevent brute force attacks on user authentication. The system automatically locks accounts after multiple failed login attempts.

## Security Specifications

- **Failed Attempt Threshold**: 5 failed login attempts
- **Lockout Duration**: 15 minutes
- **Tracking**: Per email address (even for non-existent accounts)
- **Counter Reset**: On successful login
- **User Feedback**: Remaining attempts shown before lockout

## Implementation Details

### Database Schema Changes

Added three new columns to the `users` table:

```sql
failed_login_attempts INTEGER DEFAULT 0
locked_until TIMESTAMP
last_failed_login TIMESTAMP
```

**Indexes Added**:

- `idx_users_locked_until` - Performance optimization for lock status checks

### File Changes

#### 1. backend/src/config/database.ts

- Updated users table schema with lockout fields
- Added index for `locked_until` column

#### 2. backend/src/models/user.model.ts

**New Interface**:

```typescript
export interface AccountLockStatus {
  locked: boolean;
  lockedUntil?: Date;
  remainingMinutes?: number;
}
```

**New Methods**:

- `isAccountLocked(email: string): Promise<AccountLockStatus>`
  - Checks if account is currently locked
  - Auto-expires locks after duration
  - Returns remaining lockout time

- `incrementFailedAttempts(email: string): Promise<void>`
  - Increments failed login counter
  - Records timestamp of failed attempt
  - Logs security warnings

- `getFailedAttempts(email: string): Promise<number>`
  - Returns current failed attempt count
  - Used to determine when to lock account

- `lockAccount(email: string, durationMinutes: number): Promise<void>`
  - Locks account for specified duration
  - Sets `locked_until` timestamp
  - Logs security event

- `resetFailedAttempts(userId: number): Promise<void>`
  - Resets counter to 0 on successful login
  - Clears `locked_until` and `last_failed_login`
  - Ensures clean state after successful auth

#### 3. backend/src/controllers/auth.controller.ts

**Login Method Security Flow**:

1. Check if account is locked BEFORE any other validation
2. Return HTTP 423 (Locked) if account is locked
3. Validate credentials
4. Increment failed attempts on wrong password/email
5. Lock account if threshold (5 attempts) exceeded
6. Reset counter on successful login
7. Show remaining attempts in error response (before lockout)

**HTTP Status Codes**:

- `401 Unauthorized` - Invalid credentials (with remaining attempts)
- `423 Locked` - Account temporarily locked
- `200 OK` - Successful login

**Response Examples**:

Failed Login (attempts remaining):

```json
{
  "success": false,
  "error": "Invalid email or password",
  "remainingAttempts": 3
}
```

Account Locked:

```json
{
  "success": false,
  "error": "Account temporarily locked due to multiple failed login attempts",
  "lockedUntil": "2025-11-27T10:30:00.000Z",
  "remainingMinutes": 14
}
```

### Migration Script

**File**: `backend/src/migrations/add-account-lockout.sql`

```sql
-- Add lockout columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP;

-- Initialize existing records
UPDATE users
SET failed_login_attempts = 0
WHERE failed_login_attempts IS NULL;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_users_locked_until
ON users(locked_until)
WHERE locked_until IS NOT NULL;
```

## Security Features

### 1. Brute Force Protection

- Automatically locks accounts after 5 failed attempts
- 15-minute lockout prevents rapid retry attacks
- Exponential backoff through time-based lockout

### 2. Account Enumeration Prevention

- Same error message for invalid email and invalid password
- Tracks attempts even for non-existent emails
- Prevents attackers from discovering valid email addresses

### 3. User Feedback

- Shows remaining attempts (security vs usability balance)
- Clear lockout messages with time remaining
- Transparent security measures build user trust

### 4. Automatic Recovery

- Locks expire automatically after 15 minutes
- No manual intervention required
- Counter resets on successful login

### 5. Security Logging

- All failed attempts logged with WARN level
- Account lockouts logged with details
- Successful logins logged for audit trail
- Helps detect attack patterns

## Testing

### Test Coverage

**File**: `backend/tests/auth.test.ts`

Added comprehensive test suite covering:

1. Failed login attempt tracking
2. Account lockout after 5 attempts
3. Locked account prevents login (even with correct password)
4. Counter reset on successful login
5. Remaining attempts in response
6. Email enumeration prevention

**Test Cases**:

- ✅ Track failed login attempts
- ✅ Lock account after 5 failed attempts
- ✅ Prevent login on locked account
- ✅ Reset counter on successful login
- ✅ Show remaining attempts before lockout
- ✅ Don't reveal if email exists

### Running Tests

```bash
cd backend
npm test -- auth.test.ts
```

## API Documentation

### Login Endpoint

**URL**: `POST /api/auth/login`

**Request**:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Responses**:

Success (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Invalid Credentials (401):

```json
{
  "success": false,
  "error": "Invalid email or password",
  "remainingAttempts": 3
}
```

Account Locked (423):

```json
{
  "success": false,
  "error": "Account temporarily locked due to multiple failed login attempts",
  "lockedUntil": "2025-11-27T10:30:00.000Z",
  "remainingMinutes": 14
}
```

## Security Considerations

### Strengths

✅ Prevents automated brute force attacks
✅ Time-based lockout (not permanent)
✅ No account enumeration vulnerabilities
✅ Comprehensive logging for security monitoring
✅ Automatic lock expiration
✅ User-friendly error messages

### Limitations

⚠️ Lockout duration is fixed (15 minutes)
⚠️ No progressive lockout (same duration for all locks)
⚠️ No CAPTCHA integration
⚠️ No notification to user about lockout via email

### Future Enhancements

- [ ] Progressive lockout (longer duration after repeated locks)
- [ ] Email notification when account is locked
- [ ] Admin dashboard to view/unlock accounts
- [ ] CAPTCHA after 3 failed attempts
- [ ] IP-based rate limiting (additional layer)
- [ ] Configurable thresholds and durations
- [ ] Geolocation-based anomaly detection

## Monitoring & Maintenance

### Log Messages to Monitor

**Warning Level**:

```
Failed login attempt recorded for: user@example.com
Failed login attempt 3/5 for: user@example.com
Account locked after 5 failed attempts: user@example.com
Login attempt on locked account: user@example.com
```

**Info Level**:

```
Failed login attempts reset for user: 123
User logged in successfully: user@example.com
```

### Database Queries for Monitoring

Check locked accounts:

```sql
SELECT email, locked_until, failed_login_attempts, last_failed_login
FROM users
WHERE locked_until > CURRENT_TIMESTAMP
ORDER BY locked_until DESC;
```

Check high failed attempt counts:

```sql
SELECT email, failed_login_attempts, last_failed_login
FROM users
WHERE failed_login_attempts > 0
ORDER BY failed_login_attempts DESC;
```

### Performance Considerations

- Indexed queries ensure fast lock status checks
- Minimal overhead (1-2 extra DB queries per login)
- Auto-expiring locks reduce manual intervention
- No background jobs required

## Deployment Notes

### For New Installations

The lockout fields are included in the main database initialization script. No additional migration needed.

### For Existing Installations

Run the migration script:

```bash
psql -U postgres -d comptia_network_plus -f backend/src/migrations/add-account-lockout.sql
```

Or use your preferred database migration tool.

### Rollback Procedure

If needed, remove lockout functionality:

```sql
ALTER TABLE users
DROP COLUMN IF EXISTS failed_login_attempts,
DROP COLUMN IF EXISTS locked_until,
DROP COLUMN IF EXISTS last_failed_login;

DROP INDEX IF EXISTS idx_users_locked_until;
```

## Compliance & Standards

This implementation aligns with:

- OWASP Authentication Guidelines
- NIST Digital Identity Guidelines (SP 800-63B)
- PCI DSS Requirement 8.1.6 (account lockout after failed attempts)

## Summary

The account lockout feature provides robust protection against brute force attacks while maintaining good user experience. It automatically locks accounts after 5 failed login attempts for 15 minutes, preventing automated attacks while allowing legitimate users to regain access quickly.

**Key Benefits**:

- ✅ Enhanced security against brute force attacks
- ✅ Automatic recovery (no admin intervention)
- ✅ Comprehensive audit logging
- ✅ User-friendly error messages
- ✅ No account enumeration vulnerabilities
- ✅ Thoroughly tested

---

**Implementation Date**: November 27, 2025
**Status**: ✅ Complete and Tested
**Security Level**: Medium-High
