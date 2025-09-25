/**
 * Advanced Container Query System
 * Sophisticated responsive design patterns for component-level adaptability
 */

class AdvancedContainerQueryManager {
  constructor() {
    this.containers = new Map();
    this.observers = new Map();
    this.supportedFeatures = this.detectFeatureSupport();
    this.init();
  }

  /**
   * Initialize the container query system
   */
  init() {
    if (this.supportedFeatures.containerQueries) {
      this.setupContainerQueries();
    } else {
      this.setupFallbackSystem();
    }
  }

  /**
   * Detect browser support for advanced features
   */
  detectFeatureSupport() {
    return {
      containerQueries: CSS.supports('container-type', 'inline-size'),
      containerQueryUnits: CSS.supports('width', '1cqw'),
      logicalProperties: CSS.supports('margin-inline', '1rem'),
      aspectRatioQueries: CSS.supports('aspect-ratio', '1'),
      dynamicViewportUnits: CSS.supports('width', '100dvw')
    };
  }

  /**
   * Setup advanced container queries
   */
  setupContainerQueries() {
    // Register all container elements
    this.registerContainers();

    // Setup container query observers
    this.setupContainerObservers();

    // Initialize container-based responsive features
    this.initializeResponsiveFeatures();
  }

  /**
   * Register container elements
   */
  registerContainers() {
    const containerSelectors = [
      '.container-queries-enabled',
      '.responsive-container',
      '.adaptive-layout',
      '.dynamic-component',
      '[data-container-type]'
    ];

    containerSelectors.forEach(selector => {
      const containers = document.querySelectorAll(selector);
      containers.forEach((container, index) => {
        const containerId = `container-${index}-${Date.now()}`;
        container.setAttribute('data-container-id', containerId);
        this.containers.set(containerId, {
          element: container,
          type: this.getContainerType(container),
          queries: this.getContainerQueries(container)
        });
      });
    });
  }

  /**
   * Get container type from element attributes
   */
  getContainerType(element) {
    const typeAttribute = element.getAttribute('data-container-type');
    return typeAttribute || 'inline-size';
  }

  /**
   * Get container queries from element
   */
  getContainerQueries(element) {
    const queries = [];
    const style = window.getComputedStyle(element);

    // Parse container-type and container-name
    if (style.containerType !== 'none') {
      queries.push({
        type: style.containerType,
        name: style.containerName || element.id || 'default'
      });
    }

    return queries;
  }

  /**
   * Setup container observers for dynamic content
   */
  setupContainerObservers() {
    this.containers.forEach((container, id) => {
      const observer = new ResizeObserver(entries => {
        this.handleContainerResize(container, entries);
      });

      observer.observe(container.element);
      this.observers.set(id, observer);
    });
  }

  /**
   * Handle container resize events
   */
  handleContainerResize(container, entries) {
    entries.forEach(entry => {
      const { width, height } = entry.contentRect;
      const aspectRatio = width / height;

      // Trigger container-specific responsive behavior
      this.applyContainerResponsiveStyles(container, {
        width,
        height,
        aspectRatio
      });

      // Dispatch custom event for component adaptation
      const event = new CustomEvent('containerresize', {
        detail: { container, dimensions: { width, height, aspectRatio } }
      });

      container.element.dispatchEvent(event);
    });
  }

  /**
   * Apply responsive styles based on container dimensions
   */
  applyContainerResponsiveStyles(container, dimensions) {
    const { width, height, aspectRatio } = dimensions;

    // Apply logical container queries
    if (width <= 480) {
      this.applyMobileContainerStyles(container);
    } else if (width <= 768) {
      this.applyTabletContainerStyles(container);
    } else {
      this.applyDesktopContainerStyles(container);
    }

    // Apply aspect ratio specific styles
    if (aspectRatio > 1) {
      this.applyLandscapeContainerStyles(container);
    } else {
      this.applyPortraitContainerStyles(container);
    }
  }

  /**
   * Apply mobile-specific container styles
   */
  applyMobileContainerStyles(container) {
    const element = container.element;

    // Mobile-first container adaptations
    element.style.setProperty('--container-size', 'mobile');
    element.style.setProperty('--layout-density', 'compact');
    element.style.setProperty('--interaction-mode', 'touch');

    // Mobile-optimized spacing
    element.style.setProperty('--spacing-scale', '0.8');
    element.style.setProperty('--font-scale', '0.9');
  }

  /**
   * Apply tablet-specific container styles
   */
  applyTabletContainerStyles(container) {
    const element = container.element;

    element.style.setProperty('--container-size', 'tablet');
    element.style.setProperty('--layout-density', 'normal');
    element.style.setProperty('--interaction-mode', 'hybrid');

    element.style.setProperty('--spacing-scale', '1');
    element.style.setProperty('--font-scale', '1');
  }

  /**
   * Apply desktop-specific container styles
   */
  applyDesktopContainerStyles(container) {
    const element = container.element;

    element.style.setProperty('--container-size', 'desktop');
    element.style.setProperty('--layout-density', 'spacious');
    element.style.setProperty('--interaction-mode', 'pointer');

    element.style.setProperty('--spacing-scale', '1.2');
    element.style.setProperty('--font-scale', '1.1');
  }

  /**
   * Apply landscape-specific container styles
   */
  applyLandscapeContainerStyles(container) {
    const element = container.element;

    element.style.setProperty('--orientation', 'landscape');
    element.style.setProperty('--layout-mode', 'horizontal');
    element.style.setProperty('--content-flow', 'row');
  }

  /**
   * Apply portrait-specific container styles
   */
  applyPortraitContainerStyles(container) {
    const element = container.element;

    element.style.setProperty('--orientation', 'portrait');
    element.style.setProperty('--layout-mode', 'vertical');
    element.style.setProperty('--content-flow', 'column');
  }

  /**
   * Setup fallback system for browsers without container query support
   */
  setupFallbackSystem() {
    console.warn('Container queries not supported, using fallback system');

    // Use ResizeObserver and CSS custom properties as fallback
    this.setupResizeObserverFallback();

    // Apply mobile-first responsive design
    this.applyMobileFirstFallback();
  }

  /**
   * Setup ResizeObserver fallback
   */
  setupResizeObserverFallback() {
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        const element = entry.target;

        // Apply fallback responsive styles
        this.applyFallbackResponsiveStyles(element, { width, height });
      });
    });

    // Observe all registered containers
    this.containers.forEach((container) => {
      resizeObserver.observe(container.element);
    });
  }

  /**
   * Apply fallback responsive styles
   */
  applyFallbackResponsiveStyles(element, dimensions) {
    const { width } = dimensions;

    // Apply mobile-first fallback styles
    if (width <= 480) {
      element.classList.add('mobile-fallback');
      element.classList.remove('tablet-fallback', 'desktop-fallback');
    } else if (width <= 768) {
      element.classList.add('tablet-fallback');
      element.classList.remove('mobile-fallback', 'desktop-fallback');
    } else {
      element.classList.add('desktop-fallback');
      element.classList.remove('mobile-fallback', 'tablet-fallback');
    }
  }

  /**
   * Apply mobile-first fallback styles
   */
  applyMobileFirstFallback() {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-first fallback styles */
      .mobile-fallback {
        --container-size: mobile;
        --layout-density: compact;
        --spacing-scale: 0.8;
        --font-scale: 0.9;
      }

      .tablet-fallback {
        --container-size: tablet;
        --layout-density: normal;
        --spacing-scale: 1;
        --font-scale: 1;
      }

      .desktop-fallback {
        --container-size: desktop;
        --layout-density: spacious;
        --spacing-scale: 1.2;
        --font-scale: 1.1;
      }

      /* Fallback container queries using custom properties */
      [data-container-size="mobile"] {
        /* Mobile styles */
      }

      [data-container-size="tablet"] {
        /* Tablet styles */
      }

      [data-container-size="desktop"] {
        /* Desktop styles */
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Initialize responsive features
   */
  initializeResponsiveFeatures() {
    // Setup dynamic viewport units
    this.setupDynamicViewportUnits();

    // Initialize container-based typography
    this.initializeContainerTypography();

    // Setup adaptive layouts
    this.setupAdaptiveLayouts();
  }

  /**
   * Setup dynamic viewport units
   */
  setupDynamicViewportUnits() {
    if (this.supportedFeatures.dynamicViewportUnits) {
      // Use dynamic viewport units (dvw, dvh, dvmin, dvmax)
      const style = document.createElement('style');
      style.textContent = `
        .dynamic-viewport {
          width: 100dvw;
          height: 100dvh;
          max-width: 100dvmax;
          max-height: 100dvmin;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Initialize container-based typography
   */
  initializeContainerTypography() {
    const typographyStyle = document.createElement('style');
    typographyStyle.textContent = `
      /* Container-based typography scaling */
      .container-typography {
        font-size: clamp(1rem, 2cqi + 0.5rem, 2rem);
        line-height: clamp(1.2, 0.2cqi + 1rem, 1.6);
        letter-spacing: clamp(-0.02em, -0.002cqi, 0.02em);
      }

      /* Responsive spacing based on container */
      .container-spacing {
        padding: clamp(1rem, 2cqi, 3rem);
        margin: clamp(0.5rem, 1cqi, 2rem);
        gap: clamp(0.5rem, 1cqi, 1.5rem);
      }

      /* Container-aware grid layouts */
      .container-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(250px, 100cqi), 1fr));
        gap: clamp(1rem, 2cqi, 2rem);
      }
    `;
    document.head.appendChild(typographyStyle);
  }

  /**
   * Setup adaptive layouts
   */
  setupAdaptiveLayouts() {
    const layoutStyle = document.createElement('style');
    layoutStyle.textContent = `
      /* Adaptive layout containers */
      .adaptive-container {
        container-type: inline-size;
        container-name: adaptive-layout;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      /* Mobile-first adaptive layout */
      @media (max-width: 768px) {
        .adaptive-container {
          flex-direction: column;
          gap: 1rem;
        }
      }

      /* Tablet adaptive layout */
      @media (min-width: 769px) and (max-width: 1024px) {
        .adaptive-container {
          flex-direction: row;
          gap: 2rem;
        }
      }

      /* Desktop adaptive layout */
      @media (min-width: 1025px) {
        .adaptive-container {
          flex-direction: row;
          gap: 3rem;
        }
      }

      /* Container-based adaptive behavior */
      @container adaptive-layout (max-width: 600px) {
        .adaptive-container {
          flex-direction: column;
          align-items: stretch;
        }
      }

      @container adaptive-layout (min-width: 601px) {
        .adaptive-container {
          flex-direction: row;
          align-items: flex-start;
        }
      }
    `;
    document.head.appendChild(layoutStyle);
  }

  /**
   * Create a new container with advanced features
   */
  createContainer(element, options = {}) {
    const container = {
      element,
      id: `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: options.type || 'inline-size',
      queries: options.queries || [],
      responsive: options.responsive || true
    };

    // Setup container element
    element.setAttribute('data-container-id', container.id);
    element.style.containerType = container.type;

    if (options.name) {
      element.style.containerName = options.name;
    }

    // Register container
    this.containers.set(container.id, container);

    // Setup observer
    const observer = new ResizeObserver(entries => {
      this.handleContainerResize(container, entries);
    });

    observer.observe(element);
    this.observers.set(container.id, observer);

    return container;
  }

  /**
   * Destroy container and cleanup
   */
  destroyContainer(containerId) {
    const container = this.containers.get(containerId);
    if (!container) return;

    // Remove observer
    const observer = this.observers.get(containerId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(containerId);
    }

    // Clean up element
    const element = container.element;
    element.removeAttribute('data-container-id');
    element.style.containerType = 'none';
    element.style.containerName = 'none';

    // Remove from registry
    this.containers.delete(containerId);
  }

  /**
   * Get container information
   */
  getContainerInfo(containerId) {
    return this.containers.get(containerId);
  }

  /**
   * List all containers
   */
  getAllContainers() {
    return Array.from(this.containers.entries()).map(([id, container]) => ({
      id,
      element: container.element,
      type: container.type,
      queries: container.queries
    }));
  }
}

// Export for use in other modules
export { AdvancedContainerQueryManager };

// Auto-initialize if not in a module environment
if (typeof window !== 'undefined' && !window.AdvancedContainerQueryManager) {
  window.AdvancedContainerQueryManager = AdvancedContainerQueryManager;
}