import { Router, Request, Response } from 'express';
import { validateToken } from '../utils/token.js';
import { getLocale, t } from '../services/i18n.js';
import { config } from '../../config/index.js';

const router: Router = Router();

/**
 * GET /success - Success page with secret link
 */
router.get('/success', (req: Request, res: Response) => {
  const { id, token } = req.query;
  const locale = getLocale(req);

  // TODO: Fix basePath loading from .env.production
  // For now, hardcode /skyddad since we know the app is mounted there
  const basePath = config.app.basePath || '/skyddad';

  if (!id || !token || typeof id !== 'string' || typeof token !== 'string') {
    return res.redirect(`${basePath}/`);
  }

  // Validate token
  if (!validateToken(id, token)) {
    return res.redirect(`${basePath}/`);
  }

  const viewUrl = `${req.protocol}://${req.get('host')}${basePath}/view/${id}?token=${token}`;

  res.render('success', {
    title: t(locale, 'success.title'),
    viewUrl: viewUrl,
    secretId: id,
    locale: locale,
  });
});

export default router;


