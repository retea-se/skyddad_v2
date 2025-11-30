import { config } from './index.js';

export const features = {
  adminApi: config.features.adminApi,
  sentry: config.features.sentry,
  analytics: config.features.analytics,
  metrics: config.features.metrics,
} as const;

export type FeatureFlags = typeof features;

