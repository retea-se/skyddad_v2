import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : process.env.NODE_ENV === 'test'
  ? '.env.test'
  : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // Override with .env if exists

// Schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('3000'),
  APP_ENV: z.enum(['local', 'staging', 'prod']).optional(),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('3306'),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // Encryption
  ENCRYPTION_KEY: z.string().length(64, 'Encryption key must be 32 bytes (64 hex characters)'),

  // Session
  SESSION_SECRET: z.string().min(32),

  // CSRF
  CSRF_SECRET: z.string().min(32),

  // Sentry (optional)
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  SENTRY_ENVIRONMENT: z.string().optional(),

  // Admin API (optional)
  ADMIN_API_KEY: z.string().optional(),

  // Feature Flags
  ENABLE_ADMIN_API: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SENTRY: z.string().transform(val => val === 'true').default('false'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_METRICS: z.string().transform(val => val === 'true').default('true'),
});

// Validate and parse environment variables
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parseResult.error.format());
  process.exit(1);
}

const env = parseResult.data;

// Export typed config
export const config = {
  app: {
    env: env.NODE_ENV,
    appEnv: env.APP_ENV || env.NODE_ENV,
    port: env.PORT,
  },
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  encryption: {
    key: env.ENCRYPTION_KEY,
  },
  session: {
    secret: env.SESSION_SECRET,
  },
  csrf: {
    secret: env.CSRF_SECRET,
  },
  sentry: {
    dsn: env.SENTRY_DSN || undefined,
    environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV,
  },
  admin: {
    apiKey: env.ADMIN_API_KEY,
  },
  features: {
    adminApi: env.ENABLE_ADMIN_API,
    sentry: env.ENABLE_SENTRY,
    analytics: env.ENABLE_ANALYTICS,
    metrics: env.ENABLE_METRICS,
  },
} as const;

export type Config = typeof config;

