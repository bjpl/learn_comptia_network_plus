/**
 * Password Change Modal Component
 */

import React from 'react';
import type { PasswordStrength } from '../../../../types/auth';
import type { PasswordChangeData, PasswordErrors } from '../types';
import { getPasswordStrengthColor, getPasswordStrengthLabel } from '../utils/passwordStrength';

interface PasswordChangeModalProps {
  passwordData: PasswordChangeData;
  passwordErrors: PasswordErrors;
  passwordStrength: PasswordStrength | null;
  isChangingPassword: boolean;
  firstPasswordInputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  passwordData,
  passwordErrors,
  passwordStrength,
  isChangingPassword,
  firstPasswordInputRef,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="password-modal-title">Change Password</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isChangingPassword}
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              ref={firstPasswordInputRef}
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={onChange}
              disabled={isChangingPassword}
              className={passwordErrors.currentPassword ? 'error' : ''}
              aria-invalid={!!passwordErrors.currentPassword}
            />
            {passwordErrors.currentPassword && (
              <span className="error-message">{passwordErrors.currentPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={onChange}
              disabled={isChangingPassword}
              className={passwordErrors.newPassword ? 'error' : ''}
              aria-invalid={!!passwordErrors.newPassword}
            />
            {passwordErrors.newPassword && (
              <span className="error-message">{passwordErrors.newPassword}</span>
            )}

            {passwordData.newPassword && passwordStrength && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength.score),
                    }}
                  />
                </div>
                <div className="strength-info">
                  <span
                    className="strength-label"
                    style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                  >
                    {getPasswordStrengthLabel(passwordStrength.score)}
                  </span>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="strength-feedback">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={onChange}
              disabled={isChangingPassword}
              className={passwordErrors.confirmPassword ? 'error' : ''}
              aria-invalid={!!passwordErrors.confirmPassword}
            />
            {passwordErrors.confirmPassword && (
              <span className="error-message">{passwordErrors.confirmPassword}</span>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isChangingPassword}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onSubmit} disabled={isChangingPassword}>
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};
