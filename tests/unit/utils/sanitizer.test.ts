/**
 * Unit Tests - Input Sanitization Utilities
 * Comprehensive XSS prevention and input cleaning tests
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeHtmlBasic,
  sanitizeHtmlRich,
  stripHtml,
  sanitizeInput,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeLikePattern,
  sanitizeJson,
  escapeHtml,
  sanitizeSearchQuery,
  sanitizeNoteContent,
  sanitizeAssessmentAnswer,
  sanitizeObject,
} from '../../../src/utils/security/sanitizer';

describe('Input Sanitization Utilities', () => {
  // ============================================================================
  // HTML Sanitization Tests
  // ============================================================================

  describe('sanitizeHtmlBasic', () => {
    it('should allow safe inline formatting tags', () => {
      const input = '<b>Bold</b> <i>Italic</i> <strong>Strong</strong> <em>Emphasis</em>';
      const result = sanitizeHtmlBasic(input);

      expect(result).toContain('<b>Bold</b>');
      expect(result).toContain('<i>Italic</i>');
      expect(result).toContain('<strong>Strong</strong>');
      expect(result).toContain('<em>Emphasis</em>');
    });

    it('should remove script tags and prevent XSS', () => {
      const attacks = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror="alert(1)">',
        '<svg onload="alert(1)">',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<object data="javascript:alert(1)">',
        '<embed src="javascript:alert(1)">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHtmlBasic(attack);
        expect(result).not.toContain('alert');
        expect(result).not.toContain('script');
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
      });
    });

    it('should remove event handlers', () => {
      const input = '<p onclick="alert(1)">Click me</p>';
      const result = sanitizeHtmlBasic(input);

      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });

    it('should handle empty and null inputs', () => {
      expect(sanitizeHtmlBasic('')).toBe('');
      expect(sanitizeHtmlBasic(null as any)).toBe('');
      expect(sanitizeHtmlBasic(undefined as any)).toBe('');
    });

    it('should preserve text content while removing dangerous tags', () => {
      const input = '<script>dangerous</script>Safe text<img src=x onerror=alert(1)>more text';
      const result = sanitizeHtmlBasic(input);

      expect(result).toContain('Safe text');
      expect(result).toContain('more text');
      expect(result).not.toContain('script');
      expect(result).not.toContain('img');
    });

    it('should handle nested tags correctly', () => {
      const input = '<p><b><i>Nested formatting</i></b></p>';
      const result = sanitizeHtmlBasic(input);

      expect(result).toContain('<b>');
      expect(result).toContain('<i>');
    });

    it('should remove data URLs and javascript: protocols', () => {
      const attacks = [
        '<a href="javascript:alert(1)">link</a>',
        '<a href="data:text/html,<script>alert(1)</script>">link</a>',
        '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHtmlBasic(attack);
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('data:');
      });
    });
  });

  describe('sanitizeHtmlRich', () => {
    it('should allow rich formatting tags', () => {
      const input = '<h1>Heading</h1><p>Paragraph</p><ul><li>Item</li></ul><code>code</code>';
      const result = sanitizeHtmlRich(input);

      expect(result).toContain('<h1>');
      expect(result).toContain('<p>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
      expect(result).toContain('<code>');
    });

    it('should allow safe links with proper attributes', () => {
      const input = '<a href="https://example.com" title="Example">Link</a>';
      const result = sanitizeHtmlRich(input);

      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('title="Example"');
    });

    it('should still prevent XSS in rich content', () => {
      const attacks = [
        '<h1 onclick="alert(1)">Heading</h1>',
        '<a href="javascript:alert(1)">link</a>',
        '<div><script>alert(1)</script></div>',
      ];

      attacks.forEach((attack) => {
        const result = sanitizeHtmlRich(attack);
        expect(result).not.toContain('alert');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('onclick');
      });
    });

    it('should allow blockquotes and pre tags', () => {
      const input = '<blockquote>Quote</blockquote><pre>Preformatted</pre>';
      const result = sanitizeHtmlRich(input);

      expect(result).toContain('<blockquote>');
      expect(result).toContain('<pre>');
    });
  });

  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      const input = '<p>This is <b>bold</b> and <i>italic</i> text</p>';
      const result = stripHtml(input);

      expect(result).toBe('This is bold and italic text');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should preserve text content', () => {
      const input = '<div><span>Text 1</span> <span>Text 2</span></div>';
      const result = stripHtml(input);

      expect(result).toContain('Text 1');
      expect(result).toContain('Text 2');
    });

    it('should handle complex nested structures', () => {
      const input = '<html><body><div><p><span>Deep nesting</span></p></div></body></html>';
      const result = stripHtml(input);

      expect(result).toBe('Deep nesting');
    });

    it('should handle empty input', () => {
      expect(stripHtml('')).toBe('');
      expect(stripHtml(null as any)).toBe('');
    });
  });

  // ============================================================================
  // Plain Text Sanitization Tests
  // ============================================================================

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
      expect(sanitizeInput('\n\tspaced\n\t')).toBe('spaced');
    });

    it('should remove angle brackets', () => {
      expect(sanitizeInput('test<script>alert(1)</script>')).toBe('testscriptalert(1)/script');
      expect(sanitizeInput('<b>text</b>')).toBe('btext/b');
    });

    it('should remove control characters', () => {
      const input = 'text\x00\x01\x02\x03with\x0Bcontrol\x0Cchars';
      const result = sanitizeInput(input);

      expect(result).toBe('textwithcontrolchars');
    });

    it('should respect max length', () => {
      const longText = 'a'.repeat(2000);
      const result = sanitizeInput(longText, 100);

      expect(result.length).toBe(100);
    });

    it('should use default max length of 1000', () => {
      const longText = 'a'.repeat(2000);
      const result = sanitizeInput(longText);

      expect(result.length).toBe(1000);
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null as any)).toBe('');
    });

    it('should preserve safe special characters', () => {
      expect(sanitizeInput('test@example.com')).toBe('test@example.com');
      expect(sanitizeInput('Hello, World!')).toBe('Hello, World!');
    });
  });

  // ============================================================================
  // Email Sanitization Tests
  // ============================================================================

  describe('sanitizeEmail', () => {
    it('should lowercase email', () => {
      expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeEmail('test<script>@example.com')).toBe('testscript@example.com');
      expect(sanitizeEmail('test"quote"@example.com')).toBe('testquote@example.com');
    });

    it('should respect RFC 5321 max length', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const result = sanitizeEmail(longEmail);

      expect(result.length).toBeLessThanOrEqual(254);
    });

    it('should handle empty input', () => {
      expect(sanitizeEmail('')).toBe('');
      expect(sanitizeEmail(null as any)).toBe('');
    });
  });

  // ============================================================================
  // URL Sanitization Tests
  // ============================================================================

  describe('sanitizeUrl', () => {
    it('should allow safe HTTPS URLs', () => {
      const url = 'https://example.com/path';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should allow HTTP URLs', () => {
      const url = 'http://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should block javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
      expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('');
    });

    it('should block data: protocol', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('should block vbscript: and file: protocols', () => {
      expect(sanitizeUrl('vbscript:alert(1)')).toBe('');
      expect(sanitizeUrl('file:///etc/passwd')).toBe('');
    });

    it('should add https:// to URLs without protocol', () => {
      expect(sanitizeUrl('example.com')).toBe('https://example.com');
      expect(sanitizeUrl('www.example.com')).toBe('https://www.example.com');
    });

    it('should allow mailto: URLs', () => {
      const url = 'mailto:test@example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle empty input', () => {
      expect(sanitizeUrl('')).toBe('');
      expect(sanitizeUrl(null as any)).toBe('');
    });

    it('should limit URL length', () => {
      const longUrl = 'https://' + 'a'.repeat(600) + '.com';
      const result = sanitizeUrl(longUrl);

      expect(result.length).toBeLessThanOrEqual(500);
    });
  });

  // ============================================================================
  // Filename Sanitization Tests
  // ============================================================================

  describe('sanitizeFilename', () => {
    it('should allow alphanumeric characters, dots, dashes, and underscores', () => {
      expect(sanitizeFilename('file-name_123.txt')).toBe('file-name_123.txt');
    });

    it('should replace dangerous characters with underscores', () => {
      expect(sanitizeFilename('file/name\\path.txt')).toBe('file_name_path.txt');
      expect(sanitizeFilename('file<>name.txt')).toBe('file__name.txt');
    });

    it('should prevent path traversal', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('_____etc_passwd');
      expect(sanitizeFilename('..\\..\\windows\\system32')).toBe('_____windows_system32');
    });

    it('should remove leading dots', () => {
      expect(sanitizeFilename('...hidden')).toBe('hidden');
      expect(sanitizeFilename('.htaccess')).toBe('htaccess');
    });

    it('should limit filename length', () => {
      const longName = 'a'.repeat(300) + '.txt';
      const result = sanitizeFilename(longName);

      expect(result.length).toBeLessThanOrEqual(255);
    });

    it('should handle empty input', () => {
      expect(sanitizeFilename('')).toBe('');
    });
  });

  // ============================================================================
  // SQL and Special Pattern Tests
  // ============================================================================

  describe('sanitizeLikePattern', () => {
    it('should escape SQL LIKE wildcards', () => {
      expect(sanitizeLikePattern('test%value')).toBe('test\\%value');
      expect(sanitizeLikePattern('test_value')).toBe('test\\_value');
    });

    it('should escape backslashes', () => {
      expect(sanitizeLikePattern('test\\value')).toBe('test\\\\value');
    });

    it('should limit pattern length', () => {
      const longPattern = 'a'.repeat(200);
      const result = sanitizeLikePattern(longPattern);

      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should handle empty input', () => {
      expect(sanitizeLikePattern('')).toBe('');
    });
  });

  describe('sanitizeJson', () => {
    it('should parse and re-stringify valid JSON', () => {
      const input = '{"key": "value", "number": 123}';
      const result = sanitizeJson(input);

      expect(result).toBe('{"key":"value","number":123}');
    });

    it('should return null for invalid JSON', () => {
      expect(sanitizeJson('not json')).toBeNull();
      expect(sanitizeJson('{"incomplete":')).toBeNull();
    });

    it('should handle nested objects', () => {
      const input = '{"nested": {"key": "value"}}';
      const result = sanitizeJson(input);

      expect(result).not.toBeNull();
      expect(JSON.parse(result!)).toEqual({ nested: { key: 'value' } });
    });

    it('should handle arrays', () => {
      const input = '[1, 2, 3, "test"]';
      const result = sanitizeJson(input);

      expect(result).not.toBeNull();
      expect(JSON.parse(result!)).toEqual([1, 2, 3, 'test']);
    });

    it('should handle empty input', () => {
      expect(sanitizeJson('')).toBeNull();
      expect(sanitizeJson(null as any)).toBeNull();
    });
  });

  // ============================================================================
  // HTML Entity Escaping Tests
  // ============================================================================

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("XSS")</script>'))
        .toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('Say "Hello"')).toBe('Say &quot;Hello&quot;');
      expect(escapeHtml("It's")).toBe('It&#x27;s');
    });

    it('should escape forward slashes', () => {
      expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;');
    });

    it('should handle mixed content', () => {
      const input = 'Test <>&"\'/';
      const result = escapeHtml(input);

      expect(result).toBe('Test &lt;&gt;&amp;&quot;&#x27;&#x2F;');
    });

    it('should handle empty input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  // ============================================================================
  // Specialized Sanitization Tests
  // ============================================================================

  describe('sanitizeSearchQuery', () => {
    it('should normalize whitespace', () => {
      expect(sanitizeSearchQuery('test   multiple   spaces')).toBe('test multiple spaces');
    });

    it('should remove angle brackets', () => {
      expect(sanitizeSearchQuery('search<script>term')).toBe('searchscriptterm');
    });

    it('should limit query length to 200 characters', () => {
      const longQuery = 'a'.repeat(300);
      const result = sanitizeSearchQuery(longQuery);

      expect(result.length).toBe(200);
    });

    it('should remove control characters', () => {
      const query = 'test\x00\x01query';
      const result = sanitizeSearchQuery(query);

      expect(result).toBe('testquery');
    });
  });

  describe('sanitizeNoteContent', () => {
    it('should use rich HTML sanitization', () => {
      const input = '<h2>Note Title</h2><p>Note content with <b>formatting</b></p>';
      const result = sanitizeNoteContent(input);

      expect(result).toContain('<h2>');
      expect(result).toContain('<p>');
      expect(result).toContain('<b>');
    });

    it('should prevent XSS in notes', () => {
      const input = '<script>alert(1)</script><p>Safe content</p>';
      const result = sanitizeNoteContent(input);

      expect(result).not.toContain('script');
      expect(result).toContain('Safe content');
    });
  });

  describe('sanitizeAssessmentAnswer', () => {
    it('should allow longer answers (5000 chars)', () => {
      const longAnswer = 'a'.repeat(4000);
      const result = sanitizeAssessmentAnswer(longAnswer);

      expect(result.length).toBe(4000);
    });

    it('should truncate at 5000 characters', () => {
      const veryLongAnswer = 'a'.repeat(6000);
      const result = sanitizeAssessmentAnswer(veryLongAnswer);

      expect(result.length).toBe(5000);
    });

    it('should sanitize input', () => {
      const answer = '<script>alert(1)</script>This is my answer';
      const result = sanitizeAssessmentAnswer(answer);

      expect(result).not.toContain('script');
      expect(result).toContain('This is my answer');
    });
  });

  // ============================================================================
  // Batch Sanitization Tests
  // ============================================================================

  describe('sanitizeObject', () => {
    it('should sanitize all string values', () => {
      const input = {
        name: '  John  ',
        email: '<script>test@example.com',
        age: 25,
      };

      const result = sanitizeObject(input);

      expect(result.name).toBe('John');
      expect(result.email).not.toContain('script');
      expect(result.age).toBe(25);
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '  Jane  ',
          details: {
            bio: '<b>Text</b>',
          },
        },
      };

      const result = sanitizeObject(input);

      expect(result.user.name).toBe('Jane');
      expect(result.user.details.bio).not.toContain('<b>');
    });

    it('should sanitize arrays of strings', () => {
      const input = {
        tags: ['  tag1  ', '<script>tag2', 'tag3'],
      };

      const result = sanitizeObject(input);

      expect(result.tags[0]).toBe('tag1');
      expect(result.tags[1]).not.toContain('script');
      expect(result.tags[2]).toBe('tag3');
    });

    it('should use custom sanitizer when provided', () => {
      const input = {
        email: 'Test@Example.COM',
      };

      const result = sanitizeObject(input, sanitizeEmail);

      expect(result.email).toBe('test@example.com');
    });

    it('should preserve non-string types', () => {
      const input = {
        text: 'string',
        number: 123,
        boolean: true,
        nullValue: null,
      };

      const result = sanitizeObject(input);

      expect(result.number).toBe(123);
      expect(result.boolean).toBe(true);
      expect(result.nullValue).toBeNull();
    });
  });

  // ============================================================================
  // Unicode and Edge Case Tests
  // ============================================================================

  describe('Unicode and Edge Cases', () => {
    it('should handle Unicode characters correctly', () => {
      const input = 'Hello 世界 🌍';
      expect(sanitizeInput(input)).toBe('Hello 世界 🌍');
    });

    it('should handle emoji in various sanitizers', () => {
      expect(sanitizeInput('Test 😀 emoji')).toBe('Test 😀 emoji');
      expect(sanitizeSearchQuery('search 🔍 term')).toBe('search 🔍 term');
    });

    it('should handle zero-width characters', () => {
      const input = 'test\u200B\u200C\u200Dword';
      const result = sanitizeInput(input);
      // Zero-width characters should be preserved as they're not control characters
      expect(result).toContain('test');
      expect(result).toContain('word');
    });

    it('should handle null bytes in various contexts', () => {
      const nullByteString = 'test\x00value';
      expect(sanitizeInput(nullByteString)).toBe('testvalue');
      expect(sanitizeSearchQuery(nullByteString)).toBe('testvalue');
    });
  });
});
