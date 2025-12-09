/**
 * Validation utilities for UserProfile
 */

import { validateEmail, validatePasswordStrength } from '../../../../utils/auth';
import type { FormData, FormErrors, PasswordChangeData, PasswordErrors } from '../types';

/**
 * Validate profile form data
 */
export const validateProfileForm = (formData: FormData): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  };

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  const isValid = !Object.values(errors).some((error) => error);
  return { isValid, errors };
};

/**
 * Validate password change form
 */
export const validatePasswordForm = (
  passwordData: PasswordChangeData
): { isValid: boolean; errors: PasswordErrors } => {
  const errors: PasswordErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  if (!passwordData.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!passwordData.newPassword) {
    errors.newPassword = 'New password is required';
  } else {
    const strength = validatePasswordStrength(passwordData.newPassword);
    if (!strength.isValid) {
      errors.newPassword = strength.feedback[0] || 'Password does not meet requirements';
    }
  }

  if (!passwordData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password';
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  const isValid = !Object.values(errors).some((error) => error);
  return { isValid, errors };
};
