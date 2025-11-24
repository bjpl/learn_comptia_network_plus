# API Integration Quick Reference

## Quick Start

### Development Mode (Mock API)

```bash
npm install
npm run dev
# Login with: demo@comptia.test / demo123
```

### Production Mode (Real API)

```bash
# Update .env
VITE_USE_MOCK_API=false
VITE_API_URL=https://api.yourapp.com

npm run build
npm run preview
```

## Common Operations

### Authentication

```typescript
import { useAuthStore } from './stores/authStore';

// Login
const { login } = useAuthStore();
await login({ email, password, rememberMe: true });

// Register
const { register } = useAuthStore();
await register({ email, username, password, ... });

// Logout
const { logout } = useAuthStore();
await logout();

// Get current user
const { user } = useAuthStore();
console.log(user);
```

### User Profile

```typescript
import { useUserStore } from './stores/userStore';

// Update profile
const { updateProfile } = useUserStore();
await updateProfile({ firstName, lastName });

// Upload avatar
const { uploadAvatar } = useUserStore();
const url = await uploadAvatar(fileObject);

// Update settings
const { updateSettings } = useUserStore();
await updateSettings({ theme: 'dark' });
```

### Progress Tracking

```typescript
import { useProgressStore } from './stores/progressStore';

// Update progress
const { updateComponentProgress } = useProgressStore();
await updateComponentProgress('component-id', {
  completed: true,
  score: 85,
  timeSpent: 300,
});

// Sync progress
const { syncProgress } = useProgressStore();
await syncProgress();

// Get progress
const { getOverallProgress } = useProgressStore();
const stats = getOverallProgress();
```

### Network Status

```typescript
import { useNetworkStatus } from './utils/api/network-status';

function Component() {
  const isOnline = useNetworkStatus();

  return (
    <div>
      {!isOnline && <OfflineBanner />}
    </div>
  );
}
```

## API Endpoints

### Auth

- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Current user

### User

- `GET /users/profile` - Get profile
- `PUT /users/profile` - Update profile
- `POST /users/avatar` - Upload avatar
- `GET /users/settings` - Get settings
- `PUT /users/settings` - Update settings

### Progress

- `GET /progress` - Get all
- `PUT /progress/component/:id` - Update
- `POST /progress/sync` - Sync

### Assessments

- `GET /assessments/quiz/:id` - Get quiz
- `POST /assessments/quiz/:id/submit` - Submit
- `GET /assessments/attempts` - Get attempts

## Error Handling

```typescript
import { parseApiError } from './utils/api/error-handler';

try {
  await apiCall();
} catch (error) {
  const apiError = parseApiError(error);
  console.error(apiError.userMessage);

  if (apiError.retryable) {
    // Retry logic
  }
}
```

## Testing

```bash
npm test                    # All tests
npm run test:integration    # Integration only
npm run test:coverage       # With coverage
```

## Configuration

### Environment Variables

```bash
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
VITE_USE_MOCK_API=true
```

### API Config

```typescript
import { API_CONFIG, API_ENDPOINTS } from './config/api-config';

console.log(API_CONFIG.BASE_URL);
console.log(API_ENDPOINTS.AUTH.LOGIN);
```

## Troubleshooting

### Token Issues

```typescript
// Clear and re-login
localStorage.clear();
sessionStorage.clear();
```

### Network Issues

```typescript
import { networkStatusManager } from './utils/api/network-status';

// Check status
const isOnline = networkStatusManager.getStatus();

// Queue size
const size = networkStatusManager.getQueueSize();
```

### Debugging

```typescript
// Enable in .env
VITE_ENV = development;

// Check logs in console
// All API requests/responses logged
```

## File Locations

### Services

- `src/services/api-client.ts` - Base client
- `src/services/auth-service.ts` - Auth
- `src/services/user-service.ts` - User
- `src/services/progress-service.ts` - Progress
- `src/services/assessment-service.ts` - Assessments

### Stores

- `src/stores/authStore.ts` - Auth state
- `src/stores/userStore.ts` - User state
- `src/stores/progressStore.ts` - Progress state

### Utils

- `src/utils/api/error-handler.ts` - Errors
- `src/utils/api/network-status.ts` - Network

### Config

- `src/config/api-config.ts` - API config
- `.env` - Environment variables

### Docs

- `docs/api-integration.md` - Architecture
- `docs/migration-guide.md` - Migration
- `docs/QUICK_REFERENCE.md` - This file

## Demo Accounts

**Student:**

- Email: `demo@comptia.test`
- Password: `demo123`

**Admin:**

- Email: `admin@comptia.test`
- Password: `admin123`

## Support

- Documentation in `/docs`
- Tests in `/tests/integration`
- Examples in test files
