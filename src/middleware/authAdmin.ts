import { Request, Response, NextFunction } from 'express';
import { config } from '../../config/index.js';

/**
 * Admin authentication middleware
 * Validates API key from Authorization header or query parameter
 */
export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[DEBUG authAdmin] ${req.method} ${req.path} - Admin API enabled: ${config.features.adminApi}, API Key set: ${!!config.admin.apiKey}`);

  if (!config.features.adminApi) {
    console.log('[DEBUG authAdmin] Admin API is disabled');
    res.status(503).json({ error: 'Admin API is disabled' });
    return;
  }

  if (!config.admin.apiKey) {
    console.log('[DEBUG authAdmin] Admin API key not configured');
    res.status(500).json({ error: 'Admin API key not configured' });
    return;
  }

  // Check Authorization header
  const authHeader = req.get('Authorization');
  const apiKeyFromHeader = authHeader?.replace('Bearer ', '');

  // Check query parameter (for testing)
  const apiKeyFromQuery = req.query.apiKey as string | undefined;

  const providedKey = apiKeyFromHeader || apiKeyFromQuery;

  console.log(`[DEBUG authAdmin] Provided key: ${providedKey ? 'YES' : 'NO'}, Expected key: ${config.admin.apiKey ? 'SET' : 'NOT SET'}`);

  if (!providedKey || providedKey !== config.admin.apiKey) {
    console.log('[DEBUG authAdmin] Unauthorized - returning 401');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  console.log('[DEBUG authAdmin] Authorized - calling next()');
  next();
};



