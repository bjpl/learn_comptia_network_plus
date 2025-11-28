import { body, param, query } from 'express-validator';

export const authValidators = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  forgotPassword: [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],
  resetPassword: [
    body('token').notEmpty().isString().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ],
  verifyEmail: [
    body('token')
      .notEmpty()
      .isString()
      .isLength({ min: 32, max: 128 })
      .withMessage('Valid verification token is required'),
  ],
  resendVerification: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
};

export const profileValidators = {
  update: [
    body('first_name')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('First name must be between 1 and 100 characters'),
    body('last_name')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Last name must be between 1 and 100 characters'),
    body('avatar_url').optional().isURL().withMessage('Avatar URL must be valid'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  ],
};

export const progressValidators = {
  create: [
    body('component_id').notEmpty().isString().withMessage('Component ID is required'),
    body('progress').notEmpty().isObject().withMessage('Progress must be an object'),
  ],
  query: [query('component_id').optional().isString().withMessage('Component ID must be a string')],
  componentParam: [
    param('componentId').notEmpty().isString().withMessage('Component ID is required'),
  ],
  updateComponent: [
    param('componentId').notEmpty().isString().withMessage('Component ID is required'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    body('score')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Score must be between 0 and 100'),
    body('timeSpent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
    body('attempts')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Attempts must be a non-negative integer'),
  ],
  sync: [body('progress').notEmpty().isObject().withMessage('Progress data is required')],
};

export const assessmentValidators = {
  create: [
    body('assessment_type').notEmpty().isString().withMessage('Assessment type is required'),
    body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
    body('max_score').isInt({ min: 1 }).withMessage('Max score must be a positive integer'),
    body('answers').notEmpty().isObject().withMessage('Answers must be provided as an object'),
    body('time_taken')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time taken must be a non-negative integer'),
  ],
  query: [
    query('assessment_type').optional().isString().withMessage('Assessment type must be a string'),
  ],
};

export const sessionValidators = {
  create: [
    body('component_id').notEmpty().isString().withMessage('Component ID is required'),
    body('duration').isInt({ min: 0 }).withMessage('Duration must be a non-negative integer'),
    body('activities').optional().isArray().withMessage('Activities must be an array'),
  ],
};

export const userSettingsValidators = {
  update: [
    body('theme')
      .optional()
      .isIn(['light', 'dark', 'system'])
      .withMessage('Theme must be light, dark, or system'),
    body('language')
      .optional()
      .isString()
      .isLength({ min: 2, max: 10 })
      .withMessage('Language must be a valid language code'),
    body('notifications_enabled')
      .optional()
      .isBoolean()
      .withMessage('Notifications enabled must be a boolean'),
    body('email_notifications')
      .optional()
      .isBoolean()
      .withMessage('Email notifications must be a boolean'),
    body('push_notifications')
      .optional()
      .isBoolean()
      .withMessage('Push notifications must be a boolean'),
    body('study_reminders').optional().isBoolean().withMessage('Study reminders must be a boolean'),
    body('reminder_time')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage('Reminder time must be in HH:MM:SS format'),
    body('reminder_days')
      .optional()
      .isArray()
      .withMessage('Reminder days must be an array')
      .custom((value) => {
        if (!Array.isArray(value)) return false;
        return value.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);
      })
      .withMessage('Reminder days must be integers between 0 and 6'),
    body('accessibility_mode')
      .optional()
      .isBoolean()
      .withMessage('Accessibility mode must be a boolean'),
    body('high_contrast').optional().isBoolean().withMessage('High contrast must be a boolean'),
    body('font_size')
      .optional()
      .isIn(['small', 'medium', 'large', 'xlarge'])
      .withMessage('Font size must be small, medium, large, or xlarge'),
    body('reduce_motion').optional().isBoolean().withMessage('Reduce motion must be a boolean'),
    body('auto_play_videos')
      .optional()
      .isBoolean()
      .withMessage('Auto play videos must be a boolean'),
    body('show_hints').optional().isBoolean().withMessage('Show hints must be a boolean'),
    body('difficulty_level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Difficulty level must be beginner, intermediate, or advanced'),
    body('daily_goal_minutes')
      .optional()
      .isInt({ min: 1, max: 1440 })
      .withMessage('Daily goal must be between 1 and 1440 minutes'),
    body('privacy_settings')
      .optional()
      .isObject()
      .withMessage('Privacy settings must be an object'),
  ],
};

export const passwordValidators = {
  change: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain uppercase, lowercase, number, and special character')
      .custom((value, { req }) => value !== req.body.currentPassword)
      .withMessage('New password must be different from current password'),
  ],
};

export const avatarValidators = {
  update: [
    body('avatar')
      .notEmpty()
      .withMessage('Avatar data is required')
      .custom((value) => {
        const urlPattern = /^https?:\/\/.+/;
        const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
        return urlPattern.test(value) || base64Pattern.test(value);
      })
      .withMessage('Avatar must be a valid URL or base64 encoded image'),
  ],
};

export const accountDeletionValidators = {
  delete: [
    body('password').notEmpty().withMessage('Password is required for account deletion'),
    body('confirmation')
      .notEmpty()
      .equals('DELETE')
      .withMessage('Confirmation must be the exact string "DELETE"'),
  ],
};

export default {
  authValidators,
  profileValidators,
  progressValidators,
  assessmentValidators,
  sessionValidators,
  userSettingsValidators,
  passwordValidators,
  avatarValidators,
  accountDeletionValidators,
};
