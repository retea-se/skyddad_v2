import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Generate CSRF token
 */
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Validate CSRF token
 */
export const validateCsrfToken = (token: string, sessionToken: string): boolean => {
  if (!token || !sessionToken) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  );
};

// Extend session type
declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}

/**
 * CSRF middleware - add token to session and validate on POST
 */
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Initialize session if not exists
  if (!req.session) {
    return next();
  }

  // Generate token if not exists
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  // Make token available to views
  res.locals.csrfToken = req.session.csrfToken;

  // Validate on POST/PUT/DELETE
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    const sessionToken = req.session.csrfToken;

    if (!token || !validateCsrfToken(token, sessionToken)) {
      res.status(403).json({ error: 'Invalid CSRF token' });
      return;
    }

    // Regenerate token after use
    req.session.csrfToken = generateCsrfToken();
  }

  next();
};



