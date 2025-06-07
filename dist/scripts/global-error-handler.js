/**
 * Global Error Handler Setup
 * 
 * Sets up standardized error handling for the entire application.
 * This should be loaded early in the application lifecycle.
 */

import { setupGlobalErrorHandler, handleResourceError } from '@/utils/errorUtils';

// Set up global error handling
const cleanup = setupGlobalErrorHandler({
  handlePromiseRejections: true,
  handleGlobalErrors: true
});

// Set up resource error handling
document.addEventListener('error', handleResourceError, true);

// Store cleanup function for potential use
window.nosytErrorHandlerCleanup = cleanup;

console.log('✅ Global error handling initialized');
