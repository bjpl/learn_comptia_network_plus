import { Response } from 'express';

/**
 * Standardized API response interface
 * All API endpoints should return responses matching this format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

/**
 * Send successful response with data
 * @param res - Express response object
 * @param data - Response data
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - Optional metadata (pagination, etc.)
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param res - Express response object
 * @param error - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @param details - Optional error details
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400,
  details?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  if (details) response.meta = { details };
  return res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 * @param res - Express response object
 * @param data - Created resource data
 * @param meta - Optional metadata
 */
export const sendCreated = <T>(res: Response, data: T, meta?: ApiResponse['meta']): Response => {
  return sendSuccess(res, data, 201, meta);
};

/**
 * Send no content response (204)
 * @param res - Express response object
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Send paginated response
 * @param res - Express response object
 * @param data - Array of data items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  return sendSuccess(res, data, 200, { page, limit, total });
};

/**
 * Send response with custom message
 * @param res - Express response object
 * @param message - Success message
 * @param data - Optional data
 * @param statusCode - HTTP status code (default: 200)
 */
export const sendMessage = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
  };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};
