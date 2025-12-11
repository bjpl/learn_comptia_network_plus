/**
 * API Configuration
 * Centralized configuration for API endpoints, timeouts, and retry policies
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api',
  TIMEOUT: parseInt((import.meta.env.VITE_API_TIMEOUT as string | undefined) || '10000', 10),

  // Environment
  ENV: (import.meta.env.VITE_ENV as string | undefined) || 'development',
  IS_PRODUCTION: Boolean(import.meta.env.PROD),
  IS_DEVELOPMENT: Boolean(import.meta.env.DEV),

  // Retry Policy
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // ms
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  },

  // Token Configuration
  TOKEN: {
    ACCESS_TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'auth_refresh_token',
    TOKEN_EXPIRY_BUFFER: 60000, // 1 minute before expiry
  },

  // Request Configuration
  REQUEST: {
    HEADERS: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },

  // Users
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/password',
    UPLOAD_AVATAR: '/users/avatar',
    SETTINGS: '/users/settings',
  },

  // Progress
  PROGRESS: {
    GET_ALL: '/progress',
    GET_COMPONENT: (componentId: string) => `/progress/component/${componentId}`,
    UPDATE_COMPONENT: (componentId: string) => `/progress/component/${componentId}`,
    SYNC: '/progress/sync',
    RESET: '/progress/reset',
  },

  // Assessments
  ASSESSMENT: {
    GET_QUIZ: (quizId: string) => `/assessments/quiz/${quizId}`,
    SUBMIT_ANSWER: (quizId: string) => `/assessments/quiz/${quizId}/submit`,
    GET_RESULTS: (attemptId: string) => `/assessments/results/${attemptId}`,
    GET_ATTEMPTS: '/assessments/attempts',
  },

  // Learning Content
  CONTENT: {
    GET_MODULE: (moduleId: string) => `/content/module/${moduleId}`,
    GET_LESSON: (lessonId: string) => `/content/lesson/${lessonId}`,
    SEARCH: '/content/search',
  },
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  ENABLE_OFFLINE_MODE: true,
  ENABLE_REQUEST_LOGGING: API_CONFIG.IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_TRACKING: true,
  // Disable network calls for static GitHub Pages deployment
  DISABLE_NETWORK_CALLS: import.meta.env.PROD || import.meta.env.VITE_STATIC_DEPLOY === 'true',
} as const;

/**
 * Get full URL for endpoint
 */
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Check if should use mock API
 * Returns true when:
 * - USE_MOCK_API flag is set
 * - Running in test environment
 * - Network calls are disabled (production/static deployment)
 */
export const shouldUseMockAPI = (): boolean => {
  return FEATURE_FLAGS.USE_MOCK_API || FEATURE_FLAGS.DISABLE_NETWORK_CALLS || API_CONFIG.ENV === 'test';
};
