/**
 * Resource Loader Script
 * 
 * This script handles resource loading, error recovery, and performance optimization.
 * It ensures that critical resources are loaded properly and provides fallbacks when needed.
 * 
 * Features:
 * - Monitors resource loading errors
 * - Provides fallbacks for critical resources
 * - Optimizes loading performance
 * - Handles preload warnings
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize resource loader
  initResourceLoader();
  
  // Log initialization
  console.log('Resource loader initialized');
});

/**
 * Initialize the resource loader
 */
function initResourceLoader() {
  // Monitor for resource loading errors
  monitorResourceErrors();
  
  // Handle preloaded resources
  handlePreloadedResources();
  
  // Optimize image loading
  optimizeImageLoading();
}

/**
 * Monitor for resource loading errors
 */
function monitorResourceErrors() {
  // Listen for error events on the window
  window.addEventListener('error', function(event) {
    // Check if the error is related to resource loading
    if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK' || event.target.tagName === 'IMG')) {
      const resource = event.target.src || event.target.href;
      
      // Log the error
      console.warn(`Failed to load resource: ${resource}`);
      
      // Handle specific resource types
      if (event.target.tagName === 'SCRIPT') {
        handleScriptLoadError(event.target);
      } else if (event.target.tagName === 'LINK' && event.target.rel === 'stylesheet') {
        handleStylesheetLoadError(event.target);
      } else if (event.target.tagName === 'IMG') {
        handleImageLoadError(event.target);
      }
    }
  }, true);
}

/**
 * Handle script loading errors
 * @param {HTMLScriptElement} scriptElement - The script element that failed to load
 */
function handleScriptLoadError(scriptElement) {
  const src = scriptElement.src;
  
  // Check if it's a critical script
  if (src.includes('particles.min.js')) {
    // Try to load from a CDN as fallback
    const fallbackSrc = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    
    // Create a new script element
    const fallbackScript = document.createElement('script');
    fallbackScript.src = fallbackSrc;
    fallbackScript.async = true;
    
    // Add to document
    document.head.appendChild(fallbackScript);
    
    console.log(`Attempting to load particles.js from fallback source: ${fallbackSrc}`);
  }
}

/**
 * Handle stylesheet loading errors
 * @param {HTMLLinkElement} linkElement - The link element that failed to load
 */
function handleStylesheetLoadError(linkElement) {
  const href = linkElement.href;
  
  // Check if it's a critical stylesheet
  if (href.includes('consolidated-styles.css')) {
    // Create inline fallback styles for critical UI elements
    const fallbackStyles = document.createElement('style');
    fallbackStyles.textContent = `
      :root {
        --nosyt-purple-main: #4C1D95;
        --nosyt-orange-main: #FF6B00;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
        padding: 0;
        color: #111827;
        background-color: #f9fafb;
      }
      .dark {
        color: #f9fafb;
        background-color: #111827;
      }
      a {
        color: var(--nosyt-purple-main);
        text-decoration: none;
      }
      .dark a {
        color: #8B5CF6;
      }
    `;
    
    // Add to document
    document.head.appendChild(fallbackStyles);
    
    console.log('Applied fallback styles for critical UI elements');
  }
}

/**
 * Handle image loading errors
 * @param {HTMLImageElement} imgElement - The image element that failed to load
 */
function handleImageLoadError(imgElement) {
  // Set a fallback image or hide the element
  if (imgElement.alt) {
    // Create a placeholder with the alt text
    imgElement.style.display = 'flex';
    imgElement.style.alignItems = 'center';
    imgElement.style.justifyContent = 'center';
    imgElement.style.backgroundColor = '#f3f4f6';
    imgElement.style.color = '#4b5563';
    imgElement.style.padding = '1rem';
    imgElement.style.borderRadius = '0.25rem';
    imgElement.style.fontStyle = 'italic';
    
    // Create a wrapper to hold the alt text
    const wrapper = document.createElement('div');
    wrapper.textContent = imgElement.alt;
    imgElement.parentNode.insertBefore(wrapper, imgElement.nextSibling);
  } else {
    // Hide the image if no alt text is available
    imgElement.style.display = 'none';
  }
}

/**
 * Handle preloaded resources to prevent warnings
 */
function handlePreloadedResources() {
  // Get all preloaded resources
  const preloads = document.querySelectorAll('link[rel="preload"]');
  
  // Check each preloaded resource
  preloads.forEach(preload => {
    const href = preload.href;
    const as = preload.getAttribute('as');
    
    // Ensure the resource is actually used
    if (as === 'style') {
      // Check if there's a corresponding stylesheet link
      const stylesheetExists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some(link => link.href === href);
      
      // If not, create one
      if (!stylesheetExists) {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = href;
        document.head.appendChild(stylesheet);
      }
    } else if (as === 'script') {
      // Check if there's a corresponding script tag
      const scriptExists = Array.from(document.querySelectorAll('script'))
        .some(script => script.src === href);
      
      // If not, create one
      if (!scriptExists) {
        const script = document.createElement('script');
        script.src = href;
        script.async = true;
        document.head.appendChild(script);
      }
    }
  });
}

/**
 * Optimize image loading
 */
function optimizeImageLoading() {
  // Use Intersection Observer to lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
}
