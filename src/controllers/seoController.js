const seoService = require('../services/seoService');

class SeoController {
  async getSitemap(req, res) {
    try {
      const xml = await seoService.buildSitemapXml();
      res.set('Content-Type', 'application/xml; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600');
      res.status(200).send(xml);
    } catch (error) {
      console.error('Sitemap error:', error.message);
      res.status(500).json({ success: false, error: 'Failed to build sitemap' });
    }
  }
}

module.exports = new SeoController();
