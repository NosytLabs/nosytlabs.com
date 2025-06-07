/**
 * Code Quality Utilities
 * Tools for maintaining high code quality standards
 */

export interface CodeMetrics {
  linesOfCode: number;
  complexity: number;
  maintainabilityIndex: number;
  technicalDebt: number;
}

export class CodeAnalyzer {
  static analyzeFunction(functionCode: string): CodeMetrics {
    const lines = functionCode.split('\n').filter(line => line.trim().length > 0);
    const complexity = this.calculateComplexity(functionCode);
    const maintainabilityIndex = this.calculateMaintainabilityIndex(functionCode);
    
    return {
      linesOfCode: lines.length,
      complexity,
      maintainabilityIndex,
      technicalDebt: Math.max(0, complexity - 10) * 2
    };
  }

  private static calculateComplexity(code: string): number {
    // Simplified cyclomatic complexity calculation
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s+if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /switch\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /&&/g,
      /\|\|/g,
      /\?/g
    ];
    
    let complexity = 1; // Base complexity
    
    complexityPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  private static calculateMaintainabilityIndex(code: string): number {
    // Simplified maintainability index (0-100, higher is better)
    const linesOfCode = code.split('\n').length;
    const complexity = this.calculateComplexity(code);
    
    // Basic formula based on lines of code and complexity
    const baseScore = 100;
    const complexityPenalty = complexity * 2;
    const lengthPenalty = Math.max(0, linesOfCode - 50) * 0.5;
    
    return Math.max(0, Math.min(100, baseScore - complexityPenalty - lengthPenalty));
  }
}

export class PerformanceProfiler {
  private static measurements = new Map<string, number[]>();

  static startMeasurement(label: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  }

  static endMeasurement(label: string): number {
    if (typeof performance === 'undefined') {
      return 0;
    }

    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label, 'measure')[0];
    const duration = measure ? measure.duration : 0;
    
    // Store measurement
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    this.measurements.get(label)!.push(duration);
    
    // Clean up marks and measures
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  }

  static getAverageTime(label: string): number {
    const times = this.measurements.get(label);
    if (!times || times.length === 0) {
      return 0;
    }
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  static getAllMeasurements(): Record<string, { average: number; count: number; total: number }> {
    const result: Record<string, { average: number; count: number; total: number }> = {};
    
    this.measurements.forEach((times, label) => {
      const total = times.reduce((sum, time) => sum + time, 0);
      result[label] = {
        average: total / times.length,
        count: times.length,
        total
      };
    });
    
    return result;
  }
}

export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  label?: string
): T {
  const measurementLabel = label || fn.name || 'anonymous';
  
  return ((...args: Parameters<T>) => {
    PerformanceProfiler.startMeasurement(measurementLabel);
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          PerformanceProfiler.endMeasurement(measurementLabel);
        });
      }
      
      PerformanceProfiler.endMeasurement(measurementLabel);
      return result;
    } catch (error) {
      PerformanceProfiler.endMeasurement(measurementLabel);
      throw error;
    }
  }) as T;
}

export class MemoryMonitor {
  static getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    };
  }

  static logMemoryUsage(label?: string): void {
    const usage = this.getMemoryUsage();
    if (usage) {
      console.log(`Memory Usage${label ? ` (${label})` : ''}:`, {
        used: `${(usage.used / 1024 / 1024).toFixed(2)} MB`,
        total: `${(usage.total / 1024 / 1024).toFixed(2)} MB`,
        percentage: `${usage.percentage.toFixed(2)}%`
      });
    }
  }
}
