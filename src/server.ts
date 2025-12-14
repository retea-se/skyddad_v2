import { createApp } from './app.js';
import { config } from '../config/index.js';
import { initSentry } from '../config/sentry.js';

// Initialize Sentry before app
initSentry();

console.log('[DEBUG server] Initializing app...');
console.log('[DEBUG server] NODE_ENV:', process.env.NODE_ENV);
console.log('[DEBUG server] PASSENGER_APP_ENV:', process.env.PASSENGER_APP_ENV);

const app = createApp();

console.log('[DEBUG server] App created, type:', typeof app);

// For Passenger: export the app (Passenger handles the server)
// For standalone: start the server
if (typeof process.env.PASSENGER_APP_ENV === 'undefined') {
  // Standalone mode (development)
  const PORT = config.app.port;
  app.listen(PORT, () => {
    console.info(`🚀 Server running on http://localhost:${PORT}`);
    console.info(`📦 Environment: ${config.app.env}`);
  });
} else {
  // Passenger mode (production)
  // Passenger will handle the server, we just export the app
  console.info(`📦 Passenger mode - Environment: ${config.app.env}`);
}

// Export app for Passenger (required)
// Passenger with ES modules expects default export
export default app;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.info('SIGTERM received, shutting down gracefully...');
  const { closePool } = await import('../config/database.js');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.info('SIGINT received, shutting down gracefully...');
  const { closePool } = await import('../config/database.js');
  await closePool();
  process.exit(0);
});

