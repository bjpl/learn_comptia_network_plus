/**
 * Service Layer Tests
 * Comprehensive tests for auth-service, api-client, and progress-service
 */

import { describe, it, expect, beforeEach, afterEach, vi, MockedFunction } from 'vitest';

// IMPORTANT: Unmock the auth-service and auth utils from setup.ts since we're testing them directly
vi.unmock('../../../src/services/auth-service');
vi.unmock('../../../src/utils/auth');

import * as authService from '../../../src/services/auth-service';
import { apiClient, ApiClient } from '../../../src/services/api-client';
import * as progressService from '../../../src/services/progress-service';
import { UserRole } from '../../../src/types/auth';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../../../src/types/auth';
import type { ComponentProgress, ProgressSyncData } from '../../../src/services/progress-service';

// Mock dependencies
vi.mock('../../../src/config/api-config', () => ({
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      VERIFY_EMAIL: '/auth/verify-email',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    PROGRESS: {
      GET_ALL: '/progress',
      GET_COMPONENT: (id: string) => `/progress/${id}`,
      UPDATE_COMPONENT: (id: string) => `/progress/${id}`,
      SYNC: '/progress/sync',
      RESET: '/progress/reset',
    },
  },
  shouldUseMockAPI: vi.fn(() => true), // Default to mock mode for consistency
  API_CONFIG: {
    BASE_URL: 'http://localhost:3000',
    TIMEOUT: 10000,
    REQUEST: {
      HEADERS: {
        'Content-Type': 'application/json',
      },
    },
    RETRY: {
      MAX_RETRIES: 3,
      RETRY_DELAY: 1000,
    },
  },
}));

vi.mock('../../../src/utils/auth', () => ({
  storeAuthData: vi.fn(),
  clearAuthData: vi.fn(),
  generateMockToken: vi.fn((userId: string) => {
    // Create a proper JWT-like token using btoa (browser-compatible)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now() }));
    const signature = btoa(`mock_sig_${userId}`);
    return `${header}.${payload}.${signature}`;
  }),
  generateUserId: vi.fn(() => 'generated-user-id'),
  mockApiDelay: vi.fn(() => Promise.resolve()),
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER: 'auth_user',
    REMEMBER_ME: 'auth_remember_me',
  },
}));

vi.mock('../../../src/utils/api/error-handler', () => ({
  parseApiError: vi.fn((error: unknown) => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response: { status: number; data: unknown } };
      const apiError = {
        message: 'API Error',
        statusCode: err.response.status,
        code: err.response.status === 401 ? 'TOKEN_EXPIRED' : 'API_ERROR',
        response: err.response,
      };
      return apiError;
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        throw new Error('Request timeout');
      }
      return {
        message: error.message || 'Network Error',
        statusCode: 0,
        code: 'NETWORK_ERROR',
      };
    }
    return {
      message: 'Network Error',
      statusCode: 0,
      code: 'NETWORK_ERROR',
    };
  }),
  logError: vi.fn(),
  shouldRetry: vi.fn((error: { statusCode?: number }, attemptCount: number, maxRetries: number) => {
    return attemptCount < maxRetries && (error.statusCode ?? 0) >= 500;
  }),
  calculateRetryDelay: vi.fn(
    (attempt: number, baseDelay: number) => baseDelay * Math.pow(2, attempt - 1)
  ),
}));

vi.mock('../../../src/utils/api/network-status', () => ({
  networkStatusManager: {
    getStatus: vi.fn(() => true),
    queueRequest: vi.fn((fn) => fn()),
  },
}));

// Import mocked modules
import { shouldUseMockAPI } from '../../../src/config/api-config';
import {
  storeAuthData,
  clearAuthData,
  generateMockToken,
  generateUserId,
  mockApiDelay,
} from '../../../src/utils/auth';

describe('Services - Auth Service', () => {
  let localStorageMock: Record<string, string>;
  let sessionStorageMock: Record<string, string>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock localStorage and sessionStorage
    localStorageMock = {};
    sessionStorageMock = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };

    global.sessionStorage = {
      getItem: vi.fn((key: string) => sessionStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        sessionStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete sessionStorageMock[key];
      }),
      clear: vi.fn(() => {
        sessionStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };

    // Mock fetch
    global.fetch = vi.fn();

    // Default to mock API mode for consistency
    (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(true);
    (mockApiDelay as MockedFunction<typeof mockApiDelay>).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'demo@comptia.test',
        password: 'demo123',
        rememberMe: true,
      };

      const result = await authService.login(credentials);

      expect(result.user.email).toBe('demo@comptia.test');
      expect(result.user.role).toBe(UserRole.STUDENT);
      expect(result.token).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(result.expiresIn).toBe(15 * 60);
      expect(storeAuthData).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ email: 'demo@comptia.test' }),
        }),
        true
      );
      expect(mockApiDelay).toHaveBeenCalledWith(800);
    });

    it('should handle invalid credentials error', async () => {
      const credentials: LoginCredentials = {
        email: 'demo@comptia.test',
        password: 'wrongpassword',
        rememberMe: false,
      };

      await expect(authService.login(credentials)).rejects.toMatchObject({
        response: {
          status: 401,
          data: {
            code: 'INVALID_CREDENTIALS',
          },
        },
      });
    });

    it('should use mock API when configured', async () => {
      const credentials: LoginCredentials = {
        email: 'demo@comptia.test',
        password: 'demo123',
        rememberMe: false,
      };

      const result = await authService.login(credentials);

      expect(result.user.email).toBe('demo@comptia.test');
      expect(result.token).toBeTruthy();
      expect(mockApiDelay).toHaveBeenCalledWith(800);
      expect(storeAuthData).toHaveBeenCalled();
    });

    it('should reject invalid credentials in mock mode', async () => {
      const credentials: LoginCredentials = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      };

      await expect(authService.login(credentials)).rejects.toMatchObject({
        response: {
          status: 401,
          data: {
            code: 'INVALID_CREDENTIALS',
          },
        },
      });
    });
  });

  describe('register', () => {
    it('should successfully register new user', async () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        username: 'newuser',
        firstName: 'New',
        lastName: 'User',
        acceptTerms: true,
      };

      const result = await authService.register(registerData);

      expect(result.user.email).toBe('newuser@example.com');
      expect(result.user.username).toBe('newuser');
      expect(result.user.firstName).toBe('New');
      expect(result.user.lastName).toBe('User');
      expect(result.user.role).toBe(UserRole.STUDENT);
      expect(result.user.emailVerified).toBe(false);
      expect(result.token).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(result.expiresIn).toBe(15 * 60);
      expect(storeAuthData).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ email: 'newuser@example.com' }),
        }),
        false
      );
      expect(mockApiDelay).toHaveBeenCalledWith(1000);
    });

    it('should handle email already exists error', async () => {
      const registerData: RegisterData = {
        email: 'demo@comptia.test',
        password: 'password123',
        confirmPassword: 'password123',
        username: 'demouser',
        firstName: 'Demo',
        lastName: 'User',
        acceptTerms: true,
      };

      await expect(authService.register(registerData)).rejects.toMatchObject({
        response: {
          status: 409,
          data: {
            code: 'EMAIL_EXISTS',
          },
        },
      });
    });

    it('should handle password mismatch', async () => {
      const registerData: RegisterData = {
        email: 'uniqueuser@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
        username: 'uniqueuser',
        firstName: 'New',
        lastName: 'User',
        acceptTerms: true,
      };

      await expect(authService.register(registerData)).rejects.toMatchObject({
        response: {
          status: 422,
          data: {
            message: 'Passwords do not match',
          },
        },
      });
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      await authService.logout();

      expect(mockApiDelay).toHaveBeenCalledWith(300);
      expect(clearAuthData).toHaveBeenCalled();
    });

    it('should clear auth data even if API call fails', async () => {
      await authService.logout();

      expect(clearAuthData).toHaveBeenCalled();
    });

    it('should work in mock mode', async () => {
      await authService.logout();

      expect(mockApiDelay).toHaveBeenCalledWith(300);
      expect(clearAuthData).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const result = await authService.refreshToken('demo-student-1_refresh');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(mockApiDelay).toHaveBeenCalledWith(200);
    });

    it('should work in mock mode', async () => {
      const result = await authService.refreshToken('user-123_refresh');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(mockApiDelay).toHaveBeenCalledWith(200);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user from API', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.STUDENT,
        createdAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      localStorageMock['auth_user'] = JSON.stringify(mockUser);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockApiDelay).toHaveBeenCalledWith(300);
    });

    it('should get user from storage in mock mode', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.STUDENT,
        createdAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      localStorageMock['auth_user'] = JSON.stringify(mockUser);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockApiDelay).toHaveBeenCalledWith(300);
    });

    it('should throw unauthorized error if no user in storage', async () => {
      await expect(authService.getCurrentUser()).rejects.toMatchObject({
        response: {
          status: 401,
          data: {
            code: 'UNAUTHORIZED',
          },
        },
      });
    });
  });

  describe('hasRole', () => {
    it('should return true for matching role', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.ADMIN,
        createdAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      expect(authService.hasRole(user, UserRole.ADMIN)).toBe(true);
    });

    it('should return false for non-matching role', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.STUDENT,
        createdAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      expect(authService.hasRole(user, UserRole.ADMIN)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(authService.hasRole(null, UserRole.STUDENT)).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the roles', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.INSTRUCTOR,
        createdAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      expect(authService.hasAnyRole(user, [UserRole.ADMIN, UserRole.INSTRUCTOR])).toBe(true);
    });

    it('should return false if user has none of the roles', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.STUDENT,
        createdAt: '2024-01-01T00:00:00Z',
        emailVerified: true,
      };

      expect(authService.hasAnyRole(user, [UserRole.ADMIN, UserRole.INSTRUCTOR])).toBe(false);
    });
  });
});

describe('Services - API Client', () => {
  let client: ApiClient;
  let localStorageMock: Record<string, string>;
  let sessionStorageMock: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();

    localStorageMock = {};
    sessionStorageMock = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };

    global.sessionStorage = {
      getItem: vi.fn((key: string) => sessionStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        sessionStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete sessionStorageMock[key];
      }),
      clear: vi.fn(() => {
        sessionStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };

    global.fetch = vi.fn();
    client = new ApiClient('http://localhost:3000', 10000);
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await client.get('/test');

      expect(result.data).toEqual(mockData);
      expect(result.status).toBe(200);
    });

    it('should add auth token to headers', async () => {
      localStorageMock['auth_token'] = 'test-token';

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await client.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle query parameters', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await client.get('/test', { params: { id: 123, active: true } });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('id=123&active=true'),
        expect.any(Object)
      );
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const requestBody = { name: 'New Item' };
      const mockResponse = { id: 1, ...requestBody };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: 'Created',
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await client.post('/test', requestBody);

      expect(result.data).toEqual(mockResponse);
      expect(result.status).toBe(201);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const requestBody = { name: 'Updated Item' };
      const mockResponse = { id: 1, ...requestBody };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await client.put('/test/1', requestBody);

      expect(result.data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 204,
        statusText: 'No Content',
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await client.delete('/test/1');

      expect(result.status).toBe(204);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle 401 errors', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Unauthorized' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(client.get('/test')).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should handle 500 errors', async () => {
      // Mock fetch to always return 500 error (for all retry attempts)
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(client.get('/test', { skipRetry: true })).rejects.toMatchObject({
        statusCode: 500,
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(client.get('/test')).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
      });
    });

    it('should handle timeout errors', async () => {
      // Mock a long-running request that will be aborted
      (global.fetch as MockedFunction<typeof fetch>).mockImplementationOnce(
        (_url, init) =>
          new Promise((_resolve, reject) => {
            // Simulate the AbortController aborting the request
            if (init?.signal) {
              init.signal.addEventListener('abort', () => {
                const abortError = new Error('The operation was aborted');
                abortError.name = 'AbortError';
                reject(abortError);
              });
            }
            // Never resolve to simulate a very slow request
          })
      );

      await expect(client.get('/test', { timeout: 100 })).rejects.toThrow('Request timeout');
    });
  });

  describe('Token refresh', () => {
    it('should refresh token on 401 and retry request', async () => {
      localStorageMock['auth_token'] = 'expired-token';
      localStorageMock['auth_refresh_token'] = 'refresh-token';
      localStorageMock['auth_remember_me'] = 'true';

      // First call: 401 error
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ code: 'TOKEN_EXPIRED' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      // Refresh token call
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
        }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      // Retry original request
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ data: 'success' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(client.get('/test')).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });

  describe('Retry logic', () => {
    it('should not retry on client errors (4xx)', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Bad request' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(client.get('/test')).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should skip retry when skipRetry is true', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(client.get('/test', { skipRetry: true })).rejects.toMatchObject({
        statusCode: 500,
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Services - Progress Service', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();

    localStorageMock = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };

    global.fetch = vi.fn();

    (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(false);
  });

  describe('getAllProgress', () => {
    it('should get all progress from API', async () => {
      const mockProgress: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 2,
        },
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ progress: mockProgress }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await progressService.getAllProgress();

      expect(result).toEqual(mockProgress);
    });

    it('should get progress from localStorage in mock mode', async () => {
      (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(true);

      const mockProgress: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 2,
        },
      };

      localStorageMock['comptia-network-plus-progress'] = JSON.stringify({
        state: { componentProgress: mockProgress },
      });

      const result = await progressService.getAllProgress();

      expect(result).toEqual(mockProgress);
    });

    it('should return empty object if no progress stored', async () => {
      (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(true);

      const result = await progressService.getAllProgress();

      expect(result).toEqual({});
    });
  });

  describe('getComponentProgress', () => {
    it('should get specific component progress', async () => {
      const mockProgress: ComponentProgress = {
        componentId: 'comp-1',
        completed: true,
        score: 85,
        timeSpent: 1200,
        lastVisited: '2024-01-01T00:00:00Z',
        attempts: 2,
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ progress: mockProgress }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await progressService.getComponentProgress('comp-1');

      expect(result).toEqual(mockProgress);
    });

    it('should return null if component not found in mock mode', async () => {
      (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(true);

      const result = await progressService.getComponentProgress('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateComponentProgress', () => {
    it('should update component progress via API', async () => {
      const update: Partial<ComponentProgress> = {
        completed: true,
        score: 90,
      };

      const mockResponse: ComponentProgress = {
        componentId: 'comp-1',
        completed: true,
        score: 90,
        timeSpent: 1200,
        lastVisited: '2024-01-01T00:00:00Z',
        attempts: 2,
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ progress: mockResponse }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await progressService.updateComponentProgress('comp-1', update);

      expect(result).toEqual(mockResponse);
    });

    it('should update localStorage in mock mode', async () => {
      (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(true);

      const update: Partial<ComponentProgress> = {
        completed: true,
        score: 90,
      };

      const result = await progressService.updateComponentProgress('comp-1', update);

      expect(result.componentId).toBe('comp-1');
      expect(result.completed).toBe(true);
      expect(result.score).toBe(90);

      const stored = JSON.parse(localStorageMock['comptia-network-plus-progress'] || '{}');
      expect(stored.state.componentProgress['comp-1']).toEqual(result);
    });
  });

  describe('syncProgress', () => {
    it('should sync progress with backend', async () => {
      const localProgress: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 2,
        },
      };

      const mockResponse: ProgressSyncData = {
        componentProgress: localProgress,
        lastSyncedAt: '2024-01-01T00:00:00Z',
        version: 1,
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await progressService.syncProgress(localProgress);

      expect(result).toEqual(mockResponse);
    });

    it('should sync to localStorage in mock mode', async () => {
      (shouldUseMockAPI as MockedFunction<typeof shouldUseMockAPI>).mockReturnValue(true);

      const localProgress: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 2,
        },
      };

      const result = await progressService.syncProgress(localProgress);

      expect(result.componentProgress).toEqual(localProgress);
      expect(localStorageMock['progress_sync']).toBeTruthy();
    });
  });

  describe('resolveConflicts', () => {
    it('should prefer local when local is more recent', () => {
      const local: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 90,
          timeSpent: 1200,
          lastVisited: '2024-01-02T00:00:00Z',
          attempts: 2,
        },
      };

      const remote: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1000,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
      };

      const { resolved, conflicts } = progressService.resolveConflicts(local, remote);

      expect(resolved['comp-1']).toEqual(local['comp-1']);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].resolution).toBe('local');
    });

    it('should prefer remote when remote is more recent', () => {
      const local: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1000,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
      };

      const remote: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 90,
          timeSpent: 1200,
          lastVisited: '2024-01-02T00:00:00Z',
          attempts: 2,
        },
      };

      const { resolved, conflicts } = progressService.resolveConflicts(local, remote);

      expect(resolved['comp-1']).toEqual(remote['comp-1']);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].resolution).toBe('remote');
    });

    it('should merge when timestamps are equal', () => {
      const timestamp = '2024-01-01T00:00:00Z';
      const local: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1000,
          lastVisited: timestamp,
          attempts: 1,
        },
      };

      const remote: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: false,
          score: 90,
          timeSpent: 1200,
          lastVisited: timestamp,
          attempts: 2,
        },
      };

      const { resolved, conflicts } = progressService.resolveConflicts(local, remote);

      expect(resolved['comp-1'].score).toBe(90);
      expect(resolved['comp-1'].timeSpent).toBe(1200);
      expect(resolved['comp-1'].attempts).toBe(2);
      expect(resolved['comp-1'].completed).toBe(true);
      expect(conflicts[0].resolution).toBe('merge');
    });

    it('should handle items only in local', () => {
      const local: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1000,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
      };

      const remote: Record<string, ComponentProgress> = {};

      const { resolved, conflicts } = progressService.resolveConflicts(local, remote);

      expect(resolved['comp-1']).toEqual(local['comp-1']);
      expect(conflicts).toHaveLength(0);
    });

    it('should handle items only in remote', () => {
      const local: Record<string, ComponentProgress> = {};

      const remote: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1000,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
      };

      const { resolved, conflicts } = progressService.resolveConflicts(local, remote);

      expect(resolved['comp-1']).toEqual(remote['comp-1']);
      expect(conflicts).toHaveLength(0);
    });
  });

  describe('queueProgressUpdate', () => {
    it('should queue progress update for offline sync', () => {
      const update: Partial<ComponentProgress> = {
        completed: true,
        score: 90,
      };

      progressService.queueProgressUpdate('comp-1', update);

      const queue = JSON.parse(localStorageMock['progress_queue'] || '[]');
      expect(queue).toHaveLength(1);
      expect(queue[0].componentId).toBe('comp-1');
      expect(queue[0].progress).toEqual(update);
    });

    it('should append to existing queue', () => {
      localStorageMock['progress_queue'] = JSON.stringify([
        { componentId: 'comp-1', progress: { completed: true }, timestamp: '2024-01-01T00:00:00Z' },
      ]);

      progressService.queueProgressUpdate('comp-2', { score: 80 });

      const queue = JSON.parse(localStorageMock['progress_queue'] || '[]');
      expect(queue).toHaveLength(2);
    });
  });

  describe('getCategoryProgress', () => {
    it('should calculate category progress', () => {
      const allProgress: Record<string, ComponentProgress> = {
        'cat1-comp1': {
          componentId: 'cat1-comp1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 2,
        },
        'cat1-comp2': {
          componentId: 'cat1-comp2',
          completed: false,
          score: 70,
          timeSpent: 800,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
        'cat2-comp1': {
          componentId: 'cat2-comp1',
          completed: true,
          score: 90,
          timeSpent: 1500,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
      };

      const result = progressService.getCategoryProgress(allProgress, 'cat1');

      expect(result.categoryId).toBe('cat1');
      expect(result.componentsCompleted).toBe(1);
      expect(result.totalComponents).toBe(2);
      expect(result.averageScore).toBe((85 + 70) / 2);
      expect(result.totalTimeSpent).toBe(2000);
    });
  });

  describe('getOverallProgress', () => {
    it('should calculate overall progress', () => {
      const allProgress: Record<string, ComponentProgress> = {
        'comp-1': {
          componentId: 'comp-1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 2,
        },
        'comp-2': {
          componentId: 'comp-2',
          completed: true,
          score: 90,
          timeSpent: 1500,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
        'comp-3': {
          componentId: 'comp-3',
          completed: false,
          timeSpent: 800,
          lastVisited: '2024-01-01T00:00:00Z',
          attempts: 1,
        },
      };

      const result = progressService.getOverallProgress(allProgress, 10);

      expect(result.totalCompleted).toBe(2);
      expect(result.totalComponents).toBe(10);
      expect(result.percentage).toBe(20);
      expect(result.averageScore).toBe((85 + 90) / 2);
    });

    it('should handle empty progress', () => {
      const result = progressService.getOverallProgress({}, 23);

      expect(result.totalCompleted).toBe(0);
      expect(result.totalComponents).toBe(23);
      expect(result.percentage).toBe(0);
      expect(result.averageScore).toBe(0);
    });
  });
});
