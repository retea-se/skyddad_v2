import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../../config/index.js';

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

/**
 * CSRF middleware - add token to session and validate on POST
 */
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    // Regenerate token after use
    req.session.csrfToken = generateCsrfToken();
  }

  next();
};

