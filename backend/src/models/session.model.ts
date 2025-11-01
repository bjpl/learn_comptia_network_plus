import { pool } from '../config/database';
import { logger } from '../config/logger';

export interface LearningSession {
  id: number;
  user_id: number;
  component_id: string;
  duration: number;
  activities: any[];
  completed_at: Date;
}

export interface CreateSessionData {
  user_id: number;
  component_id: string;
  duration: number;
  activities?: any[];
}

export class SessionModel {
  static async create(sessionData: CreateSessionData): Promise<LearningSession> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO learning_sessions
         (user_id, component_id, duration, activities, completed_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          sessionData.user_id,
          sessionData.component_id,
          sessionData.duration,
          JSON.stringify(sessionData.activities || []),
        ]
      );

      logger.info(`Learning session saved for user ${sessionData.user_id}, component ${sessionData.component_id}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating learning session:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId: number): Promise<LearningSession[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM learning_sessions WHERE user_id = $1 ORDER BY completed_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error finding sessions by user id:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserAndComponent(
    userId: number,
    componentId: string
  ): Promise<LearningSession[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM learning_sessions
         WHERE user_id = $1 AND component_id = $2
         ORDER BY completed_at DESC`,
        [userId, componentId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error finding sessions by user and component:', error);
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
          component_id,
          COUNT(*) as session_count,
          SUM(duration) as total_duration,
          AVG(duration) as avg_duration,
          MAX(completed_at) as last_session
         FROM learning_sessions
         WHERE user_id = $1
         GROUP BY component_id`,
        [userId]
      );

      const totalResult = await client.query(
        `SELECT
          COUNT(*) as total_sessions,
          SUM(duration) as total_learning_time,
          AVG(duration) as avg_session_duration
         FROM learning_sessions
         WHERE user_id = $1`,
        [userId]
      );

      return {
        byComponent: result.rows,
        overall: totalResult.rows[0],
      };
    } catch (error) {
      logger.error('Error getting session statistics:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default SessionModel;
