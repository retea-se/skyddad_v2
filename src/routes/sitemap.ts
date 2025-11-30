import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /sitemap.xml - Generate sitemap
 */
router.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="sv" href="${baseUrl}/?lang=sv"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/?lang=en"/>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="sv" href="${baseUrl}/privacy?lang=sv"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/privacy?lang=en"/>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="sv" href="${baseUrl}/faq?lang=sv"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/faq?lang=en"/>
  </url>
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
});

export default router;

