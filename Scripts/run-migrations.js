import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : process.env.NODE_ENV === 'test'
  ? '.env.test'
  : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

async function getExecutedMigrations(connection) {
  try {
    const [rows] = await connection.execute(
      'SELECT migration_name FROM migrations_history ORDER BY id'
    );
    return rows.map(row => row.migration_name);
  } catch (error) {
    // Table doesn't exist yet, return empty array
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw error;
  }
}

async function recordMigration(connection, migrationName) {
  await connection.execute(
    'INSERT INTO migrations_history (migration_name) VALUES (?)',
    [migrationName]
  );
}

async function runMigrations() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.info('📦 Starting migrations...');

    // Get migrations directory
    const migrationsDir = path.resolve(__dirname, '..', 'migrations');
    const files = await fs.readdir(migrationsDir);

    // Filter and sort SQL files
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.info('ℹ️  No migration files found');
      return;
    }

    // Get executed migrations
    const executedMigrations = await getExecutedMigrations(connection);

    // Run pending migrations
    for (const file of migrationFiles) {
      if (executedMigrations.includes(file)) {
        console.info(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      console.info(`🔄 Running ${file}...`);
      const sql = await fs.readFile(
        path.join(migrationsDir, file),
        'utf-8'
      );

      await connection.query(sql);
      await recordMigration(connection, file);
      console.info(`✅ Completed ${file}`);
    }

    console.info('✨ All migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();




