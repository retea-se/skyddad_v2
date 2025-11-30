import { Request, Response, NextFunction } from 'express';
import { config } from '../../config/index.js';

/**
 * Admin authentication middleware
 * Validates API key from Authorization header or query parameter
 */
export const authAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!config.features.adminApi) {
    return res.status(503).json({ error: 'Admin API is disabled' });
  }

  if (!config.admin.apiKey) {
    return res.status(500).json({ error: 'Admin API key not configured' });
  }

  // Check Authorization header
  const authHeader = req.get('Authorization');
  const apiKeyFromHeader = authHeader?.replace('Bearer ', '');

  // Check query parameter (for testing)
  const apiKeyFromQuery = req.query.apiKey as string | undefined;

  const providedKey = apiKeyFromHeader || apiKeyFromQuery;

  if (!providedKey || providedKey !== config.admin.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

