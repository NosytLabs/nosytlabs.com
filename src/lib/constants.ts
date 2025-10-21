// Site constants to avoid duplication across the codebase
const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://nosytlabs.github.io';
const baseUrl = import.meta.env.PUBLIC_BASE_URL || '/';

export const SITE_CONFIG = {
  BASE_URL: siteUrl,
  BASE_URL_LOWERCASE: siteUrl.toLowerCase(),
  LOGO_PATH: `${baseUrl}images/logo.svg`,
  LOGO_ICON_PATH: `${baseUrl}images/logo-icon.webp`,
  OG_IMAGE_PATH: `${baseUrl}images/og-image.svg`,
  EMAILS: {
    CONTACT: 'contact@nosytlabs.com',
    HELLO: 'hello@nosytlabs.com',
    LEGAL: 'legal@nosytlabs.com',
    HI: 'hi@nosytlabs.com'
  }
} as const;

// Utility function to create proper internal links with base path
export const createInternalLink = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use Astro's BASE_URL environment variable
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || '/';
  
  // Handle root path specially
  if (path === '/') {
    // If baseUrl is just '/', return '/'
    if (baseUrl === '/') return '/';
    // Otherwise, return the baseUrl without trailing slash
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
  
  // Ensure base URL ends with slash and combine with path
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
};

// Utility function to create proper image paths with base path
export const createImagePath = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use Astro/Vite BASE_URL so SSR and client are consistent
  const baseUrl = import.meta.env.PUBLIC_BASE_URL || '/';
  // Ensure base URL ends with slash and combine with path
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
};

// Company information
export const COMPANY_INFO = {
  NAME: 'NOSYT Labs',
  TEAM_NAME: 'NOSYT Labs Team',
  TAGLINE: 'Web & AI Solutions',
  LOCATION: 'Global Remote Team',
  DESCRIPTION: 'We specialize in proven web development and AI integration solutions, helping businesses achieve measurable results with technology backed by 47 successful deployments.'
} as const;
