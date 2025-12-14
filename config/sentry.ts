import * as Sentry from '@sentry/node';
import { config } from './index.js';

export const initSentry = (): void => {
  if (!config.features.sentry || !config.sentry.dsn) {
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    tracesSampleRate: 0.1, // 10% of transactions
    beforeSend(event) {
      // Filter out sensitive data
      if (event.request) {
        // Remove secret_id from URLs
        if (event.request.url) {
          event.request.url = event.request.url.replace(/\/view\/[a-f0-9]+/g, '/view/[REDACTED]');
        }
        // Remove query params with tokens
        if (event.request.query_string) {
          delete event.request.query_string;
        }
      }
      return event;
    },
  });
};




