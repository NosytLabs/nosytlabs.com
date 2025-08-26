/**
 * Enhanced Animation System with Accessibility and Performance Optimizations
 * Provides smooth, accessible animations that respect user preferences
 */

import { type AnimationConfig, type PerformanceMetrics } from '../performance/animation-system';

export interface AccessibleAnimationConfig extends AnimationConfig {
  keyframes?: Keyframe[];
  respectReducedMotion?: boolean;
  fallbackAnimation?: AccessibleAnimationConfig;
  accessibilityDescription?: string;
  skipAnimation?: boolean;
}

export interface AnimationPreset {
  name: string;
  config: AccessibleAnimationConfig;
  description: string;
  category: 'entrance' | 'exit' | 'emphasis' | 'transition';
}

export class EnhancedAnimationSystem {
  private static enhancedInstance: EnhancedAnimationSystem;
  private animationPresets: Map<string, AnimationPreset> = new Map();
  private activeAnimations: Map<Element, Animation> = new Map();
  private performanceMetrics: PerformanceMetrics & {
    animationCount: number;
    memoryUsage: number;
  } = {
    animationsActive: 0,
    frameRate: 60,
    droppedFrames: 0,
    gpuAccelerated: 0,
    reducedMotion: false,
    animationCount: 0,
    memoryUsage: 0
  };

  static getInstance(): EnhancedAnimationSystem {
    if (!EnhancedAnimationSystem.enhancedInstance) {
      EnhancedAnimationSystem.enhancedInstance = new EnhancedAnimationSystem();
    }
    return EnhancedAnimationSystem.enhancedInstance;
  }

  constructor() {
    this.initializePresets();
    this.setupPerformanceMonitoring();
  }

  /**
   * Initialize animation presets with accessibility considerations
   */
  private initializePresets(): void {
    const presets: AnimationPreset[] = [
      {
        name: 'fadeIn',
        category: 'entrance',
        description: 'Gentle fade in animation',
        config: {
          keyframes: [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            duration: 150,
            easing: 'ease'
          },
          accessibilityDescription: 'Content appears with a gentle fade effect'
        }
      },
      {
        name: 'slideInLeft',
        category: 'entrance',
        description: 'Slide in from left with reduced motion fallback',
        config: {
          keyframes: [
            { transform: 'translateX(-100%)', opacity: 0 },
            { transform: 'translateX(0)', opacity: 1 }
          ],
          duration: 400,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            duration: 200,
            easing: 'ease'
          },
          accessibilityDescription: 'Content slides in from the left side'
        }
      },
      {
        name: 'scaleIn',
        category: 'entrance',
        description: 'Scale in animation with accessibility support',
        config: {
          keyframes: [
            { transform: 'scale(0.8)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
          ],
          duration: 250,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            duration: 100,
            easing: 'ease'
          },
          accessibilityDescription: 'Content appears with a gentle scaling effect'
        }
      },
      {
        name: 'slideUp',
        category: 'entrance',
        description: 'Slide up animation for cards and modals',
        config: {
          keyframes: [
            { transform: 'translateY(20px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
          ],
          duration: 350,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            duration: 150,
            easing: 'ease'
          },
          accessibilityDescription: 'Content slides up into view'
        }
      },
      {
        name: 'fadeOut',
        category: 'exit',
        description: 'Gentle fade out animation',
        config: {
          keyframes: [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-10px)' }
          ],
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [{ opacity: 1 }, { opacity: 0 }],
            duration: 100,
            easing: 'ease'
          },
          accessibilityDescription: 'Content fades out of view'
        }
      },
      {
        name: 'pulse',
        category: 'emphasis',
        description: 'Subtle pulse animation for attention',
        config: {
          keyframes: [
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
          ],
          duration: 600,
          easing: 'ease-in-out',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [
              { boxShadow: '0 0 0 0 rgb(var(--color-primary-500-rgb) / 0.4)' },
              { boxShadow: '0 0 0 4px rgb(var(--color-primary-500-rgb) / 0)' }
            ],
            duration: 300,
            easing: 'ease-out'
          },
          accessibilityDescription: 'Element pulses to draw attention'
        }
      },
      {
        name: 'shake',
        category: 'emphasis',
        description: 'Gentle shake for error states',
        config: {
          keyframes: [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(0)' }
          ],
          duration: 400,
          easing: 'ease-in-out',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [
              { borderColor: 'var(--color-error-500)' },
              { borderColor: 'var(--color-error-300)' },
              { borderColor: 'var(--color-error-500)' }
            ],
            duration: 200,
            easing: 'ease'
          },
          accessibilityDescription: 'Element shakes to indicate an error'
        }
      },
      {
        name: 'smoothTransition',
        category: 'transition',
        description: 'Smooth property transition',
        config: {
          keyframes: [],
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          respectReducedMotion: true,
          fallbackAnimation: {
            keyframes: [],
            duration: 50,
            easing: 'ease'
          },
          accessibilityDescription: 'Smooth transition between states'
        }
      }
    ];

    presets.forEach(preset => {
      this.animationPresets.set(preset.name, preset);
    });
  }

  /**
   * Setup performance monitoring for animations
   */
  private setupPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.frameRate = frameCount;
        this.performanceMetrics.animationCount = this.activeAnimations.size;
        
        // Estimate memory usage
        if ('memory' in performance) {
          this.performanceMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measurePerformance);
    };

    requestAnimationFrame(measurePerformance);
  }

  /**
   * Animate element with accessibility considerations
   */
  animateAccessible(
    element: Element,
    presetName: string,
    options: Partial<AccessibleAnimationConfig> = {}
  ): Promise<void> {
    const preset = this.animationPresets.get(presetName);
    if (!preset) {
      throw new Error(`Animation preset '${presetName}' not found`);
    }

    const config = { ...preset.config, ...options };
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (config.skipAnimation || (prefersReducedMotion && !config.respectReducedMotion)) {
      return Promise.resolve();
    }

    // Use fallback animation if reduced motion is preferred
    const finalConfig = prefersReducedMotion && config.fallbackAnimation 
      ? config.fallbackAnimation 
      : config;

    // Announce animation to screen readers if description is provided
    if (config.accessibilityDescription) {
      this.announceToScreenReader(config.accessibilityDescription);
    }

    return this.performAnimation(element, finalConfig);
  }

  /**
   * Perform the actual animation
   */
  private performAnimation(element: Element, config: AccessibleAnimationConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Cancel any existing animation on this element
        this.cancelAnimation(element);

        // Apply GPU acceleration hints
        const htmlElement = element as HTMLElement;
        htmlElement.style.willChange = 'transform, opacity';

        // Create and start animation
        const animation = element.animate(config.keyframes || [], {
          duration: config.duration,
          easing: config.easing,
          fill: 'forwards'
        });

        // Track active animation
        this.activeAnimations.set(element, animation);

        animation.addEventListener('finish', () => {
          htmlElement.style.willChange = 'auto';
          this.activeAnimations.delete(element);
          resolve();
        });

        animation.addEventListener('cancel', () => {
          htmlElement.style.willChange = 'auto';
          this.activeAnimations.delete(element);
          reject(new Error('Animation was cancelled'));
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Cancel animation on element
   */
  cancelAnimation(element: Element): void {
    const animation = this.activeAnimations.get(element);
    if (animation) {
      animation.cancel();
      this.activeAnimations.delete(element);
      (element as HTMLElement).style.willChange = 'auto';
    }
  }

  /**
   * Announce animation to screen readers
   */
  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Animate multiple elements in sequence
   */
  async animateSequence(
    elements: Element[],
    presetName: string,
    options: {
      stagger?: number;
      config?: Partial<AccessibleAnimationConfig>;
    } = {}
  ): Promise<void> {
    const { stagger = 100, config = {} } = options;
    
    const animations = elements.map((element, index) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          this.animateAccessible(element, presetName, config).then(resolve);
        }, index * stagger);
      });
    });

    await Promise.all(animations);
  }

  /**
   * Create intersection observer for scroll-triggered animations
   */
  createScrollAnimation(
    elements: NodeListOf<Element> | Element[],
    presetName: string,
    options: {
      threshold?: number;
      rootMargin?: string;
      once?: boolean;
      config?: Partial<AccessibleAnimationConfig>;
    } = {}
  ): IntersectionObserver {
    const {
      threshold = 0.1,
      rootMargin = '0px 0px -50px 0px',
      once = true,
      config = {}
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateAccessible(entry.target, presetName, config);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach(element => observer.observe(element));
    return observer;
  }

  /**
   * Get animation preset
   */
  getPreset(name: string): AnimationPreset | undefined {
    return this.animationPresets.get(name);
  }

  /**
   * Register custom animation preset
   */
  registerPreset(preset: AnimationPreset): void {
    this.animationPresets.set(preset.name, preset);
  }

  /**
   * Get all available presets
   */
  getAllPresets(): AnimationPreset[] {
    return Array.from(this.animationPresets.values());
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Check if animations should be reduced
   */
  shouldReduceMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Pause all active animations
   */
  pauseAllAnimations(): void {
    this.activeAnimations.forEach(animation => {
      animation.pause();
    });
  }

  /**
   * Resume all paused animations
   */
  resumeAllAnimations(): void {
    this.activeAnimations.forEach(animation => {
      animation.play();
    });
  }

  /**
   * Cancel all active animations
   */
  cancelAllAnimations(): void {
    this.activeAnimations.forEach((animation, element) => {
      animation.cancel();
      (element as HTMLElement).style.willChange = 'auto';
    });
    this.activeAnimations.clear();
  }
}

// Export singleton instance
export const enhancedAnimationSystem = EnhancedAnimationSystem.getInstance();

// Utility functions
export const animateElement = (
  element: Element,
  presetName: string,
  options?: Partial<AccessibleAnimationConfig>
): Promise<void> => {
  return enhancedAnimationSystem.animateAccessible(element, presetName, options);
};

export const animateSequence = (
  elements: Element[],
  presetName: string,
  options?: {
    stagger?: number;
    config?: Partial<AccessibleAnimationConfig>;
  }
): Promise<void> => {
  return enhancedAnimationSystem.animateSequence(elements, presetName, options);
};

export const createScrollAnimation = (
  elements: NodeListOf<Element> | Element[],
  presetName: string,
  options?: {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    config?: Partial<AccessibleAnimationConfig>;
  }
): IntersectionObserver => {
  return enhancedAnimationSystem.createScrollAnimation(elements, presetName, options);
};

export const shouldReduceMotion = (): boolean => {
  return enhancedAnimationSystem.shouldReduceMotion();
};