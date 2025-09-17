import type { APIRoute } from 'astro';

const getPages = async () => {
  // Import all blog posts
  const blogPosts = await import.meta.glob('../content/blog/*.md', { eager: true });
  
  // Static pages
  const staticPages = [
    '/',
    '/about',
    '/services',
    '/projects',
    '/blog',
    '/contact',
    '/book-a-consultation',
    '/gallery',
    '/team'
  ];
  
  // Generate blog post URLs
  const blogUrls = Object.keys(blogPosts).map((path) => {
    const slug = path.split('/').pop()?.replace('.md', '');
    return `/blog/${slug}`;
  });
  
  // Combine all URLs
  const allUrls = [...staticPages, ...blogUrls];
  
  return allUrls;
};

const generateSitemap = (urls: string[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>https://nosytlabs.com${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : url.startsWith('/blog') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export const GET: APIRoute = async () => {
  const urls = await getPages();
  const sitemap = generateSitemap(urls);
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};