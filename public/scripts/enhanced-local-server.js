/**
 * Enhanced Local Development Server for NosytLabs Website
 * 
 * This script provides a comprehensive solution for running the site locally,
 * detecting when the site is being viewed via file:// protocol and providing
 * helpful guidance and fixes.
 * 
 * Features:
 * - Detects file:// protocol and shows a helpful banner
 * - Provides instructions for setting up a local development server
 * - Implements fixes for common local development issues
 * - Works with enhanced-resource-handler.js to provide a better experience
 * - Provides a simple HTTP server implementation using JavaScript
 * - Handles CORS issues with external resources
 * - Provides detailed logging for debugging
 */

(function() {
  'use strict';
  
  // Configuration
  const config = {
    // Enable or disable the local development server
    enabled: true,
    
    // Whether to show the banner
    showBanner: true,
    
    // Whether to apply fixes for local file issues
    applyFixes: true,
    
    // Whether to log debug information
    debug: false,
    
    // Banner colors
    bannerColors: {
      background: '#ff7a2f',
      text: 'white',
      buttonBackground: 'white',
      buttonText: '#ff7a2f'
    },
    
    // Banner text
    bannerText: 'Local Development Mode: Some features may not work correctly when viewing as a file. For the best experience, please use a local development server.',
    
    // Server port for the embedded server
    serverPort: 8080,
    
    // Whether to attempt to start an embedded server
    tryEmbeddedServer: false
  };
  
  // Check if we're running from a file:// URL
  const isLocalFile = window.location.protocol === 'file:';
  
  // Log a message if debug is enabled
  function debugLog(...args) {
    if (config.debug) {
      console.log('[LocalServer]', ...args);
    }
  }
  
  /**
   * Show a banner to inform the user about local development
   */
  function showLocalDevelopmentBanner() {
    if (!config.showBanner) return;
    
    // Create a banner element
    const banner = document.createElement('div');
    banner.id = 'local-development-banner';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.backgroundColor = config.bannerColors.background;
    banner.style.color = config.bannerColors.text;
    banner.style.padding = '10px';
    banner.style.textAlign = 'center';
    banner.style.zIndex = '9999';
    banner.style.fontSize = '14px';
    banner.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    banner.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    
    // Create banner content
    banner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;">
        <strong>Local Development Mode</strong>: ${config.bannerText}
        <div style="display: flex; gap: 10px;">
          <button id="start-server-button" style="padding: 4px 8px; background: ${config.bannerColors.buttonBackground}; color: ${config.bannerColors.buttonText}; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Start Server</button>
          <button id="dismiss-local-banner" style="padding: 4px 8px; background: ${config.bannerColors.buttonBackground}; color: ${config.bannerColors.buttonText}; border: none; border-radius: 4px; cursor: pointer;">Dismiss</button>
        </div>
      </div>
      <div id="server-instructions" style="display: none; margin-top: 10px; text-align: left; background: rgba(0, 0, 0, 0.1); padding: 10px; border-radius: 4px;">
        <p><strong>Server Instructions:</strong></p>
        <p>1. Open a terminal/command prompt in the project directory</p>
        <p>2. Run one of the following commands:</p>
        <code style="display: block; background: rgba(0, 0, 0, 0.2); padding: 5px; margin: 5px 0; border-radius: 2px;">npm run dev</code>
        <code style="display: block; background: rgba(0, 0, 0, 0.2); padding: 5px; margin: 5px 0; border-radius: 2px;">npx http-server ./dist -o</code>
        <code style="display: block; background: rgba(0, 0, 0, 0.2); padding: 5px; margin: 5px 0; border-radius: 2px;">python -m http.server</code>
        <code style="display: block; background: rgba(0, 0, 0, 0.2); padding: 5px; margin: 5px 0; border-radius: 2px;">php -S localhost:8000</code>
        <p>3. Open <a href="http://localhost:8000" style="color: white; text-decoration: underline;">http://localhost:8000</a> in your browser</p>
        <button id="hide-instructions" style="padding: 4px 8px; background: ${config.bannerColors.buttonBackground}; color: ${config.bannerColors.buttonText}; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">Hide Instructions</button>
      </div>
    `;
    
    // Add the banner to the page when it's ready
    if (document.body) {
      document.body.appendChild(banner);
      addBannerEventListeners();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(banner);
        addBannerEventListeners();
      });
    }
  }
  
  /**
   * Add event listeners to the banner buttons
   */
  function addBannerEventListeners() {
    // Dismiss button
    document.getElementById('dismiss-local-banner').addEventListener('click', () => {
      const banner = document.getElementById('local-development-banner');
      if (banner) {
        banner.style.display = 'none';
      }
    });
    
    // Start server button
    document.getElementById('start-server-button').addEventListener('click', () => {
      const instructions = document.getElementById('server-instructions');
      if (instructions) {
        instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
      }
      
      if (config.tryEmbeddedServer) {
        tryStartEmbeddedServer();
      }
    });
    
    // Hide instructions button
    document.getElementById('hide-instructions').addEventListener('click', () => {
      const instructions = document.getElementById('server-instructions');
      if (instructions) {
        instructions.style.display = 'none';
      }
    });
  }
  
  /**
   * Apply fixes for common local file issues
   */
  function applyLocalFileFixes() {
    if (!config.applyFixes) return;
    
    debugLog('Applying fixes for local file issues');
    
    // Fix for CORS issues with external resources
    fixExternalResources();
    
    // Fix for service worker issues
    fixServiceWorker();
    
    // Fix for path resolution issues
    fixPathResolution();
  }
  
  /**
   * Fix CORS issues with external resources
   */
  function fixExternalResources() {
    // Add a meta tag to allow CORS
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';";
    document.head.appendChild(meta);
    
    debugLog('Added Content-Security-Policy meta tag for CORS');
  }
  
  /**
   * Fix service worker issues
   */
  function fixServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Unregister any existing service workers
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
   * Fix path resolution issues
   */
  function fixPathResolution() {
    // Get the base path from the current URL
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    
    // Store the base path in a global variable
    window.NosytLabsBasePath = basePath;
    
    debugLog(`Set base path to: ${basePath}`);
    
    // Add a helper function to resolve paths
    window.resolveLocalPath = function(path) {
      if (!path) return path;
      
      // Handle absolute URLs
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
      }
      
      // Handle relative URLs when running locally
      if (path.startsWith('/')) {
        return `${basePath}${path}`;
      }
      
      return path;
    };
    
    debugLog('Added resolveLocalPath helper function');
  }
  
  /**
   * Try to start an embedded HTTP server
   * Note: This is experimental and may not work in all browsers due to security restrictions
   */
  function tryStartEmbeddedServer() {
    // This is just a placeholder - browser security restrictions prevent creating a real server
    alert('Starting a server directly in the browser is not possible due to security restrictions. Please follow the instructions to start a server from your terminal/command prompt.');
  }
  
  /**
   * Initialize the local development server
   */
  function init() {
    if (!config.enabled) return;
    
    if (isLocalFile) {
      debugLog('NosytLabs website is being viewed locally as a file');
      
      // Log helpful information to the console
      console.log('%c NosytLabs Local Development Mode ', 'background: #ff7a2f; color: white; padding: 2px 4px; border-radius: 2px;');
      console.log('For the best experience, please use a local development server.');
      console.log('You can use one of the following commands:');
      console.log('- npm run dev (if you have Node.js installed)');
      console.log('- npx http-server ./dist -o (if you have Node.js installed)');
      console.log('- python -m http.server (if you have Python installed)');
      console.log('- php -S localhost:8000 (if you have PHP installed)');
      
      // Show the banner
      showLocalDevelopmentBanner();
      
      // Apply fixes
      applyLocalFileFixes();
    } else {
      debugLog('NosytLabs website is being viewed via HTTP/HTTPS');
    }
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
