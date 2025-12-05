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

// Mock crypto for token generation and hashing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: async (algorithm: string, data: BufferSource) => {
        // Mock SHA-256 hashing for tests
        const text = new TextDecoder().decode(data);
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        // Create a 32-byte buffer (256 bits for SHA-256)
        const buffer = new ArrayBuffer(32);
        const view = new DataView(buffer);
        for (let i = 0; i < 8; i++) {
          view.setUint32(i * 4, hash + i, false);
        }
        return buffer;
      },
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

// Import the REAL auth utilities dynamically for mocking
vi.mock('../src/utils/auth', async () => {
  const actual = await vi.importActual<typeof import('../src/utils/auth')>('../src/utils/auth');

  return {
    // Export all actual implementations
    ...actual,

    // Only override storage functions to work with test mocks
    getAuthData: vi.fn(() => {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');

      if (!token || !userStr) return null;

      try {
        const user = JSON.parse(userStr);
        // Validate user object structure (same as real implementation)
        if (
          !user ||
          typeof user !== 'object' ||
          typeof user.id !== 'string' ||
          typeof user.email !== 'string'
        ) {
          return null;
        }
        return { user, token };
      } catch {
        return null;
      }
    }),

    storeAuthData: vi.fn((response: any, rememberMe: boolean = false) => {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', response.token);
      storage.setItem('auth_user', JSON.stringify(response.user));
      if (response.refreshToken) {
        storage.setItem('auth_refresh_token', response.refreshToken);
      }
      if (rememberMe) {
        localStorage.setItem('auth_remember_me', 'true');
      }
      localStorage.setItem('auth_last_activity', Date.now().toString());
    }),

    clearAuthData: vi.fn(() => {
      const keys = [
        'auth_token',
        'auth_refresh_token',
        'auth_user',
        'auth_remember_me',
        'auth_last_activity',
      ];
      keys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }),

    updateLastActivity: vi.fn(() => {
      localStorage.setItem('auth_last_activity', Date.now().toString());
    }),

    isInactive: vi.fn(() => {
      const lastActivity = localStorage.getItem('auth_last_activity');
      if (!lastActivity) return false;
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      return elapsed > 30 * 60 * 1000; // 30 minutes
    }),

    // Keep ALL other functions from actual implementation
    // These will use the REAL implementations:
    // - validatePasswordStrength
    // - validateEmail
    // - generateMockToken
    // - decodeMockToken
    // - isTokenExpired
    // - hashPassword
    // - generateUserId
    // - getUserDisplayName
    // - getUserInitials
    // - mockApiDelay
  };
});

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
