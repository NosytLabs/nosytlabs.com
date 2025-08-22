import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for lazy loading with Intersection Observer
 *
 * @param options Configuration options for the intersection observer
 * @returns Object containing ref to attach to element and visibility state
 */
export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || (triggerOnce && hasTriggered)) {
      return;
    }

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately set as visible if no support
      setIsVisible(true);
      setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            if (triggerOnce) {
              setHasTriggered(true);
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    ref: elementRef,
    isVisible,
    hasTriggered,
  };
};

/**
 * Hook specifically for lazy loading images
 * Provides additional image-specific functionality
 */
export const useLazyImage = (src: string, options: UseLazyLoadingOptions = {}) => {
  const { ref, isVisible } = useLazyLoading(options);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isVisible, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(false);
    // Could implement retry logic here
  };

  return {
    ref,
    src: imageSrc,
    isVisible,
    isLoaded,
    onLoad: handleLoad,
    onError: handleError,
  };
};

export default useLazyLoading;
