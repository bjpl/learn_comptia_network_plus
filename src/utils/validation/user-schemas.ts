/**
 * User Profile Validation Schemas
 * Zod schemas for user profile and settings validation
 */

import { z } from 'zod';
import { emailSchema, nameSchema, usernameSchema } from './auth-schemas';

/**
 * Phone number validation schema
 * Supports international formats
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()
  .or(z.literal(''));

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(500, 'URL must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * Bio/About validation schema
 */
export const bioSchema = z
  .string()
  .max(500, 'Bio must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * User profile update schema
 */
export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  username: usernameSchema.optional(),
  phone: phoneSchema,
  bio: bioSchema,
  avatar: urlSchema,
  website: urlSchema,
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * Email update schema
 */
export const updateEmailSchema = z.object({
  newEmail: emailSchema,
  password: z.string().min(1, 'Password is required to change email'),
});

export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>;

/**
 * Notification preferences schema
 */
export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  progressUpdates: z.boolean().default(true),
  assessmentReminders: z.boolean().default(true),
  achievementAlerts: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
});

export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;

/**
 * Privacy settings schema
 */
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'friends']).default('public'),
  showProgress: z.boolean().default(true),
  showAchievements: z.boolean().default(true),
  allowMessages: z.boolean().default(true),
  shareDataForImprovement: z.boolean().default(true),
});

export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;

/**
 * Learning preferences schema
 */
export const learningPreferencesSchema = z.object({
  dailyGoal: z.number().min(5, 'Daily goal must be at least 5 minutes').max(480, 'Daily goal must be less than 8 hours').default(30),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  studyMode: z.enum(['structured', 'flexible', 'exam-focused']).default('structured'),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)').optional(),
  enableReminders: z.boolean().default(false),
});

export type LearningPreferencesFormData = z.infer<typeof learningPreferencesSchema>;

/**
 * Combined settings schema
 */
export const userSettingsSchema = z.object({
  profile: updateProfileSchema.partial(),
  notifications: notificationPreferencesSchema.partial(),
  privacy: privacySettingsSchema.partial(),
  learning: learningPreferencesSchema.partial(),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;

/**
 * Account deletion schema
 */
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
  confirmation: z.string().refine((val) => val === 'DELETE', {
    message: 'Please type DELETE to confirm',
  }),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
