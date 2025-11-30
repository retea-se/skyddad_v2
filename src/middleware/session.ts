import session from 'express-session';
import { config } from '../../config/index.js';

/**
 * Session configuration
 * Dev: in-memory store
 * Prod: MySQL store (if available)
 */
export const sessionMiddleware = session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  name: 'skyddad.sid',
  cookie: {
    secure: config.app.env === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  },
});

