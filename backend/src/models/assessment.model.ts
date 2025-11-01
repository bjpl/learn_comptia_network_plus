import { pool } from '../config/database';
import { logger } from '../config/logger';

export interface AssessmentResult {
  id: number;
  user_id: number;
  assessment_type: string;
  score: number;
  max_score: number;
  answers: any;
  time_taken?: number;
  completed_at: Date;
}

export interface CreateAssessmentData {
  user_id: number;
  assessment_type: string;
  score: number;
  max_score: number;
  answers: any;
  time_taken?: number;
}

export class AssessmentModel {
  static async create(assessmentData: CreateAssessmentData): Promise<AssessmentResult> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO assessment_results
         (user_id, assessment_type, score, max_score, answers, time_taken, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          assessmentData.user_id,
          assessmentData.assessment_type,
          assessmentData.score,
          assessmentData.max_score,
          JSON.stringify(assessmentData.answers),
          assessmentData.time_taken || null,
        ]
      );

      logger.info(`Assessment saved for user ${assessmentData.user_id}, type ${assessmentData.assessment_type}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating assessment:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId: number): Promise<AssessmentResult[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM assessment_results WHERE user_id = $1 ORDER BY completed_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error finding assessments by user id:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserAndType(
    userId: number,
    assessmentType: string
  ): Promise<AssessmentResult[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM assessment_results
         WHERE user_id = $1 AND assessment_type = $2
         ORDER BY completed_at DESC`,
        [userId, assessmentType]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error finding assessments by user and type:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<AssessmentResult | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM assessment_results WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding assessment by id:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getStatistics(userId: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT
          assessment_type,
          COUNT(*) as attempts,
          AVG(score) as avg_score,
          MAX(score) as best_score,
          AVG(time_taken) as avg_time,
          MAX(completed_at) as last_attempt
         FROM assessment_results
         WHERE user_id = $1
         GROUP BY assessment_type`,
        [userId]
      );

      const totalResult = await client.query(
        `SELECT
          COUNT(*) as total_assessments,
          AVG(score::float / max_score * 100) as overall_percentage
         FROM assessment_results
         WHERE user_id = $1`,
        [userId]
      );

      return {
        byType: result.rows,
        overall: totalResult.rows[0],
      };
    } catch (error) {
      logger.error('Error getting assessment statistics:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM assessment_results WHERE id = $1',
        [id]
      );

      logger.info(`Assessment deleted: ${id}`);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error('Error deleting assessment:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default AssessmentModel;
