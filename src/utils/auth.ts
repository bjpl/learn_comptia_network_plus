/**
 * Authentication utility functions
 */

import type { PasswordStrength, User, AuthResponse } from '../types/auth';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  REMEMBER_ME: 'auth_remember_me',
  LAST_ACTIVITY: 'auth_last_activity',
} as const;

// Session configuration
export const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_INTERVAL: 14 * 60 * 1000, // 14 minutes (for 15min tokens)
} as const;

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Add at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Add at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Add at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    feedback.push('Add at least one special character');
  }

  // Common patterns check
  const commonPatterns = ['password', '12345', 'qwerty', 'admin'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common passwords');
  }

  return {
    score: Math.min(score, 4),
    feedback,
    isValid: score >= 3,
  };
};

/**
 * Generate a mock JWT token (for demo purposes)
 */
export const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 15 * 60 * 1000, // 15 minutes
    })
  );
  const signature = btoa(`mock_signature_${userId}_${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Decode mock JWT token
 */
export const decodeMockToken = (token: string): { exp: number; sub: string } | null => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeMockToken(token);
  if (!decoded) {return true;}
  return Date.now() > decoded.exp;
};

/**
 * Store auth data in localStorage or sessionStorage
 */
export const storeAuthData = (
  response: AuthResponse,
  rememberMe: boolean = false
): void => {
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(STORAGE_KEYS.TOKEN, response.token);
  storage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

  if (response.refreshToken) {
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
  }

  if (rememberMe) {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
  }

  updateLastActivity();
};

/**
 * Retrieve auth data from storage
 */
export const getAuthData = (): { user: User; token: string } | null => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN) ||
                sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  const userStr = localStorage.getItem(STORAGE_KEYS.USER) ||
                  sessionStorage.getItem(STORAGE_KEYS.USER);

  if (!token || !userStr) {return null;}

  try {
    const user = JSON.parse(userStr);
    return { user, token };
  } catch {
    return null;
  }
};

/**
 * Clear auth data from storage
 */
export const clearAuthData = (): void => {
  const keys = Object.values(STORAGE_KEYS);
  keys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = (): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
};

/**
 * Check if user has been inactive
 */
export const isInactive = (): boolean => {
  const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  if (!lastActivity) {return false;}

  const elapsed = Date.now() - parseInt(lastActivity, 10);
  return elapsed > SESSION_CONFIG.INACTIVITY_TIMEOUT;
};

/**
 * Hash password (mock implementation - would use bcrypt in production)
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Mock hashing - in production, this would be done server-side
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate user ID
 */
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Mock API delay
 */
export const mockApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Format user display name
 */
export const getUserDisplayName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || user.email;
};

/**
 * Get initials from user name
 */
export const getUserInitials = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
};
