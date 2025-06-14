/**
 * Environment Configuration Utility
 * Centralized environment variable management with validation
 */

export interface EnvironmentConfig {
  // Database
  DATABASE_URL: string;
  POSTGRES_URL: string | undefined;
  
  // Application
  NODE_ENV: 'development' | 'production' | 'test';
  APP_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  
  // Security
  ENCRYPTION_KEY: string | undefined;
  JWT_SECRET: string | undefined;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW: number;
  
  // Email
  SMTP_HOST: string | undefined;
  SMTP_PORT: number | undefined;
  SMTP_USER: string | undefined;
  SMTP_PASS: string | undefined;
  CONTACT_EMAIL: string | undefined;
  
  // Analytics
  VERCEL_ANALYTICS_ID: string | undefined;
  GOOGLE_ANALYTICS_ID: string | undefined;
  
  // API Keys
  OPENAI_API_KEY: string | undefined;
  STRIPE_SECRET_KEY: string | undefined;
  STRIPE_PUBLISHABLE_KEY: string | undefined;
  
  // Debug
  DEBUG_MODE: boolean;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Get environment variable with type conversion and validation
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number value for environment variable ${key}: ${value}`);
  }
  return parsed;
}

/**
 * Load and validate environment configuration
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  try {
    const config: EnvironmentConfig = {
      // Database (required)
      DATABASE_URL: getEnvVar('DATABASE_URL'),
      POSTGRES_URL: process.env.POSTGRES_URL,
      
      // Application
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      APP_URL: getEnvVar('APP_URL', 'http://localhost:4321'),
      APP_NAME: getEnvVar('APP_NAME', 'NosytLabs'),
      APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),
      
      // Security
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      JWT_SECRET: process.env.JWT_SECRET,
      RATE_LIMIT_MAX: getNumberEnv('RATE_LIMIT_MAX', 100),
      RATE_LIMIT_WINDOW: getNumberEnv('RATE_LIMIT_WINDOW', 900000),
      
      // Email
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      CONTACT_EMAIL: process.env.CONTACT_EMAIL,
      
      // Analytics
      VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
      GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
      
      // API Keys
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      
      // Debug
      DEBUG_MODE: getBooleanEnv('DEBUG_MODE', false),
      LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'info'
    };

    // Validate required fields
    if (!config.DATABASE_URL) {
      throw new Error('DATABASE_URL is required but not provided');
    }

    // Log configuration (without sensitive data)
    if (config.DEBUG_MODE) {
      console.log('Environment Configuration Loaded:', {
        NODE_ENV: config.NODE_ENV,
        APP_URL: config.APP_URL,
        APP_NAME: config.APP_NAME,
        DATABASE_CONFIGURED: !!config.DATABASE_URL,
        ENCRYPTION_CONFIGURED: !!config.ENCRYPTION_KEY,
        EMAIL_CONFIGURED: !!config.SMTP_HOST,
        ANALYTICS_CONFIGURED: !!config.VERCEL_ANALYTICS_ID || !!config.GOOGLE_ANALYTICS_ID
      });
    }

    return config;
  } catch (error) {
    console.error('Failed to load environment configuration:', error);
    throw error;
  }
}

/**
 * Check if environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if environment is test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// Export the loaded configuration
export const env = loadEnvironmentConfig();
