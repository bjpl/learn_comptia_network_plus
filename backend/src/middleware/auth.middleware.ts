import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../config/logger';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.length < 8) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7).trim();
    if (!token || token.length === 0) {
      sendError(res, 'Invalid token format', 401);
      return;
    }

    try {
      const payload = AuthService.verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch (error) {
      sendError(res, 'Invalid or expired token', 401);
      return;
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    sendError(res, 'Internal server error', 500);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden: Insufficient permissions', 403);
      return;
    }

    next();
  };
};

export default { authenticate, authorize };
