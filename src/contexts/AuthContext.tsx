/**
 * Authentication Context Provider
 * Manages authentication state and provides auth methods throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  UserRole,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types/auth';
import {
  storeAuthData,
  getAuthData,
  clearAuthData,
  isTokenExpired,
  isInactive,
  updateLastActivity,
  generateMockToken,
  generateUserId,
  hashPassword,
  mockApiDelay,
} from '../utils/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in production, this would be server-side)
const MOCK_USERS: Array<User & { passwordHash: string }> = [
  {
    id: 'user_demo_123',
    email: 'demo@comptia.test',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    role: UserRole.STUDENT,
    createdAt: new Date().toISOString(),
    emailVerified: true,
    passwordHash: 'demo123', // In production: properly hashed
  },
  {
    id: 'user_admin_456',
    email: 'admin@comptia.test',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    emailVerified: true,
    passwordHash: 'admin123', // In production: properly hashed
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Mock login API call
   */
  const mockLoginApi = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    await mockApiDelay();

    // Find user by email
    const user = MOCK_USERS.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password (mock - in production use bcrypt)
    if (user.passwordHash !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateMockToken(user.id);

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
      },
      token,
      expiresIn: 15 * 60 * 1000, // 15 minutes
    };
  };

  /**
   * Mock register API call
   */
  const mockRegisterApi = async (data: RegisterData): Promise<AuthResponse> => {
    await mockApiDelay();

    // Check if user exists
    if (MOCK_USERS.some(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    if (MOCK_USERS.some(u => u.username === data.username)) {
      throw new Error('Username already taken');
    }

    // Create new user
    const userId = generateUserId();
    const passwordHash = await hashPassword(data.password);

    const newUser: User & { passwordHash: string } = {
      id: userId,
      email: data.email,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.STUDENT,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      passwordHash,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Generate token
    const token = generateMockToken(userId);

    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: 15 * 60 * 1000,
    };
  };

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await mockLoginApi(credentials);

      storeAuthData(response, credentials.rememberMe || false);

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!data.acceptTerms) {
        throw new Error('You must accept the terms and conditions');
      }

      const response = await mockRegisterApi(data);

      storeAuthData(response, false);

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearAuthData();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  /**
   * Update user profile
   */
  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...updates };

      // Update storage
      const storage = localStorage.getItem('auth_remember_me') ? localStorage : sessionStorage;
      storage.setItem('auth_user', JSON.stringify(updatedUser));

      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    const authData = getAuthData();

    if (!authData) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Check if token is expired
    if (isTokenExpired(authData.token)) {
      clearAuthData();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please login again.',
      });
      return;
    }

    // Check for inactivity
    if (isInactive()) {
      clearAuthData();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired due to inactivity.',
      });
      return;
    }

    // Restore auth state
    setState({
      user: authData.user,
      token: authData.token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    updateLastActivity();
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Set up activity tracking
   */
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      updateLastActivity();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      if (isInactive()) {
        logout();
      }
    }, 60 * 1000);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [state.isAuthenticated, logout]);

  /**
   * Set up token refresh
   */
  useEffect(() => {
    if (!state.isAuthenticated || !state.token) return;

    // Check token expiry every 5 minutes
    const tokenCheck = setInterval(() => {
      if (isTokenExpired(state.token!)) {
        logout();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(tokenCheck);
  }, [state.isAuthenticated, state.token, logout]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
