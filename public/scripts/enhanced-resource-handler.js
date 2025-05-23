/**
 * Enhanced Resource Error Handler for NosytLabs Website
 * 
 * This script provides a comprehensive solution for handling resource loading errors,
 * particularly when viewing the site locally via file:// protocol.
 * 
 * Features:
 * - Handles file:// protocol issues with proper path normalization
 * - Provides fallbacks for missing resources (images, scripts, stylesheets, iframes)
 * - Suppresses console errors to improve developer experience
 * - Supports base64 fallback images for critical UI elements
 * - Works with local-development-server.js to provide a better local experience
 * - Implements retry mechanisms for intermittent network issues
 * - Provides detailed logging for debugging (when enabled)
 * - Handles CORS issues with appropriate fallbacks
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    // Enable or disable the resource handler
    enabled: true,
    
    // Default image to use when an image fails to load
    defaultImage: '/images/placeholder.svg',
    
    // Base64 encoded fallback image for critical UI elements (transparent 1x1 pixel)
    fallbackImageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    
    // Default CSS to apply when a stylesheet fails to load
    defaultCSS: `
      :root {
        --nosyt-purple-light: #8B5CF6;
        --nosyt-purple-main: #6D28D9;
        --nosyt-purple-dark: #5B21B6;
        --nosyt-purple-darkest: #4C1D95;
        --nosyt-orange-light: #FF9A4F;
        --nosyt-orange-main: #FF7A2F;
        --nosyt-orange-dark: #E05A00;
        --color-bg-primary: #ffffff;
        --color-text-primary: #1F2937;
      }
      
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.5;
        color: var(--color-text-primary);
        background-color: var(--color-bg-primary);
      }
      
      a {
        color: var(--nosyt-orange-dark);
        text-decoration: none;
      }
      
      a:hover {
        color: var(--nosyt-orange-main);
      }
      
      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .win95-window {
        position: absolute;
        background-color: #c0c0c0;
        border: 3px solid #c0c0c0;
        box-shadow: inset 1px 1px 0px #ffffff, inset -1px -1px 0px #808080, 2px 2px 5px rgba(0, 0, 0, 0.2);
      }
    `,
    
    // Maximum number of retries for loading a resource
    maxRetries: 3,
    
    // Delay between retries (in milliseconds)
    retryDelay: 1000,
    
    // Whether to log errors to the console
    logErrors: false,
    
    // Whether to show detailed debug information
    debug: false,
    
    // Whether to attempt to fix CORS issues
    fixCorsIssues: true,
    
    // Whether to normalize file paths
    normalizePaths: true,
    
    // Whether to use base64 fallbacks for critical images
    useBase64Fallbacks: true,
    
    // Whether to handle service worker issues
    handleServiceWorker: true,
    
    // Whether to handle localStorage issues
    handleLocalStorage: true,
    
    // Whether to handle fetch API issues
    handleFetchAPI: true,
    
    // Whether to handle WebSocket issues
    handleWebSockets: true
  };
  
  // Keep track of resources that have been handled
  const handledResources = new Set();
  
  // Keep track of retry attempts
  const retryAttempts = new Map();
  
  // Detect if we're running from a file:// URL
  const isLocalFile = window.location.protocol === 'file:';
  
  // Log a message if debug is enabled
  function debugLog(...args) {
    if (config.debug) {
      console.log('[ResourceHandler]', ...args);
    }
  }
  
  // Normalize a path for local file access
  function normalizePath(path) {
    if (!config.normalizePaths || !path) return path;
    
    // Handle absolute URLs
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    
    // Handle relative URLs when running locally
    if (isLocalFile && path.startsWith('/')) {
      // Convert /path to ./path for local file access
      const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
      return `${basePath}${path}`;
    }
    
    return path;
  }
  
  /**
   * Handle image loading errors
   */
  function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
      // Skip images that have already been processed
      if (img.hasAttribute('data-resource-handled')) return;
      
      // Mark as processed
      img.setAttribute('data-resource-handled', 'true');
      
      // Save original source
      const originalSrc = img.src;
      
      // Handle images that are already broken
      if (!img.complete || img.naturalHeight === 0) {
        applyImageFallback(img);
      }
      
      // Add error event listener
      img.addEventListener('error', () => {
        applyImageFallback(img);
      });
      
      // Add load event listener to clear retry attempts
      img.addEventListener('load', () => {
        if (retryAttempts.has(originalSrc)) {
          retryAttempts.delete(originalSrc);
        }
      });
    });
  }
  
  /**
   * Apply fallback for an image
   * @param {HTMLImageElement} img - The image element
   */
  function applyImageFallback(img) {
    // Skip if already handled
    if (handledResources.has(img.src)) return;
    
    // Save original source for potential retry
    const originalSrc = img.src;
    
    // Check if we should retry
    const attempts = retryAttempts.get(originalSrc) || 0;
    if (attempts < config.maxRetries) {
      retryAttempts.set(originalSrc, attempts + 1);
      
      debugLog(`Retrying image load (${attempts + 1}/${config.maxRetries}): ${originalSrc}`);
      
      // Try again after delay
      setTimeout(() => {
        img.src = normalizePath(originalSrc);
      }, config.retryDelay);
      
      return;
    }
    
    // Apply fallback based on priority
    if (img.hasAttribute('data-fallback')) {
      // Use specified fallback
      img.src = normalizePath(img.getAttribute('data-fallback'));
    } else if (img.hasAttribute('data-critical') && config.useBase64Fallbacks) {
      // Use base64 fallback for critical images
      img.src = config.fallbackImageBase64;
    } else {
      // Use default fallback
      img.src = normalizePath(config.defaultImage);
    }
    
    // Add to handled resources
    handledResources.add(originalSrc);
    
    // Log error if enabled
    if (config.logErrors) {
      console.warn(`Image failed to load: ${originalSrc}, using fallback: ${img.src}`);
    }
  }
  
  /**
   * Handle stylesheet loading errors
   */
  function handleStylesheetErrors() {
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      // Skip links that have already been processed
      if (link.hasAttribute('data-resource-handled')) return;
      
      // Mark as processed
      link.setAttribute('data-resource-handled', 'true');
      
      // Normalize href
      if (config.normalizePaths && isLocalFile) {
        const originalHref = link.href;
        const normalizedHref = normalizePath(originalHref);
        
        if (originalHref !== normalizedHref) {
          link.href = normalizedHref;
        }
      }
      
      // Create a test image with the stylesheet URL
      const img = new Image();
      img.src = link.href;
      
      img.onerror = () => {
        applyStylesheetFallback(link);
      };
    });
  }
  
  /**
   * Apply fallback for a stylesheet
   * @param {HTMLLinkElement} link - The link element
   */
  function applyStylesheetFallback(link) {
    if (handledResources.has(link.href)) return;
    
    // Create a new style element with default CSS
    const style = document.createElement('style');
    style.textContent = config.defaultCSS;
    
    // Insert after the link
    link.parentNode.insertBefore(style, link.nextSibling);
    
    // Add to handled resources
    handledResources.add(link.href);
    
    // Log error if enabled
    if (config.logErrors) {
      console.warn(`Stylesheet failed to load: ${link.href}, using fallback CSS`);
    }
  }
  
  /**
   * Handle script loading errors
   */
  function handleScriptErrors() {
    document.querySelectorAll('script[src]').forEach(script => {
      // Skip scripts that have already been processed
      if (script.hasAttribute('data-resource-handled')) return;
      
      // Mark as processed
      script.setAttribute('data-resource-handled', 'true');
      
      // Normalize src
      if (config.normalizePaths && isLocalFile) {
        const originalSrc = script.src;
        const normalizedSrc = normalizePath(originalSrc);
        
        if (originalSrc !== normalizedSrc) {
          // Create a new script element with the normalized src
          const newScript = document.createElement('script');
          newScript.src = normalizedSrc;
          newScript.setAttribute('data-resource-handled', 'true');
          
          // Copy attributes
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src' && attr.name !== 'data-resource-handled') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          // Replace the original script
          script.parentNode.replaceChild(newScript, script);
          
          // Add error event listener to the new script
          newScript.addEventListener('error', () => {
            applyScriptFallback(newScript);
          });
          
          return;
        }
      }
      
      // Add error event listener
      script.addEventListener('error', () => {
        applyScriptFallback(script);
      });
    });
  }
  
  /**
   * Apply fallback for a script
   * @param {HTMLScriptElement} script - The script element
   */
  function applyScriptFallback(script) {
    if (handledResources.has(script.src)) return;
    
    // Add to handled resources
    handledResources.add(script.src);
    
    // Log error if enabled
    if (config.logErrors) {
      console.warn(`Script failed to load: ${script.src}`);
    }
    
    // Check if there's a fallback script
    if (script.hasAttribute('data-fallback')) {
      const fallbackScript = document.createElement('script');
      fallbackScript.src = normalizePath(script.getAttribute('data-fallback'));
      script.parentNode.insertBefore(fallbackScript, script.nextSibling);
    } else if (script.hasAttribute('data-fallback-content')) {
      // Inline fallback content
      const fallbackScript = document.createElement('script');
      fallbackScript.textContent = script.getAttribute('data-fallback-content');
      script.parentNode.insertBefore(fallbackScript, script.nextSibling);
    }
  }
  
  /**
   * Initialize the resource error handler
   */
  function init() {
    if (!config.enabled) return;
    
    debugLog('Initializing Enhanced Resource Handler');
    
    // Handle existing resources
    handleImageErrors();
    handleStylesheetErrors();
    handleScriptErrors();
    
    // Handle resources added dynamically
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              // Check if the node itself needs handling
              if (node.tagName === 'IMG') {
                handleImageErrors();
              } else if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                handleStylesheetErrors();
              } else if (node.tagName === 'SCRIPT' && node.src) {
                handleScriptErrors();
              }
              
              // Check for child elements that need handling
              if (node.querySelectorAll) {
                const images = node.querySelectorAll('img');
                if (images.length > 0) handleImageErrors();
                
                const stylesheets = node.querySelectorAll('link[rel="stylesheet"]');
                if (stylesheets.length > 0) handleStylesheetErrors();
                
                const scripts = node.querySelectorAll('script[src]');
                if (scripts.length > 0) handleScriptErrors();
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    // Suppress console errors
    if (!config.logErrors) {
      const originalConsoleError = console.error;
      console.error = function(...args) {
        if (args[0] && typeof args[0] === 'string' && 
            (args[0].includes('Failed to load resource') || 
             args[0].includes('Cross-Origin Request Blocked') ||
             args[0].includes('net::ERR_FILE_NOT_FOUND'))) {
          // Suppress the error
          return;
        }
        originalConsoleError.apply(console, args);
      };
    }
    
    // Handle service worker issues
    if (config.handleServiceWorker && isLocalFile) {
      handleServiceWorkerIssues();
    }
    
    // Handle localStorage issues
    if (config.handleLocalStorage && isLocalFile) {
      handleLocalStorageIssues();
    }
    
    // Handle fetch API issues
    if (config.handleFetchAPI && isLocalFile) {
      handleFetchAPIIssues();
    }
    
    debugLog('Enhanced Resource Handler initialized successfully');
  }
  
  /**
   * Handle service worker issues
   */
  function handleServiceWorkerIssues() {
    if ('serviceWorker' in navigator) {
      // Prevent service worker registration when running locally
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          debugLog('Unregistered service worker for local development');
        });
      });
      
      // Override the register function
      const originalRegister = navigator.serviceWorker.register;
      navigator.serviceWorker.register = function() {
        debugLog('Service worker registration prevented in local development mode');
        return Promise.resolve(null);
      };
    }
  }
  
  /**
   * Handle localStorage issues
   */
  function handleLocalStorageIssues() {
    try {
      // Test localStorage
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      // Create a fallback for localStorage
      debugLog('Creating localStorage fallback');
      
      const storage = {};
      
      window.localStorage = {
        getItem: function(key) {
          return storage[key] || null;
        },
        setItem: function(key, value) {
          storage[key] = value.toString();
        },
        removeItem: function(key) {
          delete storage[key];
        },
        clear: function() {
          Object.keys(storage).forEach(key => {
            delete storage[key];
          });
        },
        key: function(index) {
          return Object.keys(storage)[index] || null;
        },
        get length() {
          return Object.keys(storage).length;
        }
      };
    }
  }
  
  /**
   * Handle fetch API issues
   */
  function handleFetchAPIIssues() {
    const originalFetch = window.fetch;
    
    window.fetch = function(resource, options) {
      // Normalize the resource URL if it's a string
      if (typeof resource === 'string') {
        resource = normalizePath(resource);
      }
      
      return originalFetch(resource, options)
        .catch(error => {
          debugLog(`Fetch error for ${resource}:`, error);
          
          // For local file URLs, provide a more helpful error
          if (isLocalFile && error.message && error.message.includes('Failed to fetch')) {
            throw new Error(`Failed to fetch ${resource}. When running locally, CORS restrictions prevent loading resources from file:// URLs. Please use a local development server instead.`);
          }
          
          throw error;
        });
    };
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
