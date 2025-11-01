/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './api-client';
import { API_ENDPOINTS, shouldUseMockAPI } from '../config/api-config';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserRole,
} from '../types/auth';
import {
  storeAuthData,
  clearAuthData,
  generateMockToken,
  generateUserId,
  mockApiDelay,
} from '../utils/auth';

/**
 * Mock user database (for demo mode)
 */
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@comptia.test': {
    password: 'demo123',
    user: {
      id: 'demo-student-1',
      email: 'demo@comptia.test',
      username: 'demo_student',
      firstName: 'Demo',
      lastName: 'Student',
      role: UserRole.STUDENT,
      createdAt: '2024-01-01T00:00:00Z',
      emailVerified: true,
    },
  },
  'admin@comptia.test': {
    password: 'admin123',
    user: {
      id: 'demo-admin-1',
      email: 'admin@comptia.test',
      username: 'admin_user',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      createdAt: '2024-01-01T00:00:00Z',
      emailVerified: true,
    },
  },
};

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (shouldUseMockAPI()) {
    return mockLogin(credentials);
  }

  const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

  // Store auth data
  storeAuthData(response.data, credentials.rememberMe);

  return response.data;
};

/**
 * Mock login implementation
 */
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await mockApiDelay(800);

  const mockUser = MOCK_USERS[credentials.email];

  if (!mockUser || mockUser.password !== credentials.password) {
    throw {
      response: {
        status: 401,
        data: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        },
      },
    };
  }

  const token = generateMockToken(mockUser.user.id);
  const refreshToken = generateMockToken(mockUser.user.id + '_refresh');

  const authResponse: AuthResponse = {
    user: {
      ...mockUser.user,
      lastLogin: new Date().toISOString(),
    },
    token,
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes
  };

  // Store auth data
  storeAuthData(authResponse, credentials.rememberMe);

  return authResponse;
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  if (shouldUseMockAPI()) {
    return mockRegister(data);
  }

  const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);

  // Store auth data
  storeAuthData(response.data, false);

  return response.data;
};

/**
 * Mock register implementation
 */
const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await mockApiDelay(1000);

  // Check if email already exists
  if (MOCK_USERS[data.email]) {
    throw {
      response: {
        status: 409,
        data: {
          message: 'Email already registered',
          code: 'EMAIL_EXISTS',
        },
      },
    };
  }

  // Validate password match
  if (data.password !== data.confirmPassword) {
    throw {
      response: {
        status: 422,
        data: {
          message: 'Passwords do not match',
          errors: {
            confirmPassword: 'Passwords do not match',
          },
        },
      },
    };
  }

  const userId = generateUserId();
  const newUser: User = {
    id: userId,
    email: data.email,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    role: UserRole.STUDENT,
    createdAt: new Date().toISOString(),
    emailVerified: false,
  };

  const token = generateMockToken(userId);
  const refreshToken = generateMockToken(userId + '_refresh');

  const authResponse: AuthResponse = {
    user: newUser,
    token,
    refreshToken,
    expiresIn: 15 * 60,
  };

  // Add to mock database
  MOCK_USERS[data.email] = {
    password: data.password,
    user: newUser,
  };

  // Store auth data
  storeAuthData(authResponse, false);

  return authResponse;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockLogout();
    return;
  }

  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API error:', error);
  } finally {
    clearAuthData();
  }
};

/**
 * Mock logout implementation
 */
const mockLogout = async (): Promise<void> => {
  await mockApiDelay(300);
  clearAuthData();
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<string> => {
  if (shouldUseMockAPI()) {
    return mockRefreshToken(refreshToken);
  }

  const response = await apiClient.post<{ token: string; refreshToken: string }>(
    API_ENDPOINTS.AUTH.REFRESH,
    { refreshToken },
    { skipAuth: true }
  );

  return response.data.token;
};

/**
 * Mock refresh token implementation
 */
const mockRefreshToken = async (refreshToken: string): Promise<string> => {
  await mockApiDelay(200);

  // Extract user ID from refresh token
  const userId = refreshToken.split('_')[0];
  return generateMockToken(userId);
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  if (shouldUseMockAPI()) {
    return mockGetCurrentUser();
  }

  const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Mock get current user implementation
 */
const mockGetCurrentUser = async (): Promise<User> => {
  await mockApiDelay(300);

  // Get user from storage
  const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
  if (!userStr) {
    throw {
      response: {
        status: 401,
        data: {
          message: 'Not authenticated',
          code: 'UNAUTHORIZED',
        },
      },
    };
  }

  return JSON.parse(userStr);
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockVerifyEmail(token);
    return;
  }

  await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
};

/**
 * Mock verify email implementation
 */
const mockVerifyEmail = async (token: string): Promise<void> => {
  await mockApiDelay(500);
  console.log('Email verified with token:', token);
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockForgotPassword(email);
    return;
  }

  await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

/**
 * Mock forgot password implementation
 */
const mockForgotPassword = async (email: string): Promise<void> => {
  await mockApiDelay(800);
  console.log('Password reset email sent to:', email);
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockResetPassword(token, newPassword);
    return;
  }

  await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
};

/**
 * Mock reset password implementation
 */
const mockResetPassword = async (token: string, newPassword: string): Promise<void> => {
  await mockApiDelay(800);
  console.log('Password reset with token:', token, 'New password:', newPassword.replace(/./g, '*'));
};

/**
 * Check if user has required role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if user has any of the required roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};
