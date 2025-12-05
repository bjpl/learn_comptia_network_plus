/**
 * TOTP (Time-based One-Time Password) utility functions
 * Production-ready implementation using otplib
 */

import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Configure TOTP settings
authenticator.options = {
  window: 1, // Allow 1 step before/after for time sync issues (30 seconds each side)
  step: 30, // 30-second time step (standard)
  digits: 6, // 6-digit codes (standard)
  algorithm: 'sha1', // SHA1 algorithm (standard for TOTP)
};

/**
 * Generate a new TOTP secret
 * Returns a base32-encoded random secret
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generate TOTP URI for QR code
 * @param secret - The TOTP secret
 * @param email - User's email address
 * @param issuer - Application name (default: 'CompTIA Network+')
 */
export function generateTOTPUri(
  secret: string,
  email: string,
  issuer: string = 'CompTIA Network+'
): string {
  return authenticator.keyuri(email, issuer, secret);
}

/**
 * Generate QR code as data URL
 * @param uri - TOTP URI
 * @returns Promise resolving to data URL
 */
export async function generateQRCode(uri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(uri, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Verify a TOTP code
 * @param token - 6-digit TOTP code
 * @param secret - The TOTP secret
 * @returns true if valid, false otherwise
 */
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    // Verify the token is 6 digits
    if (!/^\d{6}$/.test(token)) {
      return false;
    }

    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

/**
 * Generate a single backup code
 * Format: XXXX-XXXX (8 alphanumeric characters)
 */
function generateSingleBackupCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);

  const code = Array.from(array, (num) => chars[num % chars.length]).join('');
  return `${code.slice(0, 4)}-${code.slice(4, 8)}`;
}

/**
 * Generate backup codes for 2FA
 * @param count - Number of backup codes to generate (default: 10)
 * @returns Array of backup codes
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes = new Set<string>();

  // Ensure unique codes
  while (codes.size < count) {
    codes.add(generateSingleBackupCode());
  }

  return Array.from(codes);
}

/**
 * Verify a backup code
 * @param code - Backup code to verify
 * @param storedCodes - Array of valid backup codes
 * @returns Object with isValid flag and remaining codes
 */
export function verifyBackupCode(
  code: string,
  storedCodes: string[]
): { isValid: boolean; remainingCodes: string[] } {
  const normalizedCode = code.toUpperCase().replace(/\s/g, '');
  const index = storedCodes.findIndex(
    (storedCode) => storedCode.toUpperCase().replace(/\s/g, '') === normalizedCode
  );

  if (index === -1) {
    return { isValid: false, remainingCodes: storedCodes };
  }

  // Remove the used backup code
  const remainingCodes = [...storedCodes];
  remainingCodes.splice(index, 1);

  return { isValid: true, remainingCodes };
}

/**
 * Get current TOTP code (for testing/debugging only)
 * WARNING: This should only be used in development/testing
 */
export function getCurrentTOTP(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Check if TOTP code is within valid time window
 * @param _secret - TOTP secret (currently unused)
 * @returns Object with time remaining and next code generation time
 */
export function getTOTPTimeInfo(_secret: string): {
  timeRemaining: number;
  nextCodeTime: Date;
} {
  const now = Date.now();
  const step = 30000; // 30 seconds in milliseconds
  const timeRemaining = step - (now % step);
  const nextCodeTime = new Date(now + timeRemaining);

  return {
    timeRemaining: Math.floor(timeRemaining / 1000),
    nextCodeTime,
  };
}

/**
 * Format secret for display (grouped in 4-character chunks)
 */
export function formatSecret(secret: string): string {
  return secret.match(/.{1,4}/g)?.join(' ') || secret;
}
