/**
 * CSRF Protection Middleware
 * Implements token-based CSRF protection for state-changing operations
 */

import { Request, Response, NextFunction } from 'express';
import { randomBytes, timingSafeEqual } from 'crypto';
import { logger } from '../config/logger';

/**
 * CSRF token storage
 * In production, use Redis or database for distributed systems
 */
const tokenStore = new Map<string, { token: string; expiresAt: number }>();

/**
 * Token expiration time (15 minutes)
 */
const TOKEN_EXPIRY = 15 * 60 * 1000;

/**
 * Clean up expired tokens periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of tokenStore.entries()) {
    if (data.expiresAt < now) {
      tokenStore.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

/**
 * Generate a cryptographically secure CSRF token
 */
const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * Get session ID from request
 * In production, use actual session ID from session middleware
 */
const getSessionId = (req: Request): string => {
  // Use user ID if authenticated, otherwise use IP + User-Agent
  const userId = (req as any).user?.userId;
  if (userId) {
    return `user_${userId}`;
  }

  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  return `${ip}_${userAgent}`;
};

/**
 * Generate and store CSRF token
 * Use this middleware for GET requests to set tokens
 */
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const sessionId = getSessionId(req);
    const token = generateToken();
    const expiresAt = Date.now() + TOKEN_EXPIRY;

    // Store token
    tokenStore.set(sessionId, { token, expiresAt });

    // Set token in cookie (not httpOnly so JavaScript can read it)
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // Allow JavaScript to read
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRY,
    });

    // Also attach to response for header usage
    res.locals.csrfToken = token;

    next();
  } catch (error) {
    logger.error('Error generating CSRF token:', error);
    next(error);
  }
};

/**
 * Verify CSRF token
 * Use this middleware for POST, PUT, DELETE, PATCH requests
 */
export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const sessionId = getSessionId(req);

    // Get token from header or body
    const headerToken = req.get('X-CSRF-Token') || req.get('X-XSRF-Token');
    const bodyToken = req.body?._csrf;
    const providedToken = headerToken || bodyToken;

    if (!providedToken) {
      logger.warn('CSRF token missing', {
        sessionId,
        ip: req.ip,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: 'CSRF token missing',
        code: 'CSRF_TOKEN_MISSING',
      });
      return;
    }

    // Get stored token
    const stored = tokenStore.get(sessionId);

    if (!stored) {
      logger.warn('CSRF token not found in store', {
        sessionId,
        ip: req.ip,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: 'CSRF token invalid or expired',
        code: 'CSRF_TOKEN_INVALID',
      });
      return;
    }

    // Check expiration
    if (stored.expiresAt < Date.now()) {
      tokenStore.delete(sessionId);
      logger.warn('CSRF token expired', {
        sessionId,
        ip: req.ip,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: 'CSRF token expired',
        code: 'CSRF_TOKEN_EXPIRED',
      });
      return;
    }

    // Timing-safe comparison to prevent timing attacks
    const providedBuffer = Buffer.from(providedToken);
    const storedBuffer = Buffer.from(stored.token);

    if (providedBuffer.length !== storedBuffer.length) {
      logger.warn('CSRF token length mismatch', {
        sessionId,
        ip: req.ip,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: 'CSRF token invalid',
        code: 'CSRF_TOKEN_INVALID',
      });
      return;
    }

    if (!timingSafeEqual(providedBuffer, storedBuffer)) {
      logger.warn('CSRF token mismatch', {
        sessionId,
        ip: req.ip,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: 'CSRF token invalid',
        code: 'CSRF_TOKEN_INVALID',
      });
      return;
    }

    // Token valid - regenerate for next request
    const newToken = generateToken();
    tokenStore.set(sessionId, {
      token: newToken,
      expiresAt: Date.now() + TOKEN_EXPIRY,
    });

    res.cookie('XSRF-TOKEN', newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRY,
    });

    next();
  } catch (error) {
    logger.error('Error verifying CSRF token:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * CSRF protection middleware
 * Automatically generates tokens for GET requests and verifies for others
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  // Skip CSRF for safe methods
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return generateCsrfToken(req, res, next);
  }

  // Verify CSRF for state-changing methods
  return verifyCsrfToken(req, res, next);
};

/**
 * Optional: Skip CSRF for specific routes (e.g., webhooks, API tokens)
 * Use with caution!
 */
export const skipCsrf = (req: Request, res: Response, next: NextFunction): void => {
  next();
};

export default { csrfProtection, generateCsrfToken, verifyCsrfToken, skipCsrf };
