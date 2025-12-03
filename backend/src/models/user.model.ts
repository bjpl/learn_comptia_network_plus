import crypto from 'crypto';
import { pool } from '../config/database';
import { logger } from '../config/logger';
import { sanitizeForLog, sanitizeEmail } from '../utils/sanitizer';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  verification_token?: string | null;
  verification_token_expires?: Date | null;
  failed_login_attempts: number;
  locked_until: Date | null;
  last_failed_login: Date | null;
  reset_token?: string | null;
  reset_token_expires?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AccountLockStatus {
  locked: boolean;
  lockedUntil?: Date;
  remainingMinutes?: number;
}

export interface UserProfile {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  role?: string;
}

export interface UpdateUserData {
  email?: string;
  password_hash?: string;
  role?: string;
  is_active?: boolean;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userData.email, userData.password_hash, userData.role || 'student']
      );

      // Create associated profile
      await client.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [result.rows[0].id]);

      logger.info(`User created: ${userData.email}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by id:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id: number, userData: UpdateUserData): Promise<User | null> {
    const client = await pool.connect();
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        return this.findById(id);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(query, values);
      logger.info(`User updated: ${id}`);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM users WHERE id = $1', [id]);
      logger.info(`User deleted: ${id}`);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getProfile(userId: number): Promise<UserProfile | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateProfile(
    userId: number,
    profileData: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    const client = await pool.connect();
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'user_id') {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        return this.getProfile(userId);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);

      const query = `
        UPDATE user_profiles
        SET ${fields.join(', ')}
        WHERE user_id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(query, values);
      logger.info(`User profile updated: ${userId}`);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if account is locked due to failed login attempts
   */
  static async isAccountLocked(email: string): Promise<AccountLockStatus> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT locked_until FROM users WHERE email = $1', [email]);

      if (!result.rows[0] || !result.rows[0].locked_until) {
        return { locked: false };
      }

      const lockedUntil = new Date(result.rows[0].locked_until);
      const now = new Date();

      if (lockedUntil > now) {
        const remainingMs = lockedUntil.getTime() - now.getTime();
        const remainingMinutes = Math.ceil(remainingMs / 60000);

        return {
          locked: true,
          lockedUntil,
          remainingMinutes,
        };
      }

      // Lock has expired, reset the lock
      await client.query(
        `UPDATE users
         SET locked_until = NULL,
             failed_login_attempts = 0
         WHERE email = $1`,
        [email]
      );

      return { locked: false };
    } catch (error) {
      logger.error('Error checking account lock status:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Increment failed login attempts and lock account if threshold exceeded
   */
  static async incrementFailedAttempts(email: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE users
         SET failed_login_attempts = failed_login_attempts + 1,
             last_failed_login = CURRENT_TIMESTAMP
         WHERE email = $1`,
        [email]
      );

      logger.warn(`Failed login attempt recorded for: ${sanitizeEmail(email)}`);
    } catch (error) {
      logger.error('Error incrementing failed attempts:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get current failed login attempts count
   */
  static async getFailedAttempts(email: string): Promise<number> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT failed_login_attempts FROM users WHERE email = $1',
        [email]
      );

      return result.rows[0]?.failed_login_attempts || 0;
    } catch (error) {
      logger.error('Error getting failed attempts:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Lock account for specified duration in minutes
   */
  static async lockAccount(email: string, durationMinutes: number): Promise<void> {
    const client = await pool.connect();
    try {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes);

      await client.query(
        `UPDATE users
         SET locked_until = $1
         WHERE email = $2`,
        [lockedUntil, email]
      );

      logger.warn(`Account locked for ${sanitizeForLog(durationMinutes)} minutes: ${sanitizeEmail(email)}`);
    } catch (error) {
      logger.error('Error locking account:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reset failed login attempts (called on successful login)
   */
  static async resetFailedAttempts(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE users
         SET failed_login_attempts = 0,
             locked_until = NULL,
             last_failed_login = NULL
         WHERE id = $1`,
        [userId]
      );

      logger.info(`Failed login attempts reset for user: ${userId}`);
    } catch (error) {
      logger.error('Error resetting failed attempts:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Create a password reset token for a user
   * @param userId User ID
   * @returns Reset token (32 random bytes as hex string)
   */
  static async createPasswordResetToken(userId: number): Promise<string> {
    const client = await pool.connect();
    try {
      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');

      // Token expires in 1 hour
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await client.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
        [token, expires, userId]
      );

      logger.info(`Password reset token created for user: ${userId}`);
      return token;
    } catch (error) {
      logger.error('Error creating password reset token:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Validate a password reset token
   * @param token Reset token
   * @returns User ID if token is valid, null otherwise
   */
  static async validateResetToken(token: string): Promise<number | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        logger.warn('Invalid or expired reset token attempted');
        return null;
      }

      return result.rows[0].id;
    } catch (error) {
      logger.error('Error validating reset token:', error);
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * Clear the password reset token for a user
   * @param userId User ID
   */
  static async clearResetToken(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = $1',
        [userId]
      );

      logger.info(`Password reset token cleared for user: ${userId}`);
    } catch (error) {
      logger.error('Error clearing reset token:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update user's password
   * @param userId User ID
   * @param passwordHash New password hash
   */
  static async updatePassword(userId: number, passwordHash: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [passwordHash, userId]
      );

      logger.info(`Password updated for user: ${userId}`);
    } catch (error) {
      logger.error('Error updating password:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  /**
   * Get user settings
   */
  static async getSettings(userId: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM user_settings WHERE user_id = $1', [userId]);

      if (result.rows.length === 0) {
        // Create default settings if they don't exist
        const defaultSettings = await client.query(
          'INSERT INTO user_settings (user_id) VALUES ($1) RETURNING *',
          [userId]
        );
        return defaultSettings.rows[0];
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error getting user settings:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(userId: number, settings: any): Promise<any> {
    const client = await pool.connect();
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      const allowedFields = [
        'theme',
        'language',
        'notifications_enabled',
        'email_notifications',
        'push_notifications',
        'study_reminders',
        'reminder_time',
        'reminder_days',
        'accessibility_mode',
        'high_contrast',
        'font_size',
        'reduce_motion',
        'auto_play_videos',
        'show_hints',
        'difficulty_level',
        'daily_goal_minutes',
        'privacy_settings',
      ];

      Object.entries(settings).forEach(([key, value]) => {
        if (value !== undefined && allowedFields.includes(key)) {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        return this.getSettings(userId);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);

      const query = `
        UPDATE user_settings
        SET ${fields.join(', ')}
        WHERE user_id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        // If no rows affected, settings don't exist yet, so create them
        return this.getSettings(userId);
      }

      logger.info(`User settings updated: ${userId}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating user settings:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update user password
   */

  /**
   * Update user avatar
   */
  static async updateAvatar(userId: number, avatarUrl: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE user_profiles SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [avatarUrl, userId]
      );
      logger.info(`Avatar updated for user: ${userId}`);
    } catch (error) {
      logger.error('Error updating avatar:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete user account (soft delete)
   */
  static async deleteAccount(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      // Soft delete - anonymize data and mark as deleted
      await client.query(
        `UPDATE users
         SET email = CONCAT('deleted_', id::text, '@deleted.local'),
             username = CONCAT('deleted_', id::text),
             deleted_at = CURRENT_TIMESTAMP,
             account_status = 'deleted',
             is_active = FALSE
         WHERE id = $1`,
        [userId]
      );
      logger.warn(`Account deleted for user: ${userId}`);
    } catch (error) {
      logger.error('Error deleting account:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Create email verification token
   */
  static async createVerificationToken(userId: number): Promise<string> {
    const client = await pool.connect();
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await client.query(
        `UPDATE users
         SET verification_token = $1, verification_token_expires = $2
         WHERE id = $3`,
        [token, expires, userId]
      );

      logger.info(`Verification token created for user: ${userId}`);
      return token;
    } catch (error) {
      logger.error('Error creating verification token:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Verify email token and mark email as verified
   */
  static async verifyEmailToken(token: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE users
         SET email_verified = TRUE,
             verification_token = NULL,
             verification_token_expires = NULL
         WHERE verification_token = $1
           AND verification_token_expires > NOW()
           AND email_verified = FALSE
         RETURNING id`,
        [token]
      );

      if (result.rows.length > 0) {
        logger.info(`Email verified for user: ${result.rows[0].id}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error verifying email token:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default UserModel;
