/**
 * Sitemap generator for GreenShield Home Solutions
 *
 * Run:
 * node scripts/generate-sitemap.js
 *
 * Generates:
 * - Static pages
 * - Service category pages
 * - Individual ACTIVE service pages
 *
 * Hindi/Bengali SEO is handled on the actual service pages,
 * not by creating fake /hi or /bn URLs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://greenshieldhomesolutions.in';

const OUTPUT_PATH = path.resolve(
  __dirname,
  '../public/sitemap.xml'
);

/**
 * ============================================================
 * YOUR ACTUAL CATEGORIES
 * ============================================================
 */

const categories = [
  'electrical-electronics',
  'pest-control',
  'home-repair',
  'cleaning',
  'gardening',
  'interior-furniture',
  'shifting-logistics',
  'health-wellness',
  'salon-beauty',
  'home-helpers',
  'maintenance',
];

/**
 * ============================================================
 * YOUR REAL SERVICE SLUGS
 * ============================================================
 *
 * IMPORTANT:
 * Keep only slugs that actually exist as:
 *
 * /services/<slug>
 *
 * Since your services are stored in your database,
 * this list should eventually be generated directly
 * from your API/database.
 *
 * For now this is your existing service list.
 */

const serviceSlugs = [
  // Pest Control
  'pest-control',
  'residential-pest-control',
  'commercial-pest-control',
  'termite-control',
  'rodent-control',
  'fly-control',

  // AC
  'ac-service-repair',
  'ac-installation',
  'ac-gas-filling',
  'ac-cleaning',
  'split-ac-service',
  'window-ac-service',

  // Appliances
  'refrigerator-repair',
  'washing-machine-repair',
  'ro-water-purifier-service',
  'kitchen-chimney-service',
  'microwave-oven-repair',
  'tv-installation',
  'washing-machine-installation',

  // Electrical
  'electrician',
  'electrical-wiring',
  'light-fan-installation',
  'socket-outlet-installation',
  'mcb-fuse-box-repair',
  'tv-antenna-installation',
  'doorbell-installation',
  'inverter-installation',

  // Plumbing
  'plumber',
  'bathroom-plumbing',
  'kitchen-plumbing',
  'water-tank-installation',
  'tap-replace',
  'flush-tank-repair',
  'water-pump-repair',

  // Cleaning
  'home-cleaning',
  'deep-cleaning',
  'kitchen-cleaning',
  'bathroom-cleaning',
  'carpet-cleaning',
  'sofa-cleaning',
  'window-cleaning',

  // Home Repair
  'carpentry',
  'furniture-repair',
  'tile-work',
  'painting',
  'wallpaper',
  'waterproofing',

  // Shifting
  'packers-movers',
  'house-shifting',
  'office-shifting',
  'vehicle-transport',
  'bike-transport',
  'bike-taxi',

  // Interior
  'interior-design',
  'modular-kitchen',
  'false-ceiling',
  'wardrobe-installation',
  'furniture-assembly',

  // Salon
  'salon-at-home',
  'hair-cutting',
  'hair-coloring',
  'facial',
  'manicure-pedicure',
  'waxing',
  'massage',

  // Health
  'yoga-teacher',
  'personal-training',
  'nutritionist',
  'physiotherapy',
  'massage-therapy',

  // Maintenance
  'general-maintenance',
  'cctv-installation',
  'water-purifier-installation',
  'fans-installation',
  'curtain-rod',

  // Gardening
  'gardening',
  'lawn-care',
  'plant-care',
  'tree-trimming',

  // Home Helpers
  'home-helper',
  'maid-service',
  'elderly-care',
  'childcare',
  'pet-care',

  // Other services
  'car-wash',
  'car-detailing',
  'car-interior-cleaning',
  'car-denting-painting',
  'bike-washing',
  'bike-detailing',
  'tiling',
  'masonry',
  'plumbing-heavy',
  'electrical-heavy',
  'civil-work',
  'event-planning',
  'balloon-decoration',
  'catering',
  'photography',
  'videography',
  'dj-services',
  'makeup-artist',
  'appliance-repair',
  'tv-repair',
  'audio-video-setup',
  'smart-home-setup',
  'security-system-installation',

  // Additional services from database
  'emergency-home-service',
  'annual-maintenance-contract-amc',
  'flooring-service',
  'welding-service',
  'pop-ceiling',
  'delivery-service',
  'driver-on-demand',
];

/**
 * ============================================================
 * XML ESCAPE
 * ============================================================
 */

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * ============================================================
 * ADD URL
 * ============================================================
 */

function addUrl(urls, url, changefreq, priority) {
  urls.push({
    loc: `${BASE_URL}${url}`,
    changefreq,
    priority,
  });
}

/**
 * ============================================================
 * BUILD URL LIST
 * ============================================================
 */

function buildUrls() {
  const urls = [];

  /**
   * STATIC PAGES
   */

  addUrl(urls, '/', 'weekly', '1.0');

  addUrl(
    urls,
    '/services',
    'weekly',
    '0.9'
  );

  addUrl(
    urls,
    '/about',
    'monthly',
    '0.7'
  );

  addUrl(
    urls,
    '/contact',
    'monthly',
    '0.7'
  );

  /**
   * CATEGORY PAGES
   */

  for (const category of categories) {
    addUrl(
      urls,
      `/services/${category}`,
      'weekly',
      '0.8'
    );
  }

  /**
   * INDIVIDUAL SERVICE PAGES
   */

  for (const slug of serviceSlugs) {
    addUrl(
      urls,
      `/services/${slug}`,
      'weekly',
      '0.8'
    );
  }

  return urls;
}

/**
 * ============================================================
 * GENERATE XML
 * ============================================================
 */

function generateSitemap() {
  const urls = buildUrls();

  const xmlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

  /**
   * Ensure public directory exists
   */

  const publicDirectory = path.dirname(
    OUTPUT_PATH
  );

  fs.mkdirSync(publicDirectory, {
    recursive: true,
  });

  /**
   * Write sitemap
   */

  fs.writeFileSync(
    OUTPUT_PATH,
    sitemap,
    'utf8'
  );

  /**
   * Console output
   */

  console.log('');
  console.log('======================================');
  console.log(' GreenShield Home Solutions Sitemap');
  console.log('======================================');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log('');
  console.log(`Static pages:    4`);
  console.log(`Categories:      ${categories.length}`);
  console.log(`Services:        ${serviceSlugs.length}`);
  console.log('--------------------------------------');
  console.log(`TOTAL URLs:      ${urls.length}`);
  console.log('======================================');
  console.log('');
}

generateSitemap();