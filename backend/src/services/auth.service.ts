import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { logger } from '../config/logger';
import { hashPassword, verifyPassword, needsRehash } from '../utils/password';

// Require JWT secrets - fail fast if not configured
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET environment variable is required');
}
if (process.env.JWT_SECRET === process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be different');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  /**
   * Hash a password using bcrypt with 12 rounds (production security)
   * @deprecated Use hashPassword from utils/password.ts instead
   */
  static async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  /**
   * Compare a password against a bcrypt hash
   * @deprecated Use verifyPassword from utils/password.ts instead
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return verifyPassword(password, hash);
  }

  /**
   * Check if a password hash needs to be upgraded and rehash if necessary
   * This should be called after successful login to upgrade old hashes
   */
  static async checkAndRehashPassword(
    userId: number,
    password: string,
    currentHash: string
  ): Promise<void> {
    const needsUpgrade = await needsRehash(currentHash);

    if (needsUpgrade) {
      logger.info(`Upgrading password hash for user ${userId} to 12 rounds`);
      const newHash = await hashPassword(password);

      const client = await pool.connect();
      try {
        await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);
        logger.info(`Password hash upgraded successfully for user ${userId}`);
      } catch (error) {
        logger.error('Error upgrading password hash:', error);
        // Don't throw - this is a non-critical operation
      } finally {
        client.release();
      }
    }
  }

  static generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  static generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async saveRefreshToken(userId: number, token: string): Promise<void> {
    const client = await pool.connect();
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await client.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
      );
    } catch (error) {
      logger.error('Error saving refresh token:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async validateRefreshToken(token: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
      );
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error validating refresh token:', error);
      return false;
    } finally {
      client.release();
    }
  }

  static async deleteRefreshToken(token: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
    } catch (error) {
      logger.error('Error deleting refresh token:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteUserRefreshTokens(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
    } catch (error) {
      logger.error('Error deleting user refresh tokens:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async cleanExpiredTokens(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
    } catch (error) {
      logger.error('Error cleaning expired tokens:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default AuthService;
