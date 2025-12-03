import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProgressModel } from '../models/progress.model';
import { logger } from '../config/logger';
import { sendSuccess, sendError, sendCreated, sendMessage } from '../utils/response';
import { sanitizeForLog } from '../utils/sanitizer';

export class ProgressController {
  /**
   * Get all progress for user - returns Record<componentId, ComponentProgress>
   */
  static async getAllProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const allProgress = await ProgressModel.findByUserId(req.user.userId);

      // Convert array to Record<componentId, progress> format
      const progressMap: Record<string, any> = {};
      for (const item of allProgress) {
        progressMap[item.component_id] = {
          componentId: item.component_id,
          completed: item.status === 'completed' || item.status === 'mastered',
          score: item.latest_score || item.best_score,
          timeSpent: item.time_spent_minutes || 0,
          lastVisited: item.updated_at,
          attempts: item.attempts_count || 0,
        };
      }

      sendSuccess(res, {
        progress: progressMap,
      });
    } catch (error) {
      logger.error('Get all progress error:', error);
      next(error);
    }
  }

  /**
   * Get single component progress
   */
  static async getComponentProgress(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { componentId } = req.params;
      const progress = await ProgressModel.findByUserAndComponent(req.user.userId, componentId);

      logger.info(`Fetching progress for user ${sanitizeForLog(req.user.userId)}, component ${sanitizeForLog(componentId)}`);

      if (!progress) {
        // Return default empty progress
        sendSuccess(res, {
          progress: {
            componentId,
            completed: false,
            score: 0,
            timeSpent: 0,
            lastVisited: new Date().toISOString(),
            attempts: 0,
          },
        });
        return;
      }

      sendSuccess(res, {
        progress: {
          componentId: progress.component_id,
          completed: progress.status === 'completed' || progress.status === 'mastered',
          score: progress.latest_score || progress.best_score,
          timeSpent: progress.time_spent_minutes || 0,
          lastVisited: progress.updated_at,
          attempts: progress.attempts_count || 0,
        },
      });
    } catch (error) {
      logger.error('Get component progress error:', error);
      next(error);
    }
  }

  /**
   * Update single component progress
   */
  static async updateComponentProgress(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { componentId } = req.params;
      const updateData = req.body;

      const updated = await ProgressModel.upsertComponentProgress(
        req.user.userId,
        componentId,
        updateData
      );

      logger.info(`Progress updated for user ${sanitizeForLog(req.user.userId)}, component ${sanitizeForLog(componentId)}`);

      sendSuccess(res, {
        progress: {
          componentId: updated.component_id,
          completed: updated.status === 'completed' || updated.status === 'mastered',
          score: updated.latest_score || updated.best_score,
          timeSpent: updated.time_spent_minutes || 0,
          lastVisited: updated.updated_at,
          attempts: updated.attempts_count || 0,
        },
      });
    } catch (error) {
      logger.error('Update component progress error:', error);
      next(error);
    }
  }

  /**
   * Legacy getProgress method for backward compatibility
   */
  static async getProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { component_id } = req.query;

      if (component_id && typeof component_id === 'string') {
        const progress = await ProgressModel.findByUserAndComponent(req.user.userId, component_id);
        sendSuccess(res, progress);
      } else {
        const overallProgress = await ProgressModel.getOverallProgress(req.user.userId);
        sendSuccess(res, overallProgress);
      }
    } catch (error) {
      logger.error('Get progress error:', error);
      next(error);
    }
  }

  static async saveProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { component_id, progress } = req.body;

      const savedProgress = await ProgressModel.create({
        user_id: req.user.userId,
        component_id,
        progress,
      });

      logger.info(`Progress saved for user ${sanitizeForLog(req.user.userId)}, component ${sanitizeForLog(component_id)}`);

      sendCreated(res, savedProgress);
    } catch (error) {
      logger.error('Save progress error:', error);
      next(error);
    }
  }

  static async deleteProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { component_id } = req.params;

      const deleted = await ProgressModel.delete(req.user.userId, component_id);

      if (!deleted) {
        sendError(res, 'Progress not found', 404);
        return;
      }

      logger.info(`Progress deleted for user ${sanitizeForLog(req.user.userId)}, component ${sanitizeForLog(component_id)}`);

      sendMessage(res, 'Progress deleted successfully');
    } catch (error) {
      logger.error('Delete progress error:', error);
      next(error);
    }
  }

  /**
   * Sync progress - merge client progress with server progress
   */
  static async syncProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { progress } = req.body;

      // Get current server progress
      const serverProgress = await ProgressModel.findByUserId(req.user.userId);

      // Merge client progress with server progress
      const merged = await ProgressModel.mergeProgress(req.user.userId, progress, serverProgress);

      logger.info(`Progress synced for user ${req.user.email}`);

      sendSuccess(res, {
        componentProgress: merged,
        lastSyncedAt: new Date().toISOString(),
        version: Date.now(),
      });
    } catch (error) {
      logger.error('Sync progress error:', error);
      next(error);
    }
  }

  /**
   * Reset all progress for user
   */
  static async resetProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      await ProgressModel.deleteAllForUser(req.user.userId);

      logger.info(`All progress reset for user ${req.user.email}`);

      sendMessage(res, 'Progress reset successfully');
    } catch (error) {
      logger.error('Reset progress error:', error);
      next(error);
    }
  }
}

export default ProgressController;
