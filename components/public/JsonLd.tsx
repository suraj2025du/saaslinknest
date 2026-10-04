interface JsonLdProps {
  type?: 'organization' | 'website' | 'product';
}

export function JsonLd({ type = 'organization' }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://linknest.tech';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LinkNest',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/linknest',
      'https://www.instagram.com/linknest',
      'https://www.linkedin.com/company/linknest',
      'https://github.com/linknest',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '',
      contactType: 'Customer Support',
      email: 'support@linknest.tech',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LinkNest',
    url: baseUrl,
    description: 'Smart Link-in-Bio Platform for Creators & Businesses',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'LinkNest',
    description: 'The premium link-in-bio platform for creators, influencers, and businesses. Share unlimited links, track analytics, and customize your profile.',
    url: baseUrl,
    brand: {
      '@type': 'Brand',
      name: 'LinkNest',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '99',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
  };

  const schema = type === 'organization' ? organizationSchema : type === 'product' ? productSchema : websiteSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
