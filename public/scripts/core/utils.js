/**
 * utils.js
 * Core utility functions for the NosytLabs website
 * 
 * This file contains common utility functions used throughout the website.
 * It provides a centralized location for shared functionality to avoid code duplication.
 */

/**
 * Utility namespace to avoid global scope pollution
 */
const NosytUtils = {
  /**
   * DOM manipulation utilities
   */
  dom: {
    /**
     * Get an element by ID with error handling
     * @param {string} id - The ID of the element to get
     * @param {boolean} required - Whether the element is required (throws error if not found)
     * @returns {HTMLElement|null} - The element or null if not found and not required
     */
    getById: function(id, required = false) {
      const element = document.getElementById(id);
      if (!element && required) {
        console.error(`Required element with ID "${id}" not found`);
        throw new Error(`Required element with ID "${id}" not found`);
      }
      return element;
    },

    /**
     * Query selector with error handling
     * @param {string} selector - The CSS selector
     * @param {HTMLElement|Document} parent - The parent element to query within
     * @param {boolean} required - Whether the element is required
     * @returns {HTMLElement|null} - The element or null if not found and not required
     */
    query: function(selector, parent = document, required = false) {
      const element = parent.querySelector(selector);
      if (!element && required) {
        console.error(`Required element with selector "${selector}" not found`);
        throw new Error(`Required element with selector "${selector}" not found`);
      }
      return element;
    },

    /**
     * Query all elements matching a selector with error handling
     * @param {string} selector - The CSS selector
     * @param {HTMLElement|Document} parent - The parent element to query within
     * @returns {NodeList} - The matching elements
     */
    queryAll: function(selector, parent = document) {
      return parent.querySelectorAll(selector);
    },

    /**
     * Create an element with attributes and children
     * @param {string} tag - The tag name
     * @param {Object} attributes - The attributes to set
     * @param {Array|HTMLElement|string} children - The children to append
     * @returns {HTMLElement} - The created element
     */
    createElement: function(tag, attributes = {}, children = []) {
      const element = document.createElement(tag);
      
      // Set attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
          Object.entries(value).forEach(([prop, val]) => {
            element.style[prop] = val;
          });
        } else if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.substring(2).toLowerCase();
          element.addEventListener(eventName, value);
        } else {
          element.setAttribute(key, value);
        }
      });
      
      // Append children
      if (children) {
        if (!Array.isArray(children)) {
          children = [children];
        }
        
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            element.appendChild(child);
          }
        });
      }
      
      return element;
    },

    /**
     * Add event listener with automatic cleanup
     * @param {HTMLElement} element - The element to add the listener to
     * @param {string} event - The event name
     * @param {Function} callback - The callback function
     * @param {Object} options - The event listener options
     * @returns {Function} - A function to remove the event listener
     */
    addEvent: function(element, event, callback, options = {}) {
      if (!element) {
        console.warn(`Cannot add event listener: element is ${element}`);
        return () => {};
      }
      
      element.addEventListener(event, callback, options);
      
      return function cleanup() {
        element.removeEventListener(event, callback, options);
      };
    }
  },

  /**
   * Browser and device detection utilities
   */
  browser: {
    /**
     * Check if the user prefers reduced motion
     * @returns {boolean} - Whether reduced motion is preferred
     */
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Check if the device is a mobile device
     * @returns {boolean} - Whether the device is mobile
     */
    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if the device is a touch device
     * @returns {boolean} - Whether the device is a touch device
     */
    isTouch: function() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get the browser name and version
     * @returns {Object} - The browser name and version
     */
    getBrowser: function() {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = 'Unknown';
      
      // Detect browser
      if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/([0-9.]+)/)[1];
      } else if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/([0-9.]+)/)[1];
      } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        version = ua.match(/Version\/([0-9.]+)/)[1];
      } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        version = ua.match(/Edge\/([0-9.]+)/)[1];
      } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
        browser = 'Internet Explorer';
        version = ua.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
      }
      
      return { browser, version };
    }
  },

  /**
   * Performance utilities
   */
  performance: {
    /**
     * Debounce a function
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce wait time in milliseconds
     * @returns {Function} - The debounced function
     */
    debounce: function(func, wait = 100) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    /**
     * Throttle a function
     * @param {Function} func - The function to throttle
     * @param {number} limit - The throttle limit in milliseconds
     * @returns {Function} - The throttled function
     */
    throttle: function(func, limit = 100) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Measure execution time of a function
     * @param {Function} func - The function to measure
     * @param {Array} args - The arguments to pass to the function
     * @returns {Object} - The result and execution time
     */
    measureTime: function(func, ...args) {
      const start = performance.now();
      const result = func(...args);
      const end = performance.now();
      return {
        result,
        time: end - start
      };
    }
  },

  /**
   * Error handling utilities
   */
  error: {
    /**
     * Handle an error with logging and optional reporting
     * @param {Error} error - The error to handle
     * @param {string} context - The context where the error occurred
     * @param {boolean} report - Whether to report the error
     */
    handle: function(error, context = 'Unknown', report = true) {
      console.error(`Error in ${context}:`, error);
      
      if (report && typeof window.reportError === 'function') {
        window.reportError(error, context);
      }
    },

    /**
     * Try to execute a function and handle any errors
     * @param {Function} func - The function to execute
     * @param {string} context - The context for error handling
     * @param {boolean} report - Whether to report errors
     * @returns {any} - The result of the function or undefined on error
     */
    try: function(func, context = 'Unknown', report = true) {
      try {
        return func();
      } catch (error) {
        this.handle(error, context, report);
        return undefined;
      }
    }
  }
};

// Export the utilities
window.NosytUtils = NosytUtils;
export default NosytUtils;
