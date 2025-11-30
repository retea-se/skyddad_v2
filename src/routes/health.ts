import { Router, Request, Response } from 'express';
import { testConnection } from '../../config/database.js';
import { getMetrics } from '../services/metrics.js';

const router = Router();

/**
 * GET /healthz - Health check endpoint
 */
router.get('/healthz', async (req: Request, res: Response) => {
  const dbConnected = await testConnection();
  const metrics = getMetrics();
  
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: metrics.uptime,
  });
});

/**
 * GET /metrics - Metrics endpoint (if enabled)
 */
router.get('/metrics', (req: Request, res: Response) => {
  const metrics = getMetrics();
  res.json(metrics);
});

export default router;


