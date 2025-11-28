# Frontend API Integration Migration Guide

## Overview

This guide walks you through migrating the CompTIA Network+ Learning Platform frontend to use the real backend API instead of mock authentication.

## Prerequisites

- Backend API running on `http://localhost:3000` (or configured URL)
- Node.js 18+ and npm 9+
- All dependencies installed (`npm install`)

## Migration Steps

### Step 1: Environment Configuration

1. Copy the environment example file:

```bash
cp .env.example .env
```

2. Configure your `.env` file:

```bash
# Development with Mock API
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
VITE_USE_MOCK_API=true  # Start with mock API

# Production with Real API
# VITE_API_URL=https://api.yourapp.com
# VITE_USE_MOCK_API=false
```

### Step 2: Component Updates

The components are already updated to use the new stores. Here's how they work:

#### LoginForm.tsx - Already Updated

```typescript
import { useAuthStore } from '../../stores/authStore';

export const LoginForm: React.FC = () => {
  const { login, error, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    // Form UI
  );
};
```

#### RegisterForm.tsx - Already Updated

```typescript
import { useAuthStore } from '../../stores/authStore';

export const RegisterForm: React.FC = () => {
  const { register, error, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    // Form UI
  );
};
```

#### UserProfile.tsx - Updated to use stores

```typescript
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

export const UserProfile: React.FC = () => {
  const { user } = useAuthStore();
  const {
    updateProfile,
    uploadAvatar,
    isUpdatingProfile,
    isUploadingAvatar,
    error
  } = useUserStore();

  const handleUpdateProfile = async (data) => {
    try {
      const updatedUser = await updateProfile(data);
      // Show success message
    } catch (error) {
      // Error handled by store
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatar(file);
      // Show success message
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    // Profile UI
  );
};
```

### Step 3: Testing with Mock API

Before switching to real API, test with mock API:

1. Ensure `VITE_USE_MOCK_API=true` in `.env`
2. Start development server:

```bash
npm run dev
```

3. Test all authentication flows:
   - Login with demo account: `demo@comptia.test / demo123`
   - Login with admin account: `admin@comptia.test / admin123`
   - Register new account
   - Logout
   - Session restoration (refresh page while logged in)

4. Test progress tracking:
   - Complete a learning module
   - Check progress persistence
   - Verify sync indicator

### Step 4: Switch to Real API

1. Update `.env`:

```bash
VITE_USE_MOCK_API=false
```

2. Ensure backend is running:

```bash
# In backend directory
npm run dev
```

3. Restart frontend:

```bash
npm run dev
```

4. Test authentication:
   - Register a new account
   - Verify email (if enabled)
   - Login with new account
   - Test logout
   - Test token refresh (wait 15 minutes or force expiry)

### Step 5: Update Protected Routes

The ProtectedRoute component already uses the authStore:

```typescript
import { useAuthStore } from '../../stores/authStore';

export const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
```

### Step 6: Network Status Handling

Add network status indicator to your app:

```typescript
import { useNetworkStatus } from './utils/api/network-status';

function App() {
  const isOnline = useNetworkStatus();

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">
          You are offline. Changes will be synced when connection is restored.
        </div>
      )}

      <Router>
        {/* Routes */}
      </Router>
    </div>
  );
}
```

### Step 7: Progress Sync Monitoring

Monitor progress sync status:

```typescript
import { useProgressStore } from './stores/progressStore';

function Dashboard() {
  const { isSyncing, lastSyncedAt, syncProgress } = useProgressStore();

  return (
    <div>
      {isSyncing && <div>Syncing progress...</div>}
      {lastSyncedAt && (
        <div>Last synced: {new Date(lastSyncedAt).toLocaleString()}</div>
      )}
      <button onClick={syncProgress}>Sync Now</button>
    </div>
  );
}
```

## Testing Checklist

### Authentication

- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Register new user
- [ ] Register with existing email shows error
- [ ] Logout clears session
- [ ] Session restored on page refresh
- [ ] Token refresh works automatically
- [ ] Remember me stores token in localStorage
- [ ] Without remember me stores token in sessionStorage

### User Management

- [ ] View user profile
- [ ] Update profile information
- [ ] Change password
- [ ] Upload avatar
- [ ] Update settings
- [ ] Settings persist after logout/login

### Progress Tracking

- [ ] Progress saved locally
- [ ] Progress synced to backend
- [ ] Offline progress queued
- [ ] Progress synced when back online
- [ ] Conflict resolution works
- [ ] Progress displays correctly on dashboard

### Error Handling

- [ ] Network errors show user-friendly messages
- [ ] Validation errors display on form fields
- [ ] 401 errors redirect to login
- [ ] 403 errors show unauthorized message
- [ ] Server errors show generic error message
- [ ] Retry works for retryable errors

### Network Status

- [ ] Offline indicator appears when offline
- [ ] Requests queued when offline
- [ ] Queue processed when back online
- [ ] Sync status indicator works

## Troubleshooting

### Issue: CORS Errors

**Symptom:** Browser console shows CORS policy errors

**Solution:** Configure backend CORS:

```javascript
// Backend (Express.js example)
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
  })
);
```

### Issue: Token Not Being Sent

**Symptom:** API returns 401 even after login

**Solution:** Check browser dev tools:

1. Open Network tab
2. Click on failed request
3. Check Headers tab
4. Verify `Authorization: Bearer <token>` header is present

If missing, check:

- Token is stored in localStorage/sessionStorage
- API client is including token in requests
- `skipAuth` is not set to `true`

### Issue: Infinite Refresh Loop

**Symptom:** App keeps making refresh token requests

**Solution:**

1. Check refresh token expiry
2. Ensure refresh endpoint returns new refresh token
3. Clear storage and re-login:

```javascript
localStorage.clear();
sessionStorage.clear();
```

### Issue: Progress Not Syncing

**Symptom:** Progress saved locally but not on backend

**Solution:**

1. Check network status: `networkStatusManager.getStatus()`
2. Check progress queue: `localStorage.getItem('progress_queue')`
3. Manually trigger sync: `useProgressStore.getState().syncProgress()`
4. Check backend logs for errors

### Issue: Mock Data in Production

**Symptom:** Still seeing demo accounts in production

**Solution:**

1. Verify `.env` file: `VITE_USE_MOCK_API=false`
2. Rebuild app: `npm run build`
3. Clear browser cache
4. Check `import.meta.env.VITE_USE_MOCK_API` in browser console

## Performance Optimization

### 1. Enable Request Caching

```typescript
// Cache GET requests for 5 minutes
const cache = new Map();

apiClient.addResponseInterceptor((response) => {
  if (response.config.method === 'GET') {
    cache.set(response.config.url, {
      data: response.data,
      timestamp: Date.now(),
    });
  }
  return response;
});
```

### 2. Debounce Search Requests

```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const results = await apiClient.get('/search', { params: { q: query } });
  setResults(results.data);
}, 500);
```

### 3. Implement Pagination

```typescript
const [page, setPage] = useState(1);
const [data, setData] = useState([]);

const loadMore = async () => {
  const response = await apiClient.get('/data', {
    params: { page, limit: 20 },
  });
  setData([...data, ...response.data]);
  setPage(page + 1);
};
```

## Security Best Practices

### 1. Never Log Sensitive Data

```typescript
// Bad
console.log('User credentials:', credentials);

// Good
console.log('Login attempt for user:', credentials.email);
```

### 2. Validate All Inputs

```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};
```

### 3. Use HTTPS in Production

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: process.env.NODE_ENV === 'production',
  },
});
```

### 4. Implement Rate Limiting

```typescript
const rateLimiter = new Map();

const checkRateLimit = (endpoint: string): boolean => {
  const now = Date.now();
  const limit = rateLimiter.get(endpoint);

  if (limit && now - limit < 1000) {
    return false; // Too many requests
  }

  rateLimiter.set(endpoint, now);
  return true;
};
```

## Monitoring and Debugging

### Enable Debug Logging

```typescript
// Set in .env
VITE_ENV = development;

// Or in code
if (import.meta.env.DEV) {
  console.log('API Request:', config);
  console.log('API Response:', response);
}
```

### Track API Metrics

```typescript
const metrics = {
  requests: 0,
  errors: 0,
  averageResponseTime: 0,
};

apiClient.addRequestInterceptor((config) => {
  config.startTime = Date.now();
  metrics.requests++;
  return config;
});

apiClient.addResponseInterceptor((response) => {
  const duration = Date.now() - response.config.startTime;
  metrics.averageResponseTime = (metrics.averageResponseTime + duration) / 2;
  return response;
});

apiClient.addErrorInterceptor((error) => {
  metrics.errors++;
  return error;
});
```

## Rollback Plan

If issues occur in production:

1. **Immediate Rollback to Mock API:**

   ```bash
   # Update .env
   VITE_USE_MOCK_API=true

   # Rebuild and deploy
   npm run build
   ```

2. **Gradual Migration:**
   - Keep both mock and real API running
   - Use feature flags to control which users use real API
   - Monitor error rates
   - Gradually increase real API usage

3. **Data Backup:**
   - Ensure progress data is backed up
   - Keep local storage data intact
   - Implement data export functionality

## Support and Resources

- **Documentation:** `/docs/api-integration.md`
- **Backend API Docs:** (Link to backend docs)
- **Issue Tracker:** (Link to issues)
- **Team Chat:** (Link to Slack/Discord)

## Next Steps

After successful migration:

1. Remove mock API code (optional)
2. Update documentation
3. Add analytics tracking
4. Implement A/B testing
5. Optimize bundle size
6. Add performance monitoring
7. Implement error tracking (Sentry)

## Conclusion

Following this guide ensures a smooth migration from mock to real API integration. Take it step by step, test thoroughly at each stage, and monitor closely after deployment.

For questions or issues, refer to the troubleshooting section or contact the development team.
