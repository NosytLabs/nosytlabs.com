import dotenv from 'dotenv';
import path from 'path';

/**
 * Security Configuration for NosytLabs
 * Handles environment variable validation, security headers, and access control
 */

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Security validation for environment variables
export function validateEnvironmentVariables() {
  const requiredVars = [
    'DATABASE_URL',
    'RESEND_API_KEY',
    'ENCRYPTION_KEY',
    'JWT_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    } else {
      console.warn('⚠️ Running in development mode with missing environment variables');
    }
  }
}

// Security headers configuration
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.resend.com https://jvorgukgexezucwxygdi.supabase.co wss://jvorgukgexezucwxygdi.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ')
};

// Environment variable sanitization
export function sanitizeEnvVar(value: string | undefined): string | undefined {
  if (!value) return undefined;
  
  // Remove any potential injection attempts
  return value.replace(/[<>'"&]/g, '').trim();
}

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// CORS configuration
export const corsConfig = {
  origin (origin: string | undefined, callback: Function) {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4329').split(',');
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// API key validation
export function validateApiKey(apiKey: string | undefined, keyName: string): boolean {
  if (!apiKey) {
    console.warn(`⚠️ ${keyName} not configured`);
    return false;
  }
  
  // Basic format validation
  if (apiKey.length < 10) {
    console.error(`❌ ${keyName} appears to be invalid (too short)`);
    return false;
  }
  
  return true;
}

// Database connection security
export function validateDatabaseUrl(url: string | undefined): boolean {
  if (!url) {
    console.error('❌ DATABASE_URL not configured');
    return false;
  }
  
  // Ensure it's using SSL in production
  if (process.env.NODE_ENV === 'production' && !url.includes('sslmode=require')) {
    console.warn('⚠️ Database connection should use SSL in production');
  }
  
  return true;
}

// Initialize security validation
export function initializeSecurity() {
  console.log('🔒 Initializing security configuration...');
  
  try {
    validateEnvironmentVariables();
    
    // Validate critical API keys
    validateApiKey(process.env.RESEND_API_KEY, 'RESEND_API_KEY');
    validateApiKey(process.env.SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY');
    validateDatabaseUrl(process.env.DATABASE_URL);
    
    console.log('✅ Security configuration initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Security initialization failed:', error);
    return false;
  }
}

// Export security utilities
export default {
  validateEnvironmentVariables,
  securityHeaders,
  sanitizeEnvVar,
  rateLimitConfig,
  corsConfig,
  validateApiKey,
  validateDatabaseUrl,
  initializeSecurity
};
