/**
 * Enhanced Rate Limiting Middleware
 * Implements endpoint-specific rate limiting for security
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../config/logger';

/**
 * Rate limit exceeded handler
 */
const rateLimitHandler = (req: Request, res: Response): void => {
  logger.warn('Rate limit exceeded', {
    ip: req.ip,
    path: req.path,
    method: req.method,
  });

  res.status(429).json({
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: res.getHeader('Retry-After'),
  });
};

/**
 * Skip rate limiting for successful requests
 * Only count failed attempts
 */
const skipSuccessfulRequests = (req: Request, res: Response): boolean => {
  return res.statusCode < 400;
};

/**
 * Strict rate limiting for authentication endpoints
 * 5 attempts per 15 minutes per IP
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipSuccessfulRequests,
  keyGenerator: (req: Request): string => {
    // Rate limit by IP + email combination for login attempts
    const email = req.body?.email || '';
    return `${req.ip}_${email}`;
  },
});

/**
 * Very strict rate limiting for registration
 * 3 registrations per hour per IP
 */
export const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: 'Too many registration attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipSuccessfulRequests,
});

/**
 * Rate limiting for password reset requests
 * 3 attempts per hour per IP
 */
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Rate limiting for email verification
 * 5 attempts per hour per IP
 */
export const emailVerificationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'Too many verification attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Standard rate limiting for write operations
 * 100 requests per 15 minutes per IP
 */
export const standardRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Lenient rate limiting for read operations
 * 300 requests per 15 minutes per IP
 */
export const readRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Rate limiting for assessment submissions
 * 50 submissions per hour per user
 */
export const assessmentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 submissions per hour
  message: 'Too many assessment submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req: Request): string => {
    // Rate limit by user ID if authenticated, otherwise IP
    const userId = (req as any).user?.userId;
    return userId ? `user_${userId}` : req.ip || 'unknown';
  },
});

/**
 * Rate limiting for file uploads
 * 20 uploads per hour per user
 */
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: 'Too many upload attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req: Request): string => {
    const userId = (req as any).user?.userId;
    return userId ? `user_${userId}` : req.ip || 'unknown';
  },
});

/**
 * Rate limiting for search operations
 * 100 searches per 15 minutes per user
 */
export const searchRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 searches per window
  message: 'Too many search requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req: Request): string => {
    const userId = (req as any).user?.userId;
    return userId ? `user_${userId}` : req.ip || 'unknown';
  },
});

/**
 * Global rate limiter (applied to all routes)
 * 1000 requests per 15 minutes per IP
 */
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Rate limiting for API endpoints by authenticated user
 * 500 requests per 15 minutes per user
 */
export const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req: Request): string => {
    const userId = (req as any).user?.userId;
    return userId ? `user_${userId}` : req.ip || 'unknown';
  },
});

export default {
  authRateLimit,
  registrationRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  standardRateLimit,
  readRateLimit,
  assessmentRateLimit,
  uploadRateLimit,
  searchRateLimit,
  globalRateLimit,
  userRateLimit,
};
