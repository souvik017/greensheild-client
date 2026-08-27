import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  PAGE_META,
} from '../utils/seoConfig';

/**
 * SEO Head component that injects proper meta tags per page
 * Usage: <SEO title="Custom Title" description="Custom Desc" canonical="/some-page" />
 */
export const SEO = ({
  title,
  description,
  canonical,
  type = 'website',
  images,
  noindex = false,
  OgImage,
}) => {
  const pageTitle = title || DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageOgImage = OgImage || DEFAULT_OG_IMAGE;

  // Generate og:image array if provided
  const ogImageArray = Array.isArray(images)
    ? images.map(img => ({ url: img }))
    : images
    ? [{ url: images }]
    : OgImage
    ? [{ url: OgImage }]
    : [{ url: pageOgImage }];

  return (
    <Helmet
      title={pageTitle}
      htmlAttributes={{
        lang: 'en',
      }}
    >
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={DEFAULT_KEYWORDS} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={SITE_URL + (canonical || window.location.pathname)} />
      <meta property="og:site_name" content="GreenShield Home Solutions" />
      {ogImageArray.length > 0 && ogImageArray.map((img, i) => (
        <meta key={i} property="og:image" content={img.url} />
      ))}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageOgImage} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEO;