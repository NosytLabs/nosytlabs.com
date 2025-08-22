import { Request, Response, NextFunction } from 'express';

export interface CSRFOptions {
  skipMethods?: string[];
  skipPaths?: string[];
  errorHandler?: (message: string, res: Response) => void;
}

export function generateCSRFToken(sessionId: string, userAgent: string): Promise<string>;
export function validateCSRFToken(token: string, sessionId: string, userAgent: string): Promise<boolean>;
export function csrfMiddleware(options?: CSRFOptions): (req: Request, res: Response, next: NextFunction) => void;
export function setCSRFToken(req: Request, res: Response): Promise<string>;
export function validateOrigin(req: Request, allowedOrigins: string[]): boolean;

interface CSRFProtection {
  generateToken(sessionId?: string, userAgent?: string): Promise<string>;
  validateToken(token: string, sessionId?: string, userAgent?: string): Promise<boolean>;
  middleware(options?: CSRFOptions): (req: Request, res: Response, next: NextFunction) => void;
  extractToken(req: Request): string | null;
  handleCSRFError(res: Response, message: string, errorHandler?: (message: string, res: Response) => void): void;
  generateNonce(): string;
  hashUserAgent(userAgent: string): string;
  setTokenCookie(res: Response, token: string, options?: any): void;
  generateAndSetToken(req: Request, res: Response): Promise<string>;
  validateOrigin(req: Request, allowedOrigins?: string[]): boolean;
  validateDoubleSubmit(req: Request): boolean;
}

declare const csrfProtection: CSRFProtection;
export default csrfProtection;