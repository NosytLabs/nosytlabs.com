import { ThemeProvider } from '../lib/theme.jsx';

interface ThemeWrapperProps {
  children: React.ReactNode;
  enableMobileOptimizations?: boolean;
  enableTouchGestures?: boolean;
  enablePerformanceOptimizations?: boolean;
}

export default function ThemeWrapper({
  children,
  enableMobileOptimizations = true,
  enableTouchGestures = true,
  enablePerformanceOptimizations = true
}: ThemeWrapperProps) {
  return (
    <>
      {/* Mobile-specific optimizations */}
      {enableMobileOptimizations && (
        <style dangerouslySetInnerHTML={{ __html: mobileOptimizationsStyles }} />
      )}

      {/* Touch gesture support */}
      {enableTouchGestures && (
        <style dangerouslySetInnerHTML={{ __html: touchGestureStyles }} />
      )}

      {/* Performance optimizations */}
      {enablePerformanceOptimizations && (
        <style dangerouslySetInnerHTML={{ __html: performanceOptimizationStyles }} />
      )}

      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="theme-wrapper" data-mobile-optimized={enableMobileOptimizations}>
          {children}
        </div>
      </ThemeProvider>
    </>
  );
}

// Mobile optimization styles
const mobileOptimizationsStyles = `
  /* Mobile-first responsive design */
  .theme-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Container queries for theme wrapper */
  @container (max-width: var(--breakpoint-md)) {
    .theme-wrapper {
      padding: 0;
    }
  }

  /* Mobile viewport optimizations */
  @media (max-width: var(--breakpoint-md)) {
    .theme-wrapper {
      /* Optimize for mobile performance */
      contain: layout style paint;
      will-change: auto;

      /* Mobile-specific spacing */
      padding: 0;
      margin: 0;
    }

    /* Touch-friendly scrolling */
    .theme-wrapper {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
  }

  /* Extra small screens */
  @media (max-width: var(--breakpoint-xs)) {
    .theme-wrapper {
      /* Further optimize for small screens */
      padding: 0;
      margin: 0;
    }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .theme-wrapper {
      /* Disable hover effects on touch devices */
      pointer-events: auto;
    }

    /* Optimize animations for touch */
    .theme-wrapper * {
      transition-duration: 0.15s !important;
    }
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .theme-wrapper * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .theme-wrapper {
      border: 1px solid currentColor;
    }
  }
`;

// Touch gesture support styles
const touchGestureStyles = `
  /* Touch gesture support */
  .theme-wrapper {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* Touch feedback for interactive elements */
  .theme-wrapper button,
  .theme-wrapper a,
  .theme-wrapper input,
  .theme-wrapper select,
  .theme-wrapper textarea {
    -webkit-tap-highlight-color: var(--color-black-alpha-10);
    touch-action: manipulation;
  }

  /* Swipe gesture support */
  .theme-wrapper {
    /* Enable horizontal swiping */
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* Touch-friendly focus states */
  .theme-wrapper *:focus-visible {
    outline: 2px solid var(--color-brand-accent, var(--color-blue-500));
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

// Performance optimization styles
const performanceOptimizationStyles = `
  /* Performance optimizations */
  .theme-wrapper {
    /* GPU acceleration for smooth animations */
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  /* Optimize font rendering */
  .theme-wrapper {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Optimize layer composition */
  .theme-wrapper {
    will-change: auto;
    contain: layout style paint;
  }

  /* Mobile-specific performance */
  @media (max-width: var(--breakpoint-md)) {
    .theme-wrapper {
      /* Reduce paint and composite layers on mobile */
      contain: layout style;
      will-change: auto;

      /* Optimize scrolling performance */
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
  }
`;