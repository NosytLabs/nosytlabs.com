/**
 * Centralized export of all constants modules
 */

// Export all types
export type {
  CompanyInfo,
  BrandMessaging,
  ContactInfo,
  ColorPalette,
  TimingConfig,
  NavItem,
  AnimationType,
  CacheStrategy,
} from './types';

// Export company and brand constants
export {
  COMPANY,
  BRAND_MESSAGING,
  CONTACT,
  COMPANY_INFO,
  SITE,
  TWITTER_USER_NAME,
} from './company';

// Export design system constants
export {
  COLORS,
  TIMING,
  DIMENSIONS,
  PATHS,
} from './design-system';

// Export application configuration
export {
  ANIMATIONS,
  CACHE_CONFIG,
  FEATURES,
  NAVIGATION,
  ENV,
} from './app-config';

// Re-export everything as a default object for backward compatibility
import {
  COMPANY,
  BRAND_MESSAGING,
  CONTACT,
  COMPANY_INFO,
  SITE,
} from './company';

import {
  COLORS,
  TIMING,
  DIMENSIONS,
  PATHS,
} from './design-system';

import {
  ANIMATIONS,
  CACHE_CONFIG,
  FEATURES,
  NAVIGATION,
  ENV,
} from './app-config';

export default {
  COMPANY,
  COMPANY_INFO,
  BRAND_MESSAGING,
  CONTACT,
  SITE,
  COLORS,
  TIMING,
  DIMENSIONS,
  PATHS,
  ANIMATIONS,
  CACHE_CONFIG,
  FEATURES,
  ENV,
  NAVIGATION,
} as const;