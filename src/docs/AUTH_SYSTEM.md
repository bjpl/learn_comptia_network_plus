# Authentication System Documentation

## Overview

Complete authentication system for the CompTIA Network+ Learning Platform with React Context, localStorage persistence, protected routes, and user profile management.

## Features

### 1. User Authentication
- **Login/Register**: Full email/password authentication
- **Session Management**: JWT-style tokens with localStorage/sessionStorage
- **Remember Me**: Persistent login across browser sessions
- **Auto-logout**: Automatic logout after 30 minutes of inactivity
- **Token Expiry**: 15-minute token lifecycle with automatic cleanup

### 2. User Roles
- **Student**: Default role, access to learning materials
- **Instructor**: Can manage content (future feature)
- **Admin**: Full system access

### 3. Security Features
- **Password Strength Validation**: 5-level strength indicator
- **Email Format Validation**: RFC-compliant email checking
- **Input Sanitization**: All user inputs validated
- **Activity Tracking**: Last activity timestamp monitoring
- **Secure Storage**: Tokens stored in localStorage/sessionStorage

## Architecture

### Context Provider
```typescript
<AuthProvider>
  - Manages auth state
  - Provides login/register/logout methods
  - Handles session persistence
  - Tracks user activity
  - Auto-refreshes tokens
</AuthProvider>
```

### File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── components/
│   └── auth/
│       ├── LoginForm.tsx        # Login UI
│       ├── RegisterForm.tsx     # Registration UI
│       ├── ProtectedRoute.tsx   # Route wrapper
│       ├── UserProfile.tsx      # Profile management
│       ├── AuthForms.css        # Auth form styles
│       ├── UserProfile.css      # Profile styles
│       └── index.ts             # Exports
├── types/
│   └── auth.ts                  # TypeScript types
└── utils/
    └── auth.ts                  # Helper functions
```

## Usage

### 1. Wrap App with AuthProvider

```typescript
import { AuthProvider } from './contexts/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>
```

### 2. Use Auth Hook

```typescript
import { useAuth } from './contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <div>Welcome, {user.firstName}!</div>;
};
```

### 3. Protected Routes

```typescript
import { ProtectedRoute } from './components/auth/ProtectedRoute';

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  }
/>

// With role requirement
<Route
  path="/admin"
  element={
    <ProtectedRoute roles={[UserRole.ADMIN]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

## Demo Accounts

For testing and demonstration:

### Student Account
- **Email**: demo@comptia.test
- **Password**: demo123
- **Role**: student

### Admin Account
- **Email**: admin@comptia.test
- **Password**: admin123
- **Role**: admin

## API Integration

Current implementation uses mock authentication. To integrate with a real backend:

### 1. Update API Calls

Replace mock functions in `AuthContext.tsx`:

```typescript
// Replace mockLoginApi
const loginApi = async (credentials: LoginCredentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Replace mockRegisterApi
const registerApi = async (data: RegisterData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### 2. Update Token Handling

Replace mock token generation with real JWT handling:

```typescript
import jwt from 'jsonwebtoken';

// Decode real JWT
const decodeToken = (token: string) => {
  return jwt.decode(token);
};
```

### 3. Add Refresh Token Flow

```typescript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('auth_refresh_token');
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  return response.json();
};
```

## Security Considerations

### Current Implementation (Mock)
- Passwords stored in plain text in mock database
- Tokens are base64-encoded JSON (not cryptographically signed)
- No server-side validation

### Production Requirements
1. **Password Hashing**: Use bcrypt/argon2 server-side
2. **JWT Signing**: Use proper JWT libraries with secret keys
3. **HTTPS Only**: All auth requests over secure connection
4. **CSRF Protection**: Add CSRF tokens
5. **Rate Limiting**: Prevent brute force attacks
6. **Email Verification**: Verify email addresses
7. **2FA**: Add two-factor authentication option
8. **Password Reset**: Implement secure password reset flow

## Session Management

### Storage Strategy
- **sessionStorage**: Used when "Remember Me" is unchecked
- **localStorage**: Used when "Remember Me" is checked

### Activity Tracking
- Updates on: mousedown, keydown, scroll, touchstart
- Check interval: Every 60 seconds
- Timeout: 30 minutes of inactivity

### Token Lifecycle
- **Creation**: On successful login/register
- **Validation**: Checked every 5 minutes
- **Expiration**: 15 minutes from creation
- **Cleanup**: Automatic on expiry or logout

## User Profile Management

### Editable Fields
- First Name
- Last Name
- Email
- Username

### Read-Only Fields
- User ID
- Role
- Creation Date
- Last Login

### Future Features
- Avatar upload
- Password change
- Two-factor authentication
- Active session management
- Account deletion

## Integration with Progress Tracking

The auth system integrates with the existing ProgressContext:

```typescript
// Progress is now user-specific
const { user } = useAuth();
const { saveProgress } = useProgress();

// Progress saved with user context
saveProgress(componentId, {
  userId: user.id,
  completed: true,
  timestamp: Date.now(),
});
```

## Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new account
- [ ] Register with existing email (should fail)
- [ ] Remember me functionality
- [ ] Auto-logout after inactivity
- [ ] Protected route access (authenticated)
- [ ] Protected route redirect (unauthenticated)
- [ ] Role-based access control
- [ ] Profile update
- [ ] Logout functionality
- [ ] Session persistence after page refresh

### Demo Account Testing
```typescript
// Student login
await login({
  email: 'demo@comptia.test',
  password: 'demo123',
  rememberMe: false
});

// Admin login
await login({
  email: 'admin@comptia.test',
  password: 'admin123',
  rememberMe: true
});
```

## Error Handling

### Login Errors
- Invalid email or password
- Account not found
- Account disabled (future)
- Too many attempts (future)

### Registration Errors
- Email already exists
- Username taken
- Password too weak
- Terms not accepted
- Invalid email format

### Session Errors
- Token expired
- Inactive session timeout
- Invalid token format

## Styling

### Design System
- **Colors**: Tailwind CSS classes with dark mode support
- **Components**: Fully responsive (mobile-first)
- **Animations**: Smooth transitions and loading states
- **Accessibility**: ARIA labels, keyboard navigation

### Custom Styles
- `AuthForms.css`: Login and registration forms
- `UserProfile.css`: User profile page

### Dark Mode
All auth components support dark mode through ThemeContext.

## Future Enhancements

### Phase 2
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] OAuth providers (Google, GitHub)
- [ ] Magic link authentication

### Phase 3
- [ ] Two-factor authentication (TOTP)
- [ ] Biometric authentication
- [ ] Session management UI
- [ ] Account activity log

### Phase 4
- [ ] SSO integration
- [ ] SAML support
- [ ] Advanced role permissions
- [ ] User groups and teams

## Troubleshooting

### Token Expired Immediately
Check if system time is correct. Mock tokens use Date.now() for timestamps.

### Session Not Persisting
Verify localStorage is not disabled in browser settings.

### Protected Routes Not Working
Ensure AuthProvider wraps the entire app and ProtectedRoute is used correctly.

### Dark Mode Issues
Check if ThemeProvider is present and active.

## Support

For issues or questions:
1. Check this documentation
2. Review source code comments
3. Check browser console for errors
4. Verify all providers are correctly wrapped

---

**Last Updated**: 2025-10-29
**Version**: 1.0.0
**Author**: CompTIA Network+ Development Team
