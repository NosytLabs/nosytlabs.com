/**
 * Environment variable validation utility
 */

export interface EnvironmentConfig {
  NODE_ENV: string;
  CONTACT_EMAIL: string;
  PORT: string;
  CORS_ORIGIN: string;

  COOKIE_SECRET?: string;
}

export function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'contact@nosytlabs.com',
    PORT: process.env.PORT || '3000',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4321',

    ...(process.env.COOKIE_SECRET && { COOKIE_SECRET: process.env.COOKIE_SECRET }),
  };

  const errors: string[] = [];

  // Validate required environment variables based on environment
  if (config.NODE_ENV === 'production') {
    // Email validation removed for EmailJS client-side integration
  }

  if (errors.length > 0) {
    console.error('Environment validation errors:');
    errors.forEach(error => console.error(`- ${error}`));
    
    if (config.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
    } else {
      console.warn('Running in development mode with missing optional variables');
    }
  }

  return config;
}

export function getEnvironmentValue(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}