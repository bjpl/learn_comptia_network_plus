/**
 * Input Sanitization Utilities
 * XSS prevention and input cleaning functions
 */

import DOMPurify from 'dompurify';

/**
 * DOMPurify configuration for different contexts
 */
const ALLOWED_TAGS_BASIC = ['b', 'i', 'em', 'strong', 'u', 'br', 'p'];
const ALLOWED_TAGS_RICH = [
  'b',
  'i',
  'em',
  'strong',
  'u',
  'br',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'code',
  'pre',
  'blockquote',
  'a',
  'span',
  'div',
];
const ALLOWED_ATTR_BASIC: string[] = [];
const ALLOWED_ATTR_RICH = ['href', 'title', 'target', 'rel', 'class'];

/**
 * Sanitize HTML content with basic formatting
 * Allows only safe inline formatting tags
 */
export const sanitizeHtmlBasic = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ALLOWED_TAGS_BASIC,
    ALLOWED_ATTR: ALLOWED_ATTR_BASIC,
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  });
};

/**
 * Sanitize HTML content with rich formatting
 * Allows more tags for user-generated content like notes
 */
export const sanitizeHtmlRich = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ALLOWED_TAGS_RICH,
    ALLOWED_ATTR: ALLOWED_ATTR_RICH,
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    ADD_ATTR: ['target'],
  });
};

/**
 * Strip all HTML tags from content
 * Use for plain text contexts
 */
export const stripHtml = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

/**
 * Sanitize plain text input
 * Removes dangerous characters and trims content
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .slice(0, maxLength)
  );
};

/**
 * Sanitize email address
 * Basic sanitization, should be used with validation
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email
    .toLowerCase()
    .trim()
    .replace(/[<>'"]/g, '')
    .slice(0, 254); // RFC 5321 max email length
};

/**
 * Sanitize URL
 * Removes dangerous protocols and malformed URLs
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }

  // Allow only http, https, mailto
  if (!lowerUrl.match(/^(https?:\/\/|mailto:)/)) {
    // If no protocol, assume https
    if (!lowerUrl.includes(':')) {
      return `https://${trimmed}`;
    }
    return '';
  }

  return trimmed.slice(0, 500);
};

/**
 * Sanitize filename
 * Removes path traversal and dangerous characters
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  return filename
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace dangerous chars with underscore
    .replace(/\.\./g, '_') // Prevent path traversal
    .replace(/^\.+/, '') // Remove leading dots
    .slice(0, 255); // Max filename length
};

/**
 * Sanitize SQL LIKE pattern
 * Escapes special characters for SQL LIKE queries
 */
export const sanitizeLikePattern = (pattern: string): string => {
  if (!pattern || typeof pattern !== 'string') {
    return '';
  }

  return pattern
    .replace(/[%_\\]/g, '\\$&') // Escape LIKE wildcards
    .slice(0, 100);
};

/**
 * Sanitize JSON string
 * Validates and sanitizes JSON input
 */
export const sanitizeJson = (jsonString: string): string | null => {
  if (!jsonString || typeof jsonString !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonString);
    // Re-stringify to ensure clean JSON
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
};

/**
 * Escape HTML entities
 * Use when you need to display user input as text
 */
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
};

/**
 * Sanitize search query
 * Special handling for search inputs
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query || typeof query !== 'string') {
    return '';
  }

  return (
    query
      .trim()
      .replace(/[<>]/g, '')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .slice(0, 200)
  ); // Reasonable search query length
};

/**
 * Sanitize user note content
 * For user-generated notes with rich text
 */
export const sanitizeNoteContent = (content: string): string => {
  return sanitizeHtmlRich(content);
};

/**
 * Sanitize assessment answer
 * For quiz/assessment text answers
 */
export const sanitizeAssessmentAnswer = (answer: string): string => {
  return sanitizeInput(answer, 5000); // Allow longer answers
};

/**
 * Batch sanitization for objects
 * Sanitizes all string values in an object
 */
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  sanitizer: (value: string) => string = sanitizeInput
): T => {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizer(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => (typeof item === 'string' ? sanitizer(item) : item));
    } else if (value !== null && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, sanitizer);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};
