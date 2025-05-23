/**
 * Local Development Server
 * 
 * This script detects if the site is being viewed locally as a file (file:///)
 * and provides a message to the user about how to properly view the site.
 * 
 * It also attempts to provide fallbacks for common issues when viewing locally.
 */

(function() {
  // Check if we're running from a file:// URL
  const isLocalFile = window.location.protocol === 'file:';
  
  if (isLocalFile) {
    console.log('NosytLabs website is being viewed locally as a file.');
    console.log('For the best experience, please use a local development server.');
    console.log('You can use one of the following commands:');
    console.log('- npm run dev (if you have Node.js installed)');
    console.log('- python -m http.server (if you have Python installed)');
    console.log('- php -S localhost:8000 (if you have PHP installed)');
    
    // Create a banner to inform the user
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.backgroundColor = '#ff6b00';
    banner.style.color = 'white';
    banner.style.padding = '10px';
    banner.style.textAlign = 'center';
    banner.style.zIndex = '9999';
    banner.style.fontSize = '14px';
    banner.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    banner.innerHTML = `
      <strong>Local Development Mode</strong>: Some features may not work correctly when viewing as a file.
      For the best experience, please use a local development server.
      <button id="dismiss-local-banner" style="margin-left: 10px; padding: 2px 8px; background: white; color: #ff6b00; border: none; border-radius: 4px; cursor: pointer;">Dismiss</button>
    `;
    
    // Add the banner to the page when it's ready
    if (document.body) {
      document.body.appendChild(banner);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(banner);
      });
    }
    
    // Add event listener to dismiss button
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'dismiss-local-banner') {
        banner.style.display = 'none';
      }
    });
    
    // Apply fixes for common local file issues
    applyLocalFileFixes();
  }
  
  /**
   * Apply fixes for common issues when viewing the site locally
   */
  function applyLocalFileFixes() {
    // Fix for CORS issues with external resources
    fixExternalResources();
    
    // Fix for local storage issues
    fixLocalStorage();
    
    // Fix for service worker issues
    fixServiceWorker();
  }
  
  /**
   * Fix CORS issues with external resources
   */
  function fixExternalResources() {
    // Proxy external resources through a CORS proxy if needed
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    
    // Fix external stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href.startsWith('http') && !link.href.includes('localhost')) {
        const originalHref = link.href;
        
        // Create a new link element with the proxied URL
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = corsProxy + originalHref;
        
        // Replace the original link
        link.parentNode.replaceChild(newLink, link);
        
        console.log(`Fixed CORS for stylesheet: ${originalHref}`);
      }
    });
    
    // Fix external scripts
    document.querySelectorAll('script[src]').forEach(script => {
      if (script.src.startsWith('http') && !script.src.includes('localhost')) {
        const originalSrc = script.src;
        
        // Skip certain scripts that won't work with a proxy
        if (originalSrc.includes('google-analytics') || 
            originalSrc.includes('googletagmanager') ||
            originalSrc.includes('instant.page')) {
          return;
        }
        
        // Create a new script element with the proxied URL
        const newScript = document.createElement('script');
        newScript.src = corsProxy + originalSrc;
        if (script.async) newScript.async = true;
        if (script.defer) newScript.defer = true;
        
        // Replace the original script
        script.parentNode.replaceChild(newScript, script);
        
        console.log(`Fixed CORS for script: ${originalSrc}`);
      }
    });
    
    // Fix external images
    document.querySelectorAll('img').forEach(img => {
      if (img.src.startsWith('http') && !img.src.includes('localhost')) {
        const originalSrc = img.src;
        
        // Add a data attribute to store the original source
        img.setAttribute('data-original-src', originalSrc);
        
        // Only proxy the image if it fails to load
        img.addEventListener('error', () => {
          img.src = corsProxy + originalSrc;
          console.log(`Fixed CORS for image: ${originalSrc}`);
        });
      }
    });
  }
  
  /**
   * Fix local storage issues
   */
  function fixLocalStorage() {
    // Create a fallback for localStorage
    if (!window.localStorage) {
      console.log('Creating localStorage fallback');
      
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
   * Fix service worker issues
   */
  function fixServiceWorker() {
    // Prevent service worker registration when running locally
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('Unregistered service worker for local development');
        });
      });
      
      // Override the register function
      const originalRegister = navigator.serviceWorker.register;
      navigator.serviceWorker.register = function() {
        console.log('Service worker registration prevented in local development mode');
        return Promise.resolve(null);
      };
    }
  }
})();
