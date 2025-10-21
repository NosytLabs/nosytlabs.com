// MCP Server Tools Optimization Utilities
// Builds upon existing error-handler.ts and performance.ts infrastructure

import { trackError, type ErrorSeverity } from '../error-handling/error-handler';
import { PerformanceMonitor } from '../performance/monitoring';

export interface MCPToolConfig {
  name: string;
  enabled: boolean;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  healthCheckInterval: number;
  performanceThreshold: number;
}

export interface MCPOperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
  duration: number;
  retryCount: number;
  toolName: string;
}

export interface MCPHealthStatus {
  toolName: string;
  isHealthy: boolean;
  lastCheck: Date;
  responseTime: number;
  successRate: number;
  errorCount: number;
}

// Default configurations for MCP tools based on testing results
const DEFAULT_MCP_CONFIGS: Record<string, MCPToolConfig> = {
  'desktop-commander': {
    name: 'Desktop Commander',
    enabled: true,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    healthCheckInterval: 60000,
    performanceThreshold: 5000
  },
  'chrome-devtools': {
    name: 'Chrome DevTools',
    enabled: true,
    timeout: 45000,
    retryAttempts: 2,
    retryDelay: 2000,
    healthCheckInterval: 30000,
    performanceThreshold: 10000
  },
  'brave-search': {
    name: 'Brave Search',
    enabled: true,
    timeout: 15000,
    retryAttempts: 3,
    retryDelay: 5000, // Higher delay due to rate limiting
    healthCheckInterval: 120000,
    performanceThreshold: 3000
  },
  'sequential-thinking': {
    name: 'Sequential Thinking',
    enabled: true,
    timeout: 60000,
    retryAttempts: 1,
    retryDelay: 1000,
    healthCheckInterval: 300000,
    performanceThreshold: 15000
  }
};

export class MCPOptimizer {
  private configs: Map<string, MCPToolConfig> = new Map();
  private healthStatus: Map<string, MCPHealthStatus> = new Map();
  private performanceMonitor: PerformanceMonitor;
  private healthCheckIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.performanceMonitor = new PerformanceMonitor();
    this.initializeConfigs();
    this.startHealthChecks();
  }

  private initializeConfigs(): void {
    Object.entries(DEFAULT_MCP_CONFIGS).forEach(([key, config]) => {
      this.configs.set(key, { ...config });
      this.healthStatus.set(key, {
        toolName: config.name,
        isHealthy: true,
        lastCheck: new Date(),
        responseTime: 0,
        successRate: 100,
        errorCount: 0
      });
    });
  }

  /**
   * Execute MCP operation with retry logic and performance monitoring
   */
  async executeWithOptimization<T>(
    toolName: string,
    operation: () => Promise<T>,
    context?: string
  ): Promise<MCPOperationResult<T>> {
    const config = this.configs.get(toolName);
    if (!config || !config.enabled) {
      return {
        success: false,
        error: new Error(`MCP tool ${toolName} is not configured or disabled`),
        duration: 0,
        retryCount: 0,
        toolName
      };
    }

    const startTime = performance.now();
    let lastError: Error | undefined;
    let retryCount = 0;

    for (let attempt = 0; attempt <= config.retryAttempts; attempt++) {
      try {
        // Add timeout wrapper
        // eslint-disable-next-line no-await-in-loop
        const result = await this.withTimeout(operation(), config.timeout);
        const duration = performance.now() - startTime;

        // Update health status
        this.updateHealthStatus(toolName, true, duration);

        // Track performance
        this.performanceMonitor.trackCustomMetric(`mcp_${toolName}_duration`, duration);

        return {
          success: true,
          data: result,
          duration,
          retryCount,
          toolName
        };
      } catch (error) {
        lastError = error as Error;
        retryCount = attempt;

        // Update health status
        this.updateHealthStatus(toolName, false, performance.now() - startTime);

        // Track error
        trackError(lastError, context || `mcp_${toolName}`, this.getErrorSeverity(attempt, config.retryAttempts));

        // Wait before retry (exponential backoff)
        if (attempt < config.retryAttempts) {
          const delay = config.retryDelay * Math.pow(2, attempt);
          // eslint-disable-next-line no-await-in-loop
          await this.sleep(delay);
        }
      }
    }

    const duration = performance.now() - startTime;
    return {
      success: false,
      error: lastError,
      duration,
      retryCount,
      toolName
    };
  }

  /**
   * Get current health status for all MCP tools
   */
  getHealthStatus(): MCPHealthStatus[] {
    return Array.from(this.healthStatus.values());
  }

  /**
   * Get health status for specific tool
   */
  getToolHealth(toolName: string): MCPHealthStatus | undefined {
    return this.healthStatus.get(toolName);
  }

  /**
   * Update configuration for specific tool
   */
  updateConfig(toolName: string, updates: Partial<MCPToolConfig>): void {
    const current = this.configs.get(toolName);
    if (current) {
      this.configs.set(toolName, { ...current, ...updates });
    }
  }

  /**
   * Enable/disable specific tool
   */
  setToolEnabled(toolName: string, enabled: boolean): void {
    this.updateConfig(toolName, { enabled });
  }

  /**
   * Get performance recommendations based on current metrics
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.healthStatus.forEach((status, toolName) => {
      if (status.successRate < 90) {
        recommendations.push(`${status.toolName}: Success rate is ${status.successRate.toFixed(1)}%. Consider increasing retry attempts or timeout.`);
      }
      
      if (status.responseTime > (this.configs.get(toolName)?.performanceThreshold || 5000)) {
        recommendations.push(`${status.toolName}: Response time is ${status.responseTime}ms. Consider optimizing operations or increasing timeout.`);
      }
      
      if (status.errorCount > 10) {
        recommendations.push(`${status.toolName}: High error count (${status.errorCount}). Review error patterns and consider configuration adjustments.`);
      }
    });

    return recommendations;
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  private getErrorSeverity(attempt: number, maxAttempts: number): ErrorSeverity {
    if (attempt === maxAttempts) return 'high';
    if (attempt > maxAttempts / 2) return 'medium';
    return 'low';
  }

  private updateHealthStatus(toolName: string, success: boolean, responseTime: number): void {
    const status = this.healthStatus.get(toolName);
    if (!status) return;

    status.lastCheck = new Date();
    status.responseTime = responseTime;
    
    if (success) {
      status.successRate = Math.min(100, status.successRate + 0.1);
    } else {
      status.successRate = Math.max(0, status.successRate - 1);
      status.errorCount++;
    }
    
    status.isHealthy = status.successRate > 80 && status.errorCount < 20;
  }

  private startHealthChecks(): void {
    this.configs.forEach((config, toolName) => {
      const interval = setInterval(() => {
        this.performHealthCheck(toolName);
      }, config.healthCheckInterval);
      
      this.healthCheckIntervals.set(toolName, interval);
    });
  }

  private async performHealthCheck(toolName: string): Promise<void> {
    // Simple health check - just update last check time
    // In a real implementation, this could ping the MCP server
    const status = this.healthStatus.get(toolName);
    if (status) {
      status.lastCheck = new Date();
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.healthCheckIntervals.forEach(interval => clearInterval(interval));
    this.healthCheckIntervals.clear();
    this.performanceMonitor.cleanup();
  }
}

// Singleton instance
export const mcpOptimizer = new MCPOptimizer();

// Utility functions for common MCP operations
export const optimizedMCPCall = <T>(
  toolName: string,
  operation: () => Promise<T>,
  context?: string
): Promise<MCPOperationResult<T>> => {
  return mcpOptimizer.executeWithOptimization(toolName, operation, context);
};

export const getMCPHealth = (): MCPHealthStatus[] => {
  return mcpOptimizer.getHealthStatus();
};

export const getMCPRecommendations = (): string[] => {
  return mcpOptimizer.getPerformanceRecommendations();
};
