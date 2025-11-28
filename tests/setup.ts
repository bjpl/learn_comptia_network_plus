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
const mockAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockImplementation(() => {
    mockAuthState.user = null;
    mockAuthState.token = null;
    mockAuthState.isAuthenticated = false;
    mockAuthState.error = null;
    return Promise.resolve();
  }),
  register: vi.fn().mockResolvedValue(undefined),
  refreshUser: vi.fn().mockResolvedValue(undefined),
  clearError: vi.fn(),
  setError: vi.fn(),
  checkSession: vi.fn().mockResolvedValue(true),
  restoreSession: vi.fn(),
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
  getAuthData: vi.fn(() => null),
  setAuthData: vi.fn(),
  clearAuthData: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  getTokenPayload: vi.fn(() => ({ userId: 'test-user-1', exp: Date.now() / 1000 + 3600 })),
  updateLastActivity: vi.fn(),
  isInactive: vi.fn(() => false),
  validatePasswordStrength: vi.fn((password) => ({
    score: password.length >= 12 ? 4 : password.length >= 8 ? 3 : 2,
    feedback: password.length >= 12 ? 'Strong password' : 'Password could be stronger',
  })),
  validateEmail: vi.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  storeAuthData: vi.fn(),
  getUserDisplayName: vi.fn((user) => user?.username || user?.email || 'User'),
  getUserInitials: vi.fn((user) =>
    (user?.username || user?.email || 'U').substring(0, 2).toUpperCase()
  ),
  // Additional exports from auth utils
  mockApiDelay: vi.fn((ms = 500) => Promise.resolve()),
  generateSessionId: vi.fn(() => 'mock-session-id'),
  formatAuthError: vi.fn((error) => error?.message || 'Authentication error'),
  isValidToken: vi.fn(() => true),
  decodeToken: vi.fn(() => ({ userId: 'test-user-1', email: 'test@example.com' })),
  AUTH_TOKEN_KEY: 'auth_token',
  USER_KEY: 'user',
  REFRESH_TOKEN_KEY: 'refresh_token',
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
