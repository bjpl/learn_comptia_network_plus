/**
 * Two-Factor Verification Component
 * Handles TOTP and backup code verification during login
 */

import React, { useState } from 'react';
import { validateTwoFactorCode, validateBackupCode } from '../../utils/security';
import './AuthForms.css';

interface TwoFactorVerificationProps {
  secret: string;
  backupCodes: string[];
  onVerified: (remainingBackupCodes?: string[]) => void;
  onCancel: () => void;
  email: string;
}

type VerificationMode = 'totp' | 'backup';

export const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  secret,
  backupCodes,
  onVerified,
  onCancel,
  email,
}) => {
  const [mode, setMode] = useState<VerificationMode>('totp');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyTOTP = () => {
    setIsVerifying(true);
    setError('');

    try {
      if (validateTwoFactorCode(code, secret)) {
        onVerified();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      console.error('2FA verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyBackup = () => {
    setIsVerifying(true);
    setError('');

    try {
      const result = validateBackupCode(code, backupCodes);

      if (result.isValid) {
        onVerified(result.remainingCodes);
      } else {
        setError('Invalid backup code. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      console.error('Backup code verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    if (mode === 'totp') {
      handleVerifyTOTP();
    } else {
      handleVerifyBackup();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (mode === 'totp') {
      // Only allow digits for TOTP
      value = value.replace(/\D/g, '').slice(0, 6);
    } else {
      // Allow alphanumeric and hyphens for backup codes
      value = value.toUpperCase();
    }

    setCode(value);
    setError('');
  };

  const switchMode = (newMode: VerificationMode) => {
    setMode(newMode);
    setCode('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Two-Factor Authentication</h1>
          <p>Verify your identity to continue</p>
          <p className="user-email">{email}</p>
        </div>

        {mode === 'totp' && (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="totp-code">Authenticator Code</label>
              <input
                type="text"
                id="totp-code"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={handleCodeChange}
                className={error ? 'error totp-input' : 'totp-input'}
                placeholder="000000"
                maxLength={6}
                autoFocus
                disabled={isVerifying}
                aria-invalid={!!error}
                aria-describedby={error ? 'code-error' : undefined}
              />
              {error && (
                <span className="error-message" id="code-error">
                  {error}
                </span>
              )}
              <p className="help-text">Enter the 6-digit code from your authenticator app</p>
            </div>

            <div className="twofa-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
                disabled={isVerifying}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={code.length !== 6 || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>

            <div className="auth-divider">
              <span>Having trouble?</span>
            </div>

            <button
              type="button"
              className="btn-link"
              onClick={() => switchMode('backup')}
              disabled={isVerifying}
            >
              Use backup code instead
            </button>
          </form>
        )}

        {mode === 'backup' && (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="backup-code">Backup Code</label>
              <input
                type="text"
                id="backup-code"
                value={code}
                onChange={handleCodeChange}
                className={error ? 'error backup-input' : 'backup-input'}
                placeholder="XXXX-XXXX"
                maxLength={9}
                autoFocus
                disabled={isVerifying}
                aria-invalid={!!error}
                aria-describedby={error ? 'code-error' : undefined}
              />
              {error && (
                <span className="error-message" id="code-error">
                  {error}
                </span>
              )}
              <p className="help-text">Enter one of your backup codes (format: XXXX-XXXX)</p>
              <p className="warning-text">Note: Each backup code can only be used once</p>
            </div>

            <div className="twofa-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
                disabled={isVerifying}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!code.trim() || isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>

            <div className="auth-divider">
              <span>Have access to your authenticator app?</span>
            </div>

            <button
              type="button"
              className="btn-link"
              onClick={() => switchMode('totp')}
              disabled={isVerifying}
            >
              Use authenticator app instead
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
