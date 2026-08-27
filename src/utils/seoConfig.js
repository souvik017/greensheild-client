// SEO Meta data for the entire site
// Centralized SEO configuration to avoid scattered meta tags

export const SITE_URL = 'https://greenshieldhomesolutions.in';
export const SITE_NAME = 'GreenShield Home Solutions';
export const SITE_LOGO = 'https://greenshieldhomesolutions.in/logo.png';
export const CONTACT_PHONE = '+91 8282050022';
export const CONTACT_EMAIL = 'greenshieldhomesolutions@gmail.com';
export const BUSINESS_ADDRESS = {
  streetAddress: 'Kolkata',
  addressLocality: 'Kolkata',
  addressRegion: 'West Bengal',
  postalCode: '700001',
  addressCountry: 'IN',
};
export const GEO_COORDINATES = { lat: 22.992999, lng: 88.445392 };
export const BUSINESS_HOURS = 'Mo-Su 09:00-21:00';
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1CVHSTKnni/',
  instagram: 'https://instagram.com/greenshieldhomesolutions',
  twitter: 'https://twitter.com/greenshieldhomes',
  linkedin: 'https://linkedin.com/company/greenshieldhomesolutions',
  youtube: 'https://youtube.com/@greenshieldhomesolutions',
};

export const DEFAULT_TITLE = 'GreenShield — Book Trusted Home Services Online | 100+ Services';
export const DEFAULT_DESCRIPTION =
  'GreenShield Home Solutions is India\'s modern urban home services platform. Book pest control, AC repair, electrician, plumber, cleaning, salon-at-home & 100+ verified services in 30 minutes. 4.8★ rated, 10K+ happy customers.';
export const DEFAULT_KEYWORDS =
  'home services, home services near me, urban company, urban home services, pest control, AC repair, AC service, electrician, plumber, home cleaning, deep cleaning, salon at home, interior design, packers and movers, home maintenance, Kolkata home services, online home services';

export const DEFAULT_OG_IMAGE = 'https://greenshieldhomesolutions.in/og-image.jpg';

export const PAGE_META = {
  home: {
    title: 'GreenShield — India\'s Trusted Home Services | Book in 30 Minutes',
    description:
      'Book 100+ verified home services online — pest control, AC repair, plumbing, cleaning, salon, interior design, packers & movers. 4.8★ rated, 10K+ customers across 50+ cities. Same-day service available.',
    keywords:
      'home services, home services online, urban home services, urban company alternative, pest control online, AC repair booking, electrician booking, plumber near me, home cleaning service, salon at home, Kolkata home services',
  },
  services: {
    title: 'All Home Services — Book Online | GreenShield',
    description:
      'Browse 100+ home services: pest control, AC service, electrical, plumbing, cleaning, interior design, beauty, fitness & more. Transparent pricing, verified professionals, same-day service across India.',
    keywords:
      'all home services, pest control service, AC service and repair, electrician service, plumber service, home cleaning, interior design services, packers and movers, salon at home, home services list',
  },
  about: {
    title: 'About GreenShield — Our Mission, Team & Story | Trusted Home Services',
    description:
      'GreenShield Home Solutions is on a mission to make every home service trustworthy, transparent and tech-enabled. Learn about our story, team, and commitment to verified professionals and 30-minute service.',
    keywords:
      'about GreenShield, GreenShield Home Solutions, our story, our mission, home service company, verified professionals, trusted home services India',
  },
  contact: {
    title: 'Contact GreenShield — 24/7 Support | Book Home Service',
    description:
      'Get in touch with GreenShield Home Solutions. Call +91 76858 06236 or book online. Available 24/7 across 50+ cities in India. Office in Kolkata, West Bengal.',
    keywords:
      'contact GreenShield, GreenShield phone number, home service support, customer care, contact us home services',
  },
};

// Per-service SEO templates (use service data to fill)
export function getServiceMeta(service) {
  if (!service) return PAGE_META.services;
  const name = service.nameEn || 'Service';
  const category = service.category || 'home service';
  return {
    title: `${name} — Book Online at Best Price | GreenShield`,
    description: `Book ${name} online with GreenShield. Verified professionals, transparent pricing, 30-day service warranty. Same-day ${name} available in 50+ cities. 4.8★ rated by 10K+ customers.`,
    keywords: `${name}, ${name} online, ${name} near me, ${name} price, ${name} service, book ${name}, ${category}`,
  };
}

// Local SEO landing pages (city + service combos)
export const CITIES = [
  'Kolkata',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Noida',
  'Gurgaon',
  'Ahmedabad',
];

export const KEY_SERVICES = [
  'pest-control',
  'ac-service-repair',
  'electrician',
  'plumber',
  'home-cleaning',
  'packers-and-movers',
  'salon-at-home',
  'interior-design',
];
