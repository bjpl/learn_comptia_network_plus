import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProgressModel } from '../models/progress.model';
import { logger } from '../config/logger';

export class ProgressController {
  static async getProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { component_id } = req.query;

      if (component_id && typeof component_id === 'string') {
        const progress = await ProgressModel.findByUserAndComponent(
          req.user.userId,
          component_id
        );
        res.status(200).json({
          success: true,
          data: progress,
        });
      } else {
        const overallProgress = await ProgressModel.getOverallProgress(req.user.userId);
        res.status(200).json({
          success: true,
          data: overallProgress,
        });
      }
    } catch (error) {
      logger.error('Get progress error:', error);
      next(error);
    }
  }

  static async saveProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { component_id, progress } = req.body;

      const savedProgress = await ProgressModel.create({
        user_id: req.user.userId,
        component_id,
        progress,
      });

      logger.info(`Progress saved for user ${req.user.email}, component ${component_id}`);

      res.status(201).json({
        success: true,
        data: savedProgress,
      });
    } catch (error) {
      logger.error('Save progress error:', error);
      next(error);
    }
  }

  static async deleteProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { component_id } = req.params;

      const deleted = await ProgressModel.delete(req.user.userId, component_id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Progress not found',
        });
        return;
      }

      logger.info(`Progress deleted for user ${req.user.email}, component ${component_id}`);

      res.status(200).json({
        success: true,
        message: 'Progress deleted successfully',
      });
    } catch (error) {
      logger.error('Delete progress error:', error);
      next(error);
    }
  }
}

export default ProgressController;
