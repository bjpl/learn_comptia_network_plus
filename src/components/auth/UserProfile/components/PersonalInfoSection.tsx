/**
 * Personal Information Section Component
 */

import React from 'react';
import type { FormData, FormErrors } from '../types';

interface PersonalInfoSectionProps {
  isEditing: boolean;
  formData: FormData;
  errors: FormErrors;
  isSaving: boolean;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  isEditing,
  formData,
  errors,
  isSaving,
  onEdit,
  onChange,
  onCancel,
  onSave,
}) => {
  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Personal Information</h2>
        {!isEditing && (
          <button onClick={onEdit} className="btn-secondary">
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            disabled={!isEditing || isSaving}
            className={errors.username ? 'error' : ''}
            aria-invalid={!!errors.username}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        {isEditing && (
          <div className="form-actions">
            <button onClick={onCancel} className="btn-secondary" disabled={isSaving}>
              Cancel
            </button>
            <button onClick={onSave} className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
