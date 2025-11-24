import { pool } from '../config/database';
import { logger } from '../config/logger';

export interface UserProgress {
  id: number;
  user_id: number;
  component_id: string;
  progress: any;
  last_accessed: Date;
}

export interface CreateProgressData {
  user_id: number;
  component_id: string;
  progress: any;
}

export class ProgressModel {
  static async create(progressData: CreateProgressData): Promise<UserProgress> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO user_progress (user_id, component_id, progress, last_accessed)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, component_id)
         DO UPDATE SET progress = $3, last_accessed = CURRENT_TIMESTAMP
         RETURNING *`,
        [progressData.user_id, progressData.component_id, JSON.stringify(progressData.progress)]
      );

      logger.info(`Progress saved for user ${progressData.user_id}, component ${progressData.component_id}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId: number): Promise<UserProgress[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY last_accessed DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error finding progress by user id:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserAndComponent(
    userId: number,
    componentId: string
  ): Promise<UserProgress | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM user_progress WHERE user_id = $1 AND component_id = $2',
        [userId, componentId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding progress by user and component:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(
    userId: number,
    componentId: string,
    progress: any
  ): Promise<UserProgress | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE user_progress
         SET progress = $1, last_accessed = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND component_id = $3
         RETURNING *`,
        [JSON.stringify(progress), userId, componentId]
      );

      logger.info(`Progress updated for user ${userId}, component ${componentId}`);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(userId: number, componentId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM user_progress WHERE user_id = $1 AND component_id = $2',
        [userId, componentId]
      );

      logger.info(`Progress deleted for user ${userId}, component ${componentId}`);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error('Error deleting progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getOverallProgress(userId: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT
          component_id,
          progress,
          last_accessed
         FROM user_progress
         WHERE user_id = $1
         ORDER BY last_accessed DESC`,
        [userId]
      );

      return {
        totalComponents: result.rows.length,
        components: result.rows,
        lastActivity: result.rows[0]?.last_accessed || null,
      };
    } catch (error) {
      logger.error('Error getting overall progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default ProgressModel;
