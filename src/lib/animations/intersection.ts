/**
 * Intersection Observer Animations
 * 
 * Provides intersection observer-based animations for elements
 * entering the viewport with support for staggering and reduced motion.
 * 
 * @module animations/intersection
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * Animation options
 */
export interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  stagger?: number;
  reduceMotion?: boolean;
}

/**
 * Intersection animation options
 */
export interface IntersectionAnimationOptions extends AnimationOptions {
  rootMargin?: string;
  once?: boolean;
  className?: string;
}

// ========================================
// INTERSECTION ANIMATOR CLASS
// ========================================

/**
 * Unified Intersection Animator
 * Handles intersection observer-based animations with staggering support.
 * 
 * @example
 * ```typescript
 * const animator = new UnifiedIntersectionAnimator();
 * animator.observeElements('.card', {
 *   className: 'animate-fade-in',
 *   stagger: 0.1,
 *   once: true
 * });
 * ```
 */
export class UnifiedIntersectionAnimator {
  private observers: Map<string, IntersectionObserver> = new Map();
  private animatedElements: Set<Element> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize animator
   */
  private init(): void {
    if (this.isInitialized) return;
    this.setupReducedMotionSupport();
    this.isInitialized = true;
  }

  /**
   * Setup reduced motion support
   */
  private setupReducedMotionSupport(): void {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }

  /**
   * Observe elements for intersection animations with performance optimizations
   * 
   * @param selector - CSS selector for elements to observe
   * @param options - Animation options
   */
  public observeElements(selector: string, options: IntersectionAnimationOptions = {}): void {
    if (typeof document === 'undefined') return;

    const {
      threshold = 0.1,
      rootMargin = '50px 0px',
      once = true,
      className = 'animate-fade-in',
      stagger = 0.1
    } = options;

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observerKey = `${selector}-${className}`;

    if (this.observers.has(observerKey)) {
      this.observers.get(observerKey)?.disconnect();
    }

    // Batch DOM updates for better performance
    const entriesToAnimate: IntersectionObserverEntry[] = [];
    let animationFramePending = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            entriesToAnimate.push(entry);
            
            // Batch animations using requestAnimationFrame
            if (!animationFramePending) {
              animationFramePending = true;
              requestAnimationFrame(() => {
                entriesToAnimate.forEach((animEntry, animIndex) => {
                  const element = animEntry.target as HTMLElement;
                  
                  // Apply staggered delay
                  element.style.animationDelay = `${animIndex * stagger}s`;
                  
                  // Pre-apply will-change for better performance
                  element.style.willChange = 'opacity, transform';
                  
                  // Add consolidated animation class from main.css
                  element.classList.add(className, 'gpu-accelerated');
                  
                  this.animatedElements.add(animEntry.target);
                  
                  if (once) {
                    observer.unobserve(animEntry.target);
                  }
                });
                entriesToAnimate.length = 0;
                animationFramePending = false;
              });
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((element) => {
      // Pre-apply initial styles for better performance
      (element as HTMLElement).style.opacity = '0';
      (element as HTMLElement).style.transform = 'translate3d(0, 20px, 0)';
      observer.observe(element);
    });
    this.observers.set(observerKey, observer);
  }

  /**
   * Observe a single element
   * 
   * @param element - Element to observe
   * @param options - Animation options
   */
  public observeElement(element: Element, options: IntersectionAnimationOptions = {}): void {
    if (typeof window === 'undefined') return;

    const { threshold = 0.1, rootMargin = '50px 0px', once = true, className = 'animate-fade-in' } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            const htmlElement = entry.target as HTMLElement;
            htmlElement.classList.add(className, 'gpu-accelerated');
            this.animatedElements.add(entry.target);

            if (once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    this.observers.set(`element-${Date.now()}`, observer);
  }

  /**
   * Destroy all observers
   */
  public destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
    this.isInitialized = false;
  }

  /**
   * Get statistics
   * 
   * @returns Animation statistics
   */
  public getStats(): { observers: number; animatedElements: number } {
    return {
      observers: this.observers.size,
      animatedElements: this.animatedElements.size
    };
  }
}
