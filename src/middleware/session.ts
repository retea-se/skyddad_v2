import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import type { RequestHandler } from 'express';
import { config } from '../../config/index.js';
import { getPool } from '../../config/database.js';

const MySQLStore = MySQLStoreFactory(session);

/**
 * Session configuration
 * Dev: in-memory store (MemoryStore)
 * Prod: MySQL store for persistence and clustering support
 */
let sessionStore: session.Store | undefined;

if (config.app.env === 'production') {
  // Use MySQL store in production for persistence and clustering support
  // MySQLStore accepts mysql2/promise Pool (express-mysql-session docs)
  const mysqlStore = new MySQLStore(
    {
      createDatabaseTable: true,
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data',
        },
      },
    },
    getPool() as any // Type mismatch between mysql2 Pool types, but works at runtime
  );
  sessionStore = mysqlStore;
}

const sessionConfig: session.SessionOptions = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  name: 'skyddad.sid',
  cookie: {
    secure: config.app.env === 'production',
    httpOnly: true,
    sameSite: config.app.env === 'production' ? 'strict' : 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  },
  store: sessionStore, // MySQL store in production, MemoryStore (undefined) in development
};

export const sessionMiddleware: RequestHandler = session(sessionConfig);




