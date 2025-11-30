import { Router, Request, Response } from 'express';
import { getLocale, t } from '../services/i18n.js';

const router = Router();

/**
 * GET / - Home page (create secret form)
 */
router.get('/', (req: Request, res: Response) => {
  const locale = getLocale(req);
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.render('index', {
    title: t(locale, 'meta.home.title'),
    locale: locale,
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

