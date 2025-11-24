/**
 * User Profile Component
 * Displays and manages user profile information
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials, validateEmail } from '../../utils/auth';
import type { User } from '../../types/auth';
import './UserProfile.css';

export const UserProfile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
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
    return !Object.values(newErrors).some(error => error);
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
    if (!validateForm()) {return;}

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

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
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
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
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
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
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
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
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={isSaving}
                >
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
            <button className="btn-secondary btn-full">Change Password</button>
            <button className="btn-secondary btn-full">Two-Factor Authentication</button>
            <button className="btn-secondary btn-full">Active Sessions</button>
          </div>
        </div>

        <div className="profile-section danger-zone">
          <h2>Danger Zone</h2>
          <div className="danger-actions">
            <button onClick={handleLogout} className="btn-danger btn-full">
              Sign Out
            </button>
            <button className="btn-danger-outline btn-full">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
