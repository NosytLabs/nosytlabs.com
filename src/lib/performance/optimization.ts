/**
 * Performance Optimization Utilities
 *
 * JavaScript and resource optimization utilities including code splitting,
 * lazy loading, task scheduling, and bundle analysis.
 *
 * @module performance/optimization
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * JavaScript loading options
 */
export interface JSLoadOptions {
  priority?: "high" | "low";
  defer?: boolean;
  async?: boolean;
  preload?: boolean;
  module?: boolean;
}

// ========================================
// SCRIPT LOADING UTILITIES
// ========================================

/**
 * Dynamically load JavaScript with performance optimizations
 *
 * @param src - Script source URL
 * @param options - Loading options
 * @returns Promise that resolves when script is loaded
 *
 * @example
 * ```typescript
 * await loadJS('/scripts/analytics.js', { async: true, defer: true });
 * ```
 */
export function loadJS(
  src: string,
  options: JSLoadOptions = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;

    // Set loading attributes
    if (options.defer) script.defer = true;
    if (options.async) script.async = true;
    if (options.module) script.type = "module";

    // Add loading event listeners
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    // Preload if specified
    if (options.preload) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "script";
      preloadLink.href = src;
      preloadLink.onload = () => {
        document.head.appendChild(script);
      };
      document.head.appendChild(preloadLink);
    } else {
      document.head.appendChild(script);
    }
  });
}

/**
 * Load JavaScript conditionally based on user interaction
 *
 * @param src - Script source URL
 * @param events - Events to trigger loading
 * @returns Promise that resolves when script is loaded
 *
 * @example
 * ```typescript
 * await loadJSOnInteraction('/scripts/chat.js', ['click', 'scroll']);
 * ```
 */
export function loadJSOnInteraction(
  src: string,
  events: string[] = ["click", "scroll", "keydown"],
): Promise<void> {
  return new Promise((resolve) => {
    const loadScript = () => {
      loadJS(src, { async: true }).then(resolve).catch(console.error);
      // Remove event listeners after loading
      events.forEach((event) => {
        document.removeEventListener(event, loadScript);
      });
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, loadScript, {
        once: true,
        passive: true,
      });
    });

    // Fallback: load after 5 seconds if no interaction
    setTimeout(loadScript, 5000);
  });
}

/**
 * Load JavaScript based on viewport visibility
 *
 * @param src - Script source URL
 * @param selector - Element selector to observe
 * @returns Promise that resolves when script is loaded
 *
 * @example
 * ```typescript
 * await loadJSOnVisible('/scripts/video-player.js', '#video-container');
 * ```
 */
export function loadJSOnVisible(src: string, selector: string): Promise<void> {
  return new Promise((resolve) => {
    const target = document.querySelector(selector);
    if (!target) {
      // If target doesn't exist, load immediately
      loadJS(src, { async: true }).then(resolve).catch(console.error);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadJS(src, { async: true }).then(resolve).catch(console.error);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(target);
  });
}

// ========================================
// CODE SPLITTER CLASS
// ========================================

/**
 * Code splitting utility for dynamic imports with caching
 *
 * @example
 * ```typescript
 * const splitter = new CodeSplitter();
 * const module = await splitter.importModule('./heavy-module');
 * ```
 */
export class CodeSplitter {
  private loadedModules: Map<string, unknown> = new Map();
  private loadingPromises: Map<string, Promise<unknown>> = new Map();

  /**
   * Dynamically import a module with caching
   *
   * @param modulePath - Module path to import
   * @returns Imported module
   */
  public async importModule<T = unknown>(modulePath: string): Promise<T> {
    // Return cached module if available
    if (this.loadedModules.has(modulePath)) {
      return this.loadedModules.get(modulePath) as T;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(modulePath)) {
      return this.loadingPromises.get(modulePath) as Promise<T>;
    }

    // Create new loading promise
    const loadingPromise = import(modulePath)
      .then((module) => {
        this.loadedModules.set(modulePath, module);
        this.loadingPromises.delete(modulePath);
        return module;
      })
      .catch((error) => {
        this.loadingPromises.delete(modulePath);
        throw error;
      });

    this.loadingPromises.set(modulePath, loadingPromise);
    return loadingPromise as Promise<T>;
  }

  /**
   * Preload a module without executing it
   *
   * @param modulePath - Module path to preload
   */
  public preloadModule(modulePath: string): void {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = modulePath;
    document.head.appendChild(link);
  }

  /**
   * Load module on user interaction
   *
   * @param modulePath - Module path to import
   * @param events - Events to trigger loading
   * @returns Promise that resolves with imported module
   */
  public loadModuleOnInteraction<T = unknown>(
    modulePath: string,
    events: string[] = ["click", "scroll"],
  ): Promise<T> {
    return new Promise((resolve) => {
      const loadModule = () => {
        this.importModule<T>(modulePath)
          .then(resolve)
          .catch(() => {
            // Error loading module on interaction
          });
        events.forEach((event) => {
          document.removeEventListener(event, loadModule);
        });
      };

      events.forEach((event) => {
        document.addEventListener(event, loadModule, {
          once: true,
          passive: true,
        });
      });
    });
  }

  /**
   * Clear module cache
   */
  public clearCache(): void {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   *
   * @returns Cache statistics
   */
  public getCacheStats(): { loaded: number; loading: number } {
    return {
      loaded: this.loadedModules.size,
      loading: this.loadingPromises.size,
    };
  }
}

// ========================================
// TASK SCHEDULER CLASS
// ========================================

/**
 * Task scheduler for breaking up long-running tasks
 * Prevents blocking the main thread by time-slicing tasks.
 *
 * @example
 * ```typescript
 * const scheduler = new TaskScheduler();
 * scheduler.addTask(() => console.log('Task 1'));
 * scheduler.addTask(() => console.log('Task 2'));
 * ```
 */
export class TaskScheduler {
  private taskQueue: (() => void)[] = [];
  private isRunning = false;
  private timeSlice = 5; // ms

  /**
   * Add a task to the queue
   *
   * @param task - Task function to execute
   */
  public addTask(task: () => void): void {
    this.taskQueue.push(task);
    if (!this.isRunning) {
      this.processQueue();
    }
  }

  /**
   * Add multiple tasks to the queue
   *
   * @param tasks - Array of task functions
   */
  public addTasks(tasks: (() => void)[]): void {
    this.taskQueue.push(...tasks);
    if (!this.isRunning) {
      this.processQueue();
    }
  }

  /**
   * Process tasks with time slicing
   */
  private processQueue(): void {
    this.isRunning = true;

    const processChunk = () => {
      const start = performance.now();

      // Process tasks for up to timeSlice ms
      while (
        this.taskQueue.length > 0 &&
        performance.now() - start < this.timeSlice
      ) {
        const task = this.taskQueue.shift();
        if (task) {
          try {
            task();
          } catch (error) {
            console.error("Task execution error:", error);
          }
        }
      }

      // Continue processing if there are more tasks
      if (this.taskQueue.length > 0) {
        this.scheduleNextChunk(processChunk);
      } else {
        this.isRunning = false;
      }
    };

    processChunk();
  }

  /**
   * Schedule next chunk of work
   */
  private scheduleNextChunk(callback: () => void): void {
    const windowWithScheduler = window as Window & {
      scheduler?: {
        postTask: (
          callback: () => void,
          options?: { priority: string },
        ) => void;
      };
    };

    if (
      "scheduler" in window &&
      windowWithScheduler.scheduler &&
      "postTask" in windowWithScheduler.scheduler
    ) {
      windowWithScheduler.scheduler.postTask(callback, {
        priority: "background",
      });
    } else if ("requestIdleCallback" in window) {
      requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  }

  /**
   * Clear all pending tasks
   */
  public clearTasks(): void {
    this.taskQueue = [];
    this.isRunning = false;
  }

  /**
   * Get queue statistics
   *
   * @returns Queue statistics
   */
  public getQueueStats(): { pending: number; isRunning: boolean } {
    return {
      pending: this.taskQueue.length,
      isRunning: this.isRunning,
    };
  }

  /**
   * Set time slice duration
   *
   * @param ms - Time slice in milliseconds
   */
  public setTimeSlice(ms: number): void {
    this.timeSlice = ms;
  }
}

// ========================================
// BUNDLE ANALYZER CLASS
// ========================================

/**
 * JavaScript bundle analyzer for tracking script loading performance
 *
 * @example
 * ```typescript
 * const analyzer = new BundleAnalyzer();
 * analyzer.trackScriptLoad('/app.js');
 * const report = analyzer.getPerformanceReport();
 * ```
 */
export class BundleAnalyzer {
  private loadTimes: Map<string, number> = new Map();

  /**
   * Track script loading performance
   *
   * @param src - Script source URL
   */
  public trackScriptLoad(src: string): void {
    if (typeof performance === "undefined" || !performance.getEntriesByType)
      return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes(src)) {
          this.loadTimes.set(src, entry.duration);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["resource"] });
    } catch (_error) {
      // PerformanceObserver not supported
    }
  }

  /**
   * Get loading performance report
   *
   * @returns Performance report object
   */
  public getPerformanceReport(): Record<string, number> {
    return Object.fromEntries(this.loadTimes);
  }

  /**
   * Analyze bundle size impact
   */
  public analyzeBundleSize(): void {
    if (typeof performance === "undefined" || !performance.getEntriesByType)
      return;

    // const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    // const jsResources = resources.filter(
    //   (resource) => resource.name.endsWith('.js') || resource.name.endsWith('.mjs')
    // );

    // JavaScript Bundle Analysis
    // jsResources.forEach((resource) => {
    //   ${resource.name}: ${resource.transferSize} bytes (${resource.duration.toFixed(2)}ms)
    // });
  }

  /**
   * Get total bundle size
   *
   * @returns Total size in bytes
   */
  public getTotalBundleSize(): number {
    if (typeof performance === "undefined" || !performance.getEntriesByType)
      return 0;

    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    const jsResources = resources.filter(
      (resource) =>
        resource.name.endsWith(".js") || resource.name.endsWith(".mjs"),
    );

    return jsResources.reduce(
      (total, resource) => total + (resource.transferSize || 0),
      0,
    );
  }
}

// ========================================
// WEB WORKER MANAGER CLASS
// ========================================

/**
 * Web Worker utility for offloading heavy computations
 *
 * @example
 * ```typescript
 * const manager = new WebWorkerManager();
 * const result = await manager.executeInWorker('data-processor', '/workers/processor.js', data);
 * ```
 */
export class WebWorkerManager {
  private workers: Map<string, Worker> = new Map();

  /**
   * Create or get a web worker
   *
   * @param name - Worker name
   * @param scriptPath - Worker script path
   * @returns Worker instance
   */
  public getWorker(name: string, scriptPath: string): Worker {
    if (!this.workers.has(name)) {
      const worker = new Worker(scriptPath);
      this.workers.set(name, worker);
    }
    return this.workers.get(name)!;
  }

  /**
   * Execute a task in a web worker
   *
   * @param workerName - Worker name
   * @param scriptPath - Worker script path
   * @param data - Data to send to worker
   * @returns Promise that resolves with worker result
   */
  public executeInWorker<T = unknown>(
    workerName: string,
    scriptPath: string,
    data: unknown,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const worker = this.getWorker(workerName, scriptPath);

      worker.onmessage = (event) => {
        resolve(event.data);
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage(data);
    });
  }

  /**
   * Terminate a specific worker
   *
   * @param name - Worker name
   */
  public terminateWorker(name: string): void {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }

  /**
   * Terminate all workers
   */
  public terminateAll(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Initialize JavaScript optimization
 *
 * @returns Optimization utilities
 */
export function initializeJSOptimization(): {
  codeSplitter: CodeSplitter;
  taskScheduler: TaskScheduler;
  bundleAnalyzer: BundleAnalyzer;
} {
  const codeSplitter = new CodeSplitter();
  const taskScheduler = new TaskScheduler();
  const bundleAnalyzer = new BundleAnalyzer();

  // Determine base URL and helper to resolve library paths
  const baseUrl =
    (typeof window !== "undefined" &&
      (window as { __BASE_URL__?: string }).__BASE_URL__) ||
    "/";
  const libPath = (name: string) =>
    baseUrl && baseUrl !== "/"
      ? `${baseUrl}src/lib/${name}`
      : `/src/lib/${name}`;

  // Use optional configuration provided at runtime to avoid referencing non-existent modules
  const jsOptConfig =
    (typeof window !== "undefined" &&
      (
        window as {
          __JS_OPTIMIZATION_CONFIG__?: {
            criticalModules?: string[];
            nonCriticalModules?: string[];
          };
        }
      ).__JS_OPTIMIZATION_CONFIG__) ||
    {};
  const configuredCritical: string[] = Array.isArray(
    jsOptConfig.criticalModules,
  )
    ? jsOptConfig.criticalModules
    : [];
  const configuredNonCritical: string[] = Array.isArray(
    jsOptConfig.nonCriticalModules,
  )
    ? jsOptConfig.nonCriticalModules
    : [];

  // Resolve and preload only configured critical modules
  const criticalModules = configuredCritical.map((name) => libPath(name));
  criticalModules.forEach((module) => {
    codeSplitter.preloadModule(module);
  });

  // Resolve and load non-critical modules on interaction
  const nonCriticalModules = configuredNonCritical.map((name) => libPath(name));
  nonCriticalModules.forEach((module) => {
    codeSplitter.loadModuleOnInteraction(module, [
      "click",
      "scroll",
      "keydown",
    ]);
  });

  return { codeSplitter, taskScheduler, bundleAnalyzer };
}

/**
 * Optimize existing scripts for better performance
 */
export function optimizeExistingScripts(): void {
  if (typeof document === "undefined") return;

  // Add defer to non-critical scripts
  const scripts = document.querySelectorAll(
    "script[src]:not([defer]):not([async])",
  );
  scripts.forEach((script) => {
    const src = script.getAttribute("src");
    if (src && !src.includes("critical") && !src.includes("inline")) {
      script.setAttribute("defer", "true");
    }
  });

  // Add loading="lazy" to non-critical iframes
  const iframes = document.querySelectorAll("iframe:not([loading])");
  iframes.forEach((iframe) => {
    iframe.setAttribute("loading", "lazy");
  });
}

/**
 * Connection-aware loading
 * Adapts JavaScript loading based on network conditions
 */
export function adaptiveJSLoading(): void {
  if (typeof navigator === "undefined" || !("connection" in navigator)) return;

  const connection = (
    navigator as Navigator & {
      connection?: {
        effectiveType: string;
        downlink: number;
        saveData: boolean;
      };
    }
  ).connection;

  if (!connection) return;

  const { effectiveType, downlink, saveData } = connection;

  // Reduce JavaScript loading on slow connections or data saver mode
  if (
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    saveData ||
    downlink < 1
  ) {
    // Slow connection detected, reducing JavaScript loading

    // Remove non-essential scripts
    const nonEssentialScripts = document.querySelectorAll(
      'script[data-priority="low"]',
    );
    nonEssentialScripts.forEach((script) => script.remove());

    return;
  }

  // Preload additional scripts on fast connections
  if (effectiveType === "4g" && downlink > 10) {
    // Fast connection detected, preloading additional scripts

    const additionalScripts = [
      "/js/animations.js",
      "/js/analytics.js",
      "/js/enhanced-features.js",
    ];

    additionalScripts.forEach((src) => {
      loadJS(src, { preload: true, async: true }).catch(() => {
        // Error loading additional script
      });
    });
  }
}
