import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AssessmentModel } from '../models/assessment.model';
import { logger } from '../config/logger';
import { sendSuccess, sendError, sendCreated } from '../utils/response';
import { sanitizeForLog } from '../utils/sanitizer';

export class AssessmentController {
  static async getAssessments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { assessment_type } = req.query;

      if (assessment_type && typeof assessment_type === 'string') {
        const assessments = await AssessmentModel.findByUserAndType(
          req.user.userId,
          assessment_type
        );
        sendSuccess(res, assessments);
      } else {
        const assessments = await AssessmentModel.findByUserId(req.user.userId);
        sendSuccess(res, assessments);
      }
    } catch (error) {
      logger.error('Get assessments error:', error);
      next(error);
    }
  }

  static async saveAssessment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { assessment_type, score, max_score, answers, time_taken } = req.body;

      const assessment = await AssessmentModel.create({
        user_id: req.user.userId,
        assessment_type,
        score,
        max_score,
        answers,
        time_taken,
      });

      logger.info(`Assessment saved for user ${sanitizeForLog(req.user.userId)}, type ${sanitizeForLog(assessment_type)}`);

      sendCreated(res, assessment);
    } catch (error) {
      logger.error('Save assessment error:', error);
      next(error);
    }
  }

  static async getStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const statistics = await AssessmentModel.getStatistics(req.user.userId);

      sendSuccess(res, statistics);
    } catch (error) {
      logger.error('Get assessment statistics error:', error);
      next(error);
    }
  }
}

export default AssessmentController;
