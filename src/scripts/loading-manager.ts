import Ajv from 'ajv'; // Assuming ajv is installed or available

interface Resource {
    id: string;
    type: 'image' | 'audio' | 'json' | 'script';
    url: string;
    loaded: boolean;
    error?: Error;
    validationPattern?: RegExp;
    size?: number;
    element?: HTMLElement | HTMLImageElement | HTMLScriptElement | HTMLAudioElement; // Added HTMLAudioElement
    metadata?: unknown;
    schema?: unknown; // Added optional schema for JSON validation
    priority?: number; // Lower number means higher priority (e.g., 0 = highest)
}

interface ErrorEvent {
    error: Error;
    resource?: Resource;
}

interface LoadingManagerOptions {
    maxParallelLoads: number;
    retryAttempts: number;
    retryDelay: number;
    timeout: number;
    // UI related options
    uiContainer?: HTMLElement; // Optional container to append the overlay to (defaults to document.body)
    showPlaceholders?: boolean; // Flag to control placeholder visibility
}

class LoadingManager {
    private queue: Resource[] = [];
    private loadedResources: Set<string> = new Set(); // Track loaded resource IDs
    private totalResources: number = 0; // Keep track of initial queue size for progress calculation
    private activeLoads: Set<Promise<void>> = new Set();
    private options: LoadingManagerOptions = {
        maxParallelLoads: 4,
        retryAttempts: 2,
        retryDelay: 1000,
        timeout: 5000,
        uiContainer: document.body,
        showPlaceholders: false, // Default to not showing placeholders unless explicitly enabled
    };
    private eventTarget: EventTarget = new EventTarget();
    private abortController: AbortController = new AbortController();

    // UI Elements
    private overlayElement: HTMLElement | null = null;
    private progressFillElement: HTMLElement | null = null;
    private statusTextElement: HTMLElement | null = null;
    private spinnerElement: HTMLElement | null = null; // Added spinner element reference

    constructor(options?: Partial<LoadingManagerOptions>) {
        this.options = { ...this.options, ...options };
        this.setupEventListeners(); // Setup internal listeners
    }

    // --- UI Management Methods ---

    private createUI(): void {
        if (this.overlayElement) return; // Already created

        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'loading-overlay';
        this.overlayElement.style.opacity = '0'; // Start hidden for transition
        this.overlayElement.style.transition = 'opacity 0.5s ease-in-out';
        this.overlayElement.setAttribute('aria-live', 'assertive'); // Accessibility
        this.overlayElement.setAttribute('role', 'status');

        const content = document.createElement('div');
        content.className = 'loading-content';

        // Thematic Spinner (e.g., Vault-Tec Logo or Gear)
        this.spinnerElement = document.createElement('div');
        this.spinnerElement.className = 'loading-spinner'; // Style this in CSS
        // Optional: Add SVG or image content here if needed
        content.appendChild(this.spinnerElement);


        this.statusTextElement = document.createElement('p');
        this.statusTextElement.className = 'loading-status';
        this.statusTextElement.textContent = 'Initializing Vault Systems...';
        content.appendChild(this.statusTextElement);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress-container';
        progressContainer.setAttribute('role', 'progressbar'); // Accessibility
        progressContainer.setAttribute('aria-valuemin', '0');
        progressContainer.setAttribute('aria-valuemax', '100');
        progressContainer.setAttribute('aria-valuenow', '0');


        this.progressFillElement = document.createElement('div');
        this.progressFillElement.className = 'loading-progress-fill';
        progressContainer.appendChild(this.progressFillElement);

        content.appendChild(progressContainer);
        this.overlayElement.appendChild(content);

        (this.options.uiContainer || document.body).appendChild(this.overlayElement);
    }

    private showOverlay(): void {
        this.createUI();
        if (this.overlayElement) {
            // Use a slight delay to ensure the transition applies correctly after appending
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                     if (this.overlayElement) {
                        this.overlayElement.style.opacity = '1';
                     }
                });
            });
        }
    }

    private hideOverlay(): void {
        if (this.overlayElement) {
            this.overlayElement.style.opacity = '0';
            // Remove after transition
            this.overlayElement.addEventListener('transitionend', () => {
                this.destroyUI();
            }, { once: true });
        } else {
             // If overlay doesn't exist (e.g., destroy called early), ensure UI cleanup happens
             this.destroyUI();
        }
    }

    private updateProgress(): void {
        if (this.totalResources === 0) return; // Avoid division by zero

        const progress = Math.round((this.loadedResources.size / this.totalResources) * 100);
        const cappedProgress = Math.min(progress, 100); // Cap at 100

        if (this.progressFillElement) {
            this.progressFillElement.style.width = `${cappedProgress}%`;
             // Update ARIA attribute on the container
             this.progressFillElement.parentElement?.setAttribute('aria-valuenow', `${cappedProgress}`);
        }


        if (this.statusTextElement) {
             if (cappedProgress < 100) {
                this.statusTextElement.textContent = `Loading Assets... ${cappedProgress}% (${this.loadedResources.size}/${this.totalResources})`;
             } else {
                 this.statusTextElement.textContent = 'Finalizing...';
             }
        }
    }

     private destroyUI(): void {
        if (this.overlayElement) {
            this.overlayElement.remove();
            this.overlayElement = null;
            this.progressFillElement = null;
            this.statusTextElement = null;
            this.spinnerElement = null;
        }
    }

    // --- Event Handling Setup ---
    private setupEventListeners(): void {
        this.addEventListener('start', () => {
            this.showOverlay();
            this.updateProgress(); // Initial progress update (will show 0%)
        });

        this.addEventListener('loaded', (event: Event) => {
            const resource = (event as CustomEvent).detail as Resource;
            if (resource?.id && !this.loadedResources.has(resource.id)) { // Ensure resource and id exist and not already counted
                 this.loadedResources.add(resource.id);
                 this.updateProgress();
            }
        });

         this.addEventListener('error', (event: Event) => {
            const detail = (event as CustomEvent).detail as ErrorEvent; // Use ErrorEvent type
            const resource = detail.resource;
            const resourceId = resource?.id;

            console.error(`Error loading resource: ${resourceId || 'Unknown'}`, detail.error);

            if (resourceId && !this.loadedResources.has(resourceId)) {
                // Count errored resources towards progress to avoid getting stuck
                this.loadedResources.add(resourceId);
            }

             if (this.statusTextElement) {
                 this.statusTextElement.textContent = `Error loading: ${resourceId || 'resource'}. Retrying or skipping...`;
                 // Maybe revert after a delay or show final error count?
             }
            this.updateProgress(); // Update progress even on error
        });

        this.addEventListener('complete', (event: Event) => {
             const detail = (event as CustomEvent).detail as { partialError?: boolean };
             const partialError = detail?.partialError || false;

            if (this.statusTextElement) {
                 this.statusTextElement.textContent = partialError
                     ? `Vault Ready (with ${this.totalResources - this.loadedResources.size} errors)`
                     : 'Vault Ready!';
            }
            if (this.spinnerElement) {
                 this.spinnerElement.style.display = 'none'; // Hide spinner on completion
            }
             // Ensure progress bar shows 100% on completion, even with errors
             if (this.progressFillElement) {
                 this.progressFillElement.style.width = '100%';
                 this.progressFillElement.parentElement?.setAttribute('aria-valuenow', '100');
             }

            // Short delay before hiding overlay
            setTimeout(() => {
                this.hideOverlay();
            }, partialError ? 1500 : 500); // Longer delay if there were errors
        });

         this.addEventListener('fatal', (event: Event) => {
             const detail = (event as CustomEvent).detail as ErrorEvent;
             console.error('Fatal loading error:', detail.error);
             if (this.statusTextElement) {
                 this.statusTextElement.textContent = 'Critical System Error! Cannot load.';
                 this.statusTextElement.style.color = '#ff6b6b'; // Make error more visible
             }
              if (this.spinnerElement) {
                 this.spinnerElement.style.display = 'none'; // Hide spinner on fatal error
             }
             // Keep overlay visible on fatal error.
         });
    }


    // --- Core Loading Logic (Modified) ---

    public add(resource: Resource): void {
        if (!resource.id || !resource.type || !resource.url) {
            console.error('Resource must have id, type, and url:', resource);
            throw new Error('Resource must have id, type and url');
        }
        // Assign default priority if not provided
        const resourceWithPriority = {
             ...resource,
             loaded: false,
             priority: resource.priority ?? 10 // Default priority 10
        };

        // Prevent adding duplicates that are already loaded or in the queue
        if (!this.loadedResources.has(resource.id) && !this.queue.some(r => r.id === resource.id)) {
            this.queue.push(resourceWithPriority);
            // Keep the queue sorted by priority (lower number first)
            this.queue.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
        } else {
        }
    }

    public async loadAll(): Promise<void> {
        // Device capability detection
        this.detectDeviceCapabilities();

        // Log navigation timings
        this.logNavigationTimings();

        // Reset state for a new loading sequence
        this.totalResources = this.queue.length;
        this.loadedResources.clear();
        // Ensure abort controller is fresh if loadAll can be called multiple times
        if (this.abortController.signal.aborted) {
            this.abortController = new AbortController();
        }

        this.dispatchEvent('start', {}); // Dispatch start event

        if (this.totalResources === 0) {
            this.dispatchEvent('complete', {});
            return Promise.resolve();
        }

        try {
            const loadingPromises: Promise<void>[] = [];

            // Use a function to manage starting new loads to avoid complex loop logic
            const startNextLoads = () => {
                // Sort queue by priority before picking next items (in case priorities changed dynamically, though unlikely here)
                // Sorting is mainly done in `add`, but doesn't hurt to ensure order here.
                this.queue.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));

                while (this.activeLoads.size < this.options.maxParallelLoads && this.queue.length > 0) {
                    // Take the highest priority item (lowest number) from the start of the sorted queue
                    const resource = this.queue.shift()!;

                    // Double-check if already loaded
                    if (this.loadedResources.has(resource.id)) {
                        continue;
                    }

                    // Validate URL
                    if (!this.validateResourceUrl(resource)) {
                         this.dispatchEvent('error', { resource, error: resource.error || new Error('URL Validation Failed') });
                         if (!this.loadedResources.has(resource.id)) {
                             this.loadedResources.add(resource.id);
                             this.updateProgress();
                         }
                        continue;
                    }

                    // Initiate loading
                    const loadPromise = this.loadResourceWithRetry(resource)
                        .catch(error => {
                            // Errors handled internally, this catch prevents Promise.all rejection
                        })
                        .finally(() => {
                            this.activeLoads.delete(loadPromise);
                            // Trigger starting next loads after one finishes
                            startNextLoads();
                        });

                    this.activeLoads.add(loadPromise);
                    loadingPromises.push(loadPromise); // Track all initiated promises
                }
            };

            startNextLoads(); // Initial population of active loads

            // Wait for all initiated promises to settle (resolve or reject)
            await Promise.all(loadingPromises);

            // Final completion check
            const failedCount = this.totalResources - this.loadedResources.size;
            if (failedCount > 0) {
                 this.dispatchEvent('complete', { partialError: true });
            } else {
                 this.dispatchEvent('complete', { partialError: false });
            }

        } catch (error) {
            // This catch should ideally only handle unexpected errors,
            // as load errors are caught per-resource and fatal errors dispatched.
            console.error("Unexpected error during loadAll:", error);
            this.dispatchEvent('fatal', {
                error: error instanceof Error ? error : new Error(String(error))
            });
            // Depending on desired behavior, you might want to re-throw or just let the fatal event handle UI
            // throw error;
        }
    }

    private validateResourceUrl(resource: Resource): boolean {
        try {
            // Basic check for non-empty URL
            if (!resource.url || typeof resource.url !== 'string' || resource.url.trim() === '') {
                 throw new Error('Resource URL is empty or invalid');
            }

            // Allow relative URLs by providing a base (optional, adjust if needed)
            // const base = document.baseURI || window.location.href;
            // const url = new URL(resource.url, base);
            const url = new URL(resource.url); // Keep strict for now

            // Validate URL protocol (adjust allowed protocols as needed)
            if (!['http:', 'https:', 'data:', 'blob:'].includes(url.protocol)) { // Added blob:
                throw new Error(`Unsupported protocol: ${url.protocol}`);
            }

            // Validate against pattern if specified
            if (resource.validationPattern && !resource.validationPattern.test(resource.url)) {
                throw new Error(`URL ${resource.url} failed validation pattern`);
            }

            return true;
        } catch (error) {
            resource.error = error instanceof Error ? error : new Error(String(error));
            // Don't dispatch error here, let the caller handle it after validation check
            return false;
        }
    }


    private async loadResourceWithRetry(resource: Resource, attempt = 0): Promise<void> {
        try {
            await this.loadResource(resource);
            // Success: dispatch loaded event (listener will update progress)
            this.dispatchEvent('loaded', resource);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                 // If aborted, don't retry, just re-throw
                 throw error;
            }

            if (attempt < this.options.retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, this.options.retryDelay * Math.pow(2, attempt))); // Exponential backoff
                return this.loadResourceWithRetry(resource, attempt + 1);
            } else {
                // All retries failed
                resource.error = error as Error;
                // Dispatch error event (listener will update progress)
                this.dispatchEvent('error', { resource, error: resource.error });
                // Throw error so Promise.all in loadAll knows this specific chain failed
                throw error;
            }
        }
    }


    private async loadResource(resource: Resource): Promise<void> {
        // Use a single AbortController for both timeout and external abort
        const loadAbortController = new AbortController();
        const signal = loadAbortController.signal;

        // Link external abort to this load's abort
        const externalAbortHandler = () => loadAbortController.abort();
        this.abortController.signal.addEventListener('abort', externalAbortHandler, { once: true });

        const timeoutPromise = new Promise<never>((_, reject) => {
            const timer = setTimeout(() => {
                loadAbortController.abort(); // Trigger abort on timeout
                reject(new Error(`Timeout loading ${resource.type}: ${resource.url}`));
            }, this.options.timeout);

            // Clear timeout if aborted for other reasons
            signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
        });

        const loadPromise = new Promise<void>((resolve, reject) => {
            // Attach abort listener to the promise execution context
             signal.addEventListener('abort', () => {
                 // Ensure cleanup happens if aborted before load completes/fails
                 reject(new Error(`${resource.type} loading aborted: ${resource.url}`));
             }, { once: true });


            try {
                switch (resource.type) {
                    case 'image':
                        this.loadImage(resource, signal, resolve, reject);
                        break;
                    case 'audio':
                        this.loadAudio(resource, signal, resolve, reject);
                        break;
                    case 'json':
                        this.loadJson(resource, signal, resolve, reject);
                        break;
                    case 'script':
                        this.loadScript(resource, signal, resolve, reject);
                        break;
                    default:
                        // Ensure exhaustive check with a helper function or type assertion
                        const exhaustiveCheck: never = resource.type;
                        reject(new Error(`Unknown resource type: ${exhaustiveCheck}`));
                }
            } catch (error) {
                reject(error); // Catch synchronous errors during setup
            }
        });

        try {
            // Race the load against the timeout
            await Promise.race([loadPromise, timeoutPromise]);
        } finally {
            // Clean up external abort listener regardless of outcome
            this.abortController.signal.removeEventListener('abort', externalAbortHandler);
        }
    }

    // --- Specific Loaders (accept AbortSignal) ---

    private loadImage(resource: Resource, signal: AbortSignal, resolve: () => void, reject: (error: Error) => void): void {
        const img = new Image();
        resource.element = img;

        const cleanUp = () => {
            img.onload = null;
            img.onerror = null;
            img.src = ''; // Release memory?
            signal.removeEventListener('abort', abortHandler);
        };

        const abortHandler = () => {
            cleanUp();
            reject(new Error(`Image loading aborted: ${resource.url}`));
        };
        signal.addEventListener('abort', abortHandler, { once: true });

        img.onload = () => {
            cleanUp();
            resource.loaded = true;
            resource.size = img.naturalWidth * img.naturalHeight * 4; // Use naturalWidth/Height
            resolve();
        };

        img.onerror = () => {
            cleanUp();
            reject(new Error(`Failed to load image: ${resource.url}`));
        };

        try {
            new URL(resource.url); // Validate URL format
            img.src = resource.url;
        } catch (error) {
             cleanUp();
            reject(new Error(`Invalid image URL: ${resource.url}`));
        }
    }

     private loadAudio(resource: Resource, signal: AbortSignal, resolve: () => void, reject: (error: Error) => void): void {
        const audio = new Audio();
        resource.element = audio;

        const cleanUp = () => {
            audio.oncanplaythrough = null;
            audio.onerror = null;
            audio.onabort = null; // Handle explicit abort event
            audio.src = ''; // Release resource
            signal.removeEventListener('abort', abortHandler);
            // Revoke object URL if created
            if (audio.src && audio.src.startsWith('blob:')) { URL.revokeObjectURL(audio.src); }
        };

         const abortHandler = () => {
             cleanUp();
             reject(new Error(`Audio loading aborted: ${resource.url}`));
         };
         signal.addEventListener('abort', abortHandler, { once: true });


        audio.oncanplaythrough = () => {
            cleanUp();
            resource.loaded = true;
            resolve();
        };
        audio.onerror = (e) => {
            cleanUp();
            const errorMsg = `Failed to load audio: ${resource.url}`;
            const mediaError = (e instanceof Event && e.currentTarget instanceof HTMLAudioElement) ? e.currentTarget.error : null;
            const error = mediaError
                ? new Error(`${errorMsg} - Code: ${mediaError.code}, Message: ${mediaError.message}`)
                : new Error(errorMsg);
            reject(error);
        };
         audio.onabort = () => { // Handle browser-level abort
             cleanUp();
             reject(new Error(`Audio loading aborted by browser: ${resource.url}`));
         };

         try {
             new URL(resource.url); // Validate URL format
             audio.src = resource.url;
             audio.load(); // Necessary for some browsers/scenarios
         } catch (error) {
             cleanUp();
             reject(new Error(`Invalid audio URL: ${resource.url}`));
         }
    }

     private loadJson(resource: Resource, signal: AbortSignal, resolve: () => void, reject: (error: Error) => void): void {
        fetch(resource.url, {
            signal: signal, // Pass the signal directly to fetch
            credentials: 'omit',
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (signal.aborted) throw new Error('Fetch aborted'); // Check after await
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${resource.url}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType?.includes('application/json')) {
                    throw new Error(`Invalid content type: ${contentType} for ${resource.url}`);
                }
                return response.json();
            })
             .then(data => {
                 if (signal.aborted) throw new Error('Processing aborted'); // Check after await

                 if (!this.sanitizeJson(data)) {
                     throw new Error(`JSON sanitization failed for ${resource.url}`);
                 }
                 if (resource.schema && !this.validateJsonSchema(data, resource.schema)) {
                     throw new Error(`Invalid JSON schema for ${resource.url}`);
                 }

                 resource.metadata = data;
                 resource.loaded = true;
                 resolve();
             })
            .catch(error => {
                 // Don't reject if already aborted, let the abort handler do it
                 if (error.name !== 'AbortError') {
                    reject(new Error(`Failed to load/process JSON: ${resource.url} - ${error.message}`));
                 } else {
                     reject(error); // Re-throw abort error
                 }
            });
    }

     private loadScript(resource: Resource, signal: AbortSignal, resolve: () => void, reject: (error: Error) => void): void {
        const script = document.createElement('script');
        resource.element = script;

        const cleanUp = () => {
            script.onload = null;
            script.onerror = null;
            signal.removeEventListener('abort', abortHandler);
            // Only remove script if it failed or was aborted, otherwise keep it
            if (script.parentNode && (signal.aborted || !resource.loaded)) {
                 script.remove();
            }
        };

         const abortHandler = () => {
             cleanUp();
             reject(new Error(`Script loading aborted: ${resource.url}`));
         };
         signal.addEventListener('abort', abortHandler, { once: true });


        script.onload = () => {
            cleanUp();
            resource.loaded = true;
            resolve();
        };
        script.onerror = () => {
            cleanUp();
            reject(new Error(`Failed to load script: ${resource.url}`));
        };

         try {
             new URL(resource.url); // Validate URL format
             script.src = resource.url;
             script.async = true;

             const cspNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
             if (cspNonce) script.nonce = cspNonce;

             document.head.appendChild(script);
         } catch (error) {
             cleanUp();
             reject(new Error(`Invalid script URL: ${resource.url}`));
         }
    }

    // --- Sanitization & Validation ---

    private sanitizeJson(data: unknown): boolean { // Return boolean, don't modify in place
        if (typeof data !== 'object' || data === null) {
            return true; // Primitives are fine
        }

        // Prevent prototype pollution
        const proto = Object.getPrototypeOf(data);
        if (proto !== Object.prototype && proto !== Array.prototype) {
            // Potential prototype pollution detected in JSON.
            return false;
        }

        if (Array.isArray(data)) {
            return data.every(item => this.sanitizeJson(item));
        }

        // Check properties of the object
        for (const key in data) {
             // Avoid checking inherited properties, though prototype check helps
             if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

             // Disallow keys that might indicate prototype pollution
             if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                 // Disallowed key found in JSON.
                 return false;
             }

            const value = (data as Record<string, unknown>)[key];
            if (typeof value === 'string') {
                // Basic XSS check - check for script tags or event handlers
                if (/<script|onerror=|onload=/i.test(value)) {
                     // Potentially unsafe string found in JSON.
                     return false;
                }
                // Optionally replace chars like < > & ' " if needed downstream
                // (data as Record<string, unknown>)[key] = value.replace...
            } else if (typeof value === 'object' && value !== null) {
                if (!this.sanitizeJson(value)) {
                    return false; // Recurse
                }
            }
        }

        return true;
    }

    private validateJsonSchema<T>(data: unknown, schema?: T): data is T {
        // Ensure Ajv is available (consider making it optional or injectable)
        if (typeof Ajv === 'undefined') {
             // Ajv not available for schema validation. Skipping.
             return true;
        }
        if (!schema) {
             return true; // No schema means validation passes vacuously
        }

        try {
            // Consider caching compiled schemas if the same schema is used often
            const ajv = new Ajv({ allErrors: true }); // Configure Ajv as needed
            const validate = ajv.compile(schema);
            const valid = validate(data);
            if (!valid) {
                console.error('Schema validation failed:', ajv.errorsText(validate.errors));
                return false;
            }
            return true;
        } catch (error) {
            console.error('Ajv schema compilation/validation error:', error);
            return false; // Error during validation means it failed
        }
    }


    // --- Network Status ---
    private checkNetworkStatus(): boolean {
        return navigator.onLine;
    }

    // --- Event Listener Management ---
    public addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
        if (listener) {
            this.eventTarget.addEventListener(type, listener);
        }
    }

    public removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
         if (listener) {
            this.eventTarget.removeEventListener(type, listener);
         }
    }

    // --- Cleanup ---
    public destroy(): void {
        this.abortController.abort(); // Abort ongoing operations

        // Clear queues and state
        this.queue = [];
        this.loadedResources.clear();
        this.activeLoads.clear(); // Should be empty if abort worked, but clear anyway
        this.totalResources = 0;

        // Remove UI elements
        this.destroyUI();

        // Re-initialize event target to remove all listeners implicitly
        this.eventTarget = new EventTarget();

        // Create a new abort controller for potential future use
        this.abortController = new AbortController();

    }

    // --- Event Dispatcher ---
    private dispatchEvent(type: string, detail: unknown): void {
        this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
    }

    private detectDeviceCapabilities(): void {
        try {
            const cores = (navigator as any).hardwareConcurrency || 'unknown';
            const memory = (navigator as any).deviceMemory || 'unknown';

            let gpuInfo = 'unknown';
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        const vendor = (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                        const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        gpuInfo = `${vendor} - ${renderer}`;
                    }
                }
            } catch (e) {
                // Ignore WebGL errors
            }

            // Device capabilities detected (CPU, RAM, GPU).
        } catch (e) {
            // Failed to detect device capabilities.
        }
    }

    private logNavigationTimings(): void {
        try {
            const navEntries = performance.getEntriesByType('navigation');
            if (navEntries && navEntries.length > 0) {
                const nav = navEntries[0] as PerformanceNavigationTiming;
                // Navigation timing logging removed for production.
            } else if ((performance as any).timing) {
                const t = (performance as any).timing;
                console.log('[Perf] Legacy Navigation Timing:', {
                    navigationStart: t.navigationStart,
                    fetchStart: t.fetchStart,
                    domInteractive: t.domInteractive,
                    domContentLoadedEventEnd: t.domContentLoadedEventEnd,
                    loadEventEnd: t.loadEventEnd,
                    total: t.loadEventEnd - t.navigationStart
                });
            }
        } catch (e) {
            console.warn('[Perf] Failed to log navigation timings', e);
        }
    }
}

export default LoadingManager;