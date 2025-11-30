import { createApp } from './app.js';
import { config } from '../config/index.js';
import { initSentry } from '../config/sentry.js';

// Initialize Sentry before app
initSentry();

const app = createApp();

// Start server
const PORT = config.app.port;

app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT}`);
  console.info(`📦 Environment: ${config.app.env}`);
});

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

