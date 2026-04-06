import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterHandle?: string;
}

export const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage = 'https://picsum.photos/seed/linknest-og/1200/630', 
  ogType = 'website',
  twitterHandle = '@linknest'
}: SEOProps) => {
  const siteName = 'LinkNest';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ogType === 'article' ? 'BlogPosting' : 'WebApplication',
            "name": siteName,
            "description": description,
            "url": canonical || 'https://linknest.com',
            "logo": "https://linknest.com/logo.png",
            "applicationCategory": "SocialNetworkingApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }),
        }}
      />
    </>
  );
};
