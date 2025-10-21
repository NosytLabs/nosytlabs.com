/**
 * Error Handling Module
 *
 * Unified error handling system including general error tracking
 * and MCP-specific error handling with retry logic.
 *
 * @module error-handling
 */

// Export error handler
export * from "./error-handler";
export * from "./mcp-errors";

// Re-export commonly used utilities for convenience
export {
  ErrorHandler,
  trackError,
  safeJsonParse,
  safeAsync,
  withErrorTracking,
  type ErrorContext,
  type ErrorReport,
  type ErrorSeverity,
} from "./error-handler";

export {
  MCPErrorHandler,
  MCPErrorType,
  trackMCPError,
  safeMCPAsync,
  getMCPErrorStats,
  clearMCPErrorStats,
  type MCPErrorContext,
} from "./mcp-errors";
