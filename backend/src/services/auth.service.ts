import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { logger } from '../config/logger';

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
  private static SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
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
