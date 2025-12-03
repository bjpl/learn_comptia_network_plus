import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { EmailService } from '../services/email.service';
import { logger } from '../config/logger';
import { sendSuccess, sendError, sendCreated, sendMessage } from '../utils/response';
import { sanitizeEmail } from '../utils/sanitizer';

export class AuthController {
  static async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        sendError(res, 'User with this email already exists', 409);
        return;
      }

      // Hash password
      const password_hash = await AuthService.hashPassword(password);

      // Create user
      const user = await UserModel.create({
        email,
        password_hash,
        role: 'student',
      });

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      // Save refresh token
      await AuthService.saveRefreshToken(user.id, refreshToken);

      logger.info(`User registered successfully: ${sanitizeEmail(email)}`);

      sendCreated(res, {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  }

  static async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if account is locked BEFORE any other checks
      const lockStatus = await UserModel.isAccountLocked(email);
      if (lockStatus.locked) {
        logger.warn(`Login attempt on locked account: ${sanitizeEmail(email)}`);
        sendError(res, 'Account temporarily locked due to multiple failed login attempts', 423, {
          lockedUntil: lockStatus.lockedUntil,
          remainingMinutes: lockStatus.remainingMinutes,
        });
        return;
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists - increment attempts for attempted email
        await UserModel.incrementFailedAttempts(email);
        const attempts = await UserModel.getFailedAttempts(email);

        if (attempts >= 5) {
          await UserModel.lockAccount(email, 15);
          logger.warn(`Account locked after ${attempts} failed attempts: ${sanitizeEmail(email)}`);
        }

        sendError(res, 'Invalid email or password', 401);
        return;
      }

      // Verify password
      const isPasswordValid = await AuthService.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        // Increment failed attempts
        await UserModel.incrementFailedAttempts(email);
        const attempts = await UserModel.getFailedAttempts(email);

        // Lock account if threshold exceeded
        if (attempts >= 5) {
          await UserModel.lockAccount(email, 15);
          logger.warn(`Account locked after ${attempts} failed attempts: ${sanitizeEmail(email)}`);
          sendError(
            res,
            'Account locked due to multiple failed login attempts. Please try again in 15 minutes.',
            423,
            { remainingAttempts: 0 }
          );
          return;
        }

        const remainingAttempts = 5 - attempts;
        logger.warn(`Failed login attempt ${attempts}/5 for: ${sanitizeEmail(email)}`);

        sendError(res, 'Invalid email or password', 401, {
          remainingAttempts: remainingAttempts > 0 ? remainingAttempts : undefined,
        });
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        sendError(res, 'Account is disabled', 403);
        return;
      }

      // Reset failed login attempts on successful login
      await UserModel.resetFailedAttempts(user.id);

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      // Save refresh token
      await AuthService.saveRefreshToken(user.id, refreshToken);

      logger.info(`User logged in successfully: ${sanitizeEmail(email)}`);

      sendSuccess(res, {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await AuthService.deleteRefreshToken(refreshToken);
      }

      logger.info(`User logged out: ${sanitizeEmail(req.user?.email || '')}`);

      sendMessage(res, 'Logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }

  static async refresh(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
        sendError(res, 'Refresh token is required', 400);
        return;
      }

      // Verify refresh token
      const payload = AuthService.verifyRefreshToken(refreshToken);

      // Check if token exists in database
      const isValid = await AuthService.validateRefreshToken(refreshToken);
      if (!isValid) {
        sendError(res, 'Invalid or expired refresh token', 401);
        return;
      }

      // Get user
      const user = await UserModel.findById(payload.userId);
      if (!user || !user.is_active) {
        sendError(res, 'User not found or inactive', 401);
        return;
      }

      // Generate new tokens
      const newAccessToken = AuthService.generateAccessToken(user);
      const newRefreshToken = AuthService.generateRefreshToken(user);

      // Delete old refresh token and save new one
      await AuthService.deleteRefreshToken(refreshToken);
      await AuthService.saveRefreshToken(user.id, newRefreshToken);

      logger.info(`Token refreshed for user: ${sanitizeEmail(user.email)}`);

      sendSuccess(res, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      sendError(res, 'Invalid or expired refresh token', 401);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      const profile = await UserModel.getProfile(user.id);

      sendSuccess(res, {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: profile || {},
        created_at: user.created_at,
      });
    } catch (error) {
      logger.error('Get current user error:', error);
      next(error);
    }
  }

  /**
   * Request password reset
   * Sends password reset email if user exists
   * Always returns success to prevent email enumeration
   */
  static async forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        sendError(res, 'Email is required', 400);
        return;
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);

      // Only send email if user exists and account is active
      if (user && user.is_active) {
        // Create reset token
        const token = await UserModel.createPasswordResetToken(user.id);

        // Send password reset email
        try {
          await EmailService.sendPasswordResetEmail(email, token);
          logger.info(`Password reset email sent to: ${sanitizeEmail(email)}`);
        } catch (emailError) {
          logger.error('Error sending password reset email:', emailError);
          // Don't expose email sending errors to user
        }
      } else {
        logger.warn(`Password reset requested for non-existent or inactive account: ${sanitizeEmail(email)}`);
      }

      // Always return success to prevent email enumeration
      sendMessage(res, 'If an account exists with that email, a password reset link has been sent');
    } catch (error) {
      logger.error('Forgot password error:', error);
      next(error);
    }
  }

  /**
   * Reset password with token
   * Validates token and updates password
   */
  static async resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      // Validate input
      if (!token || !newPassword) {
        sendError(res, 'Token and new password are required', 400);
        return;
      }

      // Validate password strength (same as registration)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (newPassword.length < 8) {
        sendError(res, 'Password must be at least 8 characters long', 400);
        return;
      }
      if (!passwordRegex.test(newPassword)) {
        sendError(
          res,
          'Password must contain uppercase, lowercase, number, and special character',
          400
        );
        return;
      }

      // Validate reset token
      const userId = await UserModel.validateResetToken(token);
      if (!userId) {
        sendError(res, 'Invalid or expired reset token', 400);
        return;
      }

      // Hash new password
      const passwordHash = await AuthService.hashPassword(newPassword);

      // Update password
      await UserModel.updatePassword(userId, passwordHash);

      // Clear reset token
      await UserModel.clearResetToken(userId);

      // Optionally: Invalidate all refresh tokens for security
      await AuthService.deleteUserRefreshTokens(userId);

      logger.info(`Password reset successfully for user: ${userId}`);

      sendMessage(res, 'Password has been reset successfully');
    } catch (error) {
      logger.error('Reset password error:', error);
      next(error);
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token || typeof token !== 'string' || token.trim().length === 0) {
        sendError(res, 'Verification token is required', 400);
        return;
      }

      // Verify the token
      const verified = await UserModel.verifyEmailToken(token);
      if (!verified) {
        sendError(res, 'Invalid or expired verification token', 400);
        return;
      }

      logger.info('Email verified successfully');

      sendMessage(res, 'Email verified successfully');
    } catch (error) {
      logger.error('Email verification error:', error);
      sendError(res, 'Failed to verify email', 500);
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerification(
    req: AuthRequest,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        sendError(res, 'Email is required', 400);
        return;
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);

      // Always return success to prevent email enumeration
      if (user && !user.email_verified) {
        // Generate new verification token
        const token = await UserModel.createVerificationToken(user.id);

        // Send verification email
        await EmailService.sendVerificationEmail(email, token);

        logger.info(`Verification email resent to: ${sanitizeEmail(email)}`);
      }

      sendMessage(
        res,
        'If your email is registered and unverified, a verification email has been sent'
      );
    } catch (error) {
      logger.error('Resend verification error:', error);
      sendError(res, 'Failed to resend verification email', 500);
    }
  }
}

export default AuthController;
