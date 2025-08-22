/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express';
import { authLimiter } from '../../src/lib/rateLimiter';
import { 
  adminAuthSchema, 
  validateAndSanitize 
} from '../../src/lib/validation';
import { createError, ErrorTypes, asyncErrorHandler } from '../middleware/error-handler';

// Supabase imports removed - not currently used in this auth implementation
import * as jwt from 'jsonwebtoken';

const router = Router();

const env = { 
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123'
};

/**
 * Admin Authentication
 * POST /api/auth/admin
 */
router.post('/admin', authLimiter, asyncErrorHandler(async (req: Request, res: Response): Promise<void> => {
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, adminAuthSchema);
  } catch (error) {
    throw createError(
      'Invalid authentication credentials',
      400,
      ErrorTypes.VALIDATION_ERROR
    );
  }

  const { email, password } = validatedData;
  
  try {
    // Simple admin authentication (for demo purposes)
    // In production, this should use proper user management
    const adminUsername = env.ADMIN_USERNAME;
    const adminPassword = env.ADMIN_PASSWORD;
    
    if (email !== adminUsername || password !== adminPassword) {
      throw createError(
        'Invalid credentials',
        401,
        ErrorTypes.AUTHENTICATION_ERROR
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email,
        role: 'admin'
      },
      env.JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'nosytlabs-api',
        audience: 'nosytlabs-admin'
      }
    );

    // Set secure cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Authentication successful',
      user: {
        email,
        role: 'admin'
      }
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

/**
 * Admin Logout
 * POST /api/auth/logout
 */
router.post('/logout', asyncErrorHandler(async (_req: Request, res: Response): Promise<void> => {
  try {
    // Clear the admin token cookie
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

/**
 * Verify Admin Token
 * GET /api/auth/verify
 */
router.get('/verify', asyncErrorHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.admin_token;
    
    if (!token) {
      throw createError(
        'No authentication token provided',
        401
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'nosytlabs-api',
      audience: 'nosytlabs-admin'
    }) as any;

    res.status(200).json({ 
      success: true,
      user: {
        username: decoded.username,
        role: decoded.role
      },
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError(
        'Invalid authentication token',
        401
      );
    }
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

/**
 * User Registration (Future Implementation)
 * POST /api/auth/register
 */
router.post('/register', authLimiter, async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ 
    message: 'User registration coming soon - will integrate with Supabase Auth',
    status: 'not_implemented',
    features: {
      supabase_auth: 'planned',
      email_verification: 'planned',
      social_login: 'planned'
    }
  });
});

/**
 * User Login (Future Implementation)
 * POST /api/auth/login
 */
router.post('/login', authLimiter, async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ 
    message: 'User login coming soon - will integrate with Supabase Auth',
    status: 'not_implemented',
    features: {
      supabase_auth: 'planned',
      password_reset: 'planned',
      social_login: 'planned'
    }
  });
});

export default router;