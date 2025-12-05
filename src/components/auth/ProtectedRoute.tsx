/**
 * Protected Route Component
 * Wraps routes that require authentication
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: UserRole[];
  requireEmailVerified?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  requireEmailVerified = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="auth-error-page">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <p>Required role: {roles.join(' or ')}</p>
        <p>Your role: {user.role}</p>
      </div>
    );
  }

  // Check email verification requirement
  if (requireEmailVerified && !user.emailVerified) {
    return (
      <div className="auth-error-page">
        <h1>Email Verification Required</h1>
        <p>Please verify your email address to access this page.</p>
        <button className="btn-primary" onClick={() => window.location.href = '/verify-email'}>
          Verify Email
        </button>
      </div>
    );
  }

  return children;
};

/**
 * Component to show while checking authentication
 */
export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="auth-loading-screen">
      <div className="spinner-large" />
      <h2>Checking authentication...</h2>
    </div>
  );
};
