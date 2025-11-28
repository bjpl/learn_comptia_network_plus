import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendError } from '../utils/response';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('Error occurred:', {
    statusCode,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const details =
    process.env.NODE_ENV === 'development'
      ? {
          stack: err.stack,
          details: err.details,
        }
      : undefined;

  sendError(res, message, statusCode, details);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  sendError(res, 'Route not found', 404);
};

export default { errorHandler, notFoundHandler };
