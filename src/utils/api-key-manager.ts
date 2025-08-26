/**
 * API Key Management Utility
 *
 * This utility provides secure handling of API keys and external service credentials.
 * It includes validation, masking, and rotation capabilities.
 */

import { logger } from './logger';

// Environment variable validation
// Removed unused EnvVar interface - replaced by ApiKeyConfig

// API key configuration
interface ApiKeyConfig {
  name: string;
  envVar: string;
  required: boolean;
  validator?: (value: string) => boolean;
  rotationInterval?: number; // in days
  lastRotated?: Date;
}

// API key registry
const apiKeys: ApiKeyConfig[] = [
  {
    name: 'JWT Secret',
    envVar: 'JWT_SECRET',
    required: false,
    rotationInterval: 30, // Rotate every 30 days
  },
];

/**
 * Validate all required environment variables
 */
export function validateEnvironmentVariables(): {
  valid: boolean;
  missing: string[];
  invalid: string[];
} {
  const missing: string[] = [];
  const invalid: string[] = [];

  for (const apiKey of apiKeys) {
    const value = import.meta.env[apiKey.envVar];

    // Check if required key is missing
    if (apiKey.required && (!value || value === '')) {
      missing.push(apiKey.name);
      continue;
    }

    // Skip validation if value is not present
    if (!value || value === '') {
      continue;
    }

    // Validate key format if validator exists
    if (apiKey.validator && !apiKey.validator(value)) {
      invalid.push(apiKey.name);
    }
  }

  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}

/**
 * Get a masked version of an API key for logging
 */
export function getMaskedKey(key: string): string {
  if (!key || key.length < 8) {
    return '***';
  }

  // Show first 4 and last 4 characters, mask the rest
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

/**
 * Check if an API key needs rotation
 */
export function checkKeyRotation(): { needsRotation: boolean; keys: string[] } {
  const keysNeedingRotation: string[] = [];

  for (const apiKey of apiKeys) {
    // Skip if no rotation interval is defined
    if (!apiKey.rotationInterval || !apiKey.lastRotated) {
      continue;
    }

    // Calculate days since last rotation
    const daysSinceRotation = Math.floor(
      (Date.now() - apiKey.lastRotated.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Check if rotation is needed
    if (daysSinceRotation >= apiKey.rotationInterval) {
      keysNeedingRotation.push(apiKey.name);
    }
  }

  return {
    needsRotation: keysNeedingRotation.length > 0,
    keys: keysNeedingRotation,
  };
}

/**
 * Get an API key by name (for server-side use only)
 */
export function getApiKey(name: string): string | null {
  const apiKey = apiKeys.find(key => key.name === name);
  if (!apiKey) {
    return null;
  }

  return import.meta.env[apiKey.envVar] || null;
}

/**
 * Log API key usage (for auditing purposes)
 */
export function logApiKeyUsage(name: string, context: string): void {
  // In a production environment, this would log to a secure audit log
  // For now, we'll use our logger utility which handles dev/prod appropriately
  logger.log(
    `API Key Used: ${name}, Context: ${context}, Time: ${new Date().toISOString()}`,
    'security'
  );
}
