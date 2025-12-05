# Context to Zustand Migration Plan

**CompTIA Network+ Learning Platform - State Management Consolidation**

## Executive Summary

The application currently uses deprecated React Context providers (`AuthContext`, `ProgressContext`) as thin wrappers around Zustand stores. This dual-system creates confusion and adds unnecessary complexity. This document outlines a complete migration to direct Zustand usage.

**Current State:**

- 17 components use `useAuth` hook (Context wrapper)
- 3 components use `useProgress` hook (Context wrapper)
- Both contexts wrap Zustand stores
- Redundant logic in context providers

**Target State:**

- All components use Zustand stores directly
- Remove context providers
- Simplify state management
- Improve tree-shaking and bundle size

---

## Current Architecture Analysis

### AuthContext (src/contexts/AuthContext.tsx)

**Current Implementation:**

```typescript
// Deprecated wrapper around authStore
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authState = useAuthStore();

  // Legacy methods mapped to store actions
  const updateUser = () => authState.refreshUser();
  const checkAuth = () => authState.checkSession();

  // Activity tracking setup
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const handleActivity = () => updateLastActivity();
    const inactivityCheck = setInterval(() => {
      if (isInactive()) authState.logout();
    }, 60 * 1000);

    // Event listeners setup...
    return () => {
      // Cleanup...
    };
  }, [authState.isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Problems:**

1. **Redundant layer:** Context just wraps Zustand
2. **Legacy methods:** `updateUser` and `checkAuth` no longer needed
3. **Activity tracking:** Should be in a separate hook
4. **Provider overhead:** Extra re-renders
5. **Two ways to access state:** Context or direct store

---

### ProgressContext (src/contexts/ProgressContext.tsx)

**Current Implementation:**

```typescript
// Deprecated wrapper around progressStore
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getOverallProgress = useProgressStore(state => state.getOverallProgress);
  const updateComponentProgress = useProgressStore(state => state.updateComponentProgress);
  const componentProgress = useProgressStore(state => state.componentProgress);

  const [overallProgress, setOverallProgress] = useState(getOverallProgress());

  useEffect(() => {
    setOverallProgress(getOverallProgress());
  }, [getOverallProgress, componentProgress]);

  const trackTimeSpent = useCallback((componentId, seconds) => {
    updateComponentProgress(componentId, {
      timeSpent: seconds,
      lastVisited: new Date().toISOString(),
    });
  }, [updateComponentProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
```

**Problems:**

1. **Unnecessary local state:** `overallProgress` can be computed directly
2. **Derived state management:** Manually syncing with store
3. **Callback overhead:** `trackTimeSpent` wrapper unnecessary
4. **Provider overhead:** Extra re-renders
5. **Confusion:** Developers unsure which to use

---

## Components Using Deprecated Contexts

### Components Using useAuth (17 total)

| Component      | File Path                                | Usage             | Migration Complexity |
| -------------- | ---------------------------------------- | ----------------- | -------------------- |
| Header         | `src/components/layout/Header.tsx`       | User menu, logout | Low                  |
| Sidebar        | `src/components/shared/Sidebar.tsx`      | User display      | Low                  |
| UserProfile    | `src/components/auth/UserProfile.tsx`    | Full auth state   | Medium               |
| LoginForm      | `src/components/auth/LoginForm.tsx`      | Login action      | Low                  |
| RegisterForm   | `src/components/auth/RegisterForm.tsx`   | Register action   | Low                  |
| ProtectedRoute | `src/components/auth/ProtectedRoute.tsx` | Auth check        | Low                  |
| Dashboard      | `src/pages/Dashboard.tsx`                | User welcome      | Low                  |
| App            | `src/App.tsx`                            | Provider wrapper  | Critical             |
| useAuth hook   | `src/hooks/useAuth.ts`                   | Re-export         | Remove               |

### Components Using useProgress (3 total)

| Component         | File Path                             | Usage               | Migration Complexity |
| ----------------- | ------------------------------------- | ------------------- | -------------------- |
| Dashboard         | `src/pages/Dashboard.tsx`             | Overall progress    | Low                  |
| ProgressDashboard | `src/pages/ProgressDashboardPage.tsx` | Full progress state | Medium               |
| App               | `src/App.tsx`                         | Provider wrapper    | Critical             |

---

## Migration Strategy

### Phase 1: Create Activity Tracking Hook (Week 1)

**Extract activity tracking from AuthContext into reusable hook**

**New File:** `src/hooks/useActivityTracking.ts`

```typescript
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { isInactive, updateLastActivity } from '../utils/auth';

export function useActivityTracking() {
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      updateLastActivity();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      if (isInactive()) {
        logout();
      }
    }, 60 * 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [isAuthenticated, logout]);
}
```

**Usage in App.tsx:**

```typescript
import { useActivityTracking } from './hooks/useActivityTracking';

function App() {
  useActivityTracking(); // Replaces AuthProvider's activity tracking

  return (
    // App content
  );
}
```

---

### Phase 2: Update Individual Components (Week 1-2)

**Migration Pattern:**

**BEFORE (using Context):**

```typescript
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // Component logic...
};
```

**AFTER (using Zustand directly):**

```typescript
import { useAuthStore } from '../../stores/authStore';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  // Component logic - identical!
};
```

**Component-by-Component Migration:**

#### 1. Header.tsx (Low complexity)

**Changes:**

- Line 8: Change import from `../../contexts/AuthContext` to `../../stores/authStore`
- Line 8: Change `useAuth` to `useAuthStore`
- No other changes needed

**Testing:**

- User menu displays correctly
- Logout button works
- User display name shows

---

#### 2. Sidebar.tsx (Low complexity)

**Changes:**

- Line 12: Change import
- Line 22: Change hook
- No other changes

**Testing:**

- User section displays
- Navigation works

---

#### 3. UserProfile.tsx (Medium complexity)

**BEFORE:**

```typescript
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const handleUpdateProfile = async () => {
    // Update via API
    const updated = await updateUserAPI(data);
    updateUser(updated); // Legacy method
  };
};
```

**AFTER:**

```typescript
import { useAuthStore } from '../../stores/authStore';

export const UserProfile: React.FC = () => {
  const { user, refreshUser } = useAuthStore();

  const handleUpdateProfile = async () => {
    // Update via API
    await updateUserAPI(data);
    await refreshUser(); // Zustand store method
  };
};
```

**Changes:**

- Replace `updateUser` with `refreshUser`
- Change from sync to async call

**Testing:**

- Profile updates reflect immediately
- Data persists after refresh
- Form validation works

---

#### 4. LoginForm.tsx (Low complexity)

**Changes:**

- Line 8: Change import
- Line 19: Change hook name
- No logic changes (login signature identical)

**Testing:**

- Login flow works
- Error messages display
- Redirect after login

---

#### 5. RegisterForm.tsx (Low complexity)

**Changes:**

- Line 7: Change import
- Line 18: Change hook name
- No logic changes

**Testing:**

- Registration works
- Validation errors display
- Auto-login after registration

---

#### 6. ProtectedRoute.tsx (Low complexity)

**BEFORE:**

```typescript
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
```

**AFTER:**

```typescript
import { useAuthStore } from '../../stores/authStore';

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
```

**Optimization:** Use granular selectors to prevent unnecessary re-renders

**Testing:**

- Unauthorized redirects work
- Authorized access allowed
- Loading state displays

---

#### 7. Dashboard.tsx (Low complexity)

**BEFORE:**

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { overallProgress } = useProgress();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Progress: {overallProgress.percentage}%</p>
    </div>
  );
};
```

**AFTER:**

```typescript
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';

export const Dashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const getOverallProgress = useProgressStore(state => state.getOverallProgress);
  const overallProgress = getOverallProgress();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Progress: {overallProgress.percentage}%</p>
    </div>
  );
};
```

**Changes:**

- Use granular selectors
- Call `getOverallProgress()` directly
- No local state needed

**Testing:**

- Welcome message displays
- Progress percentage accurate
- Real-time updates work

---

#### 8. ProgressDashboardPage.tsx (Medium complexity)

**BEFORE:**

```typescript
import { useProgress } from '../contexts/ProgressContext';

export const ProgressDashboardPage: React.FC = () => {
  const { overallProgress, trackTimeSpent } = useProgress();

  useEffect(() => {
    trackTimeSpent('dashboard', 30);
  }, [trackTimeSpent]);

  return (
    <ProgressCharts data={overallProgress} />
  );
};
```

**AFTER:**

```typescript
import { useProgressStore } from '../stores/progressStore';

export const ProgressDashboardPage: React.FC = () => {
  const getOverallProgress = useProgressStore(state => state.getOverallProgress);
  const updateComponentProgress = useProgressStore(state => state.updateComponentProgress);

  const overallProgress = getOverallProgress();

  useEffect(() => {
    updateComponentProgress('dashboard', {
      timeSpent: 30,
      lastVisited: new Date().toISOString(),
    });
  }, [updateComponentProgress]);

  return (
    <ProgressCharts data={overallProgress} />
  );
};
```

**Changes:**

- Replace `trackTimeSpent` with direct `updateComponentProgress`
- Use granular selectors
- Compute derived state inline

**Testing:**

- Charts render correctly
- Time tracking updates
- Progress calculations accurate

---

### Phase 3: Remove Provider Wrappers from App.tsx (Week 2)

**BEFORE:**

```typescript
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            {/* Routes */}
          </Routes>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}
```

**AFTER:**

```typescript
import { useActivityTracking } from './hooks/useActivityTracking';

function App() {
  useActivityTracking(); // Replaces AuthProvider's side effects

  return (
    <Router>
      <Routes>
        {/* Routes */}
      </Routes>
    </Router>
  );
}
```

**Benefits:**

- Flatter component tree
- Fewer re-renders
- Simpler mental model

---

### Phase 4: Deprecate and Remove Contexts (Week 2)

**Step 1: Add deprecation warnings**

**AuthContext.tsx:**

```typescript
/**
 * @deprecated Use `useAuthStore` from '../stores/authStore' directly.
 * This context will be removed in v2.0.
 */
export const useAuth = (): AuthContextType => {
  console.warn('useAuth is deprecated. Use useAuthStore directly.');

  // Existing implementation...
};
```

**ProgressContext.tsx:**

```typescript
/**
 * @deprecated Use `useProgressStore` from '../stores/progressStore' directly.
 * This context will be removed in v2.0.
 */
export const useProgress = (): ProgressContextValue => {
  console.warn('useProgress is deprecated. Use useProgressStore directly.');

  // Existing implementation...
};
```

**Step 2: Remove after all components migrated**

Files to delete:

- `src/contexts/AuthContext.tsx`
- `src/contexts/ProgressContext.tsx`

Files to update:

- Remove from `src/hooks/index.ts` (if re-exported)

---

### Phase 5: Update Tests (Week 2-3)

**Current Test Pattern (with Context):**

```typescript
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';

test('renders login form', () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );

  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

**New Test Pattern (with Zustand):**

```typescript
import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from './LoginForm';

// Mock Zustand store
jest.mock('../stores/authStore');

test('renders login form', () => {
  (useAuthStore as jest.Mock).mockReturnValue({
    user: null,
    login: jest.fn(),
    isLoading: false,
    error: null,
  });

  render(<LoginForm />);

  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

**Test Migration Checklist:**

✅ Remove `AuthProvider` wrappers
✅ Remove `ProgressProvider` wrappers
✅ Mock Zustand stores instead
✅ Use granular mocking (only mock needed state)
✅ Test store integration separately

**Example Test Helper:**

```typescript
// src/test-utils/mockStores.ts

export function mockAuthStore(overrides = {}) {
  const defaultState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshUser: jest.fn(),
    clearError: jest.fn(),
  };

  (useAuthStore as jest.Mock).mockImplementation((selector) => {
    const state = { ...defaultState, ...overrides };
    return selector ? selector(state) : state;
  });
}

export function mockProgressStore(overrides = {}) {
  const defaultState = {
    componentProgress: {},
    isSyncing: false,
    getOverallProgress: jest.fn(() => ({
      totalCompleted: 0,
      totalComponents: 23,
      percentage: 0,
      averageScore: 0,
    })),
    updateComponentProgress: jest.fn(),
    // ... other methods
  };

  (useProgressStore as jest.Mock).mockImplementation((selector) => {
    const state = { ...defaultState, ...overrides };
    return selector ? selector(state) : state;
  });
}
```

**Usage:**

```typescript
import { mockAuthStore } from '../test-utils/mockStores';

test('displays user name when authenticated', () => {
  mockAuthStore({
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
  });

  render(<Header />);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

---

## Migration Validation

### Automated Checks

**1. ESLint Rule to Prevent Context Usage**

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/contexts/AuthContext', '**/contexts/ProgressContext'],
            message: 'Use Zustand stores directly instead of deprecated contexts',
          },
        ],
      },
    ],
  },
};
```

**2. TypeScript Check**

Remove context types from exports:

```typescript
// src/types/index.ts

// REMOVE these exports after migration:
// export type { AuthContextType } from '../contexts/AuthContext';
// export type { ProgressContextValue } from '../contexts/ProgressContext';
```

**3. Bundle Size Analysis**

```bash
# Before migration
npm run build -- --analyze

# After migration
npm run build -- --analyze

# Expected: 5-10% bundle size reduction from removing context overhead
```

---

### Manual Validation Checklist

**Authentication Flow:**

- [ ] Login works
- [ ] Registration works
- [ ] Logout works
- [ ] Session persistence works
- [ ] Token refresh works
- [ ] Inactivity timeout works
- [ ] Protected routes redirect properly
- [ ] User profile updates work
- [ ] Error messages display correctly

**Progress Tracking:**

- [ ] Component completion tracking works
- [ ] Overall progress calculation accurate
- [ ] Time spent tracking updates
- [ ] Progress syncs to backend
- [ ] Offline progress queues correctly
- [ ] Charts and analytics accurate
- [ ] Reset progress works

**Cross-Feature:**

- [ ] Dashboard shows correct user and progress
- [ ] Navigation works seamlessly
- [ ] No console errors
- [ ] No performance regressions
- [ ] Mobile responsiveness maintained

---

## Rollback Plan

If migration causes issues:

**1. Temporary Coexistence**

Keep both systems running:

```typescript
// Allow both during transition
export function useAuth() {
  // Try context first (backward compatibility)
  const context = useContext(AuthContext);
  if (context) return context;

  // Fall back to direct store
  return useAuthStore();
}
```

**2. Feature Flag**

```typescript
const USE_ZUSTAND_DIRECTLY = process.env.REACT_APP_ZUSTAND_MIGRATION === 'true';

function App() {
  if (USE_ZUSTAND_DIRECTLY) {
    useActivityTracking();
    return <Router>{/* routes */}</Router>;
  } else {
    return (
      <AuthProvider>
        <ProgressProvider>
          <Router>{/* routes */}</Router>
        </ProgressProvider>
      </AuthProvider>
    );
  }
}
```

**3. Git Branches**

- `main` - Stable (current context system)
- `feature/zustand-migration` - Migration in progress
- `release/zustand` - Migration complete, testing

---

## Benefits Summary

### Code Quality

- **Less code:** Remove ~200 lines of wrapper code
- **Clearer intent:** Direct store usage is self-documenting
- **Better TypeScript:** Direct inference from store types
- **Easier debugging:** One source of truth

### Performance

- **Fewer re-renders:** No context propagation
- **Better tree-shaking:** Unused store methods eliminated
- **Smaller bundle:** Remove context overhead
- **Faster development:** Hot reload more reliable

### Developer Experience

- **One pattern:** No confusion about which to use
- **Better autocomplete:** Direct store methods
- **Easier testing:** Mock stores, not providers
- **Simpler onboarding:** One state management approach

---

## Timeline

| Week | Phase      | Tasks                           | Success Criteria                       |
| ---- | ---------- | ------------------------------- | -------------------------------------- |
| 1    | Prep       | Create hooks, update tooling    | ESLint rules active, hooks created     |
| 1-2  | Migration  | Update 20 components            | All components migrated, tests passing |
| 2    | Cleanup    | Remove contexts, update App.tsx | No context imports remain              |
| 2-3  | Testing    | Update all tests                | 100% test coverage maintained          |
| 3    | Validation | Manual QA, performance testing  | No regressions, bundle size reduced    |

**Total Effort:** 3 weeks (1 developer) or 1.5 weeks (2 developers)

---

## Post-Migration Maintenance

**Documentation:**

- Update README with Zustand-only patterns
- Create migration guide for external contributors
- Update Storybook examples

**Monitoring:**

- Track bundle size in CI
- Monitor for any context imports in PRs
- Check for performance regressions

**Future:**

- Consider Zustand middleware for advanced features
- Explore Zustand devtools integration
- Evaluate additional stores (e.g., UIStore, SettingsStore)

---

_Document Version: 1.0_
_Last Updated: 2025-12-04_
_Author: System Architecture Team_
