/**
 * Security Section Component
 */

import React from 'react';
import type { TwoFactorStatus } from '../../../../types/security';
import { formatDate } from '../utils/formatting';

interface SecuritySectionProps {
  twoFactorStatus: TwoFactorStatus;
  onChangePassword: () => void;
  onManageTwoFactor: () => void;
  onViewActiveSessions: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  twoFactorStatus,
  onChangePassword,
  onManageTwoFactor,
  onViewActiveSessions,
}) => {
  return (
    <div className="profile-section">
      <h2>Security</h2>
      <div className="security-actions">
        <button className="btn-secondary btn-full" onClick={onChangePassword}>
          Change Password
        </button>

        <div className="security-action-item">
          <div className="security-action-header">
            <span className="security-action-title">Two-Factor Authentication</span>
            <span className="badge badge-optional">Optional</span>
          </div>
          <p className="security-action-description">
            Add an extra layer of security to your account. You will need an authenticator app to
            sign in.
          </p>
          <button className="btn-secondary btn-full" onClick={onManageTwoFactor}>
            {twoFactorStatus.enabled ? 'Manage 2FA' : 'Set Up 2FA'}
          </button>
          {twoFactorStatus.enabled && (
            <div className="security-status">
              <span className="badge badge-success">Enabled</span>
              {twoFactorStatus.setupDate && (
                <span className="status-detail">Since {formatDate(twoFactorStatus.setupDate)}</span>
              )}
            </div>
          )}
        </div>

        <button className="btn-secondary btn-full" onClick={onViewActiveSessions}>
          Active Sessions
        </button>
      </div>
    </div>
  );
};
