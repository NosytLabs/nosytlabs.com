/**
 * Development Configuration and Tools
 */

export const DEV_CONFIG = {
  // Feature flags for development
  features: {
    enablePerformanceMonitoring: true,
    enableErrorReporting: true,
    enableCodeAnalysis: true,
    enableMemoryMonitoring: true,
    showDebugInfo: process.env.NODE_ENV === 'development'
  },
  
  // Performance thresholds
  performance: {
    maxRenderTime: 16, // 60fps
    maxBundleSize: 250 * 1024, // 250KB
    maxImageSize: 500 * 1024, // 500KB
    maxMemoryUsage: 50 // 50MB
  },
  
  // Code quality thresholds
  quality: {
    maxComplexity: 10,
    maxLinesPerFunction: 50,
    minMaintainabilityIndex: 70,
    maxTechnicalDebt: 20
  }
};

export class DevTools {
  private static isEnabled = process.env.NODE_ENV === 'development';

  static log(message: string, data?: any): void {
    if (this.isEnabled) {
      console.log(`[DevTools] ${message}`, data || '');
    }
  }

  static warn(message: string, data?: any): void {
    if (this.isEnabled) {
      console.warn(`[DevTools] ${message}`, data || '');
    }
  }

  static error(message: string, error?: Error): void {
    if (this.isEnabled) {
      console.error(`[DevTools] ${message}`, error || '');
    }
  }

  static time(label: string): void {
    if (this.isEnabled && typeof console.time === 'function') {
      console.time(`[DevTools] ${label}`);
    }
  }

  static timeEnd(label: string): void {
    if (this.isEnabled && typeof console.timeEnd === 'function') {
      console.timeEnd(`[DevTools] ${label}`);
    }
  }

  static group(label: string): void {
    if (this.isEnabled && typeof console.group === 'function') {
      console.group(`[DevTools] ${label}`);
    }
  }

  static groupEnd(): void {
    if (this.isEnabled && typeof console.groupEnd === 'function') {
      console.groupEnd();
    }
  }

  static table(data: any): void {
    if (this.isEnabled && typeof console.table === 'function') {
      console.table(data);
    }
  }
}
