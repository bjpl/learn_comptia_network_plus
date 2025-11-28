# Backend API Test Suite

## Overview

Comprehensive unit tests for the CompTIA Network+ Learning Platform backend API. The test suite covers authentication, user management, and progress tracking endpoints.

## Test Files

### 1. auth.test.ts

Tests for authentication endpoints including:

- **Registration** (`POST /api/auth/register`)
  - Valid registration
  - Duplicate email detection
  - Email format validation
  - Password strength validation

- **Login** (`POST /api/auth/login`)
  - Valid credentials
  - Invalid email/password
  - Account lockout after failed attempts

- **Token Management** (`POST /api/auth/refresh`)
  - Token refresh
  - Invalid token rejection

- **Email Verification** (`POST /api/auth/verify-email`)
  - Valid token verification
  - Missing/invalid token rejection

- **Verification Resend** (`POST /api/auth/resend-verification`)
  - Email enumeration prevention
  - Invalid email format rejection

- **Password Reset** (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`)
  - Reset request handling
  - Email enumeration prevention
  - Password complexity validation
  - Rate limiting verification

### 2. user.test.ts (NEW)

Tests for user management endpoints including:

- **Profile Management** (`GET/PUT /api/users/profile`)
  - Get user profile
  - Update profile data
  - Partial updates
  - Authentication requirement
  - XSS prevention

- **Settings** (`GET/PUT /api/users/settings`)
  - Get user settings
  - Update settings
  - Validation of theme/language values

- **Password Change** (`POST /api/users/password`)
  - Valid password change
  - Current password verification
  - Password complexity enforcement

- **Avatar Upload** (`POST /api/users/avatar`)
  - Valid avatar upload
  - Size limit enforcement (5MB)
  - Format validation

- **Account Deletion** (`DELETE /api/users/account`)
  - Password confirmation requirement
  - Token invalidation after deletion
  - Prevention of subsequent login

### 3. progress.test.ts

Tests for progress tracking endpoints including:

- **Progress Sync** (`POST /api/progress/sync`)
  - Sync local progress data
  - Validation of progress structure

- **Component Progress** (`GET/PUT /api/progress/component/:componentId`)
  - Get component-specific progress
  - Update component progress
  - Score range validation

- **Progress Reset** (`POST /api/progress/reset`)
  - Reset all user progress
  - Verification of deletion

## Test Coverage

The test suite provides coverage for:

- ✅ Success cases (happy path)
- ✅ Validation errors (malformed input)
- ✅ Authentication errors (missing/invalid tokens)
- ✅ Authorization errors (insufficient permissions)
- ✅ Edge cases (boundary values, empty data)
- ✅ Security tests (XSS, rate limiting, email enumeration)

## Setup Requirements

### Environment Variables

Tests use `.env.test` file for configuration. Required variables:

```bash
NODE_ENV=test
DB_HOST=localhost
DB_PORT=5432
DB_NAME=comptia_network_test
DB_USER=postgres
DB_PASSWORD=your_test_password
JWT_SECRET=test-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

1. Create test database:

```bash
createdb comptia_network_test
```

2. Run migrations:

```bash
npm run migrate
```

### Running Tests

Run all tests:

```bash
npm test
```

Run specific test file:

```bash
npx jest tests/auth.test.ts
npx jest tests/user.test.ts
npx jest tests/progress.test.ts
```

Run with coverage:

```bash
npm test -- --coverage
```

Run in watch mode:

```bash
npm run test:watch
```

## Test Structure

Each test follows the AAA pattern:

- **Arrange**: Set up test data and preconditions
- **Act**: Execute the endpoint
- **Assert**: Verify expected results

Example:

```typescript
it('should update profile with valid data', async () => {
  // Arrange
  const profileData = {
    first_name: 'John',
    last_name: 'Doe',
  };

  // Act
  const response = await request(app)
    .put('/api/users/profile')
    .set('Authorization', `Bearer ${authToken}`)
    .send(profileData);

  // Assert
  expect(response.status).toBe(200);
  expect(response.body.data.first_name).toBe('John');
});
```

## Configuration Files

- **jest.config.js**: Main Jest configuration
- **tsconfig.test.json**: TypeScript configuration for tests (relaxed strict mode)
- **tests/setup.ts**: Test environment setup and globals

## Minimum Test Coverage Per Endpoint

Each endpoint has at least 3 tests:

1. Success case
2. Validation error
3. Authentication error

Critical endpoints have additional tests for:

- Edge cases
- Security vulnerabilities
- Rate limiting
- Error handling

## Notes

- Tests run sequentially to avoid database conflicts (`--runInBand`)
- 30-second timeout for slow operations
- Tests use isolated database transactions
- Tokens are generated per test suite
- Database is reset between test suites

## Troubleshooting

### Database Connection Errors

Ensure PostgreSQL is running and `.env.test` has correct credentials:

```bash
psql -U postgres -c "SELECT 1"
```

### TypeScript Errors

Tests use relaxed TypeScript settings in `tsconfig.test.json`. If errors persist:

```bash
npx tsc --project tsconfig.test.json --noEmit
```

### Port Conflicts

Ensure port 3001 is available or change in `.env.test`:

```bash
lsof -i :3001
```

## Future Enhancements

- [ ] Add assessment endpoint tests
- [ ] Add integration tests for workflow scenarios
- [ ] Add performance benchmarks
- [ ] Add load testing
- [ ] Add API contract testing
- [ ] Add mutation testing
