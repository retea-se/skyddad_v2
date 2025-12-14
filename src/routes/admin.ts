import { Router, Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import { getPool } from '../../config/database.js';
import { authAdmin } from '../middleware/authAdmin.js';
import { createSecretRateLimit } from '../middleware/rateLimit.js';

const router: Router = Router();

// Admin rate limiting (100 req/min)
const adminRateLimit = createSecretRateLimit;
router.use(adminRateLimit);

// Apply admin auth to each route individually (not on router level)
// This prevents auth from blocking non-admin routes

/**
 * GET /api/stats/summary - Get summary statistics (mounted on /admin, so full path is /admin/api/stats/summary)
 */
router.get('/api/stats/summary', authAdmin, async (_req: Request, res: Response) => {
  try {
    const pool = getPool();

    // Total created secrets
    const [createdRows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM secrets'
    );
    const totalCreated = (createdRows[0] as { count: number })?.count || 0;

    // Total viewed secrets
    const [viewedRows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM log_events WHERE event_type = 'viewed'"
    );
    const totalViewed = (viewedRows[0] as { count: number })?.count || 0;

    // Active secrets (not expired, not viewed)
    const [activeRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM secrets
       WHERE expires_at > NOW() AND views_left > 0`
    );
    const activeSecrets = (activeRows[0] as { count: number })?.count || 0;

    // Secrets created in last 24h
    const [last24hRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM secrets
       WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );
    const last24h = (last24hRows[0] as { count: number })?.count || 0;

    // Secrets created in last 7 days
    const [last7dRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM secrets
       WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );
    const last7d = (last7dRows[0] as { count: number })?.count || 0;

    // Secrets created in last 30 days
    const [last30dRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM secrets
       WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    const last30d = (last30dRows[0] as { count: number })?.count || 0;

    res.json({
      summary: {
        totalCreated,
        totalViewed,
        activeSecrets,
        last24h,
        last7d,
        last30d,
      },
    });
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /api/stats/events - Get events with filters (mounted on /admin, so full path is /admin/api/stats/events)
 */
router.get('/api/stats/events', authAdmin, async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    const days = parseInt(req.query.days as string) || 7;
    const eventType = req.query.event_type as string | undefined;
    const limit = parseInt(req.query.limit as string) || 100;

    let query = `SELECT * FROM log_events
                 WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)`;
    const params: any[] = [days];

    if (eventType) {
      query += ' AND event_type = ?';
      params.push(eventType);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const [rows] = await pool.execute(query, params);

    res.json({
      events: rows,
      filters: {
        days,
        eventType: eventType || null,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

/**
 * GET /api/stats/chart - Get chart data (mounted on /admin, so full path is /admin/api/stats/chart)
 */
router.get('/api/stats/chart', authAdmin, async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    const days = parseInt(req.query.days as string) || 7;
    const interval = req.query.interval as string || 'day'; // 'hour' or 'day'

    const intervalGroup = interval === 'hour' ? 'DATE_FORMAT(created_at, "%Y-%m-%d %H:00:00")' : 'DATE(created_at)';

    const [rows] = await pool.execute(
      `SELECT
        ${intervalGroup} as date,
        event_type,
        COUNT(*) as count
       FROM log_events
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY ${intervalGroup}, event_type
       ORDER BY date ASC, event_type ASC`,
      [days]
    );

    res.json({
      chart: rows,
      interval,
      days,
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

export default router;



