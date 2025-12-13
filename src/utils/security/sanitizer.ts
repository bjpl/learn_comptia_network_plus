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
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'a',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

export function stripHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

export function sanitizeInput(input: string, maxLength = 1000): string {
  if (!input) return '';
  // Remove control characters (0x00-0x1F except tab, newline, carriage return)
  // eslint-disable-next-line no-control-regex
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Trim whitespace
  cleaned = cleaned.trim();
  // Remove angle brackets instead of encoding
  cleaned = cleaned.replace(/[<>]/g, '');
  // Limit length
  return cleaned.substring(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._-]/g, '')
    .substring(0, 254); // RFC 5321 max length
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();

  // Block dangerous protocols (case-insensitive)
  const lowered = trimmed.toLowerCase();
  if (
    lowered.startsWith('javascript:') ||
    lowered.startsWith('data:') ||
    lowered.startsWith('vbscript:') ||
    lowered.startsWith('file:')
  ) {
    return '';
  }

  // Allow mailto: URLs
  if (lowered.startsWith('mailto:')) {
    return trimmed.substring(0, 500);
  }

  // Add https:// if no protocol
  if (!trimmed.match(/^https?:\/\//i)) {
    trimmed = 'https://' + trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    let result = parsed.href;
    // Remove trailing slash if original URL didn't have one and it's just the root
    if (!url.endsWith('/') && result.endsWith('/') && parsed.pathname === '/') {
      result = result.slice(0, -1);
    }
    return result.substring(0, 500);
  } catch {
    return '';
  }
}

export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  return filename
    .replace(/^\.+/, '') // Remove leading dots first (for hidden files like .htaccess)
    .replace(/\.\./g, '__') // Convert path traversal .. to underscores
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars (including / \ etc)
    .substring(0, 255); // Limit length
}

export function sanitizeLikePattern(pattern: string): string {
  if (!pattern) return '';
  return pattern.replace(/[%_\\]/g, '\\$&').substring(0, 100);
}

export function sanitizeJson(data: unknown): string | null {
  if (!data) return null;
  // If it's a string, try to parse and re-stringify to validate and normalize
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed);
    } catch {
      return null;
    }
  }
  // If it's already an object, stringify it
  try {
    return JSON.stringify(data);
  } catch {
    return null;
  }
}

export function escapeHtml(text: string): string {
  if (!text) return '';
  return text.replace(/[<>&"'/]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return entities[char] || char;
  });
}

export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  // Remove control characters including null bytes
  // eslint-disable-next-line no-control-regex
  let cleaned = query.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Remove angle brackets and quotes
  cleaned = cleaned.replace(/[<>'"]/g, '');
  // Normalize whitespace (multiple spaces to single space) and trim
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  // Limit length to 200
  return cleaned.substring(0, 200);
}

export function sanitizeNoteContent(content: string): string {
  return sanitizeHtmlRich(content);
}

export function sanitizeAssessmentAnswer(answer: string): string {
  if (!answer) return '';
  // Strip HTML tags and limit length for assessment answers
  return stripHtml(answer).substring(0, 5000);
}

// Default sanitizer for sanitizeObject - strips HTML and trims whitespace
function defaultObjectSanitizer(value: string): string {
  return stripHtml(value).trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  sanitizer?: (value: string) => string
): T {
  const applySanitizer = sanitizer || defaultObjectSanitizer;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = applySanitizer(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) => (typeof v === 'string' ? applySanitizer(v) : v));
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value as Record<string, unknown>, sanitizer);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
