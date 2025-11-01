import { body, param, query } from 'express-validator';

export const authValidators = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
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
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be valid'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters'),
  ],
};

export const progressValidators = {
  create: [
    body('component_id')
      .notEmpty()
      .isString()
      .withMessage('Component ID is required'),
    body('progress')
      .notEmpty()
      .isObject()
      .withMessage('Progress must be an object'),
  ],
  query: [
    query('component_id')
      .optional()
      .isString()
      .withMessage('Component ID must be a string'),
  ],
};

export const assessmentValidators = {
  create: [
    body('assessment_type')
      .notEmpty()
      .isString()
      .withMessage('Assessment type is required'),
    body('score')
      .isInt({ min: 0 })
      .withMessage('Score must be a non-negative integer'),
    body('max_score')
      .isInt({ min: 1 })
      .withMessage('Max score must be a positive integer'),
    body('answers')
      .notEmpty()
      .isObject()
      .withMessage('Answers must be provided as an object'),
    body('time_taken')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time taken must be a non-negative integer'),
  ],
  query: [
    query('assessment_type')
      .optional()
      .isString()
      .withMessage('Assessment type must be a string'),
  ],
};

export const sessionValidators = {
  create: [
    body('component_id')
      .notEmpty()
      .isString()
      .withMessage('Component ID is required'),
    body('duration')
      .isInt({ min: 0 })
      .withMessage('Duration must be a non-negative integer'),
    body('activities')
      .optional()
      .isArray()
      .withMessage('Activities must be an array'),
  ],
};

export default {
  authValidators,
  profileValidators,
  progressValidators,
  assessmentValidators,
  sessionValidators,
};
