#!/usr/bin/env node
/**
 * Cleanup Cron Job
 * Removes expired secrets and old logs
 * Run via cron: 0 * * * * (every hour)
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashIP } from '../src/utils/anonymize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function cleanup() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.info('🧹 Starting cleanup...');

    // 1. Delete expired secrets
    const [expiredResult] = await connection.execute(
      `DELETE FROM secrets WHERE expires_at < NOW()`
    );
    const expiredCount = (expiredResult as any).affectedRows || 0;
    console.info(`✅ Deleted ${expiredCount} expired secrets`);

    // 2. Log expired events for deleted secrets
    if (expiredCount > 0) {
      await connection.execute(
        `INSERT INTO log_events (event_type, secret_id, ip_hash, user_agent_hash)
         VALUES ('expired', NULL, ?, ?)`,
        [hashIP('system'), hashIP('cleanup-job')]
      );
    }

    // 3. Delete logs older than 90 days
    const [logsResult] = await connection.execute(
      `DELETE FROM log_events WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)`
    );
    const logsCount = (logsResult as any).affectedRows || 0;
    console.info(`✅ Deleted ${logsCount} old log entries`);

    // 4. Log cleanup event
    await connection.execute(
      `INSERT INTO log_events (event_type, secret_id, ip_hash, user_agent_hash)
       VALUES ('cleanup', NULL, ?, ?)`,
      [hashIP('system'), hashIP('cleanup-job')]
    );

    console.info('✨ Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

cleanup();

