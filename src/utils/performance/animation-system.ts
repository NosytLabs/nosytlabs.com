/**
 * Performance-Optimized Animation System
 * GPU-accelerated animations with reduced motion support
 */

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export interface IntersectionAnimationConfig extends AnimationConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface PerformanceMetrics {
  animationsActive: number;
  frameRate: number;
  droppedFrames: number;
  gpuAccelerated: number;
  reducedMotion: boolean;
}

/**
 * High-performance animation presets
 */
export const ANIMATION_PRESETS = {
  fadeIn: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 300, easing: 'var(--ease-out)', fill: 'forwards' }
  },
  slideUp: {
    keyframes: [
      { transform: 'translateY(var(--motion-translate-enter))', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    options: { duration: 500, easing: 'var(--ease-out)', fill: 'forwards' }
  },
  slideDown: {
    keyframes: [
      { transform: 'translateY(calc(var(--motion-translate-enter) * -1))', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    options: { duration: 500, easing: 'var(--ease-out)', fill: 'forwards' }
  },
  slideLeft: {
    keyframes: [
      { transform: 'translateX(var(--motion-translate-enter))', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ],
    options: { duration: 500, easing: 'var(--ease-out)', fill: 'forwards' }
  },
  slideRight: {
    keyframes: [
      { transform: 'translateX(calc(var(--motion-translate-enter) * -1))', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ],
    options: { duration: 500, easing: 'var(--ease-out)', fill: 'forwards' }
  },
  scaleIn: {
    keyframes: [
      { transform: 'scale(var(--motion-scale-enter))', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    options: { duration: 300, easing: 'var(--ease-back)', fill: 'forwards' }
  },
  scaleOut: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(var(--motion-scale-exit))', opacity: 0 }
    ],
    options: { duration: 200, easing: 'var(--ease-in)', fill: 'forwards' }
  },
  rotateIn: {
    keyframes: [
      { transform: 'rotate(var(--motion-rotate-moderate)) scale(var(--motion-scale-enter))', opacity: 0 },
      { transform: 'rotate(0deg) scale(1)', opacity: 1 }
    ],
    options: { duration: 400, easing: 'var(--ease-back)', fill: 'forwards' }
  },
  bounce: {
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(calc(var(--motion-translate-enter) * -0.6))' },
      { transform: 'translateY(0)' }
    ],
    options: { duration: 600, easing: 'var(--ease-bounce)' }
  },
  pulse: {
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' }
    ],
    options: { duration: 1000, easing: 'var(--ease-in-out)', iterations: Infinity }
  },
  // New modern presets
  morphIn: {
    keyframes: [
      { transform: 'scale(var(--motion-scale-enter)) rotate(var(--motion-rotate-subtle))', opacity: 0, filter: 'blur(4px)' },
      { transform: 'scale(1) rotate(0deg)', opacity: 1, filter: 'blur(0px)' }
    ],
    options: { duration: 600, easing: 'var(--ease-elastic)', fill: 'forwards' }
  },
  glideIn: {
    keyframes: [
      { transform: 'translateY(var(--motion-translate-enter)) scale(var(--motion-scale-enter))', opacity: 0 },
      { transform: 'translateY(0) scale(1)', opacity: 1 }
    ],
    options: { duration: 700, easing: 'var(--ease-out)', fill: 'forwards' }
  }
} as const;

/**
 * Performance-optimized animation manager
 */
export class AnimationSystem {
  private static instance: AnimationSystem;
  private activeAnimations: Map<Element, Animation[]> = new Map();
  private intersectionObserver: IntersectionObserver | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private metrics: PerformanceMetrics = {
    animationsActive: 0,
    frameRate: 60,
    droppedFrames: 0,
    gpuAccelerated: 0,
    reducedMotion: false,
  };
  private frameCount = 0;
  private lastFrameTime = 0;

  private constructor() {
    this.initializeSystem();
  }

  static getInstance(): AnimationSystem {
    if (!AnimationSystem.instance) {
      AnimationSystem.instance = new AnimationSystem();
    }
    return AnimationSystem.instance;
  }

  /**
   * Initialize the animation system
   */
  private initializeSystem(): void {
    // Check for reduced motion preference
    this.metrics.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.metrics.reducedMotion = e.matches;
      if (e.matches) {
        this.pauseAllAnimations();
      }
    });

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    // Initialize intersection observer for scroll animations
    this.initializeIntersectionObserver();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('animation')) {
            // Track animation performance
            this.updatePerformanceMetrics(entry);
          }
        });
      });
      
      try {
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        console.warn('Performance monitoring not available:', e);
      }
    }

    // Frame rate monitoring
    this.monitorFrameRate();
  }

  /**
   * Monitor frame rate
   */
  private monitorFrameRate(): void {
    const measureFrameRate = (timestamp: number) => {
      if (this.lastFrameTime) {
        const delta = timestamp - this.lastFrameTime;
        const fps = 1000 / delta;
        
        // Update running average
        this.metrics.frameRate = (this.metrics.frameRate * 0.9) + (fps * 0.1);
        
        // Track dropped frames (< 55fps)
        if (fps < 55) {
          this.metrics.droppedFrames++;
        }
      }
      
      this.lastFrameTime = timestamp;
      this.frameCount++;
      
      // Continue monitoring if animations are active
      if (this.metrics.animationsActive > 0) {
        requestAnimationFrame(measureFrameRate);
      }
    };

    requestAnimationFrame(measureFrameRate);
  }

  /**
   * Initialize intersection observer for scroll animations
   */
  private initializeIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const animationData = element.dataset.scrollAnimation;
          
          if (animationData && entry.isIntersecting) {
            try {
              const config = JSON.parse(animationData);
              this.animateElement(element, config.keyframes, config.options);
              
              // Remove observer if triggerOnce is true
              if (config.options?.triggerOnce) {
                this.intersectionObserver?.unobserve(element);
              }
            } catch (e) {
              console.warn('Invalid scroll animation data:', e);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );
  }

  /**
   * Create optimized animation
   */
  animate(
    element: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: AnimationConfig
  ): Animation {
    // Respect reduced motion preference
    if (this.metrics.reducedMotion) {
      return this.createReducedMotionAnimation(element, keyframes, options);
    }

    return this.animateElement(element, keyframes, options);
  }

  /**
   * Create the actual animation
   */
  private animateElement(
    element: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: AnimationConfig
  ): Animation {
    // Optimize keyframes for GPU acceleration
    const optimizedKeyframes = this.optimizeKeyframes(keyframes);
    
    // Create animation options
    const animationOptions: KeyframeAnimationOptions = {
      duration: options.duration,
      easing: options.easing,
      delay: options.delay || 0,
      fill: options.fillMode || 'none',
      iterations: typeof options.iterations === 'string' ? 1 : (options.iterations || 1),
      direction: options.direction || 'normal',
    };

    // Create animation
    const animation = element.animate(optimizedKeyframes, animationOptions);
    
    // Track animation
    this.trackAnimation(element, animation);
    
    // Add performance markers
    performance.mark(`animation-start-${Date.now()}`);
    
    animation.addEventListener('finish', () => {
      performance.mark(`animation-end-${Date.now()}`);
      this.untrackAnimation(element, animation);
    });

    animation.addEventListener('cancel', () => {
      this.untrackAnimation(element, animation);
    });

    return animation;
  }

  /**
   * Optimize keyframes for GPU acceleration
   */
  private optimizeKeyframes(
    keyframes: Keyframe[] | PropertyIndexedKeyframes
  ): Keyframe[] | PropertyIndexedKeyframes {
    if (Array.isArray(keyframes)) {
      return keyframes.map(frame => {
        const optimized = { ...frame };
        
        // Promote to GPU layer if using transform or opacity
        if ('transform' in optimized || 'opacity' in optimized) {
          optimized.willChange = 'transform, opacity';
        }
        
        return optimized;
      });
    }
    
    return keyframes;
  }

  /**
   * Create reduced motion alternative
   */
  private createReducedMotionAnimation(
    element: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: AnimationConfig
  ): Animation {
    // For reduced motion, create instant or very short animations
    const reducedOptions: KeyframeAnimationOptions = {
      duration: Math.min(options.duration, 200), // Max 200ms
      easing: 'ease',
      iterations: typeof options.iterations === 'string' ? 1 : (options.iterations || 1),
    };

    // Simplify keyframes - remove complex transforms
    const simplifiedKeyframes = this.simplifyKeyframes(keyframes);
    
    return element.animate(simplifiedKeyframes, reducedOptions);
  }

  /**
   * Simplify keyframes for reduced motion
   */
  private simplifyKeyframes(
    keyframes: Keyframe[] | PropertyIndexedKeyframes
  ): Keyframe[] | PropertyIndexedKeyframes {
    if (Array.isArray(keyframes)) {
      return keyframes.map(frame => {
        const simplified = { ...frame };
        
        // Remove complex transforms, keep only opacity and simple translations
        if ('transform' in simplified) {
          const transform = simplified.transform as string;
          if (transform.includes('rotate') || transform.includes('scale')) {
            delete simplified.transform;
          }
        }
        
        return simplified;
      });
    }
    
    return keyframes;
  }

  /**
   * Animate on scroll intersection
   */
  animateOnScroll(
    element: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: IntersectionAnimationConfig
  ): void {
    // Store animation data on element
    element.setAttribute('data-scroll-animation', JSON.stringify({
      keyframes,
      options,
    }));
    
    // Observe element
    this.intersectionObserver?.observe(element);
  }

  /**
   * Batch animate multiple elements
   */
  batchAnimate(
    elements: Element[],
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: AnimationConfig,
    stagger: number = 0
  ): Animation[] {
    const animations: Animation[] = [];
    
    elements.forEach((element, index) => {
      const staggeredOptions = {
        ...options,
        delay: (options.delay || 0) + (index * stagger),
      };
      
      animations.push(this.animate(element, keyframes, staggeredOptions));
    });
    
    return animations;
  }

  /**
   * Track active animation
   */
  private trackAnimation(element: Element, animation: Animation): void {
    if (!this.activeAnimations.has(element)) {
      this.activeAnimations.set(element, []);
    }
    
    this.activeAnimations.get(element)!.push(animation);
    this.metrics.animationsActive++;
    
    // Check if GPU accelerated
    if (this.isGPUAccelerated(animation)) {
      this.metrics.gpuAccelerated++;
    }
  }

  /**
   * Untrack animation
   */
  private untrackAnimation(element: Element, animation: Animation): void {
    const animations = this.activeAnimations.get(element);
    if (animations) {
      const index = animations.indexOf(animation);
      if (index > -1) {
        animations.splice(index, 1);
        this.metrics.animationsActive--;
        
        if (this.isGPUAccelerated(animation)) {
          this.metrics.gpuAccelerated--;
        }
        
        if (animations.length === 0) {
          this.activeAnimations.delete(element);
        }
      }
    }
  }

  /**
   * Check if animation is GPU accelerated
   */
  private isGPUAccelerated(animation: Animation): boolean {
    // Check if animation uses transform or opacity
    const effect = animation.effect as KeyframeEffect;
    if (!effect) return false;
    
    const keyframes = effect.getKeyframes();
    return keyframes.some(frame => 
      'transform' in frame || 'opacity' in frame
    );
  }

  /**
   * Pause all animations
   */
  pauseAllAnimations(): void {
    this.activeAnimations.forEach(animations => {
      animations.forEach(animation => animation.pause());
    });
  }

  /**
   * Resume all animations
   */
  resumeAllAnimations(): void {
    this.activeAnimations.forEach(animations => {
      animations.forEach(animation => animation.play());
    });
  }

  /**
   * Cancel all animations
   */
  cancelAllAnimations(): void {
    this.activeAnimations.forEach(animations => {
      animations.forEach(animation => animation.cancel());
    });
    this.activeAnimations.clear();
    this.metrics.animationsActive = 0;
    this.metrics.gpuAccelerated = 0;
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(_entry: PerformanceEntry): void {
    // Implementation for performance metric updates
    // This would be expanded based on specific performance needs
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.cancelAllAnimations();
    this.intersectionObserver?.disconnect();
    this.performanceObserver?.disconnect();
  }
}

// Export convenience functions
export const createAnimationSystem = () => AnimationSystem.getInstance();

export const animate = (
  element: Element,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: AnimationConfig
) => {
  return AnimationSystem.getInstance().animate(element, keyframes, options);
};

export const animateOnScroll = (
  element: Element,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: IntersectionAnimationConfig
) => {
  AnimationSystem.getInstance().animateOnScroll(element, keyframes, options);
};

export const batchAnimate = (
  elements: Element[],
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: AnimationConfig,
  stagger?: number
) => {
  return AnimationSystem.getInstance().batchAnimate(elements, keyframes, options, stagger);
};