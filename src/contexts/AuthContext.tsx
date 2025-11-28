/**
 * Authentication Context Provider
 * DEPRECATED: This is now a thin wrapper around authStore for backward compatibility.
 * New code should use `useAuthStore` from '../stores/authStore' directly.
 *
 * This context delegates all operations to the Zustand authStore, ensuring
 * a single source of truth for authentication state.
 */

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { User, LoginCredentials, RegisterData } from '../types/auth';
import { isInactive, updateLastActivity } from '../utils/auth';

interface AuthContextType {
  // State from authStore
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions from authStore
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;

  // Legacy methods for backward compatibility
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Wraps the Zustand authStore for backward compatibility
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get state and actions from Zustand store
  const authState = useAuthStore();

  /**
   * Legacy updateUser method - maps to refreshUser from authStore
   */
  const updateUser = (_updates: Partial<User>) => {
    // In the Zustand implementation, user updates should go through the API
    // For now, just refresh the user data
    authState.refreshUser();
  };

  /**
   * Legacy checkAuth method - maps to checkSession from authStore
   */
  const checkAuth = () => {
    authState.checkSession();
  };

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    // Restore session if available
    authState.restoreSession();
  }, []);

  /**
   * Set up activity tracking for session timeout
   */
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

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
        authState.logout();
      }
    }, 60 * 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [authState.isAuthenticated, authState.logout]);

  // Create context value that matches the legacy interface
  const value: AuthContextType = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    login: authState.login,
    register: authState.register,
    logout: authState.logout,
    clearError: authState.clearError,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth
 * Works both with AuthProvider (context) or standalone (direct Zustand store).
 * For new code, consider using `useAuthStore` from '../stores/authStore' directly.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  const directStore = useAuthStore();

  // If context is available, use it (component wrapped in AuthProvider)
  if (context !== undefined) {
    return context;
  }

  // Otherwise, use Zustand store directly (works without provider)
  // This ensures tests work without wrapping components in AuthProvider
  return {
    user: directStore.user,
    token: directStore.token,
    isAuthenticated: directStore.isAuthenticated,
    isLoading: directStore.isLoading,
    error: directStore.error,
    login: directStore.login,
    register: directStore.register,
    logout: directStore.logout,
    clearError: directStore.clearError,
    // Legacy methods
    updateUser: () => directStore.refreshUser(),
    checkAuth: () => {
      directStore.checkSession();
    },
  };
};
