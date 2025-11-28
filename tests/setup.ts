import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// CRITICAL: Mock storage BEFORE any other imports to prevent zustand persist errors
// Create storage mock implementation
const createStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
};

// Initialize storage mocks
const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

// Setup global storage mocks FIRST
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
  configurable: true,
});

// Also define on window for browser environments
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
    configurable: true,
  });
}

// =========================================================================
// Auth Store Mock with getState Support
// =========================================================================

// Create a mock state that can be accessed via getState
const mockAuthState: any = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: vi.fn().mockImplementation(async ({ email }: { email: string }) => {
    mockAuthState.user = {
      id: 'test-user-1',
      email,
      username: email.split('@')[0],
      firstName: 'Test',
      lastName: 'User',
      role: 'student',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };
    mockAuthState.token = 'mock-jwt-token';
    mockAuthState.isAuthenticated = true;
    mockAuthState.error = null;
    return Promise.resolve();
  }),
  logout: vi.fn().mockImplementation(() => {
    mockAuthState.user = null;
    mockAuthState.token = null;
    mockAuthState.isAuthenticated = false;
    mockAuthState.error = null;
    return Promise.resolve();
  }),
  register: vi
    .fn()
    .mockImplementation(async ({ email, username }: { email: string; username: string }) => {
      mockAuthState.user = {
        id: 'test-user-1',
        email,
        username,
        firstName: 'New',
        lastName: 'User',
        role: 'student',
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };
      mockAuthState.token = 'mock-jwt-token';
      mockAuthState.isAuthenticated = true;
      mockAuthState.error = null;
      return Promise.resolve();
    }),
  refreshUser: vi.fn().mockResolvedValue(undefined),
  clearError: vi.fn(() => {
    mockAuthState.error = null;
  }),
  setError: vi.fn((error: string) => {
    mockAuthState.error = error;
  }),
  checkSession: vi.fn().mockResolvedValue(true),
  restoreSession: vi.fn().mockImplementation(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      mockAuthState.token = storedToken;
      mockAuthState.user = JSON.parse(storedUser);
      mockAuthState.isAuthenticated = true;
    }
  }),
};

// Mock useAuthStore with getState and setState support
const mockUseAuthStore: any = Object.assign(
  vi.fn(() => mockAuthState),
  {
    getState: () => mockAuthState,
    setState: (newState: any) => {
      Object.assign(
        mockAuthState,
        typeof newState === 'function' ? newState(mockAuthState) : newState
      );
    },
  }
);

// Apply mock before any imports
vi.mock('../src/stores/authStore', () => ({
  useAuthStore: mockUseAuthStore,
}));

// NOW import testing library after storage is mocked
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: () => [],
}));

// Mock URL.createObjectURL and URL.revokeObjectURL for file download tests
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock HTMLAnchorElement.click for download tests
HTMLAnchorElement.prototype.click = vi.fn();

// Mock crypto for token generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  },
});

// =========================================================================
// Mock Auth Service
// =========================================================================

vi.mock('../src/services/auth-service', () => ({
  login: vi.fn().mockResolvedValue({
    user: {
      id: 'test-user-1',
      email: 'test@example.com',
      username: 'testuser',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-token',
  }),
  register: vi.fn().mockResolvedValue({
    user: {
      id: 'test-user-1',
      email: 'test@example.com',
      username: 'testuser',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-token',
  }),
  logout: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockResolvedValue({
    id: 'test-user-1',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date().toISOString(),
  }),
  refreshToken: vi.fn().mockResolvedValue({
    token: 'new-mock-jwt-token',
  }),
}));

// =========================================================================
// Mock Auth Utils
// =========================================================================

vi.mock('../src/utils/auth', () => ({
  // Storage keys constant - REQUIRED
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER: 'auth_user',
    REMEMBER_ME: 'auth_remember_me',
    LAST_ACTIVITY: 'auth_last_activity',
  },
  SESSION_CONFIG: {
    INACTIVITY_TIMEOUT: 30 * 60 * 1000,
    REFRESH_INTERVAL: 14 * 60 * 1000,
  },
  // Auth data functions
  getAuthData: vi.fn(() => null),
  storeAuthData: vi.fn(),
  clearAuthData: vi.fn(),
  // Token functions
  isTokenExpired: vi.fn(() => false),
  generateMockToken: vi.fn((userId) => `mock-token-${userId}`),
  decodeMockToken: vi.fn(() => ({ exp: Date.now() / 1000 + 3600, sub: 'test-user-1' })),
  // Activity tracking
  updateLastActivity: vi.fn(),
  isInactive: vi.fn(() => false),
  // Validation functions
  validatePasswordStrength: vi.fn((password) => ({
    score: password.length >= 12 ? 4 : password.length >= 8 ? 3 : 2,
    feedback: password.length >= 12 ? ['Strong password'] : ['Password could be stronger'],
    isValid: password.length >= 8,
  })),
  validateEmail: vi.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  // Utility functions
  hashPassword: vi.fn(async (password) => `hashed-${password}`),
  generateUserId: vi.fn(() => 'test-user-' + Math.random().toString(36).substr(2, 9)),
  mockApiDelay: vi.fn(() => Promise.resolve()),
  getUserDisplayName: vi.fn((user) => user?.username || user?.email || 'User'),
  getUserInitials: vi.fn((user) =>
    (user?.username || user?.email || 'U').substring(0, 2).toUpperCase()
  ),
}));

global.fetch = vi.fn((url, init) => {
  const urlString = typeof url === 'string' ? url : url.toString();

  let responseData = {
    success: true,
    data: {},
    message: 'Success',
  };

  if (urlString.includes('/auth/login')) {
    responseData = {
      success: true,
      data: {
        user: {
          id: 'test-user-1',
          email: 'test@example.com',
          username: 'testuser',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
      },
      message: 'Login successful',
    };
  } else if (urlString.includes('/auth/register')) {
    responseData = {
      success: true,
      data: {
        user: {
          id: 'test-user-1',
          email: 'test@example.com',
          username: 'testuser',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
      },
      message: 'Registration successful',
    };
  } else if (urlString.includes('/auth/logout')) {
    responseData = {
      success: true,
      data: null,
      message: 'Logout successful',
    };
  } else if (urlString.includes('/auth/user')) {
    responseData = {
      success: true,
      data: {
        id: 'test-user-1',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date().toISOString(),
      },
      message: 'User retrieved successfully',
    };
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({
      'content-type': 'application/json',
    }),
    json: () => Promise.resolve(responseData),
    text: () => Promise.resolve(JSON.stringify(responseData)),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    clone: function () {
      return this;
    },
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: An update to') ||
        args[0].includes('act(...)') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') || args[0].includes('componentWillMount'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  vi.resetAllMocks();
});

expect.extend({});

export { mockAuthState, vi, cleanup };
