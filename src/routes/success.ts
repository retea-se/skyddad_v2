import { Router, Request, Response } from 'express';
import { validateToken } from '../utils/token.js';
import { getLocale, t } from '../services/i18n.js';

const router = Router();

/**
 * GET /success - Success page with secret link
 */
router.get('/success', (req: Request, res: Response) => {
  const { id, token } = req.query;
  const locale = getLocale(req);

  if (!id || !token || typeof id !== 'string' || typeof token !== 'string') {
    return res.redirect('/');
  }

  // Validate token
  if (!validateToken(id, token)) {
    return res.redirect('/');
  }

  const viewUrl = `${req.protocol}://${req.get('host')}/view/${id}?token=${token}`;

  res.render('success', {
    title: t(locale, 'success.title'),
    viewUrl: viewUrl,
    secretId: id,
    locale: locale,
  });
});

export default router;


