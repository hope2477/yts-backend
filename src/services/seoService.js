const vehicleRepository = require('../repositories/vehicleRepository');
const propertyRepository = require('../repositories/propertyRepository');
const blogRepository = require('../repositories/blogRepository');

const SITE_URL = (process.env.FRONTEND_URL || 'https://ytsenterprise.com').replace(/\/$/, '');

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function vehicleModelSlug(make, model) {
  const cleaned = String(model || '')
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .trim();
  return slugify(`${make} ${cleaned}`);
}

function propertySlug(name, id) {
  const base = slugify(name) || 'property';
  return id ? `${base}-${id}` : base;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, { lastmod, changefreq = 'weekly', priority = '0.7' } = {}) {
  const last = lastmod
    ? `<lastmod>${escapeXml(lastmod)}</lastmod>`
    : '';
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${last}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

class SeoService {
  /**
   * Dynamic sitemap for Google — complements the static FE export sitemap.
   * Includes core pages + unique vehicle models, properties, holiday home, blogs.
   */
  async buildSitemapXml() {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [];

    const staticPaths = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/vehicles/', priority: '0.9' },
      { path: '/vehicles/economy-cars-sri-lanka/', priority: '0.75' },
      { path: '/vehicles/luxury-cars-colombo/', priority: '0.75' },
      { path: '/vehicles/minivans-sri-lanka/', priority: '0.75' },
      { path: '/properties/', priority: '0.9' },
      { path: '/holiday-homes/', priority: '0.9' },
      { path: '/holiday-homes/newlands-bungalow-galle/', priority: '0.8' },
      { path: '/blog/', priority: '0.8' },
      { path: '/about/', priority: '0.8', changefreq: 'monthly' },
      { path: '/contact/', priority: '0.8', changefreq: 'monthly' },
      { path: '/faq/', priority: '0.7', changefreq: 'monthly' },
      { path: '/privacy-policy/', priority: '0.5', changefreq: 'yearly' },
      { path: '/terms-and-conditions/', priority: '0.5', changefreq: 'yearly' },
    ];

    for (const item of staticPaths) {
      urls.push(
        urlEntry(`${SITE_URL}${item.path}`, {
          lastmod: today,
          changefreq: item.changefreq || 'weekly',
          priority: item.priority,
        })
      );
    }

    try {
      const vehiclesResult = await vehicleRepository.getAllVehicles({});
      const seenModels = new Set();
      for (const v of vehiclesResult.data || []) {
        if (!v.isActive) continue;
        const slug = vehicleModelSlug(v.make, v.model);
        if (!slug || seenModels.has(slug)) continue;
        seenModels.add(slug);
        urls.push(
          urlEntry(`${SITE_URL}/vehicles/${slug}/`, {
            lastmod: today,
            priority: '0.7',
          })
        );
      }
    } catch (err) {
      console.error('Sitemap vehicles error:', err.message);
    }

    try {
      const propertiesResult = await propertyRepository.getAllProperties();
      for (const p of propertiesResult.data || []) {
        if (!p.isActive || p.isSoldOut) continue;
        const slug = propertySlug(p.name, p.id);
        urls.push(
          urlEntry(`${SITE_URL}/properties/${slug}/`, {
            lastmod: today,
            priority: '0.7',
          })
        );
      }
    } catch (err) {
      console.error('Sitemap properties error:', err.message);
    }

    try {
      const blogs = await blogRepository.getPublishedBlogs();
      for (const post of blogs || []) {
        urls.push(
          urlEntry(`${SITE_URL}/blog/${post.slug}/`, {
            lastmod: post.publishedAt || today,
            changefreq: 'monthly',
            priority: '0.65',
          })
        );
      }
    } catch (err) {
      console.error('Sitemap blogs error:', err.message);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  }
}

module.exports = new SeoService();
