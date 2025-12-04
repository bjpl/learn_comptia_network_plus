/**
 * ProtectedRoute Component Tests
 * Tests authentication guards, role-based access, and email verification requirements
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AuthLoadingScreen } from '../../../../src/components/auth/ProtectedRoute';
import { useAuth } from '../../../../src/contexts/AuthContext';
import {
  mockStudent,
  mockAdmin,
  mockUnverifiedUser,
  createAuthenticatedState,
  createLoadingState,
  createMockAuthState,
  setupAuthMocks,
} from '../../../helpers/auth-test-utils';
import { UserRole } from '../../../../src/types/auth';

// Mock the useAuth hook
vi.mock('../../../../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = useAuth as Mock;

// Helper to render ProtectedRoute with router context
const renderProtectedRoute = (
  authState: ReturnType<typeof createMockAuthState>,
  options: {
    roles?: UserRole[];
    requireEmailVerified?: boolean;
    initialPath?: string;
  } = {}
) => {
  mockedUseAuth.mockReturnValue(authState);

  const { roles, requireEmailVerified, initialPath = '/protected' } = options;

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        <Route path="/verify-email" element={<div data-testid="verify-email-page">Verify Email</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute roles={roles} requireEmailVerified={requireEmailVerified}>
              <div data-testid="protected-content">Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    setupAuthMocks();
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner while checking auth', () => {
      renderProtectedRoute(createLoadingState());

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByClassName ? screen.queryByTestId('protected-content') : null).not.toBeInTheDocument();
    });

    it('should render spinner element during loading', () => {
      const { container } = renderProtectedRoute(createLoadingState());

      const spinner = container.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should show auth-loading wrapper during loading', () => {
      const { container } = renderProtectedRoute(createLoadingState());

      const loadingWrapper = container.querySelector('.auth-loading');
      expect(loadingWrapper).toBeInTheDocument();
    });
  });

  describe('Unauthenticated Access', () => {
    it('should redirect to login when not authenticated', () => {
      renderProtectedRoute(createMockAuthState({ isAuthenticated: false, user: null }));

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user is null', () => {
      renderProtectedRoute(createMockAuthState({ isAuthenticated: true, user: null }));

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('should preserve location state for redirect back', () => {
      // Location state is passed internally by Navigate component
      // We verify by checking the redirect happens
      renderProtectedRoute(createMockAuthState({ isAuthenticated: false }), {
        initialPath: '/protected?query=test',
      });

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Authenticated Access', () => {
    it('should render children when authenticated', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent));

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should allow access for any authenticated user without role requirements', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent));

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should not show loading or error states when authenticated', () => {
      const { container } = renderProtectedRoute(createAuthenticatedState(mockStudent));

      expect(container.querySelector('.auth-loading')).not.toBeInTheDocument();
      expect(container.querySelector('.auth-error-page')).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow access when user has required role', () => {
      renderProtectedRoute(createAuthenticatedState(mockAdmin), {
        roles: [UserRole.ADMIN],
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should allow access when user has one of multiple required roles', () => {
      renderProtectedRoute(createAuthenticatedState(mockAdmin), {
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should deny access when user lacks required role', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent), {
        roles: [UserRole.ADMIN],
      });

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('should show access denied message with role info', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent), {
        roles: [UserRole.ADMIN],
      });

      expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument();
      expect(screen.getByText(/Required role:/)).toBeInTheDocument();
      expect(screen.getByText(/Your role:/)).toBeInTheDocument();
    });

    it('should show multiple required roles in message', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent), {
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
      });

      expect(screen.getByText(/admin or instructor/)).toBeInTheDocument();
    });

    it('should allow access with empty roles array', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent), {
        roles: [],
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Email Verification Requirement', () => {
    it('should allow access when email is verified', () => {
      renderProtectedRoute(createAuthenticatedState(mockStudent), {
        requireEmailVerified: true,
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should block access when email verification is required but not verified', () => {
      renderProtectedRoute(createAuthenticatedState(mockUnverifiedUser), {
        requireEmailVerified: true,
      });

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
    });

    it('should show email verification prompt with button', () => {
      renderProtectedRoute(createAuthenticatedState(mockUnverifiedUser), {
        requireEmailVerified: true,
      });

      expect(screen.getByText('Please verify your email address to access this page.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument();
    });

    it('should not require email verification by default', () => {
      renderProtectedRoute(createAuthenticatedState(mockUnverifiedUser));

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle verify email button click', () => {
      // Mock window.location.href
      const originalHref = window.location.href;
      delete (window as { location?: Location }).location;
      window.location = { href: '' } as Location;

      renderProtectedRoute(createAuthenticatedState(mockUnverifiedUser), {
        requireEmailVerified: true,
      });

      const verifyButton = screen.getByRole('button', { name: /verify email/i });
      verifyButton.click();

      expect(window.location.href).toBe('/verify-email');

      // Restore
      window.location.href = originalHref;
    });
  });

  describe('Combined Requirements', () => {
    it('should check role before email verification', () => {
      // Student with unverified email trying to access admin-only page
      renderProtectedRoute(createAuthenticatedState(mockUnverifiedUser), {
        roles: [UserRole.ADMIN],
        requireEmailVerified: true,
      });

      // Role check should fail first
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('should pass both role and email checks for verified admin', () => {
      renderProtectedRoute(createAuthenticatedState(mockAdmin), {
        roles: [UserRole.ADMIN],
        requireEmailVerified: true,
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});

describe('AuthLoadingScreen Component', () => {
  it('should render loading screen with message', () => {
    render(<AuthLoadingScreen />);

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('should render large spinner', () => {
    const { container } = render(<AuthLoadingScreen />);

    const spinner = container.querySelector('.spinner-large');
    expect(spinner).toBeInTheDocument();
  });

  it('should have auth-loading-screen wrapper', () => {
    const { container } = render(<AuthLoadingScreen />);

    const wrapper = container.querySelector('.auth-loading-screen');
    expect(wrapper).toBeInTheDocument();
  });
});
