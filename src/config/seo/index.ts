/**
 * SEO Configuration Module
 * 
 * This module provides centralized SEO management with:
 * - Default SEO configurations
 * - Page-specific SEO overrides
 * - Service SEO templates for dynamic generation
 * - Structured data configurations
 * - Utility functions for SEO operations
 */

// Types
export type {
  PageSEOConfig,
  ServiceSEOTemplate,
  StructuredDataSchema,
  StructuredDataConfig
} from './types';

// Default configurations
export {
  DEFAULT_SEO,
  COMPANY_INFO,
  INTERNAL_LINK_PATTERNS,
  isValidInternalLink
} from './defaults';

// Page-specific configurations
export { PAGE_SEO_CONFIG } from './pages';

// Service templates
export { SERVICE_SEO_TEMPLATES } from './service-templates';

// Structured data
export { STRUCTURED_DATA_CONFIG } from './structured-data';

// Utility functions
export {
  getPageSEO,
  generateServiceSEO,
  generateBreadcrumbData,
  generateFAQData,
  generateArticleData,
  sanitizeSEOData
} from './utils';

