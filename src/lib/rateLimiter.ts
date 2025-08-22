import rateLimit, { type RateLimitRequestHandler, type Options } from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
// import { validateEnv } from './env.js'; // Temporarily disabled for development
import { createError, ErrorTypes } from '../../api/middleware/error-handler';

/**
 * Comprehensive Rate Limiting and Security Middleware
 * Protects API endpoints from abuse and implements production-ready security
 */



interface StoreData {
  count: number;
  resetTime: number;
}

class RateLimiterService {
  private env: { NODE_ENV: string; TRUSTED_IPS?: string };
  private isDevelopment: boolean;
  private store: Map<string, StoreData>;

  constructor() {
    // this.env = validateEnv(); // Temporarily disabled for development
    this.env = { NODE_ENV: process.env.NODE_ENV || 'development' };
    this.isDevelopment = this.env.NODE_ENV === 'development';
    this.store = new Map<string, StoreData>(); // In-memory store (use Redis in production)
  }

  /**
   * Creates rate limiter middleware with custom configuration
   * @param options - Rate limiting options
   * @returns Express middleware
   */
  createLimiter(options: Partial<Options> = {}): RateLimitRequestHandler {
    const defaultOptions: Partial<Options> = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: {
        error: true,
        message: 'Too many requests from this IP, please try again later.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: Math.ceil((options.windowMs || 15 * 60 * 1000) / 1000)
      },
      standardHeaders: true, // Return rate limit info in headers
      legacyHeaders: false, // Disable X-RateLimit-* headers
      store: this.createStore(),
      keyGenerator: this.keyGenerator.bind(this),
      handler: this.rateLimitHandler.bind(this),
      skip: (req: Request, res: Response) => this.skipFunction(req, res)
      // onLimitReached is deprecated in express-rate-limit v7
    };

    return rateLimit({ ...defaultOptions, ...options });
  }

  /**
   * Strict rate limiter for authentication endpoints
   * @returns Express middleware
   */
  authLimiter(): RateLimitRequestHandler {
    return this.createLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Only 5 attempts per window
      message: {
        error: true,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: 900
      },
      skipSuccessfulRequests: true // Don't count successful requests
    });
  }

  /**
   * Contact form rate limiter
   * @returns Express middleware
   */
  contactLimiter(): RateLimitRequestHandler {
    return this.createLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 contact submissions per hour
      message: {
        error: true,
        message: 'You can only submit 3 contact forms per hour. Please try again later.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: 3600
      }
    });
  }

  /**
   * Newsletter subscription rate limiter
   * @returns Express middleware
   */
  newsletterLimiter(): RateLimitRequestHandler {
    return this.createLimiter({
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: 5, // 5 newsletter actions per day
      message: {
        error: true,
        message: 'Newsletter subscription limit reached. Please try again tomorrow.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: 86400
      }
    });
  }

  /**
   * File upload rate limiter
   * @returns Express middleware
   */
  uploadLimiter(): RateLimitRequestHandler {
    return this.createLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // 10 uploads per hour
      message: {
        error: true,
        message: 'File upload limit reached. Please try again in an hour.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: 3600
      }
    });
  }

  /**
   * API rate limiter for general endpoints
   * @returns Express middleware
   */
  apiLimiter(): RateLimitRequestHandler {
    return this.createLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // 1000 requests per window
      message: {
        error: true,
        message: 'API rate limit exceeded. Please slow down your requests.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: 900
      }
    });
  }

  /**
   * Search rate limiter
   * @returns Express middleware
   */
  searchLimiter(): RateLimitRequestHandler {
    return this.createLimiter({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 searches per minute
      message: {
        error: true,
        message: 'Search rate limit exceeded. Please wait before searching again.',
        code: ErrorTypes.RATE_LIMIT_ERROR,
        retryAfter: 60
      }
    });
  }

  /**
   * Creates a custom store for rate limiting
   * @returns Store object
   */
  createStore(): any {
    return {
      incr: (key: string, callback: (err: Error | null, count?: number, resetTime?: number) => void) => {
        const current = this.store.get(key) || { count: 0, resetTime: Date.now() + 15 * 60 * 1000 };
        
        if (Date.now() > current.resetTime) {
          current.count = 1;
          current.resetTime = Date.now() + 15 * 60 * 1000;
        } else {
          current.count++;
        }
        
        this.store.set(key, current);
        callback(null, current.count, current.resetTime);
      },
      
      decrement: (key: string) => {
        const current = this.store.get(key);
        if (current && current.count > 0) {
          current.count--;
          this.store.set(key, current);
        }
      },
      
      resetKey: (key: string) => {
        this.store.delete(key);
      },
      
      resetAll: () => {
        this.store.clear();
      }
    };
  }

  /**
   * Generates unique key for rate limiting
   * @param req - Express request object
   * @returns Unique key
   */
  keyGenerator(req: Request): string {
    const extendedReq = req as Request & { user?: { id: string } };
    // Use IP address as primary identifier
    let key = extendedReq.ip || extendedReq.connection?.remoteAddress || 'unknown';
    
    // Add user ID if authenticated
    if (extendedReq.user && extendedReq.user.id) {
      key += `:user:${extendedReq.user.id}`;
    }
    
    // Add endpoint-specific identifier
    if (extendedReq.route && extendedReq.route.path) {
      key += `:route:${extendedReq.route.path}`;
    }
    
    return key;
  }

  /**
   * Custom rate limit handler
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   * @param options - Rate limit options
   */
  rateLimitHandler(req: Request & { user?: { role: string } }, res: Response, next: NextFunction, options: any): void {
    const error = createError(
      'Rate limit exceeded',
      429,
      ErrorTypes.RATE_LIMIT_ERROR
    );
    
    // Set retry-after header
    res.set('Retry-After', options.message.retryAfter);
    
    // Log rate limit violation
    console.warn('Rate limit exceeded:', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    next(error);
  }

  /**
   * Skip function for rate limiting
   * @param {object} req - Express request object
   * @returns {boolean} Whether to skip rate limiting
   */
  skipFunction(req: Request, _res: Response): boolean {
    const extendedReq = req as Request & { user?: { role: string } };
    // Skip in development mode for certain IPs
    if (this.isDevelopment) {
      const devIPs = ['127.0.0.1', '::1', 'localhost'];
      const clientIP = extendedReq.ip || '';
      if (clientIP && devIPs.includes(clientIP)) {
        return true;
      }
    }
    
    // Skip for health checks
    if (extendedReq.path === '/health' || extendedReq.path === '/ping') {
      return true;
    }
    
    // Skip for trusted IPs (if configured)
    const trustedIPs = this.env.TRUSTED_IPS ? this.env.TRUSTED_IPS.split(',') : [];
    const clientIP = extendedReq.ip || '';
    if (clientIP && trustedIPs.includes(clientIP)) {
      return true;
    }
    
    return false;
  }

  // onLimitReached method removed - deprecated in express-rate-limit v7
}

/**
 * Security Middleware Collection
 */
export class SecurityMiddleware {
  constructor() {
    // Constructor intentionally empty - no environment variables needed
  }

  /**
   * Request size limiter middleware
   * @param {object} options - Size limit options
   * @returns {Function} Express middleware
   */
  requestSizeLimiter(options: { maxSize?: string; message?: string } = {}): (req: Request, res: Response, next: NextFunction) => void {
    const { maxSize = '10mb', message = 'Request entity too large' } = options;
    
    return (req: Request, _res: Response, next: NextFunction) => {
      const contentLength = parseInt(req.get('Content-Length') || '0');
      const maxBytes = this.parseSize(maxSize);
      
      if (contentLength > maxBytes) {
        const error = createError(
          message,
          413,
          ErrorTypes.VALIDATION_ERROR
        );
        return next(error);
      }
      
      next();
    };
  }

  /**
   * Request timeout middleware
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Function} Express middleware
   */
  requestTimeout(timeout: number = 30000): (req: Request, res: Response, next: NextFunction) => void {
    return (_req: Request, res: Response, next: NextFunction) => {
      const timer = setTimeout(() => {
        if (!res.headersSent) {
          const error = createError(
            'Request timeout',
            408,
            ErrorTypes.INTERNAL_ERROR
          );
          next(error);
        }
      }, timeout);
      
      res.on('finish', () => clearTimeout(timer));
      res.on('close', () => clearTimeout(timer));
      
      next();
    };
  }

  /**
   * IP whitelist middleware
   * @param {array} allowedIPs - Array of allowed IP addresses
   * @returns {Function} Express middleware
   */
  ipWhitelist(allowedIPs: string[] = []) {
    return (req: Request, _res: Response, next: NextFunction) => {
      const clientIP = req.ip || req.connection?.remoteAddress || 'unknown';
      
      if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
        const error = createError(
          'IP address not allowed',
          403,
          ErrorTypes.AUTHORIZATION_ERROR
        );
        return next(error);
      }
      
      next();
    };
  }

  /**
   * User agent validation middleware
   * @param {object} options - Validation options
   * @returns {Function} Express middleware
   */
  userAgentValidator(options: { required?: boolean; blockedPatterns?: string[] } = {}) {
    const { required = true, blockedPatterns = [] } = options;
    
    return (req: Request, _res: Response, next: NextFunction) => {
      const userAgent = req.get('User-Agent');
      
      if (required && !userAgent) {
        const error = createError(
          'User-Agent header is required',
          400,
          ErrorTypes.VALIDATION_ERROR
        );
        return next(error);
      }
      
      // Check for blocked patterns
      if (userAgent && blockedPatterns.some((pattern: string) => 
        new RegExp(pattern, 'i').test(userAgent)
      )) {
        const error = createError(
          'User-Agent not allowed',
          403,
          ErrorTypes.AUTHORIZATION_ERROR
        );
        return next(error);
      }
      
      next();
    };
  }

  /**
   * Request method validator
   * @param {array} allowedMethods - Array of allowed HTTP methods
   * @returns {Function} Express middleware
   */
  methodValidator(allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!allowedMethods.includes(req.method)) {
        const error = createError(
          `HTTP method ${req.method} not allowed`,
          405,
          ErrorTypes.VALIDATION_ERROR
        );
        return next(error);
      }
      
      next();
    };
  }

  /**
   * Parses size string to bytes
   * @param {string} size - Size string (e.g., '10mb', '1gb')
   * @returns {number} Size in bytes
   */
  parseSize(size: string | undefined): number {
    if (!size) return 0;
    const units: { [key: string]: number } = {
      b: 1,
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024
    };
    
    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match || !match[1]) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2] || 'b';
    
    return Math.floor(value * (units[unit] || 1));
  }
}

// Create singleton instances
const rateLimiter = new RateLimiterService();
const securityMiddleware = new SecurityMiddleware();

// Export rate limiters
export const authLimiter = rateLimiter.authLimiter();
export const contactLimiter = rateLimiter.contactLimiter();
export const newsletterLimiter = rateLimiter.newsletterLimiter();
export const uploadLimiter = rateLimiter.uploadLimiter();
export const apiLimiter = rateLimiter.apiLimiter();
export const searchLimiter = rateLimiter.searchLimiter();

// Export security middleware
export const requestSizeLimiter = securityMiddleware.requestSizeLimiter.bind(securityMiddleware);
export const requestTimeout = securityMiddleware.requestTimeout.bind(securityMiddleware);
export const ipWhitelist = securityMiddleware.ipWhitelist.bind(securityMiddleware);
export const userAgentValidator = securityMiddleware.userAgentValidator.bind(securityMiddleware);
export const methodValidator = securityMiddleware.methodValidator.bind(securityMiddleware);

/**
 * Creates a comprehensive security middleware stack
 * @param {object} options - Configuration options
 * @returns {array} Array of middleware functions
 */
export function createSecurityStack(options: {
  rateLimiter?: string;
  timeout?: number;
  maxSize?: string;
  allowedMethods?: string[];
  requireUserAgent?: boolean;
  allowedIPs?: string[];
} = {}): any[] {
  const {
    rateLimiter: rateLimiterType = 'api',
    timeout = 30000,
    maxSize = '10mb',
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'],
    requireUserAgent = true,
    allowedIPs = []
  } = options;
  
  const stack = [];
  
  // Add rate limiter
  switch (rateLimiterType) {
    case 'auth':
      stack.push(authLimiter);
      break;
    case 'contact':
      stack.push(contactLimiter);
      break;
    case 'newsletter':
      stack.push(newsletterLimiter);
      break;
    case 'upload':
      stack.push(uploadLimiter);
      break;
    case 'search':
      stack.push(searchLimiter);
      break;
    default:
      stack.push(apiLimiter);
  }
  
  // Add security middleware
  stack.push(requestTimeout(timeout));
  stack.push(requestSizeLimiter({ maxSize: maxSize || '10mb' }));
  stack.push(methodValidator(allowedMethods));
  
  if (requireUserAgent) {
    stack.push(userAgentValidator({ required: true }));
  }
  
  if (allowedIPs.length > 0) {
    stack.push(ipWhitelist(allowedIPs));
  }
  
  return stack;
}

export { rateLimiter, securityMiddleware };
export default rateLimiter;