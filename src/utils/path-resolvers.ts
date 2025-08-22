/**
 * Utility functions for generating consistent slugs and paths throughout the application
 */

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  if (typeof text !== 'string') {
    throw new Error(
      `generateSlug expects a string but received ${typeof text}: ${JSON.stringify(text)}`
    );
  }

  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[\s\W-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * Generates a service page path from a service name or slug
 * @param nameOrSlug - Either the service name or pre-generated slug
 * @returns The full path to the service page
 */
export function generateServicePath(nameOrSlug: string): string {
  const slug = nameOrSlug.includes('/') ? nameOrSlug : generateSlug(nameOrSlug);
  return `/services/${slug}`;
}

/**
 * Generates a blog post path from a post title or slug
 * @param titleOrSlug - Either the blog post title or pre-generated slug
 * @returns The full path to the blog post
 */
export function generateBlogPath(titleOrSlug: string): string {
  const slug = titleOrSlug.includes('/') ? titleOrSlug : generateSlug(titleOrSlug);
  return `/blog/${slug}`;
}

/**
 * Generates a blog category path
 * @param category - The category name
 * @returns The path to the category page
 */
export function generateBlogCategoryPath(category: string): string {
  const slug = generateSlug(category);
  return `/blog/category/${slug}`;
}

/**
 * Generates a blog tag path
 * @param tag - The tag name
 * @returns The path to the tag page
 */
export function generateBlogTagPath(tag: string): string {
  if (typeof tag !== 'string') {
    // If it's an object with a name property, use that
    if (typeof tag === 'object' && tag !== null && 'name' in tag) {
      tag = (tag as any).name;
    } else {
      throw new Error(
        `generateBlogTagPath expects a string but received ${typeof tag}: ${JSON.stringify(tag)}`
      );
    }
  }

  const slug = generateSlug(tag);
  return `/blog/tag/${slug}`;
}

/**
 * Validates if a path follows the expected pattern
 * @param path - The path to validate
 * @param type - The type of path to validate against
 * @returns Whether the path is valid
 */
export function validatePath(
  path: string,
  type: 'service' | 'blog' | 'blog-category' | 'blog-tag'
): boolean {
  const patterns = {
    service: /^\/services\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
    blog: /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'blog-category': /^\/blog\/category\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'blog-tag': /^\/blog\/tag\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
  };

  return patterns[type].test(path);
}

/**
 * Extracts the slug from a full path
 * @param path - The full path (e.g., "/services/web-development")
 * @param type - The type of path
 * @returns The extracted slug
 */
export function extractSlugFromPath(
  path: string,
  type: 'service' | 'blog' | 'blog-category' | 'blog-tag'
): string | null {
  const patterns = {
    service: /^\/services\/(.+)$/,
    blog: /^\/blog\/(.+)$/,
    'blog-category': /^\/blog\/category\/(.+)$/,
    'blog-tag': /^\/blog\/tag\/(.+)$/,
  };

  const match = path.match(patterns[type]);
  return match?.[1] ?? null;
}

/**
 * Generates breadcrumb data for navigation
 * @param currentPath - The current page path
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(currentPath: string): Array<{ label: string; href: string }> {
  const breadcrumbs = [{ label: 'Home', href: '/' }];

  if (currentPath.startsWith('/services')) {
    breadcrumbs.push({ label: 'Services', href: '/services' });

    const serviceSlug = extractSlugFromPath(currentPath, 'service');
    if (serviceSlug) {
      // Note: In a real implementation, you'd want to import the service data
      // to get the actual service name, but for now we'll format the slug
      const serviceName = serviceSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ label: serviceName, href: currentPath });
    }
  } else if (currentPath.startsWith('/blog')) {
    breadcrumbs.push({ label: 'Blog', href: '/blog' });

    if (currentPath.startsWith('/blog/category/')) {
      const categorySlug = extractSlugFromPath(currentPath, 'blog-category');
      if (categorySlug) {
        const categoryName = categorySlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label: `Category: ${categoryName}`, href: currentPath });
      }
    } else if (currentPath.startsWith('/blog/tag/')) {
      const tagSlug = extractSlugFromPath(currentPath, 'blog-tag');
      if (tagSlug) {
        const tagName = tagSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label: `Tag: ${tagName}`, href: currentPath });
      }
    } else {
      const blogSlug = extractSlugFromPath(currentPath, 'blog');
      if (blogSlug) {
        // Note: In a real implementation, you'd want to import the blog data
        // to get the actual post title, but for now we'll format the slug
        const postTitle = blogSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label: postTitle, href: currentPath });
      }
    }
  }

  return breadcrumbs;
}

/**
 * Generates canonical URL for SEO
 * @param path - The path to generate canonical URL for
 * @param baseUrl - The base URL of the site (default: process.env.SITE_URL or '')
 * @returns The canonical URL
 */
export function generateCanonicalUrl(
  path: string,
  baseUrl: string = process.env.SITE_URL || ''
): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Remove trailing slash unless it's the root path
  const cleanPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');

  // Combine base URL and path
  const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}${cleanPath}` : cleanPath;

  return url;
}

/**
 * Checks if a path is currently active (useful for navigation highlighting)
 * @param currentPath - The current page path
 * @param linkPath - The path of the link to check
 * @param exact - Whether to match exactly or allow partial matches
 * @returns Whether the path is active
 */
export function isActivePath(
  currentPath: string,
  linkPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === linkPath;
  }

  // For non-exact matching, check if current path starts with link path
  // but avoid matching root path with everything
  if (linkPath === '/') {
    return currentPath === '/';
  }

  return currentPath.startsWith(linkPath);
}

/**
 * Generates pagination paths for blog listing pages
 * @param basePath - The base path (e.g., '/blog' or '/blog/category/technology')
 * @param currentPage - The current page number
 * @param totalPages - The total number of pages
 * @returns Object with pagination URLs
 */
export function generatePaginationPaths(basePath: string, currentPage: number, totalPages: number) {
  const basePathClean = basePath.replace(/\/$/, '');

  return {
    first: currentPage > 1 ? basePathClean : null,
    previous:
      currentPage > 1
        ? currentPage === 2
          ? basePathClean
          : `${basePathClean}/page/${currentPage - 1}`
        : null,
    next: currentPage < totalPages ? `${basePathClean}/page/${currentPage + 1}` : null,
    last: currentPage < totalPages ? `${basePathClean}/page/${totalPages}` : null,
    pages: Array.from({ length: totalPages }, (_, i) => ({
      number: i + 1,
      href: i === 0 ? basePathClean : `${basePathClean}/page/${i + 1}`,
      isCurrent: i + 1 === currentPage,
    })),
  };
}
