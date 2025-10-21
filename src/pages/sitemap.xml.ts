import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../lib/constants';

const getPages = async () => {
  // Get all blog posts with dates
  const posts = await getCollection('blog');
  const postUrls = posts.map((post: CollectionEntry<'blog'>) => ({
    url: `/blog/${post.slug}`,
    lastmod: post.data.updatedDate?.toISOString().split('T')[0] || post.data.pubDate.toISOString().split('T')[0],
    priority: '0.7',
    changefreq: 'monthly'
  }));
  
  // Get all services
  const services = await getCollection('services');
  
  // Static pages with last modified dates
  const staticPages = [
    { url: '/', lastmod: '2025-01-10', priority: '1.0', changefreq: 'daily' },
    { url: '/about', lastmod: '2025-01-10', priority: '0.9', changefreq: 'monthly' },
    { url: '/services', lastmod: '2025-01-10', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', lastmod: '2025-01-10', priority: '0.9', changefreq: 'daily' },
    { url: '/contact', lastmod: '2025-01-10', priority: '0.8', changefreq: 'monthly' },
    { url: '/projects', lastmod: '2025-01-10', priority: '0.8', changefreq: 'weekly' },
  ];
  
  // Generate service URLs
  const serviceUrls = services.map((service: CollectionEntry<'services'>) => ({
    url: `/services/${service.slug}`,
    lastmod: '2025-01-10',
    priority: '0.8',
    changefreq: 'monthly'
  }));
  
  // Combine all URLs
  return [...staticPages, ...serviceUrls, ...postUrls];
};

const generateSitemap = (pages: Array<{ url: string; lastmod: string; priority: string; changefreq: string }>): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map((page) => `  <url>
    <loc>${SITE_CONFIG.BASE_URL_LOWERCASE}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export const GET: APIRoute = async () => {
  const pages = await getPages();
  const sitemap = generateSitemap(pages);
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
