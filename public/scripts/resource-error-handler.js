/**
 * Resource Error Handler
 *
 * This script handles resource loading errors gracefully, providing fallbacks
 * and preventing console errors from affecting the user experience.
 *
 * It's particularly useful when viewing the site locally as a file (file:///)
 * where browsers have security restrictions that prevent loading resources.
 */

(function() {
  // Configuration
  const config = {
    // Default image to use when an image fails to load
    defaultImage: '/images/placeholder.svg',

    // Default CSS to apply when a stylesheet fails to load
    defaultCSS: `
      :root {
        --nosyt-primary: #ff6b00;
        --nosyt-secondary: #0078d7;
        --nosyt-accent: #00c853;
        --nosyt-dark: #1a1a1a;
        --nosyt-light: #f5f5f5;
        --nosyt-gray: #757575;
      }

      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.5;
        color: var(--nosyt-dark);
        background-color: var(--nosyt-light);
      }

      a {
        color: var(--nosyt-secondary);
        text-decoration: none;
      }

      a:hover {
        color: var(--nosyt-primary);
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
    logErrors: false
  };

  // Keep track of resources that have been handled
  const handledResources = new Set();

  /**
   * Handle image loading errors
   */
  function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        applyImageFallback(img);
      }

      img.addEventListener('error', () => {
        applyImageFallback(img);
      });
    });
  }

  /**
   * Apply fallback for an image
   * @param {HTMLImageElement} img - The image element
   */
  function applyImageFallback(img) {
    if (handledResources.has(img.src)) return;

    // Save original source for potential retry
    const originalSrc = img.src;

    // Check if the image is from the win95 folder
    if (originalSrc.includes('/win95/')) {
      // For Windows 95 interface images, use specific fallbacks
      if (originalSrc.includes('notepad.png')) {
        img.src = '/images/win95/notepad-fallback.png';
      } else if (originalSrc.includes('duck-hunt.png')) {
        img.src = '/images/win95/duck-hunt-fallback.png';
      } else if (originalSrc.includes('clippy.png')) {
        img.src = '/images/win95/clippy-fallback.png';
      } else if (originalSrc.includes('doom.png')) {
        img.src = '/images/win95/doom-fallback.png';
      } else if (originalSrc.includes('terminal.png')) {
        img.src = '/images/win95/terminal-fallback.png';
      } else if (originalSrc.includes('browser.png')) {
        img.src = '/images/win95/browser-fallback.png';
      } else if (originalSrc.includes('my-computer.png')) {
        img.src = '/images/win95/my-computer-fallback.png';
      } else if (originalSrc.includes('help.png')) {
        img.src = '/images/win95/help-fallback.png';
      } else if (originalSrc.includes('exit.png')) {
        img.src = '/images/win95/shutdown.png';
      } else {
        // Apply general fallback for other win95 images
        img.src = '/images/win95/icon-fallback.png';
      }
    } else {
      // Apply fallback based on attributes
      if (img.hasAttribute('data-fallback')) {
        img.src = img.getAttribute('data-fallback');
      } else {
        img.src = config.defaultImage;
      }
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
      fallbackScript.src = script.getAttribute('data-fallback');
      script.parentNode.insertBefore(fallbackScript, script.nextSibling);
    }
  }

  /**
   * Handle iframe loading errors
   */
  function handleIframeErrors() {
    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.addEventListener('error', () => {
        applyIframeFallback(iframe);
      });
    });
  }

  /**
   * Apply fallback for an iframe
   * @param {HTMLIFrameElement} iframe - The iframe element
   */
  function applyIframeFallback(iframe) {
    if (handledResources.has(iframe.src)) return;

    // Add to handled resources
    handledResources.add(iframe.src);

    // Log error if enabled
    if (config.logErrors) {
      console.warn(`Iframe failed to load: ${iframe.src}`);
    }

    // Check if there's a fallback content
    if (iframe.hasAttribute('data-fallback-content')) {
      const fallbackContent = iframe.getAttribute('data-fallback-content');
      const fallbackDiv = document.createElement('div');
      fallbackDiv.innerHTML = fallbackContent;
      fallbackDiv.className = 'iframe-fallback';
      iframe.parentNode.insertBefore(fallbackDiv, iframe);
      iframe.style.display = 'none';
    }
  }

  /**
   * Initialize the resource error handler
   */
  function init() {
    // Handle existing resources
    handleImageErrors();
    handleStylesheetErrors();
    handleScriptErrors();
    handleIframeErrors();

    // Handle resources added dynamically
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'IMG') {
              applyImageFallback(node);
            } else if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
              applyStylesheetFallback(node);
            } else if (node.tagName === 'SCRIPT' && node.src) {
              applyScriptFallback(node);
            } else if (node.tagName === 'IFRAME') {
              applyIframeFallback(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Suppress console errors
    if (!config.logErrors) {
      const originalConsoleError = console.error;
      console.error = function(...args) {
        if (args[0] && typeof args[0] === 'string' &&
            (args[0].includes('Failed to load resource') ||
             args[0].includes('Cross-Origin Request Blocked'))) {
          // Suppress the error
          return;
        }
        originalConsoleError.apply(console, args);
      };
    }
  }

  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
