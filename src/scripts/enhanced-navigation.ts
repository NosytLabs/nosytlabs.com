/**
 * Enhanced Navigation Manager
 *
 * Extracted from Navigation.astro to improve maintainability and performance.
 * Handles AI-powered features, predictive routing, and advanced interactions.
 */

import { logger } from '../utils/logger';



export interface NavigationConfig {
  aiPowered?: boolean;
  neuralPattern?: boolean;
  quantumGlass?: boolean;
  predictiveRouting?: boolean;
  voiceNavigation?: boolean; // Disabled - voice navigation removed
}

export class EnhancedNavigation {
  private config: NavigationConfig;
  private predictiveCache = new Map<string, number>();

  // Voice navigation removed - private voiceRecognition: any = null;
  // Voice navigation removed - private isListening = false;

  constructor(config: NavigationConfig = {}) {
    this.config = {
      aiPowered: false, // Disabled - AI assistant removed
      neuralPattern: true,
      quantumGlass: true,
      predictiveRouting: true,
      voiceNavigation: false, // Disabled - voice navigation removed
      ...config,
    };

    this.init();
  }

  private init(): void {
    this.initializeScrollBehavior();
    this.initializeResponsiveHandling();

    if (this.config.predictiveRouting) {
      this.initializePredictiveRouting();
    }

    // Voice navigation removed
    // if (this.config.voiceNavigation) {
    //   this.initializeVoiceNavigation();
    // }

    // AI assistant removed
    // if (this.config.aiPowered) {
    //   this.initializeAIAssistant();
    // }
  }

  // Voice navigation removed - functionality disabled
  // private initializeVoiceNavigation(): void {
  //   const voiceToggle = document.getElementById('voice-nav-toggle');
  //   if (!voiceToggle) return;
  //   // Implementation removed
  // }

  // Voice navigation removed
  // private toggleVoiceNavigation(): void {
  //   // Implementation removed
  // }

  // Voice navigation removed
  // private startVoiceNavigation(): void {
  //   // Implementation removed
  // }

  // Voice navigation removed
  // private stopVoiceNavigation(): void {
  //   // Implementation removed
  // }

  // Voice navigation removed
  // private processVoiceCommand(command: string): void {
  //   // Implementation removed
  // }

  // Voice navigation helper methods removed
  // private findBestMatch(command: string, options: string[]): string | null {
  //   // Implementation removed - was used for voice navigation
  // }
  //
  // private calculateSimilarity(str1: string, str2: string): number {
  //   // Implementation removed - was used for voice navigation
  // }
  //
  // private levenshteinDistance(str1: string, str2: string): number {
  //   // Implementation removed - was used for voice navigation
  // }

  // AI assistant functionality removed
  // private initializeAIAssistant(): void {
  //   const aiToggle = document.getElementById('ai-assistant-toggle');
  //   if (!aiToggle) return;
  //
  //   aiToggle.addEventListener('click', () => {
  //     if (this.aiAssistantActive) {
  //       this.hideAIAssistant();
  //     } else {
  //       this.showAIAssistant();
  //     }
  //   });
  // }

  // AI assistant functionality removed
  // private showAIAssistant(): void {
  //   Implementation removed
  // }

  // AI assistant functionality removed
  // private hideAIAssistant(): void {
  //   Implementation removed
  // }

  // AI assistant functionality removed
  // private handleAISuggestion(action: string): void {
  //   Implementation removed
  // }

  private initializePredictiveRouting(): void {
    // Preload likely next pages based on current page
    this.preloadPredictiveRoutes();

    // Track user behavior for better predictions
    this.trackUserBehavior();
  }

  private preloadPredictiveRoutes(): void {
    const currentPath = window.location.pathname;
    const predictions = this.getPredictedRoutes(currentPath);

    const canPrefetch = this.canPrefetch();

    predictions.forEach(route => {
      if (canPrefetch && !this.predictiveCache.has(route)) {
        this.preloadRoute(route);
      }
    });
  }

  private getPredictedRoutes(currentPath: string): string[] {
    const predictions: Record<string, string[]> = {
      '/': ['/services', '/projects', '/contact'],
      '/services': ['/contact', '/projects', '/services/ai-development'],
      '/projects': ['/contact', '/services', '/'],
      '/contact': ['/services', '/projects', '/'],
      '/blog': ['/services', '/projects', '/contact'],
    };

    return predictions[currentPath] || ['/services', '/projects', '/contact'];
  }

  private canPrefetch(): boolean {
    try {
      // Avoid prefetch on slow connections or when Data Saver is enabled
      const nav: any = navigator as any;
      const connection = nav && (nav.connection || nav.mozConnection || nav.webkitConnection);
      if (connection) {
        if (connection.saveData) return false;
        const effectiveType = String(connection.effectiveType || '');
        if (effectiveType.includes('2g') || effectiveType === 'slow-2g') return false;
      }
      return true;
    } catch {
      // If we cannot determine, allow prefetch
      return true;
    }
  }

  private preloadRoute(route: string): void {
    try {
      // Check if route is already preloaded
      if (this.predictiveCache.has(route)) {
        return;
      }

      // Use prefetch for low-priority fetching to avoid preload warnings
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = route;

      // Add error handling
      link.onerror = () => {
        logger.warn(`Failed to prefetch route: ${route}`, 'EnhancedNavigation');
        // Remove failed link
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };

      link.onload = () => {
        this.predictiveCache.set(route, Date.now());
      };

      document.head.appendChild(link);

      // Fallback: mark as cached even if load event doesn't fire
      setTimeout(() => {
        if (!this.predictiveCache.has(route)) {
          this.predictiveCache.set(route, Date.now());
        }
      }, 1000);
    } catch (error) {
      logger.warn(`Error prefetching route ${route}:`, error as Error, 'EnhancedNavigation');
    }
  }

  private trackUserBehavior(): void {
    let mouseIdleTimer: number;
    let lastMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousemove', e => {
      lastMousePosition = { x: e.clientX, y: e.clientY };

      clearTimeout(mouseIdleTimer);
      mouseIdleTimer = window.setTimeout(() => {
        this.analyzeMousePosition(lastMousePosition);
      }, 1000);
    });
  }

  private analyzeMousePosition(position: { x: number; y: number }): void {
    // Analyze if mouse is hovering near navigation elements
    const navElements = document.querySelectorAll('nav a, .nav-link');

    navElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(position.x - (rect.left + rect.width / 2), 2) +
          Math.pow(position.y - (rect.top + rect.height / 2), 2)
      );

      if (distance < 100) {
        const href = element.getAttribute('href');
        if (href && !this.predictiveCache.has(href) && this.canPrefetch()) {
          this.preloadRoute(href);
        }
      }
    });
  }

  private initializeScrollBehavior(): void {
    let ticking = false;

    const updateNavigation = () => {
      const currentScrollY = window.scrollY;
      const header = document.querySelector('header');

      if (!header) return;

      // Only add scroll-based effects, remove conflicting transform
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavigation);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  private initializeResponsiveHandling(): void {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      const mobileMenu = document.getElementById('mobile-menu');

      // Close mobile menu if screen becomes larger
      if (!isMobile && mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Reset mobile menu button state
        const mobileButton = document.getElementById('mobile-menu-button');
        if (mobileButton) {
          mobileButton.setAttribute('aria-expanded', 'false');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
  }
}
