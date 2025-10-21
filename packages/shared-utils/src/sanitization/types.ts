export interface SanitizationOptions {
  allowHtml?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripScriptTags?: boolean;
  stripEventHandlers?: boolean;
  removeJavascriptProtocol?: boolean;
  maxLength?: number;
  trimWhitespace?: boolean;
  blockContent?: boolean;
  blockUnsafe?: boolean;
  replacementText?: string;
  safetyThreshold?: number;
  sensitiveFields?: string[];
  threshold?: number;
  customPatterns?: RegExp[];
  customKeywords?: string[];
  // Missing properties used in unified-sanitizer.ts
  removeHtml?: boolean;
  escapeHtml?: boolean;
  removeScripts?: boolean;
  blockUnsafeContent?: boolean;
}

export interface SanitizationResult {
  sanitized: string;
  original: string;
  wasModified: boolean;
  blocked?: boolean;
  reason?: string;
}

export interface ContentSafetyResult {
  isSafe: boolean;
  reason?: string;
  score?: number;
  issues?: string[];
}
