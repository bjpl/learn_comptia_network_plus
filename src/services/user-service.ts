/**
 * User Service
 * Handles user profile operations and settings
 */

import { apiClient } from './api-client';
import { API_ENDPOINTS, shouldUseMockAPI } from '../config/api-config';
import type { User } from '../types/auth';
import { mockApiDelay } from '../utils/auth';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<User> => {
  if (shouldUseMockAPI()) {
    return mockGetUserProfile();
  }

  const response = await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
  return response.data;
};

/**
 * Mock get user profile
 */
const mockGetUserProfile = async (): Promise<User> => {
  await mockApiDelay(300);

  const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
  if (!userStr) {
    throw {
      response: {
        status: 401,
        data: { message: 'Not authenticated' },
      },
    } as const;
  }

  return JSON.parse(userStr) as User;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  if (shouldUseMockAPI()) {
    return mockUpdateUserProfile(data);
  }

  const response = await apiClient.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);

  // Update stored user data
  const storage = localStorage.getItem('auth_user') ? localStorage : sessionStorage;
  storage.setItem('auth_user', JSON.stringify(response.data));

  return response.data;
};

/**
 * Mock update user profile
 */
const mockUpdateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  await mockApiDelay(500);

  const storage = localStorage.getItem('auth_user') ? localStorage : sessionStorage;
  const userStr = storage.getItem('auth_user');

  if (!userStr) {
    throw {
      response: {
        status: 401,
        data: { message: 'Not authenticated' },
      },
    } as const;
  }

  const user = JSON.parse(userStr) as User;
  const updatedUser: User = { ...user, ...data };

  storage.setItem('auth_user', JSON.stringify(updatedUser));

  return updatedUser;
};

/**
 * Change password
 */
export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockChangePassword(data);
    return;
  }

  await apiClient.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
};

/**
 * Mock change password
 */
const mockChangePassword = async (data: ChangePasswordData): Promise<void> => {
  await mockApiDelay(600);

  if (data.newPassword !== data.confirmPassword) {
    throw {
      response: {
        status: 422,
        data: {
          message: 'Passwords do not match',
          errors: {
            confirmPassword: 'Passwords do not match',
          },
        },
      },
    } as const;
  }

  console.warn('Password changed successfully');
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  if (shouldUseMockAPI()) {
    return mockUploadAvatar(file);
  }

  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{ avatarUrl: string }>(
    API_ENDPOINTS.USER.UPLOAD_AVATAR,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // Update stored user data
  const storage = localStorage.getItem('auth_user') ? localStorage : sessionStorage;
  const userStr = storage.getItem('auth_user');

  if (userStr) {
    const user = JSON.parse(userStr) as User;
    user.avatar = response.data.avatarUrl;
    storage.setItem('auth_user', JSON.stringify(user));
  }

  return response.data.avatarUrl;
};

/**
 * Mock upload avatar
 */
const mockUploadAvatar = async (file: File): Promise<string> => {
  await mockApiDelay(1000);

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw {
      response: {
        status: 422,
        data: {
          message: 'File must be an image',
        },
      },
    } as const;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw {
      response: {
        status: 422,
        data: {
          message: 'File size must be less than 2MB',
        },
      },
    } as const;
  }

  // Create mock avatar URL
  const avatarUrl = URL.createObjectURL(file);

  // Update stored user data
  const storage = localStorage.getItem('auth_user') ? localStorage : sessionStorage;
  const userStr = storage.getItem('auth_user');

  if (userStr) {
    const user = JSON.parse(userStr) as User;
    user.avatar = avatarUrl;
    storage.setItem('auth_user', JSON.stringify(user));
  }

  return avatarUrl;
};

/**
 * Get user settings
 */
export const getUserSettings = async (): Promise<UserSettings> => {
  if (shouldUseMockAPI()) {
    return mockGetUserSettings();
  }

  const response = await apiClient.get<UserSettings>(API_ENDPOINTS.USER.SETTINGS);
  return response.data;
};

/**
 * Mock get user settings
 */
const mockGetUserSettings = async (): Promise<UserSettings> => {
  await mockApiDelay(300);

  const settingsStr = localStorage.getItem('user_settings');

  if (settingsStr) {
    return JSON.parse(settingsStr) as UserSettings;
  }

  // Default settings
  const defaultSettings: UserSettings = {
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    theme: 'light',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  localStorage.setItem('user_settings', JSON.stringify(defaultSettings));

  return defaultSettings;
};

/**
 * Update user settings
 */
export const updateUserSettings = async (
  settings: Partial<UserSettings>
): Promise<UserSettings> => {
  if (shouldUseMockAPI()) {
    return mockUpdateUserSettings(settings);
  }

  const response = await apiClient.put<UserSettings>(API_ENDPOINTS.USER.SETTINGS, settings);
  return response.data;
};

/**
 * Mock update user settings
 */
const mockUpdateUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  await mockApiDelay(400);

  const settingsStr = localStorage.getItem('user_settings');
  const currentSettings: UserSettings = settingsStr
    ? (JSON.parse(settingsStr) as UserSettings)
    : await mockGetUserSettings();

  const updatedSettings: UserSettings = { ...currentSettings, ...settings };
  localStorage.setItem('user_settings', JSON.stringify(updatedSettings));

  return updatedSettings;
};

/**
 * Delete user account
 */
export const deleteAccount = async (password: string): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockDeleteAccount(password);
    return;
  }

  await apiClient.delete(API_ENDPOINTS.USER.PROFILE, {
    body: { password },
  });
};

/**
 * Mock delete account
 */
const mockDeleteAccount = async (password: string): Promise<void> => {
  await mockApiDelay(800);

  if (!password) {
    throw {
      response: {
        status: 422,
        data: {
          message: 'Password required',
        },
      },
    } as const;
  }

  // Clear all user data
  localStorage.clear();
  sessionStorage.clear();

  console.warn('Account deleted successfully');
};
