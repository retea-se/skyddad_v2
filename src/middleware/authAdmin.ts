import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../../config/index.js';

/**
 * Admin authentication middleware
 * Validates API key from Authorization header only (Bearer token)
 * Uses constant-time comparison to prevent timing attacks
 */
export const authAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!config.features.adminApi) {
    res.status(503).json({ error: 'Admin API is disabled' });
    return;
  }

  if (!config.admin.apiKey) {
    res.status(500).json({ error: 'Admin API key not configured' });
    return;
  }

  // Only accept Authorization header (Bearer token)
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const providedKey = authHeader.replace('Bearer ', '').trim();

  // Constant-time comparison to prevent timing attacks
  const expectedKey = config.admin.apiKey;
  
  // Check length first to avoid timing attack on length
  if (providedKey.length !== expectedKey.length) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Use timing-safe comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(providedKey),
    Buffer.from(expectedKey)
  );

  if (!isValid) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};



