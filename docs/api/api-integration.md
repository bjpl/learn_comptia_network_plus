# API Integration Architecture

## Overview

This document describes the API integration architecture for the CompTIA Network+ Learning Platform. The frontend connects to a REST API backend for authentication, user management, progress tracking, and assessments.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend App                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Components │  │    Stores    │  │    Hooks     │      │
│  │              │  │              │  │              │      │
│  │  LoginForm   │  │  authStore   │  │  useAuth     │      │
│  │  Dashboard   │──│  userStore   │──│  useUser     │      │
│  │  Profile     │  │  progressStore│  │  useProgress │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│  ┌─────────────────────────────────────────────────┐        │
│  │             Service Layer                        │        │
│  ├─────────────────────────────────────────────────┤        │
│  │  authService  │  userService  │  progressService │        │
│  └─────────────────────────────────────────────────┘        │
│                            │                                  │
│  ┌─────────────────────────────────────────────────┐        │
│  │            API Client Layer                      │        │
│  ├─────────────────────────────────────────────────┤        │
│  │  - Request/Response Interceptors                │        │
│  │  - Token Management (Access + Refresh)          │        │
│  │  - Error Handling                                │        │
│  │  - Retry Logic                                   │        │
│  │  - Request Cancellation                          │        │
│  └─────────────────────────────────────────────────┘        │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Network Layer │
                    └────────┬────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      Backend API                               │
├───────────────────────────────────────────────────────────────┤
│  /api/auth/*      - Authentication endpoints                  │
│  /api/users/*     - User management                           │
│  /api/progress/*  - Progress tracking                         │
│  /api/assessments/* - Quiz and assessment                     │
└───────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. API Client (`src/services/api-client.ts`)

The base HTTP client built on Fetch API with advanced features:

**Features:**

- Request/Response interceptors
- Automatic token injection
- Token refresh on 401 errors
- Retry logic with exponential backoff
- Request timeout handling
- Network error handling
- Offline request queuing

**Usage:**

```typescript
import { apiClient } from './services/api-client';

// GET request
const response = await apiClient.get('/users/profile');

// POST request
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// With custom config
const response = await apiClient.get('/data', {
  timeout: 5000,
  skipAuth: true,
  skipRetry: true,
});
```

### 2. Service Layer

Abstraction layer for API operations:

#### Authentication Service (`src/services/auth-service.ts`)

```typescript
import * as authService from './services/auth-service';

// Login
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true,
});

// Register
const authResponse = await authService.register({
  email: 'new@example.com',
  username: 'newuser',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  acceptTerms: true,
});

// Logout
await authService.logout();

// Get current user
const user = await authService.getCurrentUser();
```

#### User Service (`src/services/user-service.ts`)

```typescript
import * as userService from './services/user-service';

// Update profile
const user = await userService.updateUserProfile({
  firstName: 'John',
  lastName: 'Smith',
});

// Change password
await userService.changePassword({
  currentPassword: 'old123',
  newPassword: 'new456',
  confirmPassword: 'new456',
});

// Upload avatar
const avatarUrl = await userService.uploadAvatar(fileObject);

// Get/Update settings
const settings = await userService.getUserSettings();
await userService.updateUserSettings({
  theme: 'dark',
  emailNotifications: false,
});
```

#### Progress Service (`src/services/progress-service.ts`)

```typescript
import * as progressService from './services/progress-service';

// Update progress
await progressService.updateComponentProgress('component-id', {
  timeSpent: 300,
  completed: true,
  score: 85,
});

// Sync with backend
await progressService.syncProgress(localProgressData);

// Get progress
const progress = await progressService.getComponentProgress('component-id');
const allProgress = await progressService.getAllProgress();
```

#### Assessment Service (`src/services/assessment-service.ts`)

```typescript
import * as assessmentService from './services/assessment-service';

// Get quiz
const quiz = await assessmentService.getQuiz('quiz-id');

// Submit answers
const result = await assessmentService.submitQuiz({
  quizId: 'quiz-id',
  answers: [...],
  totalTime: 600,
  completedAt: new Date().toISOString()
});

// Get results
const attempts = await assessmentService.getQuizAttempts();
```

### 3. State Management (Zustand Stores)

#### Auth Store (`src/stores/authStore.ts`)

```typescript
import { useAuthStore } from './stores/authStore';

function LoginComponent() {
  const { login, user, isLoading, error } = useAuthStore();

  const handleLogin = async (credentials) => {
    await login(credentials);
  };

  return (
    // UI
  );
}
```

**Features:**

- Automatic session restoration
- Token refresh management
- Error handling
- Loading states

#### User Store (`src/stores/userStore.ts`)

```typescript
import { useUserStore } from './stores/userStore';

function ProfileComponent() {
  const {
    settings,
    updateProfile,
    uploadAvatar,
    isUpdatingProfile
  } = useUserStore();

  return (
    // UI
  );
}
```

#### Progress Store (`src/stores/progressStore.ts`)

```typescript
import { useProgressStore } from './stores/progressStore';

function LearningComponent() {
  const {
    updateComponentProgress,
    syncProgress,
    isSyncing,
    getOverallProgress
  } = useProgressStore();

  return (
    // UI
  );
}
```

**Features:**

- Automatic API sync
- Offline support with queuing
- Conflict resolution
- Network status awareness

## Error Handling

### Error Handler Utility (`src/utils/api/error-handler.ts`)

Centralized error parsing and user-friendly messages:

```typescript
import { parseApiError, logError } from './utils/api/error-handler';

try {
  await apiClient.post('/endpoint', data);
} catch (error) {
  const apiError = parseApiError(error);
  logError(apiError, 'Operation Context');

  // Display user-friendly message
  showNotification(apiError.userMessage);

  // Check if retryable
  if (apiError.retryable) {
    // Implement retry logic
  }
}
```

**Error Types:**

- `NETWORK_ERROR` - Network connectivity issues
- `TIMEOUT` - Request timeout
- `UNAUTHORIZED` - Authentication required
- `TOKEN_EXPIRED` - Session expired
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate email)
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Server-side error

## Network Status Management

### Network Status Manager (`src/utils/api/network-status.ts`)

Monitors network connectivity and manages offline operations:

```typescript
import { networkStatusManager, useNetworkStatus } from './utils/api/network-status';

// React hook
function Component() {
  const isOnline = useNetworkStatus();

  return (
    <div>
      {!isOnline && <OfflineBanner />}
    </div>
  );
}

// Queue request for offline sync
networkStatusManager.queueRequest(async () => {
  await apiClient.post('/data', data);
});

// Get queue size
const queueSize = networkStatusManager.getQueueSize();

// Wait for online
const isOnline = await networkStatusManager.waitForOnline(30000);
```

**Features:**

- Online/offline detection
- Automatic reconnection
- Request queuing when offline
- Auto-processing queue when back online
- Periodic connectivity checks

## Configuration

### API Configuration (`src/config/api-config.ts`)

Central configuration for API settings:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
  },
  PROGRESS: {
    GET_ALL: '/progress',
    UPDATE_COMPONENT: (id) => `/progress/component/${id}`,
    SYNC: '/progress/sync',
  },
};
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Environment
VITE_ENV=development

# Feature Flags
VITE_USE_MOCK_API=true  # Use mock API for development
```

## Mock API vs Real API

The system supports both mock and real API modes:

**Mock API Mode** (VITE_USE_MOCK_API=true):

- Uses in-memory data
- Simulates API delays
- Perfect for development and testing
- No backend required

**Real API Mode** (VITE_USE_MOCK_API=false):

- Connects to actual backend
- Full authentication and data persistence
- Production mode

Toggle between modes using the `VITE_USE_MOCK_API` environment variable.

## Token Management

### Access Token Flow

1. User logs in
2. Backend returns access token (15min) + refresh token
3. Access token stored in localStorage (if "remember me") or sessionStorage
4. Access token included in all authenticated requests
5. On 401 error, automatically refresh token
6. If refresh fails, redirect to login

### Token Refresh

Automatic token refresh is handled by API client interceptors:

```typescript
// Automatic refresh on 401
apiClient.addErrorInterceptor(async (error) => {
  if (error.status === 401) {
    const newToken = await handleTokenRefresh();
    if (newToken) {
      // Retry original request with new token
      return retryRequest(newToken);
    }
  }
  throw error;
});
```

## Testing

### Integration Tests

Located in `tests/integration/`:

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

**Test Coverage:**

- API client functionality
- Service layer operations
- Authentication flows
- Error handling
- Network status management
- Store integration

### Example Test

```typescript
describe('Authentication Service', () => {
  it('should login successfully', async () => {
    const credentials = {
      email: 'demo@comptia.test',
      password: 'demo123',
      rememberMe: false,
    };

    const result = await authService.login(credentials);

    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
    expect(sessionStorage.getItem('auth_token')).toBe(result.token);
  });
});
```

## Migration Strategy

### Phase 1: Gradual Rollout

1. Keep mock API as fallback
2. Add feature flag for API vs Mock
3. Test with real API in development
4. Monitor for issues

### Phase 2: Component Migration

Migrate components one by one:

1. Authentication components ✓
2. User profile components
3. Progress tracking components
4. Assessment components
5. Dashboard components

### Phase 3: Full Production

1. Remove mock API code
2. Update documentation
3. Deploy to production
4. Monitor metrics

## Best Practices

1. **Always handle errors gracefully**
   - Use try-catch blocks
   - Display user-friendly messages
   - Log errors for debugging

2. **Implement loading states**
   - Show loading indicators
   - Disable forms during submission
   - Prevent duplicate submissions

3. **Optimize for offline**
   - Queue critical operations
   - Provide offline indicators
   - Sync when back online

4. **Security**
   - Never log sensitive data
   - Use HTTPS in production
   - Implement CSRF protection
   - Validate all inputs

5. **Performance**
   - Cache responses when appropriate
   - Debounce search inputs
   - Lazy load components
   - Optimize bundle size

## Troubleshooting

### Common Issues

**401 Unauthorized**

- Check if token is expired
- Verify token is being sent
- Check backend authentication

**Network Errors**

- Verify API URL is correct
- Check CORS configuration
- Ensure backend is running

**Validation Errors**

- Check request payload format
- Verify required fields
- Check data types

**Performance Issues**

- Enable request caching
- Optimize payload size
- Use pagination

## API Documentation

For complete API endpoint documentation, refer to the backend API documentation.

## Support

For issues or questions:

1. Check this documentation
2. Review backend API docs
3. Check console for errors
4. Enable debug logging: `VITE_ENV=development`
