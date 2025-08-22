/**
 * This is a API server
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { validateEnvironment } from './utils/validate-env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { 
  apiLimiter, 
  requestTimeout, 
  requestSizeLimiter,
  userAgentValidator,
  methodValidator 
} from '../src/lib/rateLimiter';
import { csrfMiddleware, setCSRFToken } from '../src/lib/csrf';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import cookieParser from 'cookie-parser';

// Environment configuration

// load env
dotenv.config();

// Validate environment variables with enhanced validation
const legacyEnv = validateEnvironment();
const env = { ...legacyEnv, NODE_ENV: process.env.NODE_ENV || 'development' };

const app: express.Application = express();

// Security headers with Helmet
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", env.SUPABASE_URL || ''],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: env.NODE_ENV === 'production' ? [] : null
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Enhanced CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : ['http://localhost:4321'];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With'
  ],
  exposedHeaders: ['X-CSRF-Token']
};

// Apply security middleware in correct order
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use(cookieParser(env.COOKIE_SECRET || 'default-secret'));

// Request timeout and size limiting
app.use(requestTimeout(30000));
app.use(requestSizeLimiter({ maxSize: '10mb' }));

// User agent and method validation
app.use(userAgentValidator({ required: true }));
app.use(methodValidator(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']));

// Rate limiting
app.use(apiLimiter);

// Body parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, _res: any, buf: Buffer) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 100
}));

// CSRF protection middleware
app.use(csrfMiddleware({
  skipMethods: ['GET', 'HEAD', 'OPTIONS'],
  skipPaths: ['/api/health', '/api/csrf-token']
}));

/**
 * CSRF Token endpoint (must be before other routes)
 */
app.get('/api/csrf-token', async (req: Request, res: Response) => {
  try {
    const token = await setCSRFToken(req, res);
    res.json({ csrfToken: token });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
});

/**
 * API Routes with enhanced security
 */
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  // Simple health check without database dependency
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: 'ok'
  });
});

/**
 * 404 handler
 */
app.use(notFoundHandler);

/**
 * Enhanced error handler middleware
 */
app.use(errorHandler);

export default app;