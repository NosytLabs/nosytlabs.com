// Use a relative import to ensure Vite resolves this correctly in dev and prod
import { initializeHeader } from '../header-enhancer.ts';

try {
  initializeHeader();
  // Mark initialization for debugging
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-header-enhancer-init', '1');
  }
} catch (error) {
  console.warn('Header enhancer initialization failed:', error);
}
