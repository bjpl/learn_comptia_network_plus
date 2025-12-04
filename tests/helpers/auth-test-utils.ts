/**
 * Authentication Test Utilities
 * Shared mocks, fixtures, and helpers for auth component tests
 */

import { vi } from 'vitest';
import type { User, UserRole } from '../../src/types/auth';

// ============================================
// Mock User Fixtures
// ============================================

export const mockStudent: User = {
  id: 'user-student-001',
  email: 'student@example.com',
  username: 'teststudent',
  firstName: 'Test',
  lastName: 'Student',
  role: 'student' as UserRole,
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-12-03T10:00:00Z',
  emailVerified: true,
  avatar: undefined,
};

export const mockAdmin: User = {
  id: 'user-admin-001',
  email: 'admin@example.com',
  username: 'testadmin',
  firstName: 'Test',
  lastName: 'Admin',
  role: 'admin' as UserRole,
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-12-03T10:00:00Z',
  emailVerified: true,
  avatar: undefined,
};

export const mockInstructor: User = {
  id: 'user-instructor-001',
  email: 'instructor@example.com',
  username: 'testinstructor',
  firstName: 'Test',
  lastName: 'Instructor',
  role: 'instructor' as UserRole,
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-12-03T10:00:00Z',
  emailVerified: true,
  avatar: undefined,
};

export const mockUnverifiedUser: User = {
  id: 'user-unverified-001',
  email: 'unverified@example.com',
  username: 'unverifieduser',
  firstName: 'Unverified',
  lastName: 'User',
  role: 'student' as UserRole,
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-12-03T10:00:00Z',
  emailVerified: false,
  avatar: undefined,
};

// ============================================
// Auth Context Mock Factory
// ============================================

export interface MockAuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const createMockAuthState = (overrides: Partial<MockAuthState> = {}): MockAuthState => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...overrides,
});

export const createAuthenticatedState = (user: User = mockStudent): MockAuthState => ({
  user,
  token: 'mock-jwt-token-12345',
  isAuthenticated: true,
  isLoading: false,
  error: null,
});

export const createLoadingState = (): MockAuthState => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
});

export const createErrorState = (error: string): MockAuthState => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error,
});

// ============================================
// Mock Functions
// ============================================

export const createMockAuthActions = () => ({
  login: vi.fn().mockResolvedValue(undefined),
  register: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  clearError: vi.fn(),
  updateUser: vi.fn(),
  checkAuth: vi.fn(),
  refreshUser: vi.fn(),
  checkSession: vi.fn(),
  restoreSession: vi.fn(),
});

// ============================================
// Navigation Mocks
// ============================================

export const mockNavigate = vi.fn();

export const createMockLocation = (pathname = '/', state: unknown = null) => ({
  pathname,
  search: '',
  hash: '',
  state,
  key: 'default',
});

// ============================================
// Storage Helpers
// ============================================

export const clearAuthStorage = () => {
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();
};

export const setMockAuthStorage = (user: User, token: string) => {
  const authState = {
    state: {
      user,
      token,
      isAuthenticated: true,
    },
    version: 0,
  };
  localStorage.setItem('auth-storage', JSON.stringify(authState));
};

// ============================================
// Test Setup Helpers
// ============================================

export const setupAuthMocks = () => {
  clearAuthStorage();
  mockNavigate.mockClear();
};
