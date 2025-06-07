/**
 * @fileoverview Utilities Barrel Export
 * 
 * Central export point for all utility functions to enable clean imports
 * and better organization of helper functions.
 * 
 * @module utils
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

// ========== UTILITY EXPORTS ==========
// Named exports for utility functions (following standards)
export * from './dateUtils.js';
export * from './knowledgeGraph.js';
export * from './youtubeScraperUtil.js';
export * from './domUtils.js';
export * from './errorUtils.js';
export * from './browserUtils.js';
export * from './fileUtils.js';

// ========== GROUPED EXPORTS FOR CONVENIENCE ==========
// Date utilities
export {
  formatDate,
  parseDate,
  getRelativeTime,
  isValidDate
} from './dateUtils.js';

// Knowledge graph utilities
export {
  createNode,
  createEdge,
  findShortestPath,
  getConnectedNodes
} from './knowledgeGraph.js';

// YouTube utilities
export {
  scrapeYouTubeData,
  parseVideoMetadata,
  extractChannelInfo
} from './youtubeScraperUtil.js';

// DOM utilities
export {
  getById,
  query,
  queryAll,
  createElement,
  addEvent,
  isElementVisible,
  waitForElement
} from './domUtils.js';

// Error handling utilities
export {
  handleError,
  tryExecute,
  tryExecuteAsync,
  handleResourceError,
  setupGlobalErrorHandler,
  ErrorSeverity,
  ErrorCategory
} from './errorUtils.js';

// Browser detection utilities
export {
  prefersReducedMotion,
  prefersDarkMode,
  isMobile,
  isTouch,
  isTablet,
  getBrowserInfo,
  supportsFeature,
  getDevicePixelRatio,
  getViewportDimensions,
  isOnline
} from './browserUtils.js';

// File processing utilities
export {
  getFileExtension,
  getFileCategory,
  validateFile,
  formatFileSize,
  generateUniqueFilename,
  extractFilename,
  isImageFile,
  getOptimizedImageDimensions,
  createFileDownload,
  readFileAsText,
  readFileAsDataURL,
  FILE_EXTENSIONS,
  MAX_FILE_SIZES
} from './fileUtils.js';
