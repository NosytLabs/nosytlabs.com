import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Extend Express Request interface to include session
 */
declare module 'express-serve-static-core' {
  interface Request {
    session?: {
      csrfToken?: string;
      [key: string]: any;
    };
  }
}

/**
 * CSRF Token Configuration
 */
interface CSRFOptions {
  skipMethods?: string[];
  skipPaths?: string[];
  tokenLength?: number;
  cookieName?: string;
  headerName?: string;
}

/**
 * Generate a secure random token
 */
function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Set CSRF token in session/cookie
 */
export async function setCSRFToken(req: Request, res: Response): Promise<string> {
  const token = generateToken();
  
  // Store token in session if available, otherwise use cookie
  if (req.session) {
    req.session.csrfToken = token;
  } else {
    res.cookie('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });
  }
  
  return token;
}

/**
 * Get CSRF token from session/cookie
 */
function getStoredToken(req: Request): string | undefined {
  if (req.session && req.session.csrfToken) {
    return req.session.csrfToken;
  }
  
  return req.cookies['csrf-token'];
}

/**
 * Get CSRF token from request headers or body
 */
function getRequestToken(req: Request, headerName: string = 'x-csrf-token'): string | undefined {
  // Check headers first
  const headerToken = req.headers[headerName] as string;
  if (headerToken) {
    return headerToken;
  }
  
  // Check body
  if (req.body && req.body._csrf) {
    return req.body._csrf;
  }
  
  return undefined;
}

/**
 * CSRF Protection Middleware
 */
export function csrfMiddleware(options: CSRFOptions = {}) {
  const {
    skipMethods = ['GET', 'HEAD', 'OPTIONS'],
    skipPaths = [],
    headerName = 'x-csrf-token'
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip CSRF check for specified methods
      if (skipMethods.includes(req.method)) {
        return next();
      }

      // Skip CSRF check for specified paths
      if (skipPaths.some(path => req.path.startsWith(path))) {
        return next();
      }

      // Get stored token
      const storedToken = getStoredToken(req);
      if (!storedToken) {
        return res.status(403).json({
          error: 'CSRF token not found in session',
          code: 'CSRF_TOKEN_MISSING'
        });
      }

      // Get request token
      const requestToken = getRequestToken(req, headerName);
      if (!requestToken) {
        return res.status(403).json({
          error: 'CSRF token not provided in request',
          code: 'CSRF_TOKEN_REQUIRED'
        });
      }

      // Compare tokens using constant-time comparison
      if (!crypto.timingSafeEqual(Buffer.from(storedToken), Buffer.from(requestToken))) {
        return res.status(403).json({
          error: 'Invalid CSRF token',
          code: 'CSRF_TOKEN_INVALID'
        });
      }

      next();
    } catch (error) {
      console.error('CSRF middleware error:', error);
      res.status(500).json({
        error: 'CSRF validation failed',
        code: 'CSRF_VALIDATION_ERROR'
      });
    }
  };
}

/**
 * Middleware to add CSRF token to response locals
 */
export function csrfTokenMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (res.locals.csrfToken) {
        return next();
      }
      
      const storedToken = getStoredToken(req);
      
      let csrfToken: string;
      if (storedToken) {
        csrfToken = storedToken;
      } else {
        csrfToken = await setCSRFToken(req, res);
      }
      // eslint-disable-next-line require-atomic-updates
       res.locals.csrfToken = csrfToken;
      
      next();
    } catch (error) {
      console.error('CSRF token middleware error:', error);
      next(error);
    }
  };
}

export default {
  csrfMiddleware,
  setCSRFToken,
  csrfTokenMiddleware
};