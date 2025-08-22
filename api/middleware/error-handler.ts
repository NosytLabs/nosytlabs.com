/**
 * Error handling middleware for API routes
 */

import type { Request, Response, NextFunction } from 'express';

// Error types enum
export enum ErrorTypes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR'
}

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  type?: ErrorTypes;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;
  type?: ErrorTypes;

  constructor(message: string, statusCode: number = 500, type?: ErrorTypes) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.type = type || ErrorTypes.INTERNAL_ERROR;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  // Log error details
  console.error('API Error:', {
    statusCode,
    message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    statusCode = 500;
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    }
  });
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, _res, next)).catch(next);
  };
};

export const validateRequest = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map((detail: any) => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

export const rateLimitHandler = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader('Retry-After', '60');
  next(new AppError('Too many requests, please try again later', 429));
};

// Create error helper function
export const createError = (message: string, statusCode: number = 500, type?: ErrorTypes): AppError => {
  return new AppError(message, statusCode, type);
};

// Async error handler (alias for asyncHandler)
export const asyncErrorHandler = asyncHandler;