/**
 * Robots.txt Generator for NosytLabs
 * Provides search engine crawling instructions
 */

const SITE_URL = 'https://nosytlabs.com';

function generateRobotsTxt() {
  return `# NosytLabs Robots.txt
# Notable Opportunities Shape Your Tomorrow

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay (be nice to our servers)
Crawl-delay: 1

# Specific rules for different bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /.netlify/
Disallow: /.vercel/

# Block access to development files
Disallow: /src/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /.env
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /yarn.lock

# Block access to temporary files
Disallow: /tmp/
Disallow: /temp/
Disallow: /*.log
Disallow: /*.tmp

# Block access to search results and dynamic pages
Disallow: /search?
Disallow: /*?utm_*
Disallow: /*?ref=*
Disallow: /*?source=*

# Allow access to important resources
Allow: /images/
Allow: /styles/
Allow: /scripts/
Allow: /fonts/
Allow: /*.css
Allow: /*.js
Allow: /*.svg
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.webp
Allow: /*.avif

# Special instructions for AI crawlers
User-agent: GPTBot
Allow: /blog/
Allow: /services/
Allow: /about/
Disallow: /admin/
Disallow: /api/

User-agent: ChatGPT-User
Allow: /blog/
Allow: /services/
Allow: /about/
Disallow: /admin/
Disallow: /api/

User-agent: CCBot
Allow: /blog/
Allow: /services/
Allow: /about/
Disallow: /admin/
Disallow: /api/

User-agent: anthropic-ai
Allow: /blog/
Allow: /services/
Allow: /about/
Disallow: /admin/
Disallow: /api/

User-agent: Claude-Web
Allow: /blog/
Allow: /services/
Allow: /about/
Disallow: /admin/
Disallow: /api/

# Block aggressive crawlers
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

# Block malicious bots
User-agent: SiteAuditBot
Disallow: /

User-agent: AhrefsSiteAudit
Disallow: /

User-agent: MegaIndex
Disallow: /

User-agent: dotbot
Disallow: /

# Additional sitemap references
Sitemap: ${SITE_URL}/sitemap-images.xml
Sitemap: ${SITE_URL}/sitemap-videos.xml
Sitemap: ${SITE_URL}/sitemap-news.xml

# Host directive (for Yandex)
Host: ${SITE_URL}

# Clean-param directive (for Yandex)
Clean-param: utm_source
Clean-param: utm_medium
Clean-param: utm_campaign
Clean-param: utm_term
Clean-param: utm_content
Clean-param: ref
Clean-param: source
Clean-param: fbclid
Clean-param: gclid`;
}

export async function GET() {
  const robotsTxt = generateRobotsTxt();
  
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    }
  });
}
