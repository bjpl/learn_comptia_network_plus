/**
 * Authentication Store
 * Zustand store for authentication state with API integration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '../types/auth';
import * as authService from '../services/auth-service';
import { getAuthData, clearAuthData } from '../utils/auth';
import { parseApiError, logError } from '../utils/api/error-handler';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;

  // Session management
  checkSession: () => Promise<boolean>;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login user
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Login');

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Register new user
       */
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(data);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Register');

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Logout');
          // Continue with logout even if API call fails
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Refresh user data from API
       */
      refreshUser: async () => {
        const { token } = get();

        if (!token) {
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Refresh User');

          // If unauthorized, clear session
          if (apiError.code === 'UNAUTHORIZED' || apiError.code === 'TOKEN_EXPIRED') {
            clearAuthData();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: apiError.userMessage,
            });
          }
        }
      },

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Set error
       */
      setError: (error: string) => {
        set({ error });
      },

      /**
       * Check if session is valid
       */
      checkSession: async (): Promise<boolean> => {
        const { token, refreshUser } = get();

        if (!token) {
          return false;
        }

        try {
          await refreshUser();
          return true;
        } catch {
          return false;
        }
      },

      /**
       * Restore session from storage
       */
      restoreSession: () => {
        const authData = getAuthData();

        if (authData) {
          set({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true,
          });

          // Refresh user data in background
          get().refreshUser();
        }
      },
    }),
    {
      name: 'comptia-network-plus-auth',
      partialize: (state) => ({
        // Don't persist sensitive data - it's already in localStorage via auth utils
        // Only persist minimal state for hydration
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore session after hydration
        if (state) {
          state.restoreSession();
        }
      },
    }
  )
);

// Auto-restore session on mount
if (typeof window !== 'undefined') {
  const authData = getAuthData();
  if (authData) {
    useAuthStore.getState().restoreSession();
  }
}
