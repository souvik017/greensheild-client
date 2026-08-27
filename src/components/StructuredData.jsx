/**
 * JSON-LD Structured Data Components
 * Add these to pages for rich snippets in Google Search
 */

import React from 'react';
import { SITE_URL, SITE_NAME, SITE_LOGO, CONTACT_PHONE, CONTACT_EMAIL, BUSINESS_ADDRESS, GEO_COORDINATES, BUSINESS_HOURS, SOCIAL_LINKS } from '../utils/seoConfig';

/**
 * LocalBusiness schema for the main site
 */
export const LocalBusinessSchema = ({ additionalType = 'HomeAndConstructionBusiness' }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': additionalType,
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    image: SITE_LOGO,
    description: 'India\'s trusted urban home services platform offering 100+ verified services including pest control, AC repair, plumbing, electrical, cleaning, interior design, salon-at-home, and packers & movers.',
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_ADDRESS.streetAddress,
      addressLocality: BUSINESS_ADDRESS.addressLocality,
      addressRegion: BUSINESS_ADDRESS.addressRegion,
      postalCode: BUSINESS_ADDRESS.postalCode,
      addressCountry: BUSINESS_ADDRESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_COORDINATES.lat,
      longitude: GEO_COORDINATES.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
    priceRange: '$$',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking, Wallet',
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: GEO_COORDINATES.lat,
        longitude: GEO_COORDINATES.lng,
      },
      geoRadius: '50000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Pest Control Service', url: `${SITE_URL}/services/pest-control` },
        { '@type': 'Offer', name: 'AC Service & Repair', url: `${SITE_URL}/services/ac-service-repair` },
        { '@type': 'Offer', name: 'Electrical Repair', url: `${SITE_URL}/services/electrician` },
        { '@type': 'Offer', name: 'Plumbing Service', url: `${SITE_URL}/services/plumber` },
        { '@type': 'Offer', name: 'Home Cleaning', url: `${SITE_URL}/services/home-cleaning` },
        { '@type': 'Offer', name: 'Interior Design', url: `${SITE_URL}/services/interior-design` },
        { '@type': 'Offer', name: 'Packers & Movers', url: `${SITE_URL}/services/packers-and-movers` },
        { '@type': 'Offer', name: 'Salon at Home', url: `${SITE_URL}/services/salon-at-home` },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '10000',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Sharma' },
        datePublished: '2024-12-15',
        reviewBody: 'Excellent service! Booked AC repair and technician arrived in 30 minutes. Professional and transparent pricing.',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Service schema for individual service pages
 */
export const ServiceSchema = ({ service, category, rating = 4.8, reviewCount = 500 }) => {
  if (!service) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.nameEn || 'Home Service',
    name: service.nameEn || 'Home Service',
    description: service.shortDescription || service.longDescription || 'Professional home service by GreenShield',
    provider: {
      '@type': 'LocalBusiness',
      name: 'GreenShield Home Solutions',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Place',
      name: 'India',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}/services/${service.slug}`,
      servicePhone: CONTACT_PHONE,
      servicePostalAddress: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    offers: {
      '@type': 'Offer',
      name: service.nameEn || 'Service',
      url: `${SITE_URL}/services/${service.slug}`,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      price: service.price || service.basePrice || '999',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    category: category?.label || 'Home Service',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * FAQ schema for pages with FAQ sections
 */
export const FAQSchema = ({ faqs }) => {
  if (!faqs?.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q || faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a || faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Breadcrumb schema for navigation
 */
export const BreadcrumbSchema = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * WebSite schema with search action
 */
export const WebSiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/services?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * AggregateRating for testimonials/reviews
 */
export const AggregateRatingSchema = ({ ratingValue = '4.8', reviewCount = '10000' }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating: '5',
    worstRating: '1',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default {
  LocalBusinessSchema,
  ServiceSchema,
  FAQSchema,
  BreadcrumbSchema,
  WebSiteSchema,
  AggregateRatingSchema,
};