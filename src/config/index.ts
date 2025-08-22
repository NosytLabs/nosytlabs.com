/**
 * Configuration Index (TypeScript)
 * Central export point for all configuration files with type safety
 */

// Import all constants with types
export * from './constants';
export { default as Constants } from './constants';

// Branding configuration removed - consolidate into constants

// Re-export commonly used constants for convenience
export {
  COMPANY,
  CONTACT,
  COLORS,
  TIMING,
  PATHS,
  FEATURES,
  TWITTER_USER_NAME,
  type CompanyInfo,
  type ContactInfo,
  type ColorPalette,
  type TimingConfig,
  type AnimationType,
  type CacheStrategy,
} from './constants';
