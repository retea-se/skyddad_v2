import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { getLocale, setLocale, t } from './services/i18n.js';
import { sentryRequestHandler, sentryErrorHandler } from './middleware/errorHandler.js';
import { metricsMiddleware } from './services/metrics.js';
import { sessionMiddleware } from './middleware/session.js';
import { csrfMiddleware } from './middleware/csrf.js';
import { config } from '../config/index.js';
import indexRouter from './routes/index.js';
import healthRouter from './routes/health.js';
import createRouter from './routes/create.js';
import viewRouter from './routes/view.js';
import successRouter from './routes/success.js';
import privacyRouter from './routes/privacy.js';
import sitemapRouter from './routes/sitemap.js';
import faqRouter from './routes/faq.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = (): express.Application => {
  const app = express();

  // Base path for route mounting (e.g., '/skyddad' for retea.se/skyddad)
  // TODO: Fix basePath loading from .env.production
  // For now, hardcode /skyddad since we know the app is mounted there
  const basePath = config.app.basePath || '/skyddad';

  // Sentry request handler (must be first)
  if (config.features.sentry) {
    app.use(sentryRequestHandler);
  }

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  );

  // Metrics middleware (early in chain)
  app.use(metricsMiddleware);

  // Sessions (before body parsing for CSRF)
  app.use(sessionMiddleware);

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // CSRF protection
  app.use(csrfMiddleware);

  // Static files - mount on basePath if set
  const publicPath = path.resolve(__dirname, '..', 'public');
  if (basePath) {
    app.use(basePath, express.static(publicPath));
  } else {
    app.use(express.static(publicPath));
  }

  // i18n middleware - set locale from query/cookie
  app.use((req, res, next) => {
    const locale = getLocale(req);
    if (req.query?.lang && (req.query.lang === 'en' || req.query.lang === 'sv')) {
      setLocale(res, req.query.lang as 'sv' | 'en');
    }
    (req as any).locale = locale;
    next();
  });

  // Handlebars setup with i18n helper
  const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.resolve(__dirname, '..', 'views', 'layouts'),
    partialsDir: path.resolve(__dirname, '..', 'views', 'partials'),
    helpers: {
      t: function (this: any, key: string, options?: any) {
        const locale = this.locale || 'sv';
        let translation = t(locale, key);
        // Simple variable replacement ({{variable}})
        if (options && options.hash) {
          Object.keys(options.hash).forEach((varName) => {
            translation = translation.replace(
              new RegExp(`{{${varName}}}`, 'g'),
              options.hash[varName]
            );
          });
        }
        return translation;
      },
      eq: (a: any, b: any) => a === b,
    },
  });

  // Make locale and basePath available to Handlebars
  // IMPORTANT: This must run BEFORE routes that render views
  app.use((req, res, next) => {
    const locale = getLocale(req);
    res.locals.locale = locale;
    // Ensure basePath is always set - use hardcoded /skyddad for now
    res.locals.basePath = basePath || '/skyddad';
    // Also set it directly on res for Handlebars helpers
    (res as any).basePath = basePath || '/skyddad';
    next();
  });

  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.set('views', path.resolve(__dirname, '..', 'views'));
  // Disable view cache to ensure template updates are picked up
  app.set('view cache', false);

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  // Routes - mount on basePath
  app.use(basePath || '/', indexRouter);
  app.use(basePath || '/', healthRouter);
  app.use(basePath || '/', createRouter);
  app.use(basePath || '/', viewRouter);
  app.use(basePath || '/', successRouter);
  app.use(basePath || '/', privacyRouter);
  app.use(basePath || '/', sitemapRouter);
  app.use(basePath || '/', faqRouter);

  // Admin routes (protected)
  if (config.features.adminApi) {
    app.use(`${basePath}/admin`, adminRouter);
  }

  // 404 handler
  app.use((req, res) => {
    const locale = getLocale(req);
    res.status(404).render('404', {
      title: t(locale, '404.title'),
      locale: locale,
    });
  });

  // Sentry error handler (before other error handlers)
  if (config.features.sentry) {
    app.use(sentryErrorHandler);
  }

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    const locale = getLocale(req);
    res.status(500).render('500', {
      title: t(locale, '500.title'),
      locale: locale,
    });
  });

  return app;
};

