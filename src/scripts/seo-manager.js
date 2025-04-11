// SEO Component for Astro
// This component adds meta tags, structured data, and other SEO enhancements

const siteName = 'Nosyt Labs';
const siteUrl = 'https://nosytlabs.com';
const defaultTitle = 'Nosyt Labs - Notable Opportunities Shape Your Tomorrow';
const defaultDescription = 'Nosyt Labs is a forward-thinking technology company specializing in innovative solutions across multiple domains.';
const defaultImage = '/images/nosyt-labs-og.png';

export function generateMetaTags(options = {}) {
  const title = options.title || defaultTitle;
  const description = options.description || defaultDescription;
  const image = options.image || defaultImage;
  const url = options.url || siteUrl;
  const type = options.type || 'website';
  const keywords = options.keywords || ['technology', 'innovation', 'software', 'development'];
  const locale = options.locale || 'en_US';
  const alternateLocales = options.alternateLocales || [];
  const twitterSite = options.twitterSite || '@nosytlabs';
  const twitterCreator = options.twitterCreator || '@nosytlabs';
  const publishedTime = options.publishedTime;
  const modifiedTime = options.modifiedTime;

  let meta = `
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords.join(', ')}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${siteUrl}${image}">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:locale" content="${locale}">`;

  alternateLocales.forEach(loc => {
    meta += `
    <meta property="og:locale:alternate" content="${loc}">`;
  });

  if (publishedTime) {
    meta += `
    <meta property="article:published_time" content="${publishedTime}">`;
  }
  if (modifiedTime) {
    meta += `
    <meta property="article:modified_time" content="${modifiedTime}">`;
  }

  meta += `
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:site" content="${twitterSite}">
    <meta property="twitter:creator" content="${twitterCreator}">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${siteUrl}${image}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${url}">
  `;

  return meta;
}

export function generateStructuredData(options = {}) {
  const type = options.type || 'Organization';
  let data = {};

  if (type === 'Organization') {
    data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': siteName,
      'url': siteUrl,
      'logo': `${siteUrl}/images/logo.svg`,
      'description': defaultDescription,
      'sameAs': [
        'https://twitter.com/nosytlabs',
        'https://github.com/nosytlabs'
      ]
    };
  } else if (type === 'Article') {
    data = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': options.headline || defaultTitle,
      'description': options.description || defaultDescription,
      'image': [`${siteUrl}${options.image || defaultImage}`],
      'author': options.author || 'Nosyt Labs',
      'publisher': {
        '@type': 'Organization',
        'name': siteName,
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/images/logo.svg`
        }
      },
      'datePublished': options.publishedTime || new Date().toISOString(),
      'dateModified': options.modifiedTime || new Date().toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': options.url || siteUrl
      }
    };
  }

  if (options.data) {
    data = { ...data, ...options.data };
  }

  return `
    <script type="application/ld+json">
      ${JSON.stringify(data, null, 2)}
    </script>
  `;
}

export function generateRobotsTxt() {
  return `
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
  `.trim();
}

export function generateSitemap(pages = []) {
  const defaultPages = [
    { url: '/', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/about', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/projects', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/contact', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/how-it-works', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/vault-shelter', lastmod: new Date().toISOString().split('T')[0] }
  ];

  const allPages = [...defaultPages, ...pages];

  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allPages.forEach(page => {
    sitemapContent += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemapContent += `
</urlset>`;

  return sitemapContent;
}

export default SEOManager;
