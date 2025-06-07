/**
 * Configuration Index
 * Central export point for all configuration files
 */

// Import all constants
export * from './constants.js';
export { default as Constants } from './constants.js';

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
  FEATURES
} from './constants.js';
