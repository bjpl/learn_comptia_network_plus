import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ProgressProvider } from '../../src/contexts/ProgressContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { vi } from 'vitest';
import type { User } from '../../src/types/auth';

/**
 * Auth state interface for testing
 */
export interface MockAuthState {
  user?: User | null;
  token?: string | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Common provider wrapper for tests (includes AuthProvider)
 */
export const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

/**
 * Provider with routing support (uses BrowserRouter)
 */
export const AllProvidersWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AllProviders>{children}</AllProviders>
    </BrowserRouter>
  );
};

/**
 * Provider with memory router (for testing without actual routing)
 */
export const AllProvidersWithMemoryRouter: React.FC<{
  children: React.ReactNode;
  initialEntries?: string[];
}> = ({ children, initialEntries = ['/'] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AllProviders>{children}</AllProviders>
    </MemoryRouter>
  );
};

/**
 * Custom render that includes all providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}

/**
 * Custom render that includes all providers and router
 */
export function renderWithRouter(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: AllProvidersWithRouter, ...options });
}

/**
 * Custom render that includes all providers and memory router
 */
export function renderWithMemoryRouter(
  ui: React.ReactElement,
  initialEntries: string[] = ['/'],
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllProvidersWithMemoryRouter initialEntries={initialEntries}>
      {children}
    </AllProvidersWithMemoryRouter>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock authentication user
 */
export const mockAuthUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student' as const,
};

/**
 * Mock progress data
 */
export const mockProgressData = {
  totalCompleted: 0,
  totalComponents: 23,
  percentage: 0,
  averageScore: 0,
};

/**
 * Helper to set mock auth state for Zustand store
 */
export const setMockAuthState = (state: MockAuthState) => {
  const { useAuthStore } = require('../../src/stores/authStore');

  const mockState = {
    user: state.user ?? null,
    token: state.token ?? null,
    isAuthenticated: state.isAuthenticated ?? false,
    isLoading: state.isLoading ?? false,
    error: state.error ?? null,
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    register: vi.fn().mockResolvedValue(undefined),
    refreshUser: vi.fn().mockResolvedValue(undefined),
    clearError: vi.fn(),
    setError: vi.fn(),
    checkSession: vi.fn().mockResolvedValue(true),
    restoreSession: vi.fn(),
  };

  // Mock the store
  vi.mocked(useAuthStore).mockReturnValue(mockState as any);

  return mockState;
};

/**
 * Mock authenticated user helper
 */
export const mockAuthenticatedUser = (
  user: User = {
    id: 'test-user-1',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date().toISOString(),
  }
) => {
  return setMockAuthState({
    user,
    token: 'mock-jwt-token',
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
};

/**
 * Mock unauthenticated state
 */
export const mockUnauthenticated = () => {
  return setMockAuthState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
};

/**
 * Mock loading state
 */
export const mockAuthLoading = () => {
  return setMockAuthState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
};

/**
 * Mock error state
 */
export const mockAuthError = (error = 'Authentication failed') => {
  return setMockAuthState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error,
  });
};

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-1',
  email: 'test@example.com',
  username: 'testuser',
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Wait for auth to be ready (useful for async auth operations)
 */
export const waitForAuth = async () => {
  const { waitFor } = require('@testing-library/react');
  await waitFor(() => {
    const { useAuthStore } = require('../../src/stores/authStore');
    const state = useAuthStore.getState();
    return !state.isLoading;
  });
};
