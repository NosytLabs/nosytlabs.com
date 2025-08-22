/**
 * CSRF Protection Utilities
 *
 * This module provides utilities for generating, storing, and validating CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

import type { APIContext } from 'astro';
import { getRequestHeaders } from './request-utils';

// CSRF token storage (in production, use Redis or database)
const csrfTokenStore = new Map<string, { token: string; timestamp: number; sessionId: string }>();

// Token expiration time (30 minutes)
const TOKEN_EXPIRY = 30 * 60 * 1000;

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

/**
 * Generate a session ID for tracking user sessions
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Store CSRF token with session association
 */
export function storeCsrfToken(token: string, sessionId: string): void {
  csrfTokenStore.set(token, {
    token,
    timestamp: Date.now(),
    sessionId,
  });

  // Clean up expired tokens
  cleanupExpiredTokens();
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, sessionId: string): boolean {
  const storedToken = csrfTokenStore.get(token);

  if (!storedToken) {
    return false;
  }

  // Check if token is expired
  if (Date.now() - storedToken.timestamp > TOKEN_EXPIRY) {
    csrfTokenStore.delete(token);
    return false;
  }

  // Check if session matches
  if (storedToken.sessionId !== sessionId) {
    return false;
  }

  return true;
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [token, data] of csrfTokenStore.entries()) {
    if (now - data.timestamp > TOKEN_EXPIRY) {
      csrfTokenStore.delete(token);
    }
  }
}

/**
 * Get or create session ID from cookies
 */
export function getOrCreateSessionId(context: APIContext): string {
  const sessionCookie = context.cookies.get('session_id');

  if (sessionCookie && sessionCookie.value) {
    return sessionCookie.value;
  }

  const newSessionId = generateSessionId();
  context.cookies.set('session_id', newSessionId, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return newSessionId;
}

/**
 * Generate and store a new CSRF token for a session
 */
export function createCsrfTokenForSession(context: APIContext): string {
  const sessionId = getOrCreateSessionId(context);
  const token = generateCsrfToken();

  storeCsrfToken(token, sessionId);

  // Set CSRF token in cookie for client-side access
  context.cookies.set('csrf_token', token, {
    httpOnly: false, // Allow client-side access
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: TOKEN_EXPIRY / 1000, // 30 minutes
    path: '/',
  });

  return token;
}

/**
 * Validate CSRF token from request
 */
export function validateCsrfFromRequest(context: APIContext): boolean {
  const sessionId = getOrCreateSessionId(context);

  // Get CSRF token from various sources
  const headers = getRequestHeaders(context);
  const tokenFromHeader =
    headers.get('x-csrf-token') || headers.get('csrf-token');

  const tokenFromBody: string | null = null;

  // For form submissions, get token from form data
  if (headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
    // We'll handle this in the middleware after parsing form data
  }

  const token = tokenFromHeader || tokenFromBody;

  if (!token) {
    return false;
  }

  return validateCsrfToken(token, sessionId);
}

/**
 * Middleware helper to extract CSRF token from form data
 */
export async function extractCsrfFromFormData(request: Request): Promise<string | null> {
  try {
    const formData = await request.clone().formData();
    return (formData.get('_csrf') as string) || null;
  } catch {
    return null;
  }
}
