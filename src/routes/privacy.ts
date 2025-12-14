import { Router, Request, Response } from 'express';
import { getLocale, t } from '../services/i18n.js';

const router: Router = Router();

/**
 * GET /privacy - Privacy policy page
 */
router.get('/privacy', (req: Request, res: Response) => {
  const locale = getLocale(req);
  res.render('privacy', {
    title: t(locale, 'privacy.pageTitle'),
    locale: locale,
  });
});

export default router;




