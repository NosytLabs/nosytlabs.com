import { SignJWT, jwtVerify } from 'jose';
// import { validateEnv } from './env.js'; // Temporarily disabled for development

/**
 * CSRF Protection Implementation using JWT tokens
 * Provides secure token generation and validation for all forms
 */

class CSRFProtection {
  constructor() {
    // const env = validateEnv(); // Temporarily disabled for development
const env = { NODE_ENV: process.env.NODE_ENV || 'development' };
    this.secret = new TextEncoder().encode(env.CSRF_SECRET || 'default-csrf-secret-change-in-production');
    this.algorithm = 'HS256';
    this.tokenExpiry = '1h'; // 1 hour expiry
    this.cookieName = '_csrf_token';
    this.headerName = 'X-CSRF-Token';
  }

  /**
   * Generates a new CSRF token
   * @param {string} sessionId - Unique session identifier
   * @param {string} userAgent - User agent string for additional security
   * @returns {Promise<string>} JWT CSRF token
   */
  async generateToken(sessionId = 'anonymous', userAgent = '') {
    try {
      const payload = {
        sessionId,
        userAgent: this.hashUserAgent(userAgent),
        timestamp: Date.now(),
        nonce: this.generateNonce(),
      };

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: this.algorithm })
        .setIssuedAt()
        .setExpirationTime(this.tokenExpiry)
        .setIssuer('nosytlabs-csrf')
        .setAudience('nosytlabs-api')
        .sign(this.secret);

      return token;
    } catch (error) {
      console.error('CSRF token generation failed:', error);
      throw new Error('Failed to generate CSRF token');
    }
  }

  /**
   * Validates a CSRF token
   * @param {string} token - JWT CSRF token to validate
   * @param {string} sessionId - Expected session identifier
   * @param {string} userAgent - User agent string for validation
   * @returns {Promise<boolean>} Whether token is valid
   */
  async validateToken(token, sessionId = 'anonymous', userAgent = '') {
    try {
      if (!token || typeof token !== 'string') {
        return false;
      }

      const { payload } = await jwtVerify(token, this.secret, {
        issuer: 'nosytlabs-csrf',
        audience: 'nosytlabs-api',
        algorithms: [this.algorithm],
      });

      // Validate session ID
      if (payload.sessionId !== sessionId) {
        console.warn('CSRF validation failed: Session ID mismatch');
        return false;
      }

      // Validate user agent hash
      const expectedUserAgentHash = this.hashUserAgent(userAgent);
      if (payload.userAgent !== expectedUserAgentHash) {
        console.warn('CSRF validation failed: User agent mismatch');
        return false;
      }

      // Check token age (additional security)
      const tokenAge = Date.now() - payload.timestamp;
      const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
      if (tokenAge > maxAge) {
        console.warn('CSRF validation failed: Token too old');
        return false;
      }

      return true;
    } catch (error) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        console.warn('CSRF validation failed: Token expired');
      } else if (error.code === 'ERR_JWT_INVALID') {
        console.warn('CSRF validation failed: Invalid token');
      } else {
        console.error('CSRF validation error:', error);
      }
      return false;
    }
  }

  /**
   * Middleware for Express.js to handle CSRF protection
   * @param {object} options - Configuration options
   * @returns {Function} Express middleware function
   */
  middleware(options = {}) {
    const {
      skipMethods = ['GET', 'HEAD', 'OPTIONS'],
      skipPaths = [],
      errorHandler = null,
    } = options;

    return async (req, res, next) => {
      try {
        // Skip CSRF check for safe methods
        if (skipMethods.includes(req.method)) {
          return next();
        }

        // Skip CSRF check for specified paths
        if (skipPaths.some(path => req.path.startsWith(path))) {
          return next();
        }

        // Extract token from various sources
        const token = this.extractToken(req);
        if (!token) {
          return this.handleCSRFError(res, 'CSRF token missing', errorHandler);
        }

        // Get session ID and user agent
        const sessionId = req.sessionID || req.ip || 'anonymous';
        const userAgent = req.get('User-Agent') || '';

        // Validate token
        const isValid = await this.validateToken(token, sessionId, userAgent);
        if (!isValid) {
          return this.handleCSRFError(res, 'CSRF token invalid', errorHandler);
        }

        next();
      } catch (error) {
        console.error('CSRF middleware error:', error);
        return this.handleCSRFError(res, 'CSRF validation failed', errorHandler);
      }
    };
  }

  /**
   * Extracts CSRF token from request
   * @param {object} req - Express request object
   * @returns {string|null} CSRF token or null if not found
   */
  extractToken(req) {
    // Check header first
    const token = req.get(this.headerName);
    if (token) return token;

    // Check body
    if (req.body && req.body._token) {
      return req.body._token;
    }

    // Check query parameters (less secure, use sparingly)
    if (req.query && req.query._token) {
      return req.query._token;
    }

    // Check cookies
    if (req.cookies && req.cookies[this.cookieName]) {
      return req.cookies[this.cookieName];
    }

    return null;
  }

  /**
   * Handles CSRF validation errors
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {Function} errorHandler - Custom error handler
   */
  handleCSRFError(res, message, errorHandler) {
    if (errorHandler && typeof errorHandler === 'function') {
      return errorHandler(message, res);
    }

    res.status(403).json({
      error: 'Forbidden',
      message: 'CSRF token validation failed',
      code: 'CSRF_INVALID',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Generates a cryptographically secure nonce
   * @returns {string} Random nonce
   */
  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Creates a hash of the user agent for additional security
   * @param {string} userAgent - User agent string
   * @returns {string} Hashed user agent
   */
  hashUserAgent(userAgent) {
    if (!userAgent) return '';
    
    // Simple hash function (in production, consider using crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < userAgent.length; i++) {
      const char = userAgent.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Sets CSRF token in response cookie
   * @param {object} res - Express response object
   * @param {string} token - CSRF token
   * @param {object} options - Cookie options
   */
  setTokenCookie(res, token, options = {}) {
    const defaultOptions = {
      httpOnly: false, // Allow JavaScript access for AJAX requests
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/',
    };

    res.cookie(this.cookieName, token, { ...defaultOptions, ...options });
  }

  /**
   * Generates and sets CSRF token for a response
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @returns {Promise<string>} Generated token
   */
  async generateAndSetToken(req, res) {
    const sessionId = req.sessionID || req.ip || 'anonymous';
    const userAgent = req.get('User-Agent') || '';
    
    const token = await this.generateToken(sessionId, userAgent);
    this.setTokenCookie(res, token);
    
    return token;
  }

  /**
   * Validates request origin for additional CSRF protection
   * @param {object} req - Express request object
   * @param {array} allowedOrigins - Array of allowed origins
   * @returns {boolean} Whether origin is valid
   */
  validateOrigin(req, allowedOrigins = []) {
    const origin = req.get('Origin') || req.get('Referer');
    if (!origin) return false;

    try {
      const originUrl = new URL(origin);
      const allowedHosts = allowedOrigins.map(o => new URL(o).host);
      
      return allowedHosts.includes(originUrl.host);
    } catch (error) {
      console.warn('Invalid origin format:', origin);
      return false;
    }
  }

  /**
   * Double submit cookie pattern validation
   * @param {object} req - Express request object
   * @returns {boolean} Whether double submit validation passes
   */
  validateDoubleSubmit(req) {
    const headerToken = req.get(this.headerName);
    const cookieToken = req.cookies && req.cookies[this.cookieName];
    
    return headerToken && cookieToken && headerToken === cookieToken;
  }
}

// Create singleton instance
const csrfProtection = new CSRFProtection();

/**
 * Generate CSRF token for forms
 * @param {string} sessionId - Session identifier
 * @param {string} userAgent - User agent string
 * @returns {Promise<string>} CSRF token
 */
export async function generateCSRFToken(sessionId, userAgent) {
  return await csrfProtection.generateToken(sessionId, userAgent);
}

/**
 * Validate CSRF token
 * @param {string} token - Token to validate
 * @param {string} sessionId - Session identifier
 * @param {string} userAgent - User agent string
 * @returns {Promise<boolean>} Whether token is valid
 */
export async function validateCSRFToken(token, sessionId, userAgent) {
  return await csrfProtection.validateToken(token, sessionId, userAgent);
}

/**
 * Express middleware for CSRF protection
 * @param {object} options - Configuration options
 * @returns {Function} Express middleware
 */
export function csrfMiddleware(options) {
  return csrfProtection.middleware(options);
}

/**
 * Generate and set CSRF token in response
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @returns {Promise<string>} Generated token
 */
export async function setCSRFToken(req, res) {
  return await csrfProtection.generateAndSetToken(req, res);
}

/**
 * Validate request origin
 * @param {object} req - Express request
 * @param {array} allowedOrigins - Allowed origins
 * @returns {boolean} Whether origin is valid
 */
export function validateOrigin(req, allowedOrigins) {
  return csrfProtection.validateOrigin(req, allowedOrigins);
}

export default csrfProtection;