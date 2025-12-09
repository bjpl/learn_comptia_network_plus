/**
 * Type definitions for UserProfile component
 */

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordErrors {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}
