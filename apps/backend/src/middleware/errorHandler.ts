import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  // Log error in development
  if (config.server.nodeEnv === 'development') {
    console.error('Error:', error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(config.server.nodeEnv === 'development' && { details: error.details })
    },
    timestamp: new Date().toISOString()
  });
};

export const createError = (message: string, statusCode: number = 500, code?: string): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};
