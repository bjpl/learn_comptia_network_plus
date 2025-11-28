import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { authValidators } from '../utils/validators';
import { passwordResetRateLimit } from '../middleware/rate-limit.middleware';

const router = Router();

// Public routes
router.post('/register', validate(authValidators.register), AuthController.register);
router.post('/login', validate(authValidators.login), AuthController.login);
router.post('/refresh', AuthController.refresh);

// Email verification routes
router.post('/verify-email', validate(authValidators.verifyEmail), AuthController.verifyEmail);
router.post(
  '/resend-verification',
  validate(authValidators.resendVerification),
  AuthController.resendVerification
);

// Password reset routes (rate limited)
router.post(
  '/forgot-password',
  passwordResetRateLimit,
  validate(authValidators.forgotPassword),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  validate(authValidators.resetPassword),
  AuthController.resetPassword
);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
