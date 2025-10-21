// JS Optimizer Client
// Ported from JSOptimizer.astro inline script to ensure base-aware bundling

interface ModuleImporter<T = unknown> {
  (): Promise<T>;
}

// Type guard for requestIdleCallback support
function hasRequestIdleCallback(win: Window): win is Window & { requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number } {
  return 'requestIdleCallback' in win && typeof win.requestIdleCallback === 'function';
}

function initializeJSOptimization() {
  return {
    codeSplitter: {
      importModule: async <T = unknown>(importer: ModuleImporter<T>) => {
        try {
          return await importer();
        } catch (_error) {
          // Failed to load module via codeSplitter
          return null;
        }
      },
    },
    taskScheduler: {
      addTask: (task: () => void) => {
        if (hasRequestIdleCallback(window)) {
          window.requestIdleCallback(task);
        } else {
          setTimeout(task, 0);
        }
      },
    },
    bundleAnalyzer: {
      analyzeBundleSize: () => {
        // Bundle analysis would run here in development
      },
    },
  };
}

function optimizeExistingScripts() {
  // Optimizing existing scripts
}

function adaptiveJSLoading() {
  if ('connection' in navigator) {
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      // Slow connection detected, reducing JS loading
    }
  }
}

async function initJSOptimization() {
  const { codeSplitter, taskScheduler, bundleAnalyzer } = initializeJSOptimization();

  optimizeExistingScripts();
  adaptiveJSLoading();

  // Load non-critical scripts on first user interaction
  const loadNonCriticalScripts = () => {
    // Use direct dynamic imports so bundler includes these modules
    codeSplitter.importModule(() => import('../analytics.js')).catch((_error) => {
      // Failed to load non-critical script: analytics
    });
    codeSplitter.importModule(() => import('../social-sharing.js')).catch((_error) => {
      // Failed to load non-critical script: social-sharing
    });
    // Enhanced animations removed for performance optimization

    document.removeEventListener('click', loadNonCriticalScripts);
    document.removeEventListener('scroll', loadNonCriticalScripts);
    document.removeEventListener('keydown', loadNonCriticalScripts);
  };

  document.addEventListener('click', loadNonCriticalScripts, { once: true, passive: true });
  document.addEventListener('scroll', loadNonCriticalScripts, { once: true, passive: true });
  document.addEventListener('keydown', loadNonCriticalScripts, { once: true, passive: true });

  setTimeout(loadNonCriticalScripts, 10000);

  const heavyTasks: Array<() => void | Promise<void>> = [
    async () => {
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const animations = await codeSplitter.importModule(() => import('../animations/complex-animations.js'));
        if (animations && animations.initComplexAnimations) {
          animations.initComplexAnimations();
        }
      }
    },
    () => {
      if (localStorage.getItem('analytics-consent') === 'true') {
        codeSplitter.importModule(() => import('../analytics.js'));
      }
    },
    () => {
      if (!/^(localhost|127\.0\.0\.1)$/i.test(location.hostname) && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }
    },
  ];

  heavyTasks.forEach((task) => taskScheduler.addTask(task));

  if (window.location.hostname === 'localhost') {
    setTimeout(() => {
      bundleAnalyzer.analyzeBundleSize();
    }, 5000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJSOptimization);
} else {
  initJSOptimization();
}

document.addEventListener('astro:page-load', initJSOptimization);