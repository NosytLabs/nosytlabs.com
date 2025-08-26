import * as express from 'express';

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

/**
 * Enhanced error handler middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || err.message;
  } else if (err.name === 'UnauthorizedError' || err.status === 401) {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError' || err.status === 403) {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.status === 404) {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.status === 429) {
    statusCode = 429;
    message = 'Too Many Requests';
  } else if (err.status && err.status >= 400 && err.status < 500) {
    statusCode = err.status;
    message = err.message || 'Bad Request';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
    details = undefined;
  } else if (statusCode === 500) {
    details = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
      ...(details && { details }),
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * 404 Not Found handler for API routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only handle API routes
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: {
        message: 'API endpoint not found',
        status: 404,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    // Let other handlers deal with non-API routes
    next();
  }
};