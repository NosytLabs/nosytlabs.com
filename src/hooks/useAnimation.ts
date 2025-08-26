/**
 * React Hook for Enhanced Animation System
 * Provides easy-to-use animation capabilities with accessibility support
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { enhancedAnimationSystem } from '../utils/animations/enhanced-animation-system.ts';
import type {
  AccessibleAnimationConfig,
  AnimationPreset
} from '../utils/animations/enhanced-animation-system';

export interface UseAnimationOptions {
  preset: string;
  config?: Partial<AccessibleAnimationConfig>;
  trigger?: 'mount' | 'hover' | 'focus' | 'click' | 'scroll' | 'manual';
  scrollOptions?: {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
  };
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface UseAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  animate: () => Promise<void>;
  cancel: () => void;
  isAnimating: boolean;
  canAnimate: boolean;
}

/**
 * Hook for animating a single element
 */
export function useAnimation(options: UseAnimationOptions): UseAnimationReturn {
  const {
    preset,
    config = {},
    trigger = 'manual',
    scrollOptions = {},
    onComplete,
    onError
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [canAnimate] = useState(() => !enhancedAnimationSystem.shouldReduceMotion());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const animate = useCallback(async () => {
    if (!ref.current || !canAnimate) return;

    setIsAnimating(true);
    try {
      await enhancedAnimationSystem.animateAccessible(ref.current, preset, config);
      onComplete?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsAnimating(false);
    }
  }, [preset, config, canAnimate, onComplete, onError]);

  const cancel = useCallback(() => {
    if (ref.current) {
      enhancedAnimationSystem.cancelAnimation(ref.current);
      setIsAnimating(false);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !canAnimate) return;

    switch (trigger) {
      case 'mount':
        animate();
        return; // No cleanup needed for mount trigger

      case 'hover':
        const handleMouseEnter = () => animate();
        element.addEventListener('mouseenter', handleMouseEnter);
        return () => element.removeEventListener('mouseenter', handleMouseEnter);

      case 'focus':
        const handleFocus = () => animate();
        element.addEventListener('focus', handleFocus);
        return () => element.removeEventListener('focus', handleFocus);

      case 'click':
        const handleClick = () => animate();
        element.addEventListener('click', handleClick);
        return () => element.removeEventListener('click', handleClick);

      case 'scroll':
        observerRef.current = enhancedAnimationSystem.createScrollAnimation(
          [element],
          preset,
          {
            ...scrollOptions,
            config
          }
        );
        return () => {
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        };

      default:
        // Manual trigger - no automatic animation
        return; // No cleanup needed for manual trigger
    }
  }, [trigger, animate, preset, config, scrollOptions, canAnimate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [cancel]);

  return {
    ref,
    animate,
    cancel,
    isAnimating,
    canAnimate
  };
}

/**
 * Hook for animating multiple elements in sequence
 */
export function useSequenceAnimation(options: {
  preset: string;
  config?: Partial<AccessibleAnimationConfig>;
  stagger?: number;
  trigger?: 'mount' | 'manual';
  onComplete?: () => void;
  onError?: (error: Error) => void;
}) {
  const {
    preset,
    config = {},
    stagger = 100,
    trigger = 'manual',
    onComplete,
    onError
  } = options;

  const refs = useRef<HTMLElement[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [canAnimate] = useState(() => !enhancedAnimationSystem.shouldReduceMotion());

  const addRef = useCallback((element: HTMLElement | null) => {
    if (element && !refs.current.includes(element)) {
      refs.current.push(element);
    }
  }, []);

  const animate = useCallback(async () => {
    if (refs.current.length === 0 || !canAnimate) return;

    setIsAnimating(true);
    try {
      await enhancedAnimationSystem.animateSequence(
        refs.current,
        preset,
        { stagger, config }
      );
      onComplete?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsAnimating(false);
    }
  }, [preset, config, stagger, canAnimate, onComplete, onError]);

  const cancel = useCallback(() => {
    refs.current.forEach(element => {
      enhancedAnimationSystem.cancelAnimation(element);
    });
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (trigger === 'mount' && canAnimate) {
      animate();
    }
  }, [trigger, animate, canAnimate]);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    addRef,
    animate,
    cancel,
    isAnimating,
    canAnimate
  };
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(options: {
  preset: string;
  config?: Partial<AccessibleAnimationConfig>;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}) {
  const {
    preset,
    config = {},
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    onComplete,
    onError
  } = options;

  const refs = useRef<HTMLElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [canAnimate] = useState(() => !enhancedAnimationSystem.shouldReduceMotion());

  const addRef = useCallback((element: HTMLElement | null) => {
    if (element && !refs.current.includes(element)) {
      refs.current.push(element);
      
      if (observerRef.current && canAnimate) {
        observerRef.current.observe(element);
      }
    }
  }, [canAnimate]);

  useEffect(() => {
    if (!canAnimate) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            try {
              await enhancedAnimationSystem.animateAccessible(
                entry.target,
                preset,
                config
              );
              onComplete?.();
            } catch (error) {
              onError?.(error as Error);
            }
            
            if (once) {
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe existing elements
    refs.current.forEach(element => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [preset, config, threshold, rootMargin, once, onComplete, onError, canAnimate]);

  return {
    addRef,
    canAnimate
  };
}

/**
 * Hook for getting animation presets
 */
export function useAnimationPresets() {
  const [presets, setPresets] = useState<AnimationPreset[]>([]);

  useEffect(() => {
    setPresets(enhancedAnimationSystem.getAllPresets());
  }, []);

  const getPreset = useCallback((name: string) => {
    return enhancedAnimationSystem.getPreset(name);
  }, []);

  const registerPreset = useCallback((preset: AnimationPreset) => {
    enhancedAnimationSystem.registerPreset(preset);
    setPresets(enhancedAnimationSystem.getAllPresets());
  }, []);

  return {
    presets,
    getPreset,
    registerPreset
  };
}

/**
 * Hook for animation performance monitoring
 */
export function useAnimationPerformance() {
  const [metrics, setMetrics] = useState(() => 
    enhancedAnimationSystem.getPerformanceMetrics()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(enhancedAnimationSystem.getPerformanceMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pauseAll = useCallback(() => {
    enhancedAnimationSystem.pauseAllAnimations();
  }, []);

  const resumeAll = useCallback(() => {
    enhancedAnimationSystem.resumeAllAnimations();
  }, []);

  const cancelAll = useCallback(() => {
    enhancedAnimationSystem.cancelAllAnimations();
  }, []);

  return {
    metrics,
    pauseAll,
    resumeAll,
    cancelAll
  };
}

/**
 * Hook for checking motion preferences
 */
export function useMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => 
    enhancedAnimationSystem.shouldReduceMotion()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    prefersReducedMotion,
    canAnimate: !prefersReducedMotion
  };
}