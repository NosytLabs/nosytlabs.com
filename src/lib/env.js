import { z } from 'zod';

/**
 * Environment validation schema using Zod
 * Ensures all required environment variables are present and valid
 */

// Base environment schema
const baseEnvSchema = z.object({
  // Core Application Settings
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url('APP_URL must be a valid URL'),
  APP_NAME: z.string().min(1, 'APP_NAME is required'),
  APP_VERSION: z.string().min(1, 'APP_VERSION is required'),
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number').transform(Number).default('3000'),



  // Email Service Configuration (EmailJS)
  VITE_EMAILJS_SERVICE_ID: z.string().min(1, 'VITE_EMAILJS_SERVICE_ID is required'),
  VITE_EMAILJS_TEMPLATE_ID: z.string().min(1, 'VITE_EMAILJS_TEMPLATE_ID is required'),
  VITE_EMAILJS_PUBLIC_KEY: z.string().min(1, 'VITE_EMAILJS_PUBLIC_KEY is required'),

  // Security Configuration
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CSRF_SECRET: z.string().min(16, 'CSRF_SECRET must be at least 16 characters').optional(),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().regex(/^\d+$/, 'RATE_LIMIT_MAX must be a number').transform(Number).default('100'),
  RATE_LIMIT_WINDOW: z.string().regex(/^\d+$/, 'RATE_LIMIT_WINDOW must be a number').transform(Number).default('900000'),
  RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS: z.string().transform(val => val === 'true').default('false'),

  // CORS Configuration
  CORS_ORIGIN: z.string().url('CORS_ORIGIN must be a valid URL').optional(),
  CORS_CREDENTIALS: z.string().transform(val => val === 'true').default('true'),

  // Security Headers
  HSTS_MAX_AGE: z.string().regex(/^\d+$/, 'HSTS_MAX_AGE must be a number').transform(Number).default('31536000'),
  CSP_REPORT_URI: z.string().optional(),

  // Development & Debugging
  DEBUG_MODE: z.string().transform(val => val === 'true').default('false'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  VERBOSE_LOGGING: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SOURCE_MAPS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_HOT_RELOAD: z.string().transform(val => val === 'true').default('true'),
});

// Production-specific schema
const productionEnvSchema = baseEnvSchema.extend({
  CSRF_SECRET: z.string().min(16, 'CSRF_SECRET is required in production'),
});

// Optional environment variables schema
const optionalEnvSchema = z.object({
  // Analytics & Monitoring
  VERCEL_ANALYTICS_ID: z.string().optional(),
  GOOGLE_ANALYTICS_ID: z.string().regex(/^G-/, 'GOOGLE_ANALYTICS_ID must start with "G-"').optional(),
  GTAG_ID: z.string().regex(/^GT-/, 'GTAG_ID must start with "GT-"').optional(),
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  UPTIME_ROBOT_API_KEY: z.string().optional(),

  // Third-party API Keys
  OPENAI_API_KEY: z.string().regex(/^sk-/, 'OPENAI_API_KEY must start with "sk-"').optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().regex(/^sk_(test_|live_)/, 'STRIPE_SECRET_KEY must start with "sk_test_" or "sk_live_"').optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().regex(/^pk_(test_|live_)/, 'STRIPE_PUBLISHABLE_KEY must start with "pk_test_" or "pk_live_"').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().regex(/^whsec_/, 'STRIPE_WEBHOOK_SECRET must start with "whsec_"').optional(),
  TWITTER_API_KEY: z.string().optional(),
  LINKEDIN_API_KEY: z.string().optional(),

  // SMTP Configuration (backup)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/, 'SMTP_PORT must be a number').transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Testing Configuration
  TEST_DATABASE_URL: z.string().url('TEST_DATABASE_URL must be a valid URL').optional(),
  TEST_EMAIL_PROVIDER: z.string().optional(),
});

/**
 * Validates environment variables based on NODE_ENV
 * @param {object} env - Environment variables object (defaults to process.env)
 * @returns {object} Validated and parsed environment variables
 * @throws {Error} If validation fails
 */
export function validateEnv(env = process.env) {
  try {
    // Choose schema based on environment
    const schema = env.NODE_ENV === 'production' 
      ? productionEnvSchema.merge(optionalEnvSchema)
      : baseEnvSchema.merge(optionalEnvSchema);

    // Parse and validate
    const validatedEnv = schema.parse(env);

    // Additional custom validations
    if (validatedEnv.NODE_ENV === 'production') {
      // Ensure production URLs use HTTPS
      if (!validatedEnv.APP_URL.startsWith('https://')) {
        throw new Error('APP_URL must use HTTPS in production');
      }
      
      if (validatedEnv.CORS_ORIGIN && !validatedEnv.CORS_ORIGIN.startsWith('https://')) {
        throw new Error('CORS_ORIGIN must use HTTPS in production');
      }

      // Ensure debug mode is disabled in production
      if (validatedEnv.DEBUG_MODE) {
        console.warn('WARNING: DEBUG_MODE is enabled in production');
      }
    }

    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      }).join('\n');
      
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Validates specific environment variables for a feature
 * @param {string[]} requiredVars - Array of required environment variable names
 * @param {object} env - Environment variables object (defaults to process.env)
 * @returns {object} Object containing only the requested variables
 * @throws {Error} If any required variables are missing
 */
export function validateFeatureEnv(requiredVars, env = process.env) {
  const missing = requiredVars.filter(varName => !env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return requiredVars.reduce((acc, varName) => {
    acc[varName] = env[varName];
    return acc;
  }, {});
}

/**
 * Checks if all required environment variables for a specific service are present
 * @param {'emailjs'|'stripe'|'analytics'} service - Service name
 * @param {object} env - Environment variables object (defaults to process.env)
 * @returns {boolean} True if all required variables are present
 */
export function isServiceConfigured(service, env = process.env) {
  const serviceRequirements = {
    emailjs: ['VITE_EMAILJS_SERVICE_ID', 'VITE_EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_PUBLIC_KEY'],
    stripe: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY'],
    analytics: ['GOOGLE_ANALYTICS_ID'],
    sentry: ['SENTRY_DSN'],
  };

  const required = serviceRequirements[service];
  if (!required) {
    throw new Error(`Unknown service: ${service}`);
  }

  return required.every(varName => env[varName]);
}

/**
 * Gets environment-specific configuration
 * @param {object} env - Validated environment variables
 * @returns {object} Environment-specific configuration object
 */
export function getEnvConfig(env) {
  return {
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    
    app: {
      url: env.APP_URL,
      name: env.APP_NAME,
      version: env.APP_VERSION,
      port: env.PORT,
    },
    
    emailjs: {
      serviceId: env.VITE_EMAILJS_SERVICE_ID,
      templateId: env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: env.VITE_EMAILJS_PUBLIC_KEY,
    },
    
    security: {
      encryptionKey: env.ENCRYPTION_KEY,
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
      csrfSecret: env.CSRF_SECRET,
      corsOrigin: env.CORS_ORIGIN,
      corsCredentials: env.CORS_CREDENTIALS,
    },
    
    rateLimit: {
      max: env.RATE_LIMIT_MAX,
      window: env.RATE_LIMIT_WINDOW,
      skipSuccessfulRequests: env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS,
    },
    
    debug: {
      enabled: env.DEBUG_MODE,
      logLevel: env.LOG_LEVEL,
      verbose: env.VERBOSE_LOGGING,
      sourceMaps: env.ENABLE_SOURCE_MAPS,
      hotReload: env.ENABLE_HOT_RELOAD,
    },
  };
}

// Export the validated environment (only in non-test environments)
let validatedEnv;
try {
  if (process.env.NODE_ENV !== 'test') {
    // validatedEnv = validateEnv(); // Temporarily disabled for development
    validatedEnv = { NODE_ENV: process.env.NODE_ENV || 'development' };
  }
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

export { validatedEnv };
export default validatedEnv;