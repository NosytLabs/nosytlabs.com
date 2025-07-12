/**
 * Browser Compatibility Utilities
 * Handles feature detection and polyfill loading for cross-browser compatibility
 */

export interface BrowserSupport {
  backdropFilter: boolean;
  containerQueries: boolean;
  webkitLineClamp: boolean;
  maskComposite: boolean;
  supportsQueries: boolean;
}

/**
 * Detects browser support for various CSS features
 */
export function detectBrowserSupport(): BrowserSupport {
  const support: BrowserSupport = {
    backdropFilter: false,
    containerQueries: false,
    webkitLineClamp: false,
    maskComposite: false,
    supportsQueries: false
  };

  // Check if CSS.supports is available
  if (typeof CSS !== 'undefined' && CSS.supports) {
    support.supportsQueries = true;
    
    // Test backdrop-filter support
    support.backdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') || 
                             CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    
    // Test container queries support
    support.containerQueries = CSS.supports('container-type', 'inline-size');
    
    // Test webkit line clamp
    support.webkitLineClamp = CSS.supports('-webkit-line-clamp', '3');
    
    // Test mask composite
    support.maskComposite = CSS.supports('mask-composite', 'xor');
  } else {
    // Fallback detection for older browsers
    const testElement = document.createElement('div');
    const style = testElement.style;
    
    // Test backdrop filter
    style.backdropFilter = 'blur(10px)';
    (style as any)['webkitBackdropFilter'] = 'blur(10px)';
    support.backdropFilter = style.backdropFilter !== '' || (style as any)['webkitBackdropFilter'] !== '';
    
    // Test webkit line clamp
    (style as any)['webkitLineClamp'] = '3';
    support.webkitLineClamp = (style as any)['webkitLineClamp'] !== '';
    
    // Container queries are newer, assume false if CSS.supports not available
    support.containerQueries = false;
    support.maskComposite = false;
  }

  return support;
}

/**
 * Loads polyfills based on browser support
 */
export async function loadPolyfills(support: BrowserSupport): Promise<void> {
  const polyfills: Promise<void>[] = [];

  // Load backdrop filter polyfill if needed
  if (!support.backdropFilter) {
    polyfills.push(loadBackdropFilterPolyfill());
  }

  // Load container queries polyfill if needed
  if (!support.containerQueries) {
    polyfills.push(loadContainerQueriesPolyfill());
  }

  // Load line clamp polyfill if needed
  if (!support.webkitLineClamp) {
    polyfills.push(loadLineClampPolyfill());
  }

  // Load mask composite polyfill if needed
  if (!support.maskComposite) {
    polyfills.push(loadMaskCompositePolyfill());
  }

  await Promise.all(polyfills);
}

/**
 * Backdrop filter polyfill implementation
 */
async function loadBackdropFilterPolyfill(): Promise<void> {
  // Create CSS fallback for backdrop filter
  const style = document.createElement('style');
  style.innerHTML = `
    .backdrop-blur-fallback {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .backdrop-blur-fallback::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.05);
      z-index: -1;
    }
    
    .backdrop-blur-glass-fallback {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    
    .dark .backdrop-blur-fallback {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dark .backdrop-blur-glass-fallback {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Container queries polyfill implementation
 */
async function loadContainerQueriesPolyfill(): Promise<void> {
  // Use ResizeObserver for container query fallback
  if (typeof ResizeObserver !== 'undefined') {
    const containerElements = document.querySelectorAll('[data-container-query]');
    
    containerElements.forEach(element => {
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          updateContainerClasses(element as HTMLElement, width);
        }
      });
      observer.observe(element);
    });
  }
}

/**
 * Updates container classes based on width
 */
function updateContainerClasses(element: HTMLElement, width: number): void {
  // Remove existing container classes
  element.classList.remove('container-sm', 'container-md', 'container-lg', 'container-xl');
  
  // Add appropriate container class
  if (width < 300) {
    element.classList.add('container-sm');
  } else if (width < 500) {
    element.classList.add('container-md');
  } else if (width < 700) {
    element.classList.add('container-lg');
  } else {
    element.classList.add('container-xl');
  }
}

/**
 * Line clamp polyfill implementation
 */
async function loadLineClampPolyfill(): Promise<void> {
  const style = document.createElement('style');
  style.innerHTML = `
    .line-clamp-fallback {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .line-clamp-2-fallback {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      max-height: 3em; /* 2 lines * 1.5 line-height */
    }
    
    .line-clamp-3-fallback {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      max-height: 4.5em; /* 3 lines * 1.5 line-height */
    }
  `;
  document.head.appendChild(style);
  
  // JavaScript fallback for non-webkit browsers
  const lineClampElements = document.querySelectorAll('.line-clamp-2, .line-clamp-3');
  lineClampElements.forEach(element => {
    const lines = element.classList.contains('line-clamp-2') ? 2 : 3;
    applyLineClampFallback(element as HTMLElement, lines);
  });
}

/**
 * Applies line clamp fallback using JavaScript
 */
function applyLineClampFallback(element: HTMLElement, lines: number): void {
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
  const maxHeight = lineHeight * lines;
  
  if (element.scrollHeight > maxHeight) {
    element.style.maxHeight = `${maxHeight}px`;
    element.style.overflow = 'hidden';
    element.style.position = 'relative';
    
    // Add ellipsis indicator
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.style.position = 'absolute';
    ellipsis.style.bottom = '0';
    ellipsis.style.right = '0';
    ellipsis.style.background = 'inherit';
    ellipsis.style.paddingLeft = '0.5rem';
    element.appendChild(ellipsis);
  }
}

/**
 * Mask composite polyfill implementation
 */
async function loadMaskCompositePolyfill(): Promise<void> {
  const style = document.createElement('style');
  style.innerHTML = `
    .mask-composite-fallback {
      position: relative;
      overflow: hidden;
    }
    
    .mask-composite-fallback::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .mask-composite-fallback:hover::before {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initializes the compatibility system
 */
export async function initializeCompatibility(): Promise<BrowserSupport> {
  const support = detectBrowserSupport();
  
  // Add browser classes to document
  document.documentElement.classList.add(
    support.backdropFilter ? 'supports-backdrop-filter' : 'no-backdrop-filter',
    support.containerQueries ? 'supports-container-queries' : 'no-container-queries',
    support.webkitLineClamp ? 'supports-line-clamp' : 'no-line-clamp',
    support.maskComposite ? 'supports-mask-composite' : 'no-mask-composite'
  );
  
  // Load necessary polyfills
  await loadPolyfills(support);
  
  return support;
}