/**
 * Unit Tests - Authentication Utilities
 * Comprehensive tests for token management, session handling, and security features
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { User, AuthResponse } from '../../../src/types/auth';
import {
  STORAGE_KEYS,
  SESSION_CONFIG,
  validateEmail,
  validatePasswordStrength,
  generateMockToken,
  decodeMockToken,
  isTokenExpired,
  storeAuthData,
  getAuthData,
  clearAuthData,
  updateLastActivity,
  isInactive,
  hashPassword,
  generateUserId,
  getUserDisplayName,
  getUserInitials,
} from '../../../src/utils/auth';

describe('Authentication Utilities', () => {
  // Setup and teardown
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ============================================================================
  // Email Validation Tests
  // ============================================================================

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('admin+tag@company.com')).toBe(true);
      expect(validateEmail('user123@test-domain.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user @domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('a@b.c')).toBe(true); // Minimal valid
      expect(validateEmail('user..name@domain.com')).toBe(true); // Double dots (technically allowed)
      expect(validateEmail('user@domain..com')).toBe(true); // Passes basic regex
    });
  });

  // ============================================================================
  // Password Strength Validation Tests
  // ============================================================================

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords with perfect score', () => {
      const result = validatePasswordStrength('SecureP@ssw0rd!');
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should reject weak passwords with helpful feedback', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.score).toBeLessThan(3);
      expect(result.feedback.length).toBeGreaterThan(0);
      expect(result.feedback).toContain('Password must be at least 8 characters long');
    });

    it('should penalize common passwords', () => {
      const result = validatePasswordStrength('Password123!');
      expect(result.feedback).toContain('Avoid common passwords');
      expect(result.score).toBeLessThan(4);
    });

    it('should provide specific feedback for missing requirements', () => {
      const result = validatePasswordStrength('lowercase123');
      expect(result.feedback).toContain('Add at least one uppercase letter');
      expect(result.feedback).toContain('Add at least one special character');
    });

    it('should handle all requirement checks', () => {
      // Missing uppercase
      let result = validatePasswordStrength('lowercase123!');
      expect(result.feedback).toContain('Add at least one uppercase letter');

      // Missing lowercase
      result = validatePasswordStrength('UPPERCASE123!');
      expect(result.feedback).toContain('Add at least one lowercase letter');

      // Missing number
      result = validatePasswordStrength('PasswordOnly!');
      expect(result.feedback).toContain('Add at least one number');

      // Missing special character
      result = validatePasswordStrength('Password123');
      expect(result.feedback).toContain('Add at least one special character');
    });

    it('should detect multiple common patterns', () => {
      expect(validatePasswordStrength('Admin12345!').feedback).toContain('Avoid common passwords');
      expect(validatePasswordStrength('Qwerty123!').feedback).toContain('Avoid common passwords');
    });
  });

  // ============================================================================
  // Token Generation and Validation Tests
  // ============================================================================

  describe('generateMockToken', () => {
    it('should generate valid JWT-like token', () => {
      const token = generateMockToken('user123');
      expect(token).toMatch(/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$/);
    });

    it('should generate unique tokens for different users', () => {
      const token1 = generateMockToken('user1');
      const token2 = generateMockToken('user2');
      expect(token1).not.toBe(token2);
    });

    it('should include user ID in payload', () => {
      const userId = 'test-user-123';
      const token = generateMockToken(userId);
      const decoded = decodeMockToken(token);
      expect(decoded?.sub).toBe(userId);
    });

    it('should set expiration time correctly', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const token = generateMockToken('user123');
      const decoded = decodeMockToken(token);

      expect(decoded?.exp).toBeGreaterThan(now);
      expect(decoded?.exp).toBeLessThanOrEqual(now + 15 * 60 * 1000);
    });
  });

  describe('decodeMockToken', () => {
    it('should decode valid token correctly', () => {
      const userId = 'user456';
      const token = generateMockToken(userId);
      const decoded = decodeMockToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe(userId);
      expect(typeof decoded?.exp).toBe('number');
    });

    it('should return null for invalid tokens', () => {
      expect(decodeMockToken('invalid.token')).toBeNull();
      expect(decodeMockToken('not-a-token')).toBeNull();
      expect(decodeMockToken('')).toBeNull();
      expect(decodeMockToken('a.b.c')).toBeNull();
    });

    it('should handle malformed payloads', () => {
      const malformedToken = 'header.invalidbase64!@#.signature';
      expect(decodeMockToken(malformedToken)).toBeNull();
    });

    it('should validate payload structure', () => {
      // Token with missing fields
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ sub: 'user123' })); // Missing exp
      const signature = btoa('signature');
      const token = `${header}.${payload}.${signature}`;

      expect(decodeMockToken(token)).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const token = generateMockToken('user123');
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const token = generateMockToken('user123');

      // Advance time by 20 minutes (token expires in 15)
      vi.setSystemTime(now + 20 * 60 * 1000);
      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
      expect(isTokenExpired('')).toBe(true);
    });

    it('should handle edge case at exact expiration time', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const token = generateMockToken('user123');
      const decoded = decodeMockToken(token);

      // Set time to exactly expiration
      vi.setSystemTime(decoded!.exp + 1);
      expect(isTokenExpired(token)).toBe(true);
    });
  });

  // ============================================================================
  // Storage Management Tests
  // ============================================================================

  describe('storeAuthData', () => {
    const mockUser: User = {
      id: 'user123',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'student' as any,
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };

    const mockAuthResponse: AuthResponse = {
      user: mockUser,
      token: 'mock.token.here',
      refreshToken: 'refresh.token.here',
      expiresIn: 900,
    };

    it('should store data in sessionStorage by default', () => {
      storeAuthData(mockAuthResponse);

      expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBe(mockAuthResponse.token);
      expect(sessionStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(mockUser));
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    });

    it('should store data in localStorage when rememberMe is true', () => {
      storeAuthData(mockAuthResponse, true);

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe(mockAuthResponse.token);
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(mockUser));
      expect(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)).toBe('true');
    });

    it('should store refresh token if provided', () => {
      storeAuthData(mockAuthResponse, false);
      expect(sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe(mockAuthResponse.refreshToken);
    });

    it('should update last activity timestamp', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      storeAuthData(mockAuthResponse);
      expect(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)).toBe(now.toString());
    });
  });

  describe('getAuthData', () => {
    const mockUser: User = {
      id: 'user123',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'student' as any,
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };

    it('should retrieve data from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      const result = getAuthData();
      expect(result).not.toBeNull();
      expect(result?.token).toBe('test-token');
      expect(result?.user).toEqual(mockUser);
    });

    it('should retrieve data from sessionStorage', () => {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, 'session-token');
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      const result = getAuthData();
      expect(result).not.toBeNull();
      expect(result?.token).toBe('session-token');
    });

    it('should return null when no data exists', () => {
      expect(getAuthData()).toBeNull();
    });

    it('should return null for malformed user data', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
      localStorage.setItem(STORAGE_KEYS.USER, 'invalid-json');
      expect(getAuthData()).toBeNull();
    });

    it('should validate user object structure', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ invalid: 'object' }));
      expect(getAuthData()).toBeNull();
    });

    it('should prefer localStorage over sessionStorage', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'local-token');
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, 'session-token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      const result = getAuthData();
      expect(result?.token).toBe('local-token');
    });
  });

  describe('clearAuthData', () => {
    it('should clear all auth data from both storages', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'token');
      localStorage.setItem(STORAGE_KEYS.USER, 'user');
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh');
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, '123456');

      sessionStorage.setItem(STORAGE_KEYS.TOKEN, 'token');
      sessionStorage.setItem(STORAGE_KEYS.USER, 'user');

      clearAuthData();

      Object.values(STORAGE_KEYS).forEach((key) => {
        expect(localStorage.getItem(key)).toBeNull();
        expect(sessionStorage.getItem(key)).toBeNull();
      });
    });

    it('should not affect other localStorage items', () => {
      localStorage.setItem('other-key', 'other-value');
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'token');

      clearAuthData();

      expect(localStorage.getItem('other-key')).toBe('other-value');
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    });
  });

  // ============================================================================
  // Session Activity Tests
  // ============================================================================

  describe('updateLastActivity', () => {
    it('should update last activity timestamp', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      updateLastActivity();
      expect(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)).toBe(now.toString());
    });

    it('should overwrite previous timestamp', () => {
      const time1 = 1000000;
      const time2 = 2000000;

      vi.setSystemTime(time1);
      updateLastActivity();
      expect(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)).toBe(time1.toString());

      vi.setSystemTime(time2);
      updateLastActivity();
      expect(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)).toBe(time2.toString());
    });
  });

  describe('isInactive', () => {
    it('should return false when no activity recorded', () => {
      expect(isInactive()).toBe(false);
    });

    it('should return false for recent activity', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      updateLastActivity();

      // Advance time by 10 minutes (less than 30 minute timeout)
      vi.setSystemTime(now + 10 * 60 * 1000);
      expect(isInactive()).toBe(false);
    });

    it('should return true after inactivity timeout', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      updateLastActivity();

      // Advance time by 35 minutes (more than 30 minute timeout)
      vi.setSystemTime(now + 35 * 60 * 1000);
      expect(isInactive()).toBe(true);
    });

    it('should use SESSION_CONFIG.INACTIVITY_TIMEOUT', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      updateLastActivity();

      // Exactly at timeout threshold
      vi.setSystemTime(now + SESSION_CONFIG.INACTIVITY_TIMEOUT + 1);
      expect(isInactive()).toBe(true);
    });
  });

  // ============================================================================
  // Security Utility Tests
  // ============================================================================

  describe('hashPassword', () => {
    it('should hash password consistently', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 hex chars
    });

    it('should produce different hashes for different passwords', async () => {
      const hash1 = await hashPassword('password1');
      const hash2 = await hashPassword('password2');

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const hash = await hashPassword('');
      expect(hash).toHaveLength(64);
    });

    it('should handle special characters', async () => {
      const hash = await hashPassword('!@#$%^&*()_+-={}[]|\\:";\'<>?,./');
      expect(hash).toHaveLength(64);
    });
  });

  describe('generateUserId', () => {
    it('should generate unique user IDs', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();

      expect(id1).not.toBe(id2);
    });

    it('should have expected format', () => {
      const id = generateUserId();
      expect(id).toMatch(/^user_\d+_[a-z0-9]{9}$/);
    });

    it('should include timestamp', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const id = generateUserId();
      expect(id).toContain(`user_${now}_`);
    });
  });

  // ============================================================================
  // User Display Utility Tests
  // ============================================================================

  describe('getUserDisplayName', () => {
    it('should use first and last name when available', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserDisplayName(user)).toBe('John Doe');
    });

    it('should use username when names not available', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'cooluser',
        firstName: '',
        lastName: '',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserDisplayName(user)).toBe('cooluser');
    });

    it('should fall back to email', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: '',
        firstName: '',
        lastName: '',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserDisplayName(user)).toBe('test@example.com');
    });
  });

  describe('getUserInitials', () => {
    it('should use first letters of first and last name', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserInitials(user)).toBe('JD');
    });

    it('should use first two letters of username', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'cooluser',
        firstName: '',
        lastName: '',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserInitials(user)).toBe('CO');
    });

    it('should fall back to email', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: '',
        firstName: '',
        lastName: '',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserInitials(user)).toBe('TE');
    });

    it('should uppercase initials', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'ab',
        firstName: '',
        lastName: '',
        role: 'student' as any,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      expect(getUserInitials(user)).toBe('AB');
    });
  });
});
