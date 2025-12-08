/**
 * Security utility functions for 2FA and session management
 */

import type { TwoFactorSetupData, DeviceSession } from '../types/security';
import {
  generateTOTPSecret,
  generateTOTPUri,
  generateQRCode,
  verifyTOTP,
  generateBackupCodes as generateTOTPBackupCodes,
  verifyBackupCode,
} from './totp';

/**
 * Generate a cryptographically secure random integer between 0 and max (exclusive)
 */
const getSecureRandomInt = (max: number): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
};

/**
 * Generate a cryptographically secure random hex string
 */
const getSecureRandomHex = (length: number): string => {
  const array = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, length);
};

/**
 * Generate a TOTP secret for 2FA setup
 */
export const generateTwoFactorSecret = (): string => {
  return generateTOTPSecret();
};

/**
 * Generate backup codes for 2FA
 */
export const generateBackupCodes = (count: number = 10): string[] => {
  return generateTOTPBackupCodes(count);
};

/**
 * Setup 2FA for a user (async version with real QR code generation)
 */
export const setupTwoFactor = async (email: string): Promise<TwoFactorSetupData> => {
  const secret = generateTOTPSecret();
  const uri = generateTOTPUri(secret, email);
  const qrCodeUrl = await generateQRCode(uri);
  const backupCodes = generateTOTPBackupCodes();

  return {
    secret,
    qrCodeUrl,
    backupCodes,
  };
};

/**
 * Validate a 2FA code (production implementation)
 */
export const validateTwoFactorCode = (code: string, secret: string): boolean => {
  return verifyTOTP(code, secret);
};

/**
 * Validate a backup code
 * @returns Object with validity and remaining codes
 */
export const validateBackupCode = (
  code: string,
  storedCodes: string[]
): { isValid: boolean; remainingCodes: string[] } => {
  return verifyBackupCode(code, storedCodes);
};

/**
 * Generate mock device sessions
 */
export const generateMockSessions = (count: number = 3): DeviceSession[] => {
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const deviceTypes: Array<'Desktop' | 'Mobile' | 'Tablet'> = ['Desktop', 'Mobile', 'Tablet'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const countries = ['United States', 'Canada', 'United Kingdom'];

  const sessions: DeviceSession[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const createdDate = new Date(now.getTime() - getSecureRandomInt(30 * 24 * 60 * 60 * 1000));
    const lastActiveDate = new Date(now.getTime() - getSecureRandomInt(24 * 60 * 60 * 1000));

    sessions.push({
      id: `session-${getSecureRandomHex(13)}`,
      deviceType: deviceTypes[getSecureRandomInt(deviceTypes.length)],
      browser: browsers[getSecureRandomInt(browsers.length)],
      location: {
        city: cities[getSecureRandomInt(cities.length)],
        country: countries[getSecureRandomInt(countries.length)],
      },
      ipAddress: `${getSecureRandomInt(256)}.${getSecureRandomInt(256)}.${getSecureRandomInt(256)}.${getSecureRandomInt(256)}`,
      lastActive: lastActiveDate.toISOString(),
      isCurrent: i === 0, // First session is current
      createdAt: createdDate.toISOString(),
    });
  }

  return sessions;
};

/**
 * Get or create sessions from localStorage
 */
export const getDeviceSessions = (): DeviceSession[] => {
  const stored = localStorage.getItem('device_sessions');
  if (stored) {
    return JSON.parse(stored) as DeviceSession[];
  }

  // Generate initial sessions
  const sessions = generateMockSessions(4);
  localStorage.setItem('device_sessions', JSON.stringify(sessions));
  return sessions;
};

/**
 * Remove a session by ID
 */
export const removeSession = (sessionId: string): DeviceSession[] => {
  const sessions = getDeviceSessions();
  const updated = sessions.filter((s) => s.id !== sessionId);
  localStorage.setItem('device_sessions', JSON.stringify(updated));
  return updated;
};

/**
 * Remove all sessions except current
 */
export const removeAllOtherSessions = (): DeviceSession[] => {
  const sessions = getDeviceSessions();
  const current = sessions.filter((s) => s.isCurrent);
  localStorage.setItem('device_sessions', JSON.stringify(current));
  return current;
};

/**
 * Format relative time
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};
