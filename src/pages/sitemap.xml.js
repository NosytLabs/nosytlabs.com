/**
 * Sitemap Generator for NosytLabs
 * Automatically generates sitemap.xml for better SEO
 */

// Site configuration
const SITE_URL = 'https://nosytlabs.com';

// Static pages with their priorities and change frequencies
const staticPages = [
  {
    url: '',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString()
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/services',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: new Date().toISOString()
  },
  {
    url: '/projects',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/blog',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString()
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  },
  {
    url: '/nosytos95',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/3d-printing',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  },
  {
    url: '/content-creation',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/crypto-mining',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date().toISOString()
  },
  {
    url: '/privacy-policy',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: new Date().toISOString()
  },
  {
    url: '/terms-of-service',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: new Date().toISOString()
  }
];

// Blog posts (these would typically be fetched from a CMS or markdown files)
const blogPosts = [
  {
    url: '/blog/cursor-ai-review',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-15T00:00:00.000Z'
  },
  {
    url: '/blog/cursor-ai-revolutionizing-coding',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-14T00:00:00.000Z'
  },
  {
    url: '/blog/trae-ai-guide',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-13T00:00:00.000Z'
  },
  {
    url: '/blog/roo-code-windsurf-comparison',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-12T00:00:00.000Z'
  },
  {
    url: '/blog/ai-tools-comparison-2025',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2025-01-11T00:00:00.000Z'
  },
  {
    url: '/blog/ai-trends-2025',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2025-01-10T00:00:00.000Z'
  },
  {
    url: '/blog/future-of-3d-printing-2025',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-09T00:00:00.000Z'
  }
];

// Passive income pages
const passiveIncomePages = [
  {
    url: '/passive-income/guide',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/comparison',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/honeygain',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/earnapp',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/peer2profit',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/repocket',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/traffmonetizer',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/brave',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/passive-income/swagbucks',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  }
];

// Combine all pages
const allPages = [...staticPages, ...blogPosts, ...passiveIncomePages];

// Generate sitemap XML
function generateSitemap() {
  const urls = allPages.map(page => {
    return `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;
}

// Export the GET function for Astro
export async function GET() {
  const sitemap = generateSitemap();
  
  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'X-Robots-Tag': 'noindex' // Don't index the sitemap itself
    }
  });
}
