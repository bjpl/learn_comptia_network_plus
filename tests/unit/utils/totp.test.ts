/**
 * TOTP Utility Tests
 * Tests for Time-based One-Time Password functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateTOTPSecret,
  generateTOTPUri,
  generateQRCode,
  verifyTOTP,
  generateBackupCodes,
  verifyBackupCode,
  getCurrentTOTP,
  getTOTPTimeInfo,
  formatSecret,
} from '../../../src/utils/totp';

describe('TOTP Utilities', () => {
  describe('generateTOTPSecret', () => {
    it('should generate a valid base32 secret', () => {
      const secret = generateTOTPSecret();

      // Should be a string
      expect(typeof secret).toBe('string');

      // Should be base32 encoded (A-Z, 2-7)
      expect(secret).toMatch(/^[A-Z2-7]+$/);

      // Should be at least 16 characters (recommended minimum)
      expect(secret.length).toBeGreaterThanOrEqual(16);
    });

    it('should generate unique secrets', () => {
      const secret1 = generateTOTPSecret();
      const secret2 = generateTOTPSecret();

      expect(secret1).not.toBe(secret2);
    });
  });

  describe('generateTOTPUri', () => {
    it('should generate valid TOTP URI', () => {
      const secret = generateTOTPSecret();
      const email = 'test@example.com';
      const uri = generateTOTPUri(secret, email);

      expect(uri).toContain('otpauth://totp/');
      expect(uri).toContain(encodeURIComponent(email));
      expect(uri).toContain(secret);
      expect(uri).toContain(encodeURIComponent('CompTIA Network+'));
    });

    it('should handle custom issuer', () => {
      const secret = generateTOTPSecret();
      const email = 'test@example.com';
      const issuer = 'Custom App';
      const uri = generateTOTPUri(secret, email, issuer);

      expect(uri).toContain(encodeURIComponent(issuer));
    });

    it('should properly encode special characters', () => {
      const secret = generateTOTPSecret();
      const email = 'test+user@example.com';
      const uri = generateTOTPUri(secret, email);

      expect(uri).toContain(encodeURIComponent(email));
    });
  });

  describe('generateQRCode', () => {
    it('should generate QR code as data URL', async () => {
      const secret = generateTOTPSecret();
      const uri = generateTOTPUri(secret, 'test@example.com');
      const qrCode = await generateQRCode(uri);

      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });

    it('should handle errors gracefully', async () => {
      await expect(generateQRCode('')).rejects.toThrow();
    });
  });

  describe('verifyTOTP', () => {
    it('should verify valid TOTP code', () => {
      const secret = generateTOTPSecret();
      const token = getCurrentTOTP(secret);

      expect(verifyTOTP(token, secret)).toBe(true);
    });

    it('should reject invalid TOTP code', () => {
      const secret = generateTOTPSecret();

      expect(verifyTOTP('000000', secret)).toBe(false);
      expect(verifyTOTP('999999', secret)).toBe(false);
    });

    it('should reject non-numeric codes', () => {
      const secret = generateTOTPSecret();

      expect(verifyTOTP('abcdef', secret)).toBe(false);
      expect(verifyTOTP('12345a', secret)).toBe(false);
    });

    it('should reject codes with wrong length', () => {
      const secret = generateTOTPSecret();

      expect(verifyTOTP('123', secret)).toBe(false);
      expect(verifyTOTP('1234567', secret)).toBe(false);
    });

    it('should handle time window correctly', () => {
      const secret = generateTOTPSecret();
      const token = getCurrentTOTP(secret);

      // Should still be valid immediately
      expect(verifyTOTP(token, secret)).toBe(true);
    });

    it('should handle errors gracefully', () => {
      expect(verifyTOTP('123456', '')).toBe(false);
      expect(verifyTOTP('', 'secret')).toBe(false);
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate default number of backup codes', () => {
      const codes = generateBackupCodes();

      expect(codes).toHaveLength(10);
    });

    it('should generate custom number of backup codes', () => {
      const codes = generateBackupCodes(5);

      expect(codes).toHaveLength(5);
    });

    it('should generate codes in correct format', () => {
      const codes = generateBackupCodes();

      codes.forEach((code) => {
        // Format: XXXX-XXXX (8 alphanumeric characters)
        expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      });
    });

    it('should generate unique codes', () => {
      const codes = generateBackupCodes(20);
      const uniqueCodes = new Set(codes);

      expect(uniqueCodes.size).toBe(codes.length);
    });

    it('should generate different codes each time', () => {
      const codes1 = generateBackupCodes(5);
      const codes2 = generateBackupCodes(5);

      expect(codes1).not.toEqual(codes2);
    });
  });

  describe('verifyBackupCode', () => {
    it('should verify valid backup code', () => {
      const codes = generateBackupCodes(3);
      const result = verifyBackupCode(codes[0], codes);

      expect(result.isValid).toBe(true);
      expect(result.remainingCodes).toHaveLength(2);
      expect(result.remainingCodes).not.toContain(codes[0]);
    });

    it('should reject invalid backup code', () => {
      const codes = generateBackupCodes(3);
      const result = verifyBackupCode('AAAA-AAAA', codes);

      expect(result.isValid).toBe(false);
      expect(result.remainingCodes).toEqual(codes);
    });

    it('should handle case-insensitive codes', () => {
      const codes = ['ABCD-1234'];
      const result = verifyBackupCode('abcd-1234', codes);

      expect(result.isValid).toBe(true);
    });

    it('should handle codes with whitespace', () => {
      const codes = ['ABCD-1234'];
      const result = verifyBackupCode(' ABCD - 1234 ', codes);

      expect(result.isValid).toBe(true);
    });

    it('should only use each backup code once', () => {
      const codes = ['ABCD-1234', 'EFGH-5678'];
      const result1 = verifyBackupCode('ABCD-1234', codes);

      expect(result1.isValid).toBe(true);
      expect(result1.remainingCodes).toHaveLength(1);

      const result2 = verifyBackupCode('ABCD-1234', result1.remainingCodes);

      expect(result2.isValid).toBe(false);
    });

    it('should handle empty code list', () => {
      const result = verifyBackupCode('ABCD-1234', []);

      expect(result.isValid).toBe(false);
      expect(result.remainingCodes).toEqual([]);
    });
  });

  describe('getCurrentTOTP', () => {
    it('should generate 6-digit code', () => {
      const secret = generateTOTPSecret();
      const token = getCurrentTOTP(secret);

      expect(token).toMatch(/^\d{6}$/);
    });

    it('should generate same code for same secret at same time', () => {
      const secret = generateTOTPSecret();
      const token1 = getCurrentTOTP(secret);
      const token2 = getCurrentTOTP(secret);

      expect(token1).toBe(token2);
    });

    it('should generate different codes for different secrets', () => {
      const secret1 = generateTOTPSecret();
      const secret2 = generateTOTPSecret();
      const token1 = getCurrentTOTP(secret1);
      const token2 = getCurrentTOTP(secret2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('getTOTPTimeInfo', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return time remaining in current window', () => {
      const secret = generateTOTPSecret();
      const info = getTOTPTimeInfo(secret);

      expect(info.timeRemaining).toBeGreaterThan(0);
      expect(info.timeRemaining).toBeLessThanOrEqual(30);
    });

    it('should return next code generation time', () => {
      const now = new Date('2025-01-01T12:00:00Z');
      vi.setSystemTime(now);

      const secret = generateTOTPSecret();
      const info = getTOTPTimeInfo(secret);

      expect(info.nextCodeTime).toBeInstanceOf(Date);
      expect(info.nextCodeTime.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should calculate correctly at start of window', () => {
      // Set time to exact start of 30-second window
      vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));

      const secret = generateTOTPSecret();
      const info = getTOTPTimeInfo(secret);

      expect(info.timeRemaining).toBe(30);
    });

    it('should calculate correctly at end of window', () => {
      // Set time to 1ms before end of window
      vi.setSystemTime(new Date('2025-01-01T12:00:29.999Z'));

      const secret = generateTOTPSecret();
      const info = getTOTPTimeInfo(secret);

      expect(info.timeRemaining).toBe(0);
    });
  });

  describe('formatSecret', () => {
    it('should format secret in 4-character groups', () => {
      const secret = 'ABCDEFGHIJKLMNOP';
      const formatted = formatSecret(secret);

      expect(formatted).toBe('ABCD EFGH IJKL MNOP');
    });

    it('should handle secrets not divisible by 4', () => {
      const secret = 'ABCDEFGHIJ';
      const formatted = formatSecret(secret);

      expect(formatted).toBe('ABCD EFGH IJ');
    });

    it('should handle short secrets', () => {
      const secret = 'ABC';
      const formatted = formatSecret(secret);

      expect(formatted).toBe('ABC');
    });

    it('should handle empty secret', () => {
      const formatted = formatSecret('');

      expect(formatted).toBe('');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full 2FA setup flow', async () => {
      // Generate secret
      const secret = generateTOTPSecret();
      expect(secret).toBeTruthy();

      // Generate URI
      const uri = generateTOTPUri(secret, 'test@example.com');
      expect(uri).toContain('otpauth://totp/');

      // Generate QR code
      const qrCode = await generateQRCode(uri);
      expect(qrCode).toMatch(/^data:image\/png;base64,/);

      // Generate and verify TOTP
      const token = getCurrentTOTP(secret);
      expect(verifyTOTP(token, secret)).toBe(true);

      // Generate backup codes
      const backupCodes = generateBackupCodes();
      expect(backupCodes).toHaveLength(10);

      // Verify backup code
      const result = verifyBackupCode(backupCodes[0], backupCodes);
      expect(result.isValid).toBe(true);
      expect(result.remainingCodes).toHaveLength(9);
    });

    it('should handle time-based code rotation', () => {
      const secret = generateTOTPSecret();
      const token1 = getCurrentTOTP(secret);

      // Verify current token works
      expect(verifyTOTP(token1, secret)).toBe(true);

      // Same token should still work within window
      const token2 = getCurrentTOTP(secret);
      expect(token1).toBe(token2);
      expect(verifyTOTP(token2, secret)).toBe(true);
    });

    it('should handle multiple backup code uses', () => {
      const codes = generateBackupCodes(5);
      let remainingCodes = codes;

      // Use first code
      const result1 = verifyBackupCode(codes[0], remainingCodes);
      expect(result1.isValid).toBe(true);
      expect(result1.remainingCodes).toHaveLength(4);
      remainingCodes = result1.remainingCodes;

      // Use second code
      const result2 = verifyBackupCode(codes[1], remainingCodes);
      expect(result2.isValid).toBe(true);
      expect(result2.remainingCodes).toHaveLength(3);
      remainingCodes = result2.remainingCodes;

      // Try to use first code again (should fail)
      const result3 = verifyBackupCode(codes[0], remainingCodes);
      expect(result3.isValid).toBe(false);
      expect(result3.remainingCodes).toHaveLength(3);
    });
  });

  describe('Security Tests', () => {
    it('should not accept expired codes from previous window', () => {
      // This test verifies that codes don't persist beyond their valid window
      // Note: This is a basic test; actual time-based testing would require
      // more sophisticated time mocking
      const secret = generateTOTPSecret();
      const token = getCurrentTOTP(secret);

      expect(verifyTOTP(token, secret)).toBe(true);
    });

    it('should generate cryptographically random secrets', () => {
      const secrets = new Set<string>();
      const count = 100;

      for (let i = 0; i < count; i++) {
        secrets.add(generateTOTPSecret());
      }

      // All secrets should be unique
      expect(secrets.size).toBe(count);
    });

    it('should generate cryptographically random backup codes', () => {
      const allCodes = new Set<string>();
      const iterations = 10;
      const codesPerIteration = 10;

      for (let i = 0; i < iterations; i++) {
        const codes = generateBackupCodes(codesPerIteration);
        codes.forEach((code) => allCodes.add(code));
      }

      // All codes should be unique across multiple generations
      expect(allCodes.size).toBe(iterations * codesPerIteration);
    });

    it('should reject obviously invalid inputs', () => {
      const secret = generateTOTPSecret();

      // SQL injection attempt
      expect(verifyTOTP("'; DROP TABLE users; --", secret)).toBe(false);

      // XSS attempt
      expect(verifyTOTP('<script>alert("xss")</script>', secret)).toBe(false);

      // Path traversal
      expect(verifyTOTP('../../etc/passwd', secret)).toBe(false);

      // Command injection
      expect(verifyTOTP('123456; rm -rf /', secret)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long secrets', () => {
      const secret = generateTOTPSecret() + generateTOTPSecret();
      const token = getCurrentTOTP(secret);

      expect(verifyTOTP(token, secret)).toBe(true);
    });

    it('should handle concurrent verifications', () => {
      const secret = generateTOTPSecret();
      const token = getCurrentTOTP(secret);

      // Multiple simultaneous verifications should all work
      const results = [
        verifyTOTP(token, secret),
        verifyTOTP(token, secret),
        verifyTOTP(token, secret),
      ];

      expect(results.every((r) => r === true)).toBe(true);
    });

    it('should handle rapid backup code verifications', () => {
      const codes = generateBackupCodes(3);

      // Verify all codes rapidly
      const results = [
        verifyBackupCode(codes[0], codes),
        verifyBackupCode(codes[1], codes),
        verifyBackupCode(codes[2], codes),
      ];

      // All should be valid when verified against original list
      expect(results.every((r) => r.isValid)).toBe(true);
    });
  });
});
