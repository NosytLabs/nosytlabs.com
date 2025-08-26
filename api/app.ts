/**
 * This is a API server
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
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
import performanceMetricsRoutes from './routes/performance-metrics';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import * as fs from 'fs';

// Environment configuration
// Note: These variables are available but not currently used in this file

// Get current directory - using process.cwd() for Node.js compatibility
const __dirname = process.cwd();

// load env
dotenv.config();

// Validate environment variables with enhanced validation
const legacyEnv = validateEnvironment();
const env = { ...legacyEnv, NODE_ENV: process.env.NODE_ENV || 'development' };

const app: express.Application = express();

// Serve static files in preview mode
if (env.NODE_ENV === 'production' && process.env.SERVE_STATIC === 'true') {
  // Use project root as base; dist/client contains static output
  const distPath = path.join(__dirname, 'dist/client');
  // Add trailing slash for directory-like paths
  app.use((req, res, next) => {
    if (!req.path.endsWith('/') && !req.path.includes('.') && !req.path.startsWith('/api')) {
      res.redirect(301, req.path + '/');
    } else {
      next();
    }
  });

  app.use(express.static(distPath, { index: 'index.html' }));

  // Fallback for unknown paths to 404.html if exists, else to index.html
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
      // Normalize path to avoid absolute path issues on Windows
      const rel = (req.path.endsWith('/') ? req.path + 'index.html' : req.path).replace(/^\/+/, '');
      const filePath = path.join(distPath, rel);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      const notFoundPath = path.join(distPath, '404.html');
      if (fs.existsSync(notFoundPath)) {
        return res.sendFile(notFoundPath);
      }
      return res.sendFile(path.join(distPath, 'index.html'));
    } else {
      // Ensure API routes continue to downstream handlers
      return next();
    }
  });
}

// Security headers with Helmet
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
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
    const defaultAllowedOrigins = [
      'http://localhost:4321',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : defaultAllowedOrigins;
    
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
    'X-CSRF-Token'
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
app.use('/api/performance-metrics', performanceMetricsRoutes);

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  // Simple health check without database dependency
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
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