/**
 * User Profile Component
 * Displays and manages user profile information
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  getUserDisplayName,
  getUserInitials,
  validateEmail,
  validatePasswordStrength,
} from '../../utils/auth';
import type { User, PasswordStrength } from '../../types/auth';
import type { TwoFactorStatus } from '../../types/security';
import { TwoFactorSetup } from './TwoFactorSetup';
import { ActiveSessions } from './ActiveSessions';
import './UserProfile.css';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const UserProfile: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 2FA and Sessions state
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({
    enabled: false,
  });

  // Refs for focus management
  const passwordModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const firstPasswordInputRef = useRef<HTMLInputElement>(null);
  const deleteInputRef = useRef<HTMLInputElement>(null);

  // Load 2FA status on mount
  useEffect(() => {
    const stored = localStorage.getItem('twoFactorStatus');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TwoFactorStatus;
        setTwoFactorStatus(parsed);
      } catch (error) {
        console.error('Error loading 2FA status:', error);
      }
    }
  }, []);

  // Focus trap and escape key handler for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPasswordModal) {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordStrength(null);
        }
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
        }
      }
    };

    if (showPasswordModal || showDeleteModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showPasswordModal, showDeleteModal]);

  // Auto-focus first input when modals open
  useEffect(() => {
    if (showPasswordModal && firstPasswordInputRef.current) {
      firstPasswordInputRef.current.focus();
    }
  }, [showPasswordModal]);

  useEffect(() => {
    if (showDeleteModal && deleteInputRef.current) {
      deleteInputRef.current.focus();
    }
  }, [showDeleteModal]);

  // Update password strength when new password changes
  useEffect(() => {
    if (passwordData.newPassword) {
      const strength = validatePasswordStrength(passwordData.newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [passwordData.newPassword]);

  // Early return after all hooks
  if (!user) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
    });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updates: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
      };

      updateUser(updates);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Password change handlers
  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordStrength(null);
  };

  const handleClosePasswordModal = () => {
    if (isChangingPassword) {
      return;
    }
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordStrength(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (passwordErrors[name as keyof PasswordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: PasswordErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const strength = validatePasswordStrength(passwordData.newPassword);
      if (!strength.isValid) {
        newErrors.newPassword = strength.feedback[0] || 'Password does not meet requirements';
      }
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simulate API call for password change
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would call an API endpoint
      // await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);

      setSuccessMessage('Password changed successfully!');
      handleClosePasswordModal();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: 'Current password is incorrect',
      }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Delete account handlers
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation('');
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingAccount) {
      return;
    }
    setShowDeleteModal(false);
    setDeleteConfirmation('');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE' && deleteConfirmation !== user.email) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      // Simulate API call for account deletion
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would call an API endpoint
      // await authService.deleteAccount();

      // Logout and redirect to home
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeletingAccount(false);
    }
  };

  const getPasswordStrengthColor = (): string => {
    if (!passwordStrength) {
      return 'transparent';
    }

    const colors = ['#dc2626', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];
    return colors[passwordStrength.score] || colors[0];
  };

  const getPasswordStrengthLabel = (): string => {
    if (!passwordStrength) {
      return '';
    }

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[passwordStrength.score] || labels[0];
  };

  const handleTwoFactorComplete = (enabled: boolean) => {
    setShowTwoFactorSetup(false);

    // Reload 2FA status
    const stored = localStorage.getItem('twoFactorStatus');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TwoFactorStatus;
        setTwoFactorStatus(parsed);
      } catch (error) {
        console.error('Error loading 2FA status:', error);
      }
    } else {
      setTwoFactorStatus({ enabled: false });
    }

    // Show success message
    setSuccessMessage(
      enabled
        ? 'Two-factor authentication has been enabled successfully!'
        : 'Two-factor authentication has been disabled.'
    );
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={getUserDisplayName(user)} />
            ) : (
              <div className="avatar-placeholder">{getUserInitials(user)}</div>
            )}
          </div>
          <div className="profile-info">
            <h1>{getUserDisplayName(user)}</h1>
            <p className="profile-role">{user.role}</p>
            {user.emailVerified ? (
              <span className="badge badge-success">Email Verified</span>
            ) : (
              <span className="badge badge-warning">Email Not Verified</span>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="success-message" role="alert">
            {successMessage}
          </div>
        )}

        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing && (
              <button onClick={handleEdit} className="btn-secondary">
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing || isSaving}
                  className={errors.firstName ? 'error' : ''}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing || isSaving}
                  className={errors.lastName ? 'error' : ''}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={errors.email ? 'error' : ''}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={errors.username ? 'error' : ''}
                aria-invalid={!!errors.username}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button onClick={handleCancel} className="btn-secondary" disabled={isSaving}>
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Details</h2>
          <div className="account-details">
            <div className="detail-row">
              <span className="detail-label">User ID:</span>
              <span className="detail-value">{user.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">{formatDate(user.createdAt)}</span>
            </div>
            {user.lastLogin && (
              <div className="detail-row">
                <span className="detail-label">Last Login:</span>
                <span className="detail-value">{formatDate(user.lastLogin)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Security</h2>
          <div className="security-actions">
            <button className="btn-secondary btn-full" onClick={handleOpenPasswordModal}>
              Change Password
            </button>

            <div className="security-action-item">
              <div className="security-action-header">
                <span className="security-action-title">Two-Factor Authentication</span>
                <span className="badge badge-optional">Optional</span>
              </div>
              <p className="security-action-description">
                Add an extra layer of security to your account. You will need an authenticator app
                to sign in.
              </p>
              <button
                className="btn-secondary btn-full"
                onClick={() => setShowTwoFactorSetup(true)}
              >
                {twoFactorStatus.enabled ? 'Manage 2FA' : 'Set Up 2FA'}
              </button>
              {twoFactorStatus.enabled && (
                <div className="security-status">
                  <span className="badge badge-success">Enabled</span>
                  {twoFactorStatus.setupDate && (
                    <span className="status-detail">
                      Since {formatDate(twoFactorStatus.setupDate)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button className="btn-secondary btn-full" onClick={() => setShowActiveSessions(true)}>
              Active Sessions
            </button>
          </div>
        </div>

        <div className="profile-section danger-zone">
          <h2>Danger Zone</h2>
          <div className="danger-actions">
            <button onClick={handleLogout} className="btn-danger btn-full">
              Sign Out
            </button>
            <button className="btn-danger-outline btn-full" onClick={handleOpenDeleteModal}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={handleClosePasswordModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            ref={passwordModalRef}
          >
            <div className="modal-header">
              <h2 id="password-modal-title">Change Password</h2>
              <button
                className="modal-close"
                onClick={handleClosePasswordModal}
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
                  onChange={handlePasswordChange}
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
                  onChange={handlePasswordChange}
                  disabled={isChangingPassword}
                  className={passwordErrors.newPassword ? 'error' : ''}
                  aria-invalid={!!passwordErrors.newPassword}
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">{passwordErrors.newPassword}</span>
                )}

                {/* Password Strength Indicator */}
                {passwordData.newPassword && passwordStrength && (
                  <div className="password-strength">
                    <div className="strength-bar-container">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(),
                        }}
                      />
                    </div>
                    <div className="strength-info">
                      <span
                        className="strength-label"
                        style={{ color: getPasswordStrengthColor() }}
                      >
                        {getPasswordStrengthLabel()}
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
                  onChange={handlePasswordChange}
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
              <button
                className="btn-secondary"
                onClick={handleClosePasswordModal}
                disabled={isChangingPassword}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={handleCloseDeleteModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div
            className="modal-content modal-danger"
            onClick={(e) => e.stopPropagation()}
            ref={deleteModalRef}
          >
            <div className="modal-header">
              <h2 id="delete-modal-title">Delete Account</h2>
              <button
                className="modal-close"
                onClick={handleCloseDeleteModal}
                aria-label="Close modal"
                disabled={isDeletingAccount}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="warning-box">
                <p className="warning-title">Warning: This action cannot be undone!</p>
                <p>Deleting your account will:</p>
                <ul>
                  <li>Permanently delete all your personal data</li>
                  <li>Remove all your progress and achievements</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Delete all saved content and preferences</li>
                </ul>
              </div>

              <div className="form-group">
                <label htmlFor="deleteConfirmation">
                  To confirm, type <strong>DELETE</strong> or your email{' '}
                  <strong>{user.email}</strong>
                </label>
                <input
                  ref={deleteInputRef}
                  type="text"
                  id="deleteConfirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  disabled={isDeletingAccount}
                  placeholder="Type DELETE or your email"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={handleCloseDeleteModal}
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={
                  isDeletingAccount ||
                  (deleteConfirmation !== 'DELETE' && deleteConfirmation !== user.email)
                }
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete Account Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorSetup && (
        <TwoFactorSetup
          userEmail={user.email}
          isEnabled={twoFactorStatus.enabled}
          onClose={() => setShowTwoFactorSetup(false)}
          onComplete={handleTwoFactorComplete}
        />
      )}

      {/* Active Sessions Modal */}
      {showActiveSessions && <ActiveSessions onClose={() => setShowActiveSessions(false)} />}
    </div>
  );
};
