/**
 * @fileoverview Animation utilities for NosytLabs
 * Provides Motion and AnimatePresence components for smooth animations
 * Built with CSS animations and transitions for performance
 */

import { useState, useEffect, useRef, type ReactNode } from 'react';

// Animation configuration
export interface AnimationConfig {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
}

// Motion component props
export interface MotionProps {
  children: ReactNode;
  className?: string;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: AnimationConfig['transition'];
  onAnimationComplete?: () => void;
}

// AnimatePresence props
export interface AnimatePresenceProps {
  children: ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
}

/**
 * Motion component for smooth animations
 * Uses CSS transitions and transforms for optimal performance
 */
export function Motion({ 
  children, 
  className = '', 
  initial, 
  animate, 
  exit: _exit, 
  transition = { duration: 0.3 },
  onAnimationComplete 
}: MotionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (onAnimationComplete) {
      timer = setTimeout(onAnimationComplete, (transition?.duration || 0.3) * 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [onAnimationComplete, transition?.duration]);

  // Apply initial styles
  const getInitialStyles = () => {
    if (!initial) return {};
    
    const styles: Record<string, string> = {};
    
    if (initial.opacity !== undefined) {
      styles.opacity = String(initial.opacity);
    }
    
    if (initial.scale !== undefined) {
      styles.transform = `scale(${initial.scale})`;
    }
    
    if (initial.x !== undefined || initial.y !== undefined) {
      const x = initial.x || 0;
      const y = initial.y || 0;
      styles.transform = `${styles.transform || ''} translate(${x}px, ${y}px)`.trim();
    }
    
    if (initial.rotate !== undefined) {
      styles.transform = `${styles.transform || ''} rotate(${initial.rotate}deg)`.trim();
    }
    
    return styles;
  };

  // Apply animated styles
  const getAnimatedStyles = () => {
    if (!animate || !isMounted) return {};
    
    const styles: Record<string, string> = {
      transition: `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease-out'} ${transition?.delay || 0}s`
    };
    
    if (animate.opacity !== undefined) {
      styles.opacity = String(animate.opacity);
    }
    
    if (animate.scale !== undefined) {
      styles.transform = `scale(${animate.scale})`;
    }
    
    if (animate.x !== undefined || animate.y !== undefined) {
      const x = animate.x || 0;
      const y = animate.y || 0;
      styles.transform = `${styles.transform || ''} translate(${x}px, ${y}px)`.trim();
    }
    
    if (animate.rotate !== undefined) {
      styles.transform = `${styles.transform || ''} rotate(${animate.rotate}deg)`.trim();
    }
    
    return styles;
  };

  return (
    <div 
      ref={elementRef}
      className={`motion-element ${className}`}
      style={{
        ...getInitialStyles(),
        ...getAnimatedStyles()
      }}
    >
      {children}
    </div>
  );
}

/**
 * AnimatePresence component for managing enter/exit animations
 * Handles mounting/unmounting animations smoothly
 */
export function AnimatePresence({ 
  children, 
  mode: _mode = 'sync' 
}: AnimatePresenceProps) {
  const [mountedChildren, setMountedChildren] = useState<ReactNode[]>([]);

  useEffect(() => {
    setMountedChildren([children]);
    
    return () => {
      // Handle exit animations if needed
      setMountedChildren([]);
    };
  }, [children]);

  return <>{mountedChildren}</>;
}

// Export individual animation utilities
export const motion = {
  div: Motion,
  span: Motion,
  p: Motion,
  h1: Motion,
  h2: Motion,
  h3: Motion,
};

// Animation presets for common use cases
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  },
  
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
  }
};

// CSS class-based animations for better performance
export const cssAnimations = {
  fadeIn: 'entrance-fade',
  slideUp: 'entrance-slide-up',
  slideDown: 'entrance-slide-down',
  slideLeft: 'entrance-slide-left',
  slideRight: 'entrance-slide-right',
  zoomIn: 'entrance-zoom',
  flipIn: 'entrance-flip',
  fadeOut: 'exit-fade',
  slideUpExit: 'exit-slide-up',
  slideDownExit: 'exit-slide-down',
  zoomOut: 'exit-zoom'
};

// Utility functions
export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return reducedMotion;
};

export const staggerChildren = (delay: number = 0.1) => ({
  transition: {
    staggerChildren: delay
  }
});

// Default export
export default {
  Motion,
  AnimatePresence,
  motion,
  animationPresets,
  cssAnimations,
  useReducedMotion,
  staggerChildren
};