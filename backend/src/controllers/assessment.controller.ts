import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AssessmentModel } from '../models/assessment.model';
import { logger } from '../config/logger';

export class AssessmentController {
  static async getAssessments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { assessment_type } = req.query;

      if (assessment_type && typeof assessment_type === 'string') {
        const assessments = await AssessmentModel.findByUserAndType(
          req.user.userId,
          assessment_type
        );
        res.status(200).json({
          success: true,
          data: assessments,
        });
      } else {
        const assessments = await AssessmentModel.findByUserId(req.user.userId);
        res.status(200).json({
          success: true,
          data: assessments,
        });
      }
    } catch (error) {
      logger.error('Get assessments error:', error);
      next(error);
    }
  }

  static async saveAssessment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
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

      logger.info(`Assessment saved for user ${req.user.email}, type ${assessment_type}`);

      res.status(201).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      logger.error('Save assessment error:', error);
      next(error);
    }
  }

  static async getStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const statistics = await AssessmentModel.getStatistics(req.user.userId);

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      logger.error('Get assessment statistics error:', error);
      next(error);
    }
  }
}

export default AssessmentController;
