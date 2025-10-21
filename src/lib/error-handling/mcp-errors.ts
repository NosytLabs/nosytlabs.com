/**
 * MCP Error Handling Utilities
 *
 * Specialized error handling for MCP (Model Context Protocol) operations
 * including error classification, retry logic, and statistics tracking.
 *
 * @module error-handling/mcp-errors
 */

import {
  ErrorHandler,
  type ErrorContext,
  type ErrorSeverity,
} from "./error-handler";

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * MCP-specific error context
 */
export interface MCPErrorContext extends ErrorContext {
  mcpServer?: string;
  operation?: string;
  retryCount?: number;
  lastError?: string;
}

/**
 * MCP error types for classification
 */
export enum MCPErrorType {
  CONNECTION_REFUSED = "connection_refused",
  TIMEOUT = "timeout",
  PERMISSION_DENIED = "permission_denied",
  FILE_NOT_FOUND = "file_not_found",
  INVALID_PATH = "invalid_path",
  RATE_LIMITED = "rate_limited",
  SERVER_ERROR = "server_error",
  UNKNOWN = "unknown",
}

// ========================================
// MCP ERROR HANDLER CLASS
// ========================================

/**
 * MCP Error Handler
 * Specialized error handler for MCP operations with retry logic and statistics.
 *
 * @example
 * ```typescript
 * const handler = MCPErrorHandler.getInstance();
 *
 * // Classify error
 * const errorType = handler.classifyError(error);
 *
 * // Check if should retry
 * const shouldRetry = handler.shouldRetry(error, retryCount);
 *
 * // Get retry delay
 * const delay = handler.getRetryDelay(errorType, retryCount);
 * ```
 */
export class MCPErrorHandler {
  private static instance: MCPErrorHandler;
  private errorStats = new Map<
    string,
    { count: number; lastOccurrence: number }
  >();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): MCPErrorHandler {
    if (!MCPErrorHandler.instance) {
      MCPErrorHandler.instance = new MCPErrorHandler();
    }
    return MCPErrorHandler.instance;
  }

  /**
   * Track MCP-specific error
   *
   * @param context - Error context
   * @param message - Error message
   */
  public trackMCPError(context: string, message: string): void {
    const key = `${context}:${message}`;
    const existing = this.errorStats.get(key) || {
      count: 0,
      lastOccurrence: 0,
    };
    this.errorStats.set(key, {
      count: existing.count + 1,
      lastOccurrence: Date.now(),
    });
  }

  /**
   * Get MCP error statistics
   *
   * @returns Map of error statistics
   */
  public getErrorStats(): Map<
    string,
    { count: number; lastOccurrence: number }
  > {
    return new Map(this.errorStats);
  }

  /**
   * Classify MCP error by type
   *
   * @param error - Error to classify
   * @returns Error type
   */
  public classifyError(error: Error): MCPErrorType {
    const message = error.message.toLowerCase();

    if (
      message.includes("connection refused") ||
      message.includes("econnrefused")
    ) {
      return MCPErrorType.CONNECTION_REFUSED;
    }
    if (message.includes("timeout") || message.includes("etimedout")) {
      return MCPErrorType.TIMEOUT;
    }
    if (message.includes("permission denied") || message.includes("eacces")) {
      return MCPErrorType.PERMISSION_DENIED;
    }
    if (message.includes("no such file") || message.includes("enoent")) {
      return MCPErrorType.FILE_NOT_FOUND;
    }
    if (message.includes("invalid path") || message.includes("malformed")) {
      return MCPErrorType.INVALID_PATH;
    }
    if (
      message.includes("rate limit") ||
      message.includes("too many requests")
    ) {
      return MCPErrorType.RATE_LIMITED;
    }
    if (
      message.includes("server error") ||
      message.includes("internal error")
    ) {
      return MCPErrorType.SERVER_ERROR;
    }

    return MCPErrorType.UNKNOWN;
  }

  /**
   * Check if MCP operation should be retried
   *
   * @param error - Error that occurred
   * @param retryCount - Current retry count
   * @returns True if should retry
   */
  public shouldRetry(error: Error, retryCount: number): boolean {
    const errorType = this.classifyError(error);
    const maxRetries = this.getMaxRetries(errorType);

    return retryCount < maxRetries;
  }

  /**
   * Get maximum retries for error type
   *
   * @param errorType - Type of error
   * @returns Maximum retry count
   */
  public getMaxRetries(errorType: MCPErrorType): number {
    switch (errorType) {
      case MCPErrorType.CONNECTION_REFUSED:
      case MCPErrorType.TIMEOUT:
        return 3;
      case MCPErrorType.SERVER_ERROR:
        return 2;
      case MCPErrorType.RATE_LIMITED:
        return 5; // Higher retry count with exponential backoff
      case MCPErrorType.PERMISSION_DENIED:
      case MCPErrorType.FILE_NOT_FOUND:
      case MCPErrorType.INVALID_PATH:
        return 0; // Don't retry these errors
      default:
        return 1;
    }
  }

  /**
   * Get retry delay for error type
   *
   * @param errorType - Type of error
   * @param retryCount - Current retry count
   * @returns Delay in milliseconds
   */
  public getRetryDelay(errorType: MCPErrorType, retryCount: number): number {
    const baseDelay = 1000; // 1 second

    switch (errorType) {
      case MCPErrorType.RATE_LIMITED:
        // Exponential backoff for rate limiting: 2^retryCount * baseDelay
        return Math.min(Math.pow(2, retryCount) * baseDelay, 30000); // Max 30 seconds
      case MCPErrorType.CONNECTION_REFUSED:
      case MCPErrorType.TIMEOUT:
        // Linear backoff for connection issues
        return baseDelay * (retryCount + 1);
      case MCPErrorType.SERVER_ERROR:
        // Moderate backoff for server errors
        return baseDelay * Math.pow(1.5, retryCount);
      default:
        return baseDelay;
    }
  }

  /**
   * Clear error statistics
   */
  public clearStats(): void {
    this.errorStats.clear();
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Track MCP-specific error with enhanced context
 *
 * @param error - Error to track
 * @param mcpServer - MCP server name
 * @param operation - Operation name
 * @param retryCount - Current retry count
 * @param severity - Error severity
 *
 * @example
 * ```typescript
 * try {
 *   await mcpOperation();
 * } catch (error) {
 *   trackMCPError(error, 'desktop-commander', 'read_file', 0, 'medium');
 * }
 * ```
 */
export function trackMCPError(
  error: Error,
  mcpServer: string,
  operation: string,
  retryCount: number = 0,
  severity: ErrorSeverity = "medium",
): void {
  const handler = ErrorHandler.getInstance();
  const mcpHandler = MCPErrorHandler.getInstance();

  const context: MCPErrorContext = {
    mcpServer,
    operation,
    retryCount,
    lastError: error.message,
  };

  handler.trackError(error, `mcp_${mcpServer}_${operation}`, severity, context);
  mcpHandler.trackMCPError(`mcp_${mcpServer}_${operation}`, error.message);
}

/**
 * Safe async operation with MCP-specific retry logic
 *
 * @param operation - Async operation to execute
 * @param fallback - Fallback value if operation fails
 * @param mcpServer - MCP server name
 * @param operationName - Operation name
 * @param maxRetries - Maximum retry attempts
 * @returns Operation result or fallback
 *
 * @example
 * ```typescript
 * const result = await safeMCPAsync(
 *   () => mcpClient.readFile('/path/to/file'),
 *   null,
 *   'desktop-commander',
 *   'read_file',
 *   3
 * );
 * ```
 */
export async function safeMCPAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  mcpServer: string,
  operationName: string,
  maxRetries: number = 3,
): Promise<T> {
  const mcpHandler = MCPErrorHandler.getInstance();
  let lastError: Error | null = null;

  // This loop is for retrying the operation, so await is necessary.
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await operation();
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("MCP operation failed");

      // Track the error
      trackMCPError(lastError, mcpServer, operationName, retryCount);

      // Check if we should retry
      if (
        retryCount < maxRetries &&
        mcpHandler.shouldRetry(lastError, retryCount)
      ) {
        const errorType = mcpHandler.classifyError(lastError);
        const delay = mcpHandler.getRetryDelay(errorType, retryCount);

        console.warn(
          `MCP operation failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries + 1}):`,
          lastError.message,
        );
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If no more retries, break the loop
      break;
    }
  }

  // All retries exhausted, track final error and return fallback
  if (lastError) {
    trackMCPError(lastError, mcpServer, operationName, maxRetries, "high");
  }

  return fallback;
}

/**
 * Get MCP error statistics
 *
 * @returns Error statistics
 */
export function getMCPErrorStats(): Map<
  string,
  { count: number; lastOccurrence: number }
> {
  return MCPErrorHandler.getInstance().getErrorStats();
}

/**
 * Clear MCP error statistics
 */
export function clearMCPErrorStats(): void {
  MCPErrorHandler.getInstance().clearStats();
}
