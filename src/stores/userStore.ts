/**
 * User Store
 * Zustand store for user profile and settings management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';
import * as userService from '../services/user-service';
import { parseApiError, logError } from '../utils/api/error-handler';
import type { UpdateProfileData, UserSettings, ChangePasswordData } from '../services/user-service';

interface UserState {
  // State
  settings: UserSettings | null;
  isLoadingSettings: boolean;
  isUpdatingProfile: boolean;
  isUploadingAvatar: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  clearError: () => void;
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  theme: 'light',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      settings: null,
      isLoadingSettings: false,
      isUpdatingProfile: false,
      isUploadingAvatar: false,
      error: null,

      /**
       * Load user settings
       */
      loadSettings: async () => {
        set({ isLoadingSettings: true, error: null });

        try {
          const settings = await userService.getUserSettings();

          set({
            settings,
            isLoadingSettings: false,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Load Settings');

          // Use default settings on error
          set({
            settings: defaultSettings,
            isLoadingSettings: false,
            error: apiError.userMessage,
          });
        }
      },

      /**
       * Update user settings
       */
      updateSettings: async (newSettings: Partial<UserSettings>) => {
        set({ isLoadingSettings: true, error: null });

        try {
          const settings = await userService.updateUserSettings(newSettings);

          set({
            settings,
            isLoadingSettings: false,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Update Settings');

          set({
            isLoadingSettings: false,
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Update user profile
       */
      updateProfile: async (data: UpdateProfileData) => {
        set({ isUpdatingProfile: true, error: null });

        try {
          const user = await userService.updateUserProfile(data);

          set({
            isUpdatingProfile: false,
          });

          return user;
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Update Profile');

          set({
            isUpdatingProfile: false,
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Change password
       */
      changePassword: async (data: ChangePasswordData) => {
        set({ error: null });

        try {
          await userService.changePassword(data);
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Change Password');

          set({
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Upload avatar
       */
      uploadAvatar: async (file: File) => {
        set({ isUploadingAvatar: true, error: null });

        try {
          const avatarUrl = await userService.uploadAvatar(file);

          set({
            isUploadingAvatar: false,
          });

          return avatarUrl;
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Upload Avatar');

          set({
            isUploadingAvatar: false,
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'comptia-network-plus-user',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
