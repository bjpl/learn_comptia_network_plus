/**
 * API Integration Tests
 * Tests for API client and service layer integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '../../src/services/api-client';
import * as authService from '../../src/services/auth-service';
import * as userService from '../../src/services/user-service';
import * as progressService from '../../src/services/progress-service';
import * as assessmentService from '../../src/services/assessment-service';
import { UserRole } from '../../src/types/auth';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Request Handling', () => {
    it('should make GET request successfully', async () => {
      const mockData = { message: 'success' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      });

      const response = await apiClient.get('/test');

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should make POST request with body', async () => {
      const mockData = { id: '123' };
      const postBody = { name: 'test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      });

      const response = await apiClient.post('/test', postBody);

      expect(response.status).toBe(201);
      expect(response.data).toEqual(mockData);
    });

    it('should include auth token in headers', async () => {
      localStorage.setItem('auth_token', 'test-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await apiClient.get('/protected');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
        retryable: true,
      });
    });

    it('should handle timeout errors', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 20000))
      );

      await expect(
        apiClient.get('/test', { timeout: 100 })
      ).rejects.toMatchObject({
        code: 'TIMEOUT',
      });
    });
  });

  describe('Error Handling', () => {
    it('should parse 401 error correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        }),
      });

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
    });

    it('should parse validation errors correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 422,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Validation error',
          errors: {
            email: 'Invalid email format',
            password: 'Password too short',
          },
        }),
      });

      await expect(apiClient.post('/test', {})).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
        statusCode: 422,
      });
    });
  });
});

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Login', () => {
    it('should login successfully with demo credentials', async () => {
      const credentials = {
        email: 'demo@comptia.test',
        password: 'demo123',
        rememberMe: false,
      };

      const result = await authService.login(credentials);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(credentials.email);
      expect(result.token).toBeDefined();
      expect(sessionStorage.getItem('auth_token')).toBe(result.token);
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'invalid@test.com',
        password: 'wrong',
        rememberMe: false,
      };

      await expect(authService.login(credentials)).rejects.toMatchObject({
        response: {
          status: 401,
        },
      });
    });

    it('should store token in localStorage when rememberMe is true', async () => {
      const credentials = {
        email: 'demo@comptia.test',
        password: 'demo123',
        rememberMe: true,
      };

      await authService.login(credentials);

      expect(localStorage.getItem('auth_token')).toBeDefined();
      expect(localStorage.getItem('auth_remember_me')).toBe('true');
    });
  });

  describe('Register', () => {
    it('should register new user successfully', async () => {
      const userData = {
        email: 'newuser@test.com',
        username: 'newuser',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'New',
        lastName: 'User',
        acceptTerms: true,
      };

      const result = await authService.register(userData);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.role).toBe(UserRole.STUDENT);
      expect(result.token).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'demo@comptia.test',
        username: 'duplicate',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Duplicate',
        lastName: 'User',
        acceptTerms: true,
      };

      await expect(authService.register(userData)).rejects.toMatchObject({
        response: {
          status: 409,
        },
      });
    });

    it('should reject password mismatch', async () => {
      const userData = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      };

      await expect(authService.register(userData)).rejects.toMatchObject({
        response: {
          status: 422,
        },
      });
    });
  });

  describe('Logout', () => {
    it('should clear auth data on logout', async () => {
      // Login first
      await authService.login({
        email: 'demo@comptia.test',
        password: 'demo123',
        rememberMe: false,
      });

      expect(sessionStorage.getItem('auth_token')).toBeDefined();

      // Logout
      await authService.logout();

      expect(sessionStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_user')).toBeNull();
    });
  });
});

describe('Progress Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should update component progress', async () => {
    const componentId = 'network-fundamentals';
    const progress = {
      timeSpent: 300,
      completed: false,
    };

    const result = await progressService.updateComponentProgress(componentId, progress);

    expect(result.componentId).toBe(componentId);
    expect(result.timeSpent).toBe(300);
  });

  it('should get all progress', async () => {
    // Add some progress
    await progressService.updateComponentProgress('comp1', { timeSpent: 100 });
    await progressService.updateComponentProgress('comp2', { timeSpent: 200 });

    const allProgress = await progressService.getAllProgress();

    expect(Object.keys(allProgress).length).toBeGreaterThanOrEqual(2);
  });

  it('should calculate category progress correctly', async () => {
    const allProgress = {
      'cat1-comp1': {
        componentId: 'cat1-comp1',
        completed: true,
        score: 90,
        timeSpent: 100,
        lastVisited: new Date().toISOString(),
        attempts: 1,
      },
      'cat1-comp2': {
        componentId: 'cat1-comp2',
        completed: false,
        timeSpent: 50,
        lastVisited: new Date().toISOString(),
        attempts: 0,
      },
    };

    const categoryProgress = progressService.getCategoryProgress(allProgress, 'cat1');

    expect(categoryProgress.categoryId).toBe('cat1');
    expect(categoryProgress.componentsCompleted).toBe(1);
    expect(categoryProgress.totalComponents).toBe(2);
  });
});

describe('Assessment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should get quiz by ID', async () => {
    const quiz = await assessmentService.getQuiz('network-fundamentals');

    expect(quiz).toBeDefined();
    expect(quiz.id).toBe('network-fundamentals');
    expect(quiz.questions).toBeInstanceOf(Array);
    expect(quiz.questions.length).toBeGreaterThan(0);
  });

  it('should submit quiz and calculate score', async () => {
    const quizId = 'network-fundamentals';
    const quiz = await assessmentService.getQuiz(quizId);

    const submission = {
      quizId,
      answers: quiz.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: q.correctAnswer, // All correct
        timeSpent: 30,
      })),
      totalTime: quiz.questions.length * 30,
      completedAt: new Date().toISOString(),
    };

    const result = await assessmentService.submitQuiz(submission);

    expect(result).toBeDefined();
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.correctAnswers).toBe(quiz.questions.length);
  });

  it('should store quiz attempts', async () => {
    const quizId = 'network-fundamentals';
    const quiz = await assessmentService.getQuiz(quizId);

    const submission = {
      quizId,
      answers: quiz.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: 0, // All wrong
        timeSpent: 20,
      })),
      totalTime: quiz.questions.length * 20,
      completedAt: new Date().toISOString(),
    };

    await assessmentService.submitQuiz(submission);

    const attempts = await assessmentService.getQuizAttempts();

    expect(attempts.length).toBeGreaterThan(0);
    expect(attempts[0].quizId).toBe(quizId);
  });
});

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    // Login to have a user session
    authService.login({
      email: 'demo@comptia.test',
      password: 'demo123',
      rememberMe: false,
    });
  });

  it('should get user profile', async () => {
    const profile = await userService.getUserProfile();

    expect(profile).toBeDefined();
    expect(profile.email).toBeDefined();
  });

  it('should update user profile', async () => {
    const updates = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    const updatedProfile = await userService.updateUserProfile(updates);

    expect(updatedProfile.firstName).toBe(updates.firstName);
    expect(updatedProfile.lastName).toBe(updates.lastName);
  });

  it('should get user settings', async () => {
    const settings = await userService.getUserSettings();

    expect(settings).toBeDefined();
    expect(settings.theme).toBeDefined();
    expect(settings.emailNotifications).toBeDefined();
  });

  it('should update user settings', async () => {
    const newSettings = {
      theme: 'dark' as const,
      emailNotifications: false,
    };

    const updatedSettings = await userService.updateUserSettings(newSettings);

    expect(updatedSettings.theme).toBe('dark');
    expect(updatedSettings.emailNotifications).toBe(false);
  });
});
