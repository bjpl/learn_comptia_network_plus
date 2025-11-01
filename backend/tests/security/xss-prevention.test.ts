/**
 * XSS Prevention Tests
 * Verifies frontend sanitization functions prevent XSS attacks
 */

import {
  sanitizeHtmlBasic,
  sanitizeHtmlRich,
  stripHtml,
  sanitizeInput,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeSearchQuery,
  escapeHtml,
} from '../../../src/utils/security/sanitizer';

describe('XSS Prevention', () => {
  describe('HTML Sanitization - Basic', () => {
    test('should allow safe inline formatting', () => {
      const input = '<b>bold</b> and <i>italic</i>';
      const output = sanitizeHtmlBasic(input);

      expect(output).toContain('<b>bold</b>');
      expect(output).toContain('<i>italic</i>');
    });

    test('should remove script tags', () => {
      const input = '<script>alert("XSS")</script>';
      const output = sanitizeHtmlBasic(input);

      expect(output).not.toContain('<script>');
      expect(output).not.toContain('alert');
    });

    test('should remove onclick handlers', () => {
      const input = '<div onclick="alert(\'XSS\')">Click me</div>';
      const output = sanitizeHtmlBasic(input);

      expect(output).not.toContain('onclick');
      expect(output).not.toContain('alert');
    });

    test('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const output = sanitizeHtmlBasic(input);

      expect(output).not.toContain('javascript:');
      expect(output).not.toContain('alert');
    });

    test('should remove style attributes with expressions', () => {
      const input = '<div style="width:expression(alert(\'XSS\'))">test</div>';
      const output = sanitizeHtmlBasic(input);

      expect(output).not.toContain('expression');
      expect(output).not.toContain('alert');
    });

    test('should handle empty input', () => {
      expect(sanitizeHtmlBasic('')).toBe('');
      expect(sanitizeHtmlBasic(null as any)).toBe('');
      expect(sanitizeHtmlBasic(undefined as any)).toBe('');
    });
  });

  describe('HTML Sanitization - Rich', () => {
    test('should allow headings and lists', () => {
      const input = '<h1>Title</h1><ul><li>Item</li></ul>';
      const output = sanitizeHtmlRich(input);

      expect(output).toContain('<h1>');
      expect(output).toContain('<ul>');
      expect(output).toContain('<li>');
    });

    test('should allow safe links', () => {
      const input = '<a href="https://example.com">Link</a>';
      const output = sanitizeHtmlRich(input);

      expect(output).toContain('<a');
      expect(output).toContain('https://example.com');
    });

    test('should remove dangerous protocols in links', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Link</a>';
      const output = sanitizeHtmlRich(input);

      expect(output).not.toContain('javascript:');
    });

    test('should remove script tags', () => {
      const input = '<h1>Title</h1><script>alert("XSS")</script>';
      const output = sanitizeHtmlRich(input);

      expect(output).toContain('<h1>');
      expect(output).not.toContain('<script>');
    });
  });

  describe('Strip HTML', () => {
    test('should remove all HTML tags', () => {
      const input = '<b>bold</b> <i>italic</i> <script>alert("XSS")</script>';
      const output = stripHtml(input);

      expect(output).toBe('bold italic ');
      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
    });

    test('should preserve text content', () => {
      const input = '<p>Hello <b>World</b>!</p>';
      const output = stripHtml(input);

      expect(output).toContain('Hello');
      expect(output).toContain('World');
    });
  });

  describe('Plain Text Sanitization', () => {
    test('should remove angle brackets', () => {
      const input = 'Hello <script>alert("XSS")</script> World';
      const output = sanitizeInput(input);

      expect(output).toBe('Hello scriptalert("XSS")/script World');
      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
    });

    test('should remove control characters', () => {
      const input = 'Hello\x00\x01\x02World';
      const output = sanitizeInput(input);

      expect(output).toBe('HelloWorld');
    });

    test('should trim whitespace', () => {
      const input = '  Hello World  ';
      const output = sanitizeInput(input);

      expect(output).toBe('Hello World');
    });

    test('should respect max length', () => {
      const input = 'a'.repeat(2000);
      const output = sanitizeInput(input, 100);

      expect(output.length).toBe(100);
    });
  });

  describe('Email Sanitization', () => {
    test('should lowercase and trim email', () => {
      const input = '  Test@Example.COM  ';
      const output = sanitizeEmail(input);

      expect(output).toBe('test@example.com');
    });

    test('should remove dangerous characters', () => {
      const input = 'test<script>@example.com';
      const output = sanitizeEmail(input);

      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
      expect(output).not.toContain('script');
    });

    test('should enforce max length', () => {
      const input = 'a'.repeat(300) + '@example.com';
      const output = sanitizeEmail(input);

      expect(output.length).toBeLessThanOrEqual(254);
    });
  });

  describe('URL Sanitization', () => {
    test('should allow safe HTTP URLs', () => {
      const input = 'https://example.com';
      const output = sanitizeUrl(input);

      expect(output).toBe('https://example.com');
    });

    test('should remove javascript: protocol', () => {
      const input = 'javascript:alert("XSS")';
      const output = sanitizeUrl(input);

      expect(output).toBe('');
    });

    test('should remove data: protocol', () => {
      const input = 'data:text/html,<script>alert("XSS")</script>';
      const output = sanitizeUrl(input);

      expect(output).toBe('');
    });

    test('should remove vbscript: protocol', () => {
      const input = 'vbscript:msgbox("XSS")';
      const output = sanitizeUrl(input);

      expect(output).toBe('');
    });

    test('should add https:// if no protocol', () => {
      const input = 'example.com';
      const output = sanitizeUrl(input);

      expect(output).toBe('https://example.com');
    });

    test('should enforce max length', () => {
      const input = 'https://' + 'a'.repeat(600) + '.com';
      const output = sanitizeUrl(input);

      expect(output.length).toBeLessThanOrEqual(500);
    });
  });

  describe('Filename Sanitization', () => {
    test('should remove path traversal attempts', () => {
      const input = '../../../etc/passwd';
      const output = sanitizeFilename(input);

      expect(output).not.toContain('..');
      expect(output).not.toContain('/');
    });

    test('should replace dangerous characters', () => {
      const input = 'file<>name:test*?.txt';
      const output = sanitizeFilename(input);

      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
      expect(output).not.toContain(':');
      expect(output).not.toContain('*');
      expect(output).not.toContain('?');
    });

    test('should allow safe filenames', () => {
      const input = 'my-file_v2.txt';
      const output = sanitizeFilename(input);

      expect(output).toBe('my-file_v2.txt');
    });

    test('should enforce max length', () => {
      const input = 'a'.repeat(300) + '.txt';
      const output = sanitizeFilename(input);

      expect(output.length).toBeLessThanOrEqual(255);
    });
  });

  describe('Search Query Sanitization', () => {
    test('should normalize whitespace', () => {
      const input = 'hello    world   test';
      const output = sanitizeSearchQuery(input);

      expect(output).toBe('hello world test');
    });

    test('should remove angle brackets', () => {
      const input = 'search <script>alert()</script> query';
      const output = sanitizeSearchQuery(input);

      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
    });

    test('should respect max length', () => {
      const input = 'a'.repeat(300);
      const output = sanitizeSearchQuery(input);

      expect(output.length).toBeLessThanOrEqual(200);
    });
  });

  describe('HTML Entity Escaping', () => {
    test('should escape ampersand', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    test('should escape angle brackets', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
    });

    test('should escape quotes', () => {
      expect(escapeHtml('"Hello" \'World\'')).toBe('&quot;Hello&quot; &#x27;World&#x27;');
    });

    test('should escape forward slash', () => {
      expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;');
    });

    test('should handle empty input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });
});
