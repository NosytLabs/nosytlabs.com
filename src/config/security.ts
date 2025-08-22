/**
 * Security Configuration
 * Centralized security settings for the application
 */

export interface SecurityConfig {
  // Rate limiting configuration
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
    standardHeaders: boolean;
    legacyHeaders: boolean;
  };

  // CSRF protection configuration
  csrf: {
    enabled: boolean;
    tokenLength: number;
    cookieName: string;
    headerName: string;
    sameSite: 'strict' | 'lax' | 'none';
    secure: boolean;
    httpOnly: boolean;
  };

  // Content Security Policy configuration
  csp: {
    enabled: boolean;
    reportOnly: boolean;
    reportUri?: string;
    directives: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      connectSrc: string[];
      fontSrc: string[];
      objectSrc: string[];
      mediaSrc: string[];
      frameSrc: string[];
      childSrc: string[];
      workerSrc: string[];
      manifestSrc: string[];
      formAction: string[];
      frameAncestors: string[];
      baseUri: string[];
      upgradeInsecureRequests: boolean;
    };
  };

  // Security headers configuration
  headers: {
    hsts: {
      enabled: boolean;
      maxAge: number;
      includeSubDomains: boolean;
      preload: boolean;
    };
    xFrameOptions: string;
    xContentTypeOptions: string;
    referrerPolicy: string;
    permissionsPolicy: string;
    crossOriginEmbedderPolicy: string;
    crossOriginOpenerPolicy: string;
    crossOriginResourcePolicy: string;
  };

  // Logging and monitoring configuration
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    maxEvents: number;
    retentionDays: number;
    sensitiveDataMasking: boolean;
  };

  // Alert configuration
  alerts: {
    enabled: boolean;
    channels: {
      console: boolean;
      email: boolean;
      webhook: boolean;
      slack: boolean;
    };
    thresholds: {
      criticalEvents: number;
      suspiciousIPs: number;
      blockedRequests: number;
      timeWindow: number; // minutes
    };
    cooldown: number; // minutes
  };

  // IP filtering configuration
  ipFiltering: {
    enabled: boolean;
    whitelist: string[];
    blacklist: string[];
    maxFailedAttempts: number;
    blockDuration: number; // minutes
  };

  // Input validation configuration
  validation: {
    maxRequestSize: number; // bytes
    maxUrlLength: number;
    maxHeaderSize: number;
    allowedMethods: string[];
    blockedUserAgents: (string | RegExp)[];
    suspiciousPatterns: (string | RegExp)[];
  };
}

/**
 * Development security configuration
 */
const developmentConfig: SecurityConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // More lenient for development
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
  },

  csrf: {
    enabled: true,
    tokenLength: 32,
    cookieName: '__csrf_token',
    headerName: 'x-csrf-token',
    sameSite: 'lax',
    secure: false, // HTTP in development
    httpOnly: true,
  },

  csp: {
    enabled: true,
    reportOnly: true, // Report-only in development
    reportUri: '/api/security/csp-report',
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'localhost:*', '127.0.0.1:*'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'localhost:*', '127.0.0.1:*', 'ws:', 'wss:'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      childSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
      manifestSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: false, // Allow HTTP in development
    },
  },

  headers: {
    hsts: {
      enabled: false, // Disabled for HTTP development
      maxAge: 31536000,
      includeSubDomains: true,
      preload: false,
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
    crossOriginEmbedderPolicy: 'unsafe-none',
    crossOriginOpenerPolicy: 'same-origin',
    crossOriginResourcePolicy: 'same-origin',
  },

  logging: {
    enabled: true,
    level: 'debug',
    maxEvents: 10000,
    retentionDays: 7,
    sensitiveDataMasking: true,
  },

  alerts: {
    enabled: true,
    channels: {
      console: true,
      email: false,
      webhook: false,
      slack: false,
    },
    thresholds: {
      criticalEvents: 5,
      suspiciousIPs: 10,
      blockedRequests: 50,
      timeWindow: 15,
    },
    cooldown: 5,
  },

  ipFiltering: {
    enabled: true,
    whitelist: ['127.0.0.1', '::1', 'localhost'],
    blacklist: [],
    maxFailedAttempts: 10,
    blockDuration: 15,
  },

  validation: {
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    maxUrlLength: 2048,
    maxHeaderSize: 8192,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    blockedUserAgents: [],
    suspiciousPatterns: [
      /\b(union|select|insert|delete|drop|create|alter)\b/i, // SQL injection
      /<script[^>]*>.*?<\/script>/gi, // XSS
      /javascript:/gi, // JavaScript protocol
      /vbscript:/gi, // VBScript protocol
      /on\w+\s*=/gi, // Event handlers
    ],
  },
};

/**
 * Production security configuration
 */
const productionConfig: SecurityConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Stricter for production
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
  },

  csrf: {
    enabled: true,
    tokenLength: 32,
    cookieName: '__csrf_token',
    headerName: 'x-csrf-token',
    sameSite: 'strict',
    secure: true, // HTTPS in production
    httpOnly: true,
  },

  csp: {
    enabled: true,
    reportOnly: false, // Enforce in production
    reportUri: '/api/security/csp-report',
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: true,
    },
  },

  headers: {
    hsts: {
      enabled: true,
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    crossOriginEmbedderPolicy: 'require-corp',
    crossOriginOpenerPolicy: 'same-origin',
    crossOriginResourcePolicy: 'same-origin',
  },

  logging: {
    enabled: true,
    level: 'info',
    maxEvents: 50000,
    retentionDays: 30,
    sensitiveDataMasking: true,
  },

  alerts: {
    enabled: true,
    channels: {
      console: true,
      email: true,
      webhook: true,
      slack: true,
    },
    thresholds: {
      criticalEvents: 1,
      suspiciousIPs: 5,
      blockedRequests: 20,
      timeWindow: 5,
    },
    cooldown: 15,
  },

  ipFiltering: {
    enabled: true,
    whitelist: [],
    blacklist: [],
    maxFailedAttempts: 5,
    blockDuration: 60,
  },

  validation: {
    maxRequestSize: 5 * 1024 * 1024, // 5MB
    maxUrlLength: 1024,
    maxHeaderSize: 4096,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    blockedUserAgents: [/bot/i, /crawler/i, /spider/i, /scraper/i],
    suspiciousPatterns: [
      /\b(union|select|insert|delete|drop|create|alter|exec|execute)\b/i,
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /\.\.\//g, // Path traversal
      /\\x[0-9a-f]{2}/gi, // Hex encoding
      /%[0-9a-f]{2}/gi, // URL encoding
    ],
  },
};

/**
 * Get security configuration based on environment
 */
export function getSecurityConfig(): SecurityConfig {
  // Use process.env for Node.js compatibility or fallback to development
  const environment = (typeof process !== 'undefined' && process.env.NODE_ENV) || 
                     (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || 
                     'development';

  if (environment === 'production') {
    return productionConfig;
  }

  return developmentConfig;
}

/**
 * Merge custom configuration with defaults
 */
export function mergeSecurityConfig(customConfig: Partial<SecurityConfig>): SecurityConfig {
  const defaultConfig = getSecurityConfig();

  return {
    ...defaultConfig,
    ...customConfig,
    rateLimit: { ...defaultConfig.rateLimit, ...customConfig.rateLimit },
    csrf: { ...defaultConfig.csrf, ...customConfig.csrf },
    csp: {
      ...defaultConfig.csp,
      ...customConfig.csp,
      directives: { ...defaultConfig.csp.directives, ...customConfig.csp?.directives },
    },
    headers: {
      ...defaultConfig.headers,
      ...customConfig.headers,
      hsts: { ...defaultConfig.headers.hsts, ...customConfig.headers?.hsts },
    },
    logging: { ...defaultConfig.logging, ...customConfig.logging },
    alerts: {
      ...defaultConfig.alerts,
      ...customConfig.alerts,
      channels: { ...defaultConfig.alerts.channels, ...customConfig.alerts?.channels },
      thresholds: { ...defaultConfig.alerts.thresholds, ...customConfig.alerts?.thresholds },
    },
    ipFiltering: { ...defaultConfig.ipFiltering, ...customConfig.ipFiltering },
    validation: { ...defaultConfig.validation, ...customConfig.validation },
  };
}

/**
 * Validate security configuration
 */
export function validateSecurityConfig(config: SecurityConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate rate limit
  if (config.rateLimit.windowMs <= 0) {
    errors.push('Rate limit window must be positive');
  }

  if (config.rateLimit.maxRequests <= 0) {
    errors.push('Rate limit max requests must be positive');
  }

  // Validate CSRF
  if (config.csrf.tokenLength < 16) {
    errors.push('CSRF token length must be at least 16 characters');
  }

  // Validate HSTS
  if (config.headers.hsts.enabled && config.headers.hsts.maxAge <= 0) {
    errors.push('HSTS max age must be positive when enabled');
  }

  // Validate logging
  if (config.logging.maxEvents <= 0) {
    errors.push('Logging max events must be positive');
  }

  if (config.logging.retentionDays <= 0) {
    errors.push('Logging retention days must be positive');
  }

  // Validate alerts
  if (config.alerts.thresholds.timeWindow <= 0) {
    errors.push('Alert time window must be positive');
  }

  if (config.alerts.cooldown < 0) {
    errors.push('Alert cooldown cannot be negative');
  }

  // Validate validation limits
  if (config.validation.maxRequestSize <= 0) {
    errors.push('Max request size must be positive');
  }

  if (config.validation.maxUrlLength <= 0) {
    errors.push('Max URL length must be positive');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export default configuration
export default getSecurityConfig();
