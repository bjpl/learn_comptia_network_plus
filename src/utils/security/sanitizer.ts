/**
 * Input Sanitization Utilities
 * XSS prevention and input cleaning
 */

import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtmlBasic(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeHtmlRich(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'code', 'pre'],
    ALLOWED_ATTR: ['href'],
  });
}

export function stripHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.replace(/[<>'"&]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    };
    return entities[char] || char;
  });
}

export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._-]/g, '');
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return '';
  }
}

export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .substring(0, 255); // Limit length
}

export function sanitizeLikePattern(pattern: string): string {
  if (!pattern) return '';
  return pattern.replace(/[%_\\]/g, '\\$&');
}

export function sanitizeJson(data: unknown): unknown {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeJson);
  }
  if (data && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeJson(value);
    }
    return result;
  }
  return data;
}

export function escapeHtml(text: string): string {
  return sanitizeInput(text);
}

export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  return query.trim().replace(/[<>'"]/g, '');
}

export function sanitizeNoteContent(content: string): string {
  return sanitizeHtmlRich(content);
}

export function sanitizeAssessmentAnswer(answer: string): string {
  return sanitizeInput(answer);
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  sanitizer?: (value: string) => string
): T {
  const defaultSanitizer = sanitizer || sanitizeInput;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = defaultSanitizer(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) => (typeof v === 'string' ? defaultSanitizer(v) : v));
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value as Record<string, unknown>, sanitizer);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
