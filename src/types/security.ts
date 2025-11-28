/**
 * Security-related types for 2FA and session management
 */

export interface TwoFactorSetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface DeviceSession {
  id: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  location: {
    city: string;
    country: string;
  };
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  setupDate?: string;
  backupCodesRemaining?: number;
}
