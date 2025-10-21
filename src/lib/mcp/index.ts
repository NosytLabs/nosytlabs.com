/**
 * MCP Module
 * 
 * MCP (Model Context Protocol) utilities including optimization,
 * wrapper functions, and performance monitoring for MCP operations.
 * 
 * @module mcp
 */

// Export all MCP utilities
export * from './mcp-optimization';
export * from './mcp-wrapper';

// Re-export commonly used utilities for convenience
export {
  MCPOptimizer,
  mcpOptimizer,
  optimizedMCPCall,
  getMCPHealth,
  getMCPRecommendations,
  type MCPToolConfig,
  type MCPOperationResult,
  type MCPHealthStatus
} from './mcp-optimization';

export {
  MCPWrapper,
  mcpWrapper,
  optimizedDesktopCommander,
  optimizedChromeDevTools,
  optimizedBraveSearch,
  optimizedSequentialThinking,
  optimizedFileRead,
  optimizedPageScreenshot,
  type MCPWrapperOptions,
  type MCPOperationResult as MCPWrapperOperationResult
} from './mcp-wrapper';
