/**
 * Animations Module
 * 
 * Unified animation system including intersection observer animations,
 * parallax effects, staggered animations, and button enhancements.
 * 
 * @module animations
 */

import { UnifiedIntersectionAnimator, type IntersectionAnimationOptions } from './intersection';
import { StaggeredAnimator } from './stagger';
import { ButtonAnimator } from './buttons';

// Export all sub-modules
export * from './intersection';
export * from './stagger';
export * from './buttons';
export * from './parallax';

// ========================================
// UNIFIED ANIMATION MANAGER
// ========================================

/**
 * Animation configuration
 */
export interface AnimationConfig {
  enableIntersectionObserver?: boolean;
  enableButtonAnimations?: boolean;
  reduceMotion?: boolean;
}

/**
 * Unified Animation Manager
 * Coordinates all animation features and provides a single entry point.
 *
 * @example
 * ```typescript
 * const manager = new UnifiedAnimationManager();
 *
 * // Animations are automatically initialized
 * // Cleanup when done
 * manager.destroy();
 * ```
 */
export class UnifiedAnimationManager {
  private intersectionAnimator: UnifiedIntersectionAnimator;
  private isInitialized = false;
  private config: AnimationConfig;

  constructor(config: AnimationConfig = {}) {
    this.config = {
      enableIntersectionObserver: true,
      enableButtonAnimations: true,
      reduceMotion: false,
      ...config
    };

    this.intersectionAnimator = new UnifiedIntersectionAnimator();
    this.init();
  }

  /**
   * Initialize animation manager
   */
  private init(): void {
    if (this.isInitialized) return;

    if (typeof document === 'undefined') return;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup animations
   */
  private setup(): void {
    if (this.config.enableIntersectionObserver) {
      this.setupIntersectionAnimations();
    }

    if (this.config.enableButtonAnimations) {
      ButtonAnimator.enhanceButtons();
    }

    this.isInitialized = true;
  }

  /**
   * Setup intersection observer animations
   */
  private setupIntersectionAnimations(): void {
    // Consolidated observer for all animated elements
    this.intersectionAnimator.observeElements(
      '.service-card, .testimonial-card, .faq-item, .process-step, .case-study-card',
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      }
    );
  }

  /**
   * Get intersection animator
   */
  public getIntersectionAnimator(): UnifiedIntersectionAnimator {
    return this.intersectionAnimator;
  }

  /**
   * Observe elements for intersection animations
   *
   * @param selector - CSS selector
   * @param options - Animation options
   */
  public observeElements(selector: string, options?: IntersectionAnimationOptions): void {
    this.intersectionAnimator.observeElements(selector, options);
  }

  /**
   * Animate elements with stagger
   *
   * @param selector - CSS selector
   * @param animationClass - Animation class
   * @param staggerDelay - Delay between elements
   */
  public animateStaggered(selector: string, animationClass?: string, staggerDelay?: number): void {
    StaggeredAnimator.animateElements(selector, animationClass, staggerDelay);
  }

  /**
   * Get animation statistics
   *
   * @returns Animation statistics
   */
  public getStats(): {
    intersection: { observers: number; animatedElements: number };
  } {
    return {
      intersection: this.intersectionAnimator.getStats(),
    };
  }

  /**
   * Destroy animation manager
   */
  public destroy(): void {
    this.intersectionAnimator.destroy();
    this.isInitialized = false;
  }
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Create and initialize animation manager
 *
 * @param config - Animation configuration
 * @returns Initialized animation manager
 */
export function createAnimationManager(config?: AnimationConfig): UnifiedAnimationManager {
  return new UnifiedAnimationManager(config);
}

/**
 * Create default animation manager with all features enabled
 *
 * @returns Initialized animation manager
 */
export function createDefaultAnimationManager(): UnifiedAnimationManager {
  return new UnifiedAnimationManager({
    enableIntersectionObserver: true,
    enableButtonAnimations: true
  });
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new UnifiedAnimationManager());
  } else {
    new UnifiedAnimationManager();
  }
}
