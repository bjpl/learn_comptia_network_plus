import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { logger } from '../config/logger';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      const profile = await UserModel.getProfile(user.id);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          profile: profile || {},
        },
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
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
        res.status(404).json({
          success: false,
          error: 'Profile not found',
        });
        return;
      }

      logger.info(`Profile updated for user: ${req.user.email}`);

      res.status(200).json({
        success: true,
        data: updatedProfile,
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      next(error);
    }
  }
}

export default UserController;
