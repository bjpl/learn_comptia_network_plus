/**
 * API Error Handling Utilities
 * Centralized error parsing, user-friendly messages, and retry strategies
 */

export enum ApiErrorCode {
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  OFFLINE = 'OFFLINE',

  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Authorization Errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Server Errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Client Errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  userMessage: string;
  statusCode?: number;
  details?: unknown;
  timestamp: string;
  retryable: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Parse API error response
 */
export const parseApiError = (error: unknown): ApiError => {
  const timestamp = new Date().toISOString();

  // Network error
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      code: ApiErrorCode.NETWORK_ERROR,
      message: 'Network request failed',
      userMessage: 'Unable to connect to the server. Please check your internet connection.',
      timestamp,
      retryable: true,
    };
  }

  // Timeout error
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      code: ApiErrorCode.TIMEOUT,
      message: 'Request timeout',
      userMessage: 'The request took too long. Please try again.',
      timestamp,
      retryable: true,
    };
  }

  // Axios-like error with response
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const data = error.response?.data;

    switch (statusCode) {
      case 401:
        return {
          code:
            data?.code === 'TOKEN_EXPIRED' ? ApiErrorCode.TOKEN_EXPIRED : ApiErrorCode.UNAUTHORIZED,
          message: data?.message || 'Unauthorized',
          userMessage:
            data?.code === 'TOKEN_EXPIRED'
              ? 'Your session has expired. Please log in again.'
              : 'Invalid credentials. Please check your email and password.',
          statusCode,
          timestamp,
          retryable: false,
        };

      case 403:
        return {
          code: ApiErrorCode.FORBIDDEN,
          message: data?.message || 'Forbidden',
          userMessage: 'You do not have permission to perform this action.',
          statusCode,
          timestamp,
          retryable: false,
        };

      case 404:
        return {
          code: ApiErrorCode.NOT_FOUND,
          message: data?.message || 'Not found',
          userMessage: 'The requested resource was not found.',
          statusCode,
          timestamp,
          retryable: false,
        };

      case 409:
        return {
          code: ApiErrorCode.CONFLICT,
          message: data?.message || 'Conflict',
          userMessage: data?.message || 'This resource already exists.',
          statusCode,
          timestamp,
          retryable: false,
        };

      case 422:
        return {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: data?.message || 'Validation error',
          userMessage: 'Please check your input and try again.',
          statusCode,
          details: data?.errors,
          timestamp,
          retryable: false,
        };

      case 429:
        return {
          code: ApiErrorCode.RATE_LIMITED,
          message: 'Rate limit exceeded',
          userMessage: 'Too many requests. Please wait a moment and try again.',
          statusCode,
          timestamp,
          retryable: true,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          code: statusCode === 503 ? ApiErrorCode.SERVICE_UNAVAILABLE : ApiErrorCode.SERVER_ERROR,
          message: data?.message || 'Server error',
          userMessage: 'A server error occurred. Please try again later.',
          statusCode,
          timestamp,
          retryable: true,
        };

      default:
        return {
          code: ApiErrorCode.UNKNOWN,
          message: data?.message || 'Unknown error',
          userMessage: 'An unexpected error occurred. Please try again.',
          statusCode,
          details: data,
          timestamp,
          retryable: false,
        };
    }
  }

  // Generic error
  if (error instanceof Error) {
    return {
      code: ApiErrorCode.UNKNOWN,
      message: error.message,
      userMessage: 'An unexpected error occurred. Please try again.',
      timestamp,
      retryable: false,
    };
  }

  // Unknown error type
  return {
    code: ApiErrorCode.UNKNOWN,
    message: 'Unknown error occurred',
    userMessage: 'An unexpected error occurred. Please try again.',
    details: error,
    timestamp,
    retryable: false,
  };
};

/**
 * Check if error is axios-like
 */
interface ErrorResponseData {
  code?: string;
  message?: string;
  errors?: unknown;
}

function isAxiosError(
  error: unknown
): error is { response?: { status?: number; data?: ErrorResponseData } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

/**
 * Type guard for validation error
 */
function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'field' in error &&
    'message' in error &&
    typeof (error as ValidationError).field === 'string' &&
    typeof (error as ValidationError).message === 'string'
  );
}

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors: unknown): Record<string, string> => {
  if (!errors || typeof errors !== 'object') {
    return {};
  }

  const formatted: Record<string, string> = {};

  if (Array.isArray(errors)) {
    // Array of validation errors
    errors.forEach((error: unknown) => {
      if (isValidationError(error)) {
        formatted[error.field] = error.message;
      }
    });
  } else {
    // Object with field: message pairs
    Object.entries(errors).forEach(([field, message]) => {
      if (typeof message === 'string') {
        formatted[field] = message;
      } else if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'string') {
        formatted[field] = message[0];
      }
    });
  }

  return formatted;
};

/**
 * Determine if error should trigger a retry
 */
export const shouldRetry = (error: ApiError, attemptCount: number, maxRetries: number): boolean => {
  if (attemptCount >= maxRetries) {
    return false;
  }

  return error.retryable;
};

/**
 * Calculate retry delay with exponential backoff
 */
export const calculateRetryDelay = (attemptCount: number, baseDelay: number = 1000): number => {
  return Math.min(baseDelay * Math.pow(2, attemptCount), 10000);
};

/**
 * Log error for debugging
 */
export const logError = (error: ApiError, context?: string): void => {
  if (import.meta.env.DEV) {
    console.error(`🔴 API Error ${context ? `(${context})` : ''}`, {
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: error.timestamp,
      retryable: error.retryable,
    });
  }
};

/**
 * Create user-friendly error message
 */
export const getUserFriendlyMessage = (
  error: unknown,
  fallback: string = 'An error occurred'
): string => {
  const apiError = parseApiError(error);
  return apiError.userMessage || fallback;
};
