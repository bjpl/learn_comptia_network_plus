/**
 * Security sanitization utilities
 * Prevents log injection, XSS, and other injection attacks
 */

/**
 * Sanitize a string for safe logging
 * Removes or escapes control characters and newlines that could be used for log injection
 */
export const sanitizeForLog = (input: unknown): string => {
  if (input === null || input === undefined) {
    return '[null]';
  }

  if (typeof input !== 'string') {
    try {
      input = String(input);
    } catch {
      return '[unserializable]';
    }
  }

  return (input as string)
    .replace(/[\r\n]/g, ' ')  // Replace newlines with spaces
    .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
    .replace(/[<>]/g, '')  // Remove potential HTML/XML tags
    .slice(0, 500);  // Limit length to prevent log flooding
};

/**
 * Sanitize an email for safe logging
 * Partially masks the email while keeping it identifiable
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '[invalid-email]';
  }

  const sanitized = sanitizeForLog(email);
  const parts = sanitized.split('@');

  if (parts.length !== 2) {
    return '[malformed-email]';
  }

  const [local, domain] = parts;
  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(Math.min(local.length - 2, 5)) + local[local.length - 1]
    : local;

  return `${maskedLocal}@${domain}`;
};

/**
 * Sanitize an object for safe logging
 * Recursively sanitizes all string values
 */
export const sanitizeObjectForLog = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeForLog(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObjectForLog(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
};

/**
 * Validate and sanitize a property key to prevent prototype pollution
 */
export const safePropertyAccess = <T>(
  obj: Record<string, T>,
  key: string,
  defaultValue: T
): T => {
  // Prevent prototype pollution
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  if (dangerousKeys.includes(key)) {
    return defaultValue;
  }

  // Only allow valid object keys
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    return defaultValue;
  }

  return obj[key];
};

export default {
  sanitizeForLog,
  sanitizeEmail,
  sanitizeObjectForLog,
  safePropertyAccess,
};
