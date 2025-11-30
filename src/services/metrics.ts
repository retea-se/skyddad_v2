import { Request, Response, NextFunction } from 'express';
import { config } from '../../config/index.js';

interface Metrics {
  requests: number;
  errors: {
    '4xx': number;
    '5xx': number;
  };
  startTime: Date;
}

let metrics: Metrics = {
  requests: 0,
  errors: {
    '4xx': 0,
    '5xx': 0,
  },
  startTime: new Date(),
};

/**
 * Metrics middleware - track requests and errors
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!config.features.metrics) {
    return next();
  }

  metrics.requests++;

  // Track response status
  res.on('finish', () => {
    const status = res.statusCode;
    if (status >= 400 && status < 500) {
      metrics.errors['4xx']++;
    } else if (status >= 500) {
      metrics.errors['5xx']++;
    }
  });

  next();
};

/**
 * Get current metrics
 */
export const getMetrics = (): Metrics & { uptime: number } => {
  const uptime = Math.floor((Date.now() - metrics.startTime.getTime()) / 1000);
  return {
    ...metrics,
    uptime,
  };
};

/**
 * Reset metrics (for testing)
 */
export const resetMetrics = (): void => {
  metrics = {
    requests: 0,
    errors: {
      '4xx': 0,
      '5xx': 0,
    },
    startTime: new Date(),
  };
};

