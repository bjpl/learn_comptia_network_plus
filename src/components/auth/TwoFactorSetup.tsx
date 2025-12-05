/**
 * Two-Factor Authentication Setup Component
 * Provides a multi-step flow for enabling 2FA
 */

import React, { useState, useEffect } from 'react';
import { setupTwoFactor, validateTwoFactorCode } from '../../utils/security';
import type { TwoFactorSetupData } from '../../types/security';
import './TwoFactorSetup.css';

interface TwoFactorSetupProps {
  userEmail: string;
  isEnabled: boolean;
  onClose: () => void;
  onComplete: (enabled: boolean) => void;
}

type SetupStep = 'qr-code' | 'backup-codes' | 'verify' | 'success' | 'disable';

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  userEmail,
  isEnabled,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<SetupStep>(isEnabled ? 'disable' : 'qr-code');
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEnabled && !setupData) {
      // Setup 2FA is now async
      setIsLoading(true);
      setupTwoFactor(userEmail)
        .then(setSetupData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [userEmail, isEnabled, setupData]);

  const handleVerify = () => {
    if (!setupData) {
      return;
    }

    if (validateTwoFactorCode(verificationCode, setupData.secret)) {
      // Store 2FA status
      localStorage.setItem(
        'twoFactorStatus',
        JSON.stringify({
          enabled: true,
          setupDate: new Date().toISOString(),
          backupCodesRemaining: setupData.backupCodes.length,
        })
      );
      setStep('success');
      setError('');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleDisable = () => {
    localStorage.removeItem('twoFactorStatus');
    onComplete(false);
  };

  const handleComplete = () => {
    onComplete(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllCodes = () => {
    if (!setupData) {
      return;
    }
    const codesText = setupData.backupCodes.join('\n');
    copyToClipboard(codesText);
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const downloadCodes = () => {
    if (!setupData) {
      return;
    }
    const codesText = setupData.backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content twofa-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {step === 'disable' && (
          <div className="twofa-step">
            <h2>Disable Two-Factor Authentication</h2>
            <p>
              Are you sure you want to disable two-factor authentication? This will make your
              account less secure.
            </p>
            <div className="twofa-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDisable}>
                Disable 2FA
              </button>
            </div>
          </div>
        )}

        {step === 'qr-code' && (
          <div className="twofa-step">
            <div className="step-indicator">
              <span className="step active">1</span>
              <span className="step">2</span>
              <span className="step">3</span>
              <span className="step">4</span>
            </div>

            <h2>Scan QR Code</h2>
            {isLoading ? (
              <p>Loading QR code...</p>
            ) : setupData ? (
              <>
                <p>
                  Use an authenticator app (Google Authenticator, Authy, etc.) to scan this QR code:
                </p>

                <div className="qr-code-container">
                  <img src={setupData.qrCodeUrl} alt="2FA QR Code" className="qr-code" />
                </div>

            <div className="secret-key">
              <p>Or enter this key manually:</p>
              <code>{setupData.secret}</code>
              <button className="btn-link" onClick={() => copyToClipboard(setupData.secret)}>
                Copy Key
              </button>
            </div>

                <div className="twofa-actions">
                  <button className="btn-secondary" onClick={onClose} disabled={isLoading}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={() => setStep('backup-codes')} disabled={isLoading}>
                    Next
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {step === 'backup-codes' && setupData && (
          <div className="twofa-step">
            <div className="step-indicator">
              <span className="step completed">1</span>
              <span className="step active">2</span>
              <span className="step">3</span>
              <span className="step">4</span>
            </div>

            <h2>Save Backup Codes</h2>
            <p className="warning-text">
              Store these backup codes in a safe place. You can use them to access your account if
              you lose your device.
            </p>

            <div className="backup-codes">
              {setupData.backupCodes.map((code, index) => (
                <div key={index} className="backup-code">
                  <code>{code}</code>
                </div>
              ))}
            </div>

            <div className="backup-actions">
              <button className="btn-secondary" onClick={copyAllCodes} disabled={copiedCodes}>
                {copiedCodes ? 'Copied!' : 'Copy All'}
              </button>
              <button className="btn-secondary" onClick={downloadCodes}>
                Download
              </button>
            </div>

            <div className="twofa-actions">
              <button className="btn-secondary" onClick={() => setStep('qr-code')}>
                Back
              </button>
              <button className="btn-primary" onClick={() => setStep('verify')}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'verify' && setupData && (
          <div className="twofa-step">
            <div className="step-indicator">
              <span className="step completed">1</span>
              <span className="step completed">2</span>
              <span className="step active">3</span>
              <span className="step">4</span>
            </div>

            <h2>Verify Setup</h2>
            <p>Enter the 6-digit code from your authenticator app:</p>

            <div className="verification-input">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="000000"
                className={error ? 'error' : ''}
                aria-label="Verification code"
                aria-invalid={!!error}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="twofa-actions">
              <button className="btn-secondary" onClick={() => setStep('backup-codes')}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleVerify}
                disabled={verificationCode.length !== 6}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="twofa-step">
            <div className="step-indicator">
              <span className="step completed">1</span>
              <span className="step completed">2</span>
              <span className="step completed">3</span>
              <span className="step completed">4</span>
            </div>

            <div className="success-icon">✓</div>
            <h2>Two-Factor Authentication Enabled</h2>
            <p>
              Your account is now protected with two-factor authentication. You will be asked for a
              code from your authenticator app when you sign in.
            </p>

            <div className="twofa-actions">
              <button className="btn-primary btn-full" onClick={handleComplete}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
