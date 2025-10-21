import { startPerformanceMonitoring } from './monitoring.ts';

try {
  startPerformanceMonitoring?.();
} catch (error) {
  console.warn('Performance monitoring not available:', error);
}