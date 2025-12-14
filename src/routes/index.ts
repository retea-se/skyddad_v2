import { Router, Request, Response } from 'express';
import { getLocale, t } from '../services/i18n.js';

const router: Router = Router();

/**
 * GET / - Home page (create secret form)
 */
router.get('/', (req: Request, res: Response) => {
  const locale = getLocale(req);
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  // Ensure basePath is available (should be set by middleware, but add fallback)
  const basePath = (res.locals.basePath as string) || '/skyddad';
  console.log('[DEBUG index] basePath from res.locals:', res.locals.basePath);
  console.log('[DEBUG index] basePath fallback:', basePath);
  res.render('index', {
    title: t(locale, 'meta.home.title'),
    locale: locale,
    basePath: basePath, // Explicitly pass basePath
    meta: {
      title: t(locale, 'meta.home.title'),
      description: t(locale, 'meta.home.description'),
      url: `${baseUrl}/`,
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
  });
});

export default router;

