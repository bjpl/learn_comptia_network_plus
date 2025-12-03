import { pool } from '../config/database';
import { logger } from '../config/logger';
import { sanitizeForLog } from '../utils/sanitizer';

export interface UserProgress {
  id: number;
  user_id: number;
  component_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  progress_percentage?: number;
  time_spent_minutes: number;
  last_position?: any;
  attempts_count: number;
  best_score?: number;
  latest_score?: number;
  completion_date?: Date;
  mastery_date?: Date;
  notes?: string;
  is_bookmarked: boolean;
  created_at: Date;
  updated_at: Date;
  // Legacy field for backward compatibility
  progress?: any;
  last_accessed?: Date;
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

      logger.info(
        `Progress saved for user ${sanitizeForLog(progressData.user_id)}, component ${sanitizeForLog(progressData.component_id)}`
      );
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

      logger.info(`Progress updated for user ${sanitizeForLog(userId)}, component ${sanitizeForLog(componentId)}`);
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

      logger.info(`Progress deleted for user ${sanitizeForLog(userId)}, component ${sanitizeForLog(componentId)}`);
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

  /**
   * Upsert component progress - creates or updates progress for a component
   */
  static async upsertComponentProgress(
    userId: number,
    componentId: string,
    data: {
      completed?: boolean;
      score?: number;
      timeSpent?: number;
      attempts?: number;
    }
  ): Promise<any> {
    const client = await pool.connect();
    try {
      // Convert frontend format to database format
      const status = data.completed ? 'completed' : 'in_progress';
      const score = data.score !== undefined ? data.score : null;
      const timeSpent = data.timeSpent !== undefined ? data.timeSpent : 0;
      const attempts = data.attempts !== undefined ? data.attempts : 0;

      const result = await client.query(
        `INSERT INTO user_progress (
          user_id, component_id, status, latest_score, best_score,
          time_spent_minutes, attempts_count, updated_at
        )
        VALUES ($1, $2, $3, $4, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, component_id) DO UPDATE SET
          status = COALESCE($3, user_progress.status),
          latest_score = COALESCE($4, user_progress.latest_score),
          best_score = CASE
            WHEN $4 IS NOT NULL AND $4 > COALESCE(user_progress.best_score, 0)
            THEN $4
            ELSE user_progress.best_score
          END,
          time_spent_minutes = COALESCE($5, user_progress.time_spent_minutes),
          attempts_count = COALESCE($6, user_progress.attempts_count),
          completion_date = CASE WHEN $3 = 'completed' THEN CURRENT_TIMESTAMP ELSE user_progress.completion_date END,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [userId, componentId, status, score, timeSpent, attempts]
      );

      logger.info(`Progress upserted for user ${sanitizeForLog(userId)}, component ${sanitizeForLog(componentId)}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error upserting component progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Merge client progress with server progress
   */
  static async mergeProgress(
    userId: number,
    clientProgress: Record<string, any>,
    serverProgress: any[]
  ): Promise<Record<string, any>> {
    const client = await pool.connect();
    try {
      const merged: Record<string, any> = {};

      // Start with server progress
      for (const item of serverProgress) {
        merged[item.component_id] = {
          componentId: item.component_id,
          completed: item.status === 'completed' || item.status === 'mastered',
          score: item.latest_score || item.best_score,
          timeSpent: item.time_spent_minutes || 0,
          lastVisited: item.updated_at,
          attempts: item.attempts_count || 0,
        };
      }

      // Validate clientProgress keys to prevent prototype pollution
      const safeClientProgress: Record<string, any> = {};
      const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
      for (const [key, value] of Object.entries(clientProgress)) {
        if (!dangerousKeys.includes(key) && typeof key === 'string') {
          safeClientProgress[key] = value;
        }
      }

      // Merge client progress (last-write-wins based on lastVisited)
      for (const [componentId, clientItem] of Object.entries(safeClientProgress)) {
        const serverItem = merged[componentId];

        if (!serverItem || new Date(clientItem.lastVisited) > new Date(serverItem.lastVisited)) {
          // Client is newer, update server
          await this.upsertComponentProgress(userId, componentId, clientItem);
          merged[componentId] = clientItem;
        }
      }

      return merged;
    } catch (error) {
      logger.error('Error merging progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete all progress for a user
   */
  static async deleteAllForUser(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM user_progress WHERE user_id = $1', [userId]);
      logger.info(`All progress deleted for user ${sanitizeForLog(userId)}`);
    } catch (error) {
      logger.error('Error deleting all progress:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default ProgressModel;
