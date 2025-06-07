/**
 * Configuration Index (TypeScript)
 * Central export point for all configuration files with type safety
 */

// Import all constants with types
export * from './constants';
export { default as Constants } from './constants';

// Import branding configuration
export * from './branding.js';
export { BRAND_CONFIG } from './branding.js';

// Re-export commonly used constants for convenience
export {
  COMPANY,
  CONTACT,
  COLORS,
  TIMING,
  PATHS,
  FEATURES,
  type CompanyInfo,
  type ContactInfo,
  type ColorPalette,
  type TimingConfig,
  type AnimationType,
  type CacheStrategy
} from './constants';
