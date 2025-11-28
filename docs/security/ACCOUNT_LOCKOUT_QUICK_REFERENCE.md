# Account Lockout - Quick Reference

## Configuration

```typescript
// Current settings (hardcoded in auth.controller.ts)
MAX_FAILED_ATTEMPTS = 5;
LOCKOUT_DURATION_MINUTES = 15;
```

## UserModel Methods

### Check if Account is Locked

```typescript
const lockStatus = await UserModel.isAccountLocked(email);
if (lockStatus.locked) {
  // Account is locked
  console.log(`Locked until: ${lockStatus.lockedUntil}`);
  console.log(`Minutes remaining: ${lockStatus.remainingMinutes}`);
}
```

### Increment Failed Attempts

```typescript
await UserModel.incrementFailedAttempts(email);
```

### Get Failed Attempts Count

```typescript
const attempts = await UserModel.getFailedAttempts(email);
console.log(`Failed attempts: ${attempts}/5`);
```

### Lock Account

```typescript
await UserModel.lockAccount(email, 15); // 15 minutes
```

### Reset Failed Attempts

```typescript
await UserModel.resetFailedAttempts(userId);
```

## Login Flow Diagram

```
┌─────────────────────────────────────────────┐
│ POST /api/auth/login                        │
│ { email, password }                         │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ Check: isAccountLocked(email)               │
└────────┬────────────────────┬────────────────┘
         │                    │
    YES  │                    │  NO
         ▼                    ▼
┌────────────────────┐  ┌─────────────────────┐
│ Return 423 Locked  │  │ Validate User       │
│ + lockedUntil      │  │ Exists?             │
│ + remainingMinutes │  └─────┬───────────────┘
└────────────────────┘        │
                        ┌─────┴─────┐
                   NO   │           │  YES
                        ▼           ▼
              ┌─────────────┐ ┌──────────────┐
              │ Increment   │ │ Validate     │
              │ Attempts    │ │ Password     │
              │ Return 401  │ └──────┬───────┘
              └─────────────┘        │
                                ┌────┴────┐
                           FAIL │         │ PASS
                                ▼         ▼
                      ┌──────────────┐ ┌──────────────┐
                      │ Increment    │ │ Reset        │
                      │ Attempts     │ │ Attempts     │
                      │ Check >= 5   │ │ Return 200   │
                      │ Lock if needed│ │ + tokens     │
                      │ Return 401/423│ └──────────────┘
                      └──────────────┘
```

## HTTP Response Examples

### Successful Login

```json
HTTP 200 OK
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "user@example.com", "role": "student" },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Failed Login (Attempts Remaining)

```json
HTTP 401 Unauthorized
{
  "success": false,
  "error": "Invalid email or password",
  "remainingAttempts": 3
}
```

### Account Locked

```json
HTTP 423 Locked
{
  "success": false,
  "error": "Account temporarily locked due to multiple failed login attempts",
  "lockedUntil": "2025-11-27T10:30:00.000Z",
  "remainingMinutes": 14
}
```

## Database Schema

```sql
-- Users table (relevant fields)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  -- Account lockout fields
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  last_failed_login TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX idx_users_locked_until
ON users(locked_until)
WHERE locked_until IS NOT NULL;
```

## Common Use Cases

### Manually Check Account Status

```typescript
const user = await UserModel.findByEmail(email);
console.log({
  failedAttempts: user.failed_login_attempts,
  lockedUntil: user.locked_until,
  lastFailedLogin: user.last_failed_login,
});
```

### Manually Unlock Account (Admin Action)

```typescript
// Future enhancement - not currently implemented
await UserModel.resetFailedAttempts(userId);
```

### Check All Locked Accounts (SQL)

```sql
SELECT email, locked_until, failed_login_attempts
FROM users
WHERE locked_until > CURRENT_TIMESTAMP;
```

### Check Accounts with High Failed Attempts

```sql
SELECT email, failed_login_attempts, last_failed_login
FROM users
WHERE failed_login_attempts >= 3
ORDER BY failed_login_attempts DESC;
```

## Testing Examples

```typescript
// Test account lockout
describe('Account Lockout', () => {
  it('should lock account after 5 failed attempts', async () => {
    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });
    }

    // 6th attempt should return 423 Locked
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(423);

    expect(response.body.error).toContain('locked');
  });
});
```

## Log Messages

### Warning Logs (Security Events)

```
Failed login attempt recorded for: user@example.com
Failed login attempt 3/5 for: user@example.com
Account locked after 5 failed attempts: user@example.com
Login attempt on locked account: user@example.com
```

### Info Logs (Normal Operations)

```
Failed login attempts reset for user: 123
User logged in successfully: user@example.com
```

## Security Notes

✅ **DO**:

- Always check lock status BEFORE validating credentials
- Log all security events (failed attempts, lockouts)
- Use same error message for invalid email/password
- Reset counter on successful login
- Show remaining attempts to user

❌ **DON'T**:

- Don't reveal if email exists in error messages
- Don't allow bypassing lock check
- Don't hardcode lockout duration in multiple places
- Don't forget to reset counter after successful login

## Troubleshooting

### User reports being locked out

1. Check database: `SELECT * FROM users WHERE email = 'user@example.com'`
2. Check `locked_until` timestamp
3. Check `failed_login_attempts` count
4. Review logs for failed login patterns
5. If needed, manually reset: `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE email = 'user@example.com'`

### Lockout not working

1. Verify database schema has lockout fields
2. Check application logs for errors
3. Verify `isAccountLocked()` is called first in login flow
4. Check indexes exist: `\d+ users` in psql

### Performance issues

1. Verify index exists: `idx_users_locked_until`
2. Check query performance: `EXPLAIN ANALYZE SELECT * FROM users WHERE locked_until > CURRENT_TIMESTAMP`
3. Monitor connection pool usage

## Files Modified

- `backend/src/config/database.ts` - Database schema
- `backend/src/models/user.model.ts` - Lockout methods
- `backend/src/controllers/auth.controller.ts` - Login logic
- `backend/src/migrations/add-account-lockout.sql` - Migration script
- `backend/tests/auth.test.ts` - Test cases

---

**Quick Links**:

- [Full Implementation Guide](./ACCOUNT_LOCKOUT_IMPLEMENTATION.md)
- [Security Documentation](./README.md)
- [API Documentation](../api/)
