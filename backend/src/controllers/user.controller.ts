import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { logger } from '../config/logger';
import { sendSuccess, sendError, sendMessage } from '../utils/response';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        profile: profile || {},
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { first_name, last_name, avatar_url, bio } = req.body;

      const updatedProfile = await UserModel.updateProfile(req.user.userId, {
        first_name,
        last_name,
        avatar_url,
        bio,
      });

      if (!updatedProfile) {
        sendError(res, 'Profile not found', 404);
        return;
      }

      logger.info(`Profile updated for user: ${req.user.email}`);

      sendSuccess(res, updatedProfile);
    } catch (error) {
      logger.error('Update profile error:', error);
      next(error);
    }
  }
  static async getSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const settings = await UserModel.getSettings(req.user.userId);

      sendSuccess(res, settings);
    } catch (error) {
      logger.error('Get settings error:', error);
      next(error);
    }
  }

  static async updateSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const updatedSettings = await UserModel.updateSettings(req.user.userId, req.body);

      logger.info(`Settings updated for user: ${req.user.email}`);

      sendSuccess(res, updatedSettings);
    } catch (error) {
      logger.error('Update settings error:', error);
      next(error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password hash
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      // Verify current password
      const isValid = await AuthService.comparePassword(currentPassword, user.password_hash);
      if (!isValid) {
        sendError(res, 'Current password is incorrect', 401);
        return;
      }

      // Hash and update new password
      const newHash = await AuthService.hashPassword(newPassword);
      await UserModel.updatePassword(req.user.userId, newHash);

      // Optionally: Invalidate all refresh tokens for this user
      // await AuthService.deleteUserRefreshTokens(req.user.userId);

      logger.info(`Password changed for user: ${req.user.email}`);

      sendMessage(res, 'Password updated successfully');
    } catch (error) {
      logger.error('Change password error:', error);
      next(error);
    }
  }

  static async updateAvatar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { avatar } = req.body;

      // Validate avatar size if it's base64
      if (avatar.startsWith('data:image/')) {
        const base64Data = avatar.split(',')[1];
        const sizeInBytes = (base64Data.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (sizeInBytes > maxSize) {
          sendError(res, 'Avatar image size exceeds 5MB limit', 400);
          return;
        }
      }

      await UserModel.updateAvatar(req.user.userId, avatar);

      logger.info(`Avatar updated for user: ${req.user.email}`);

      sendSuccess(res, { avatarUrl: avatar });
    } catch (error) {
      logger.error('Update avatar error:', error);
      next(error);
    }
  }

  static async deleteAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { password } = req.body;

      // Get user with password hash
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      // Verify password
      const isValid = await AuthService.comparePassword(password, user.password_hash);
      if (!isValid) {
        sendError(res, 'Password is incorrect', 401);
        return;
      }

      // Delete all refresh tokens
      await AuthService.deleteUserRefreshTokens(req.user.userId);

      // Soft delete the account
      await UserModel.deleteAccount(req.user.userId);

      logger.warn(`Account deleted: ${req.user.email}`);

      sendMessage(res, 'Account deleted successfully');
    } catch (error) {
      logger.error('Delete account error:', error);
      next(error);
    }
  }
}

export default UserController;
