import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedElementProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'scaleOut' | 'rotateIn' | 'bounceIn' | 'morphIn' | 'glideIn';
  duration?: 'fast' | 'standard' | 'slow' | 'extra-slow';
  easing?: 'ease-out' | 'ease-in' | 'ease-in-out' | 'ease-back' | 'ease-bounce' | 'ease-elastic';
  delay?: number;
  trigger?: 'immediate' | 'scroll' | 'hover' | 'focus';
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation = 'fadeIn',
  duration = 'standard',
  easing = 'ease-out',
  delay = 0,
  trigger = 'scroll',
  threshold = 0.1,
  className,
  style,
  as: Component = 'div',
  onAnimationStart,
  onAnimationEnd,
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'immediate');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (trigger === 'immediate') {
      setIsVisible(true);
      return;
    }

    if (trigger === 'scroll') {
      // For scroll trigger, we'll set visible after a short delay
      // This is a simplified approach since we removed the ref
      const timer = setTimeout(() => {
        if (!hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          onAnimationStart?.();
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [trigger, threshold, hasAnimated, onAnimationStart]);

  const handleAnimationEnd = () => {
    onAnimationEnd?.();
  };

  const getAnimationClasses = () => {
    const baseClasses = [
      // Base animation state
      !isVisible && 'opacity-0',
      
      // Animation type classes
      animation === 'slideUp' && !isVisible && 'translate-y-4',
      animation === 'slideDown' && !isVisible && '-translate-y-4',
      animation === 'slideLeft' && !isVisible && 'translate-x-4',
      animation === 'slideRight' && !isVisible && '-translate-x-4',
      animation === 'scaleIn' && !isVisible && 'scale-95',
      animation === 'morphIn' && !isVisible && 'scale-95 rotate-1 blur-sm',
      animation === 'glideIn' && !isVisible && 'translate-y-4 scale-95',
      
      // Revealed state
      isVisible && 'opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0 blur-0',
      
      // Transition classes with CSS custom properties
      'transition-all',
      duration === 'fast' && '[transition-duration:var(--duration-fast)]',
      duration === 'standard' && '[transition-duration:var(--duration-standard)]',
      duration === 'slow' && '[transition-duration:var(--duration-slow)]',
      duration === 'extra-slow' && '[transition-duration:var(--duration-extra-slow)]',
      
      // Easing classes
      easing === 'ease-in' && '[transition-timing-function:var(--ease-in)]',
      easing === 'ease-out' && '[transition-timing-function:var(--ease-out)]',
      easing === 'ease-in-out' && '[transition-timing-function:var(--ease-in-out)]',
      easing === 'ease-back' && '[transition-timing-function:var(--ease-back)]',
      easing === 'ease-elastic' && '[transition-timing-function:var(--ease-elastic)]',
      easing === 'ease-bounce' && '[transition-timing-function:var(--ease-bounce)]',
      
      // Performance optimizations
      'will-change-transform',
      'transform-gpu',
    ].filter(Boolean);

    return cn(...baseClasses);
  };

  const animationStyle: React.CSSProperties = {
     '--animation-delay': `${delay}ms`,
   } as React.CSSProperties;

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
      onAnimationStart?.();
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      setIsVisible(true);
      onAnimationStart?.();
    }
  };

  return (
    <Component
      className={cn(getAnimationClasses(), className)}
      style={{ ...animationStyle, ...style }}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTransitionEnd={handleAnimationEnd}
    >
      {children}
    </Component>
  );
};

export default AnimatedElement;

// Staggered container component
interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  staggerDelay = 100,
  className,
  as: Component = 'div',
}) => {
  return (
    <Component className={cn('stagger-children', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            style: {
              ...child.props.style,
              transitionDelay: `${index * staggerDelay}ms`,
            },
          });
        }
        return child;
      })}
    </Component>
  );
};

// Parallax component
interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 'medium',
  className,
  as: Component = 'div',
}) => {
  const [transform, setTransform] = useState('translateY(0px)');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * getSpeedMultiplier(speed);
      setTransform(`translateY(${rate}px)`);
    };

    const getSpeedMultiplier = (speed: string) => {
      switch (speed) {
        case 'slow': return -0.2;
        case 'medium': return -0.5;
        case 'fast': return -0.8;
        case 'ultra': return -1.2;
        default: return -0.5;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <Component
      className={cn('will-change-transform', className)}
      style={{ transform }}
    >
      {children}
    </Component>
  );
};