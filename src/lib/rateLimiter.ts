import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

// Helper to parse size strings like '10mb', '1gb', '500kb'
function parseSizeToBytes(size: string): number {
  const match = /^\s*(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?\s*$/i.exec(size);
  if (!match) return Number(size) || 0;
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'b').toLowerCase();
  const multipliers: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  return Math.floor(value * (multipliers[unit] || 1));
}

// Request timeout middleware factory
export function requestTimeout(ms: number): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    // Only apply if not already finished
    let finished = false;
    const done = () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
      }
    };

    const timer = setTimeout(() => {
      if (finished) return;
      res.setHeader('Content-Type', 'application/json');
      res.status(503).json({ error: 'Request timed out' });
    }, ms);

    res.on('finish', done);
    res.on('close', done);

    next();
  };
}

// Request size limiter middleware factory
export function requestSizeLimiter(options: { maxSize: string | number }): RequestHandler {
  const limitBytes = typeof options.maxSize === 'number' ? options.maxSize : parseSizeToBytes(options.maxSize);
  return function (req: Request, res: Response, next: NextFunction) {
    const contentLength = req.headers['content-length'] ? Number(req.headers['content-length']) : undefined;
    if (contentLength && contentLength > limitBytes) {
      return res.status(413).json({ error: 'Payload too large' });
    }
    next();
  };
}

// User-Agent validator middleware factory
export function userAgentValidator(options: { required?: boolean } = {}): RequestHandler {
  const required = options.required ?? false;
  return function (req: Request, res: Response, next: NextFunction) {
    const ua = req.headers['user-agent'];
    if (required && (!ua || (Array.isArray(ua) ? ua[0] : ua).trim() === '')) {
      return res.status(400).json({ error: 'User-Agent header is required' });
    }
    next();
  };
}

// HTTP Method validator middleware factory
export function methodValidator(allowed: string[]): RequestHandler {
  const set = new Set(allowed.map((m) => m.toUpperCase()));
  return function (req: Request, res: Response, next: NextFunction) {
    if (!set.has(req.method.toUpperCase())) {
      res.setHeader('Allow', Array.from(set).join(', '));
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    next();
  };
}

// Base limiter options derived from environment or sensible defaults
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000); // 1 minute
const MAX_GENERAL = Number(process.env.RATE_LIMIT_MAX || 120);

export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_GENERAL,
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || WINDOW_MS),
  max: Number(process.env.CONTACT_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact requests, please try again later.' },
});

export const newsletterLimiter = rateLimit({
  windowMs: Number(process.env.NEWSLETTER_RATE_LIMIT_WINDOW_MS || WINDOW_MS),
  max: Number(process.env.NEWSLETTER_RATE_LIMIT_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many newsletter requests, please try again later.' },
});

export const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || WINDOW_MS),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' },
});