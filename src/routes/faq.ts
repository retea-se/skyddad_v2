import { Router, Request, Response } from 'express';
import { getLocale, t } from '../services/i18n.js';
import { getFAQ } from '../services/faq.js';

const router: Router = Router();

/**
 * GET /faq - FAQ page (SEO and AI-friendly)
 */
router.get('/faq', (req: Request, res: Response) => {
  const locale = getLocale(req);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.render('faq', {
    title: t(locale, 'faq.pageTitle'),
    locale: locale,
    faq: {
      questions: getFAQ(locale),
    },
    meta: {
      title: t(locale, 'faq.metaTitle'),
      description: t(locale, 'faq.metaDescription'),
      url: `${baseUrl}/faq`,
      type: 'FAQPage',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
  });
});

export default router;

