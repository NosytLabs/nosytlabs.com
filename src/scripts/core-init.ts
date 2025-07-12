/**
 * NosytLabs Core Initialization Module
 * Consolidated core functionality for better performance and maintainability
 */

class NosytLabsManager {
  config: {
    features: {
      darkMode: boolean;
      animations: boolean;
      lazyLoading: boolean;
      serviceWorker: boolean;
    }
  };

  constructor() {
    this.config = {
      features: {
        darkMode: true,
        animations: true,
        lazyLoading: true,
        serviceWorker: false
      }
    };
  }

  init(): void {
    console.log('NosytLabsManager initialized successfully!');
  }
}

const nosytLabs = new NosytLabsManager();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => nosytLabs.init());
} else {
  nosytLabs.init();
}

(window as any).NosytLabs = nosytLabs;

export { nosytLabs };
