/**
 * @fileoverview DOM Manipulation Utilities
 * 
 * Consolidated DOM utility functions to eliminate duplication across the codebase.
 * Provides safe, consistent DOM manipulation with error handling and performance optimization.
 * 
 * @module domUtils
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

/**
 * Get an element by ID with error handling
 * 
 * Safely retrieves an element by ID with optional error handling.
 * Provides consistent error messaging and optional requirement validation.
 * 
 * @param {string} id - The ID of the element to get
 * @param {boolean} [required=false] - Whether the element is required (throws error if not found)
 * @returns {HTMLElement|null} The element or null if not found and not required
 * @throws {Error} When element is required but not found
 * @example
 * // Get optional element
 * const element = getById('my-element');
 * 
 * @example
 * // Get required element (throws if not found)
 * const element = getById('required-element', true);
 * 
 * @since 1.0.0
 */
export function getById(id, required = false) {
  const element = document.getElementById(id);
  if (!element && required) {
    const error = new Error(`Required element with ID "${id}" not found`);
    console.error(error.message);
    throw error;
  }
  return element;
}

/**
 * Query selector with error handling
 * 
 * Enhanced querySelector with error handling and optional parent context.
 * Provides consistent error messaging and requirement validation.
 * 
 * @param {string} selector - The CSS selector
 * @param {HTMLElement|Document} [parent=document] - The parent element to query within
 * @param {boolean} [required=false] - Whether the element is required
 * @returns {HTMLElement|null} The element or null if not found and not required
 * @throws {Error} When element is required but not found
 * @example
 * // Query optional element
 * const element = query('.my-class');
 * 
 * @example
 * // Query within parent with requirement
 * const element = query('.child', parentElement, true);
 * 
 * @since 1.0.0
 */
export function query(selector, parent = document, required = false) {
  const element = parent.querySelector(selector);
  if (!element && required) {
    const error = new Error(`Required element with selector "${selector}" not found`);
    console.error(error.message);
    throw error;
  }
  return element;
}

/**
 * Query all elements matching a selector
 * 
 * Enhanced querySelectorAll with optional parent context.
 * Always returns a NodeList, never null.
 * 
 * @param {string} selector - The CSS selector
 * @param {HTMLElement|Document} [parent=document] - The parent element to query within
 * @returns {NodeList} The matching elements (empty NodeList if none found)
 * @example
 * // Query all matching elements
 * const elements = queryAll('.my-class');
 * 
 * @example
 * // Query within parent
 * const elements = queryAll('.child', parentElement);
 * 
 * @since 1.0.0
 */
export function queryAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Create an element with attributes and children
 * 
 * Enhanced createElement that supports attributes, children, and event listeners
 * in a single call. Provides a more convenient API than native createElement.
 * 
 * @param {string} tag - The tag name
 * @param {object} [attributes={}] - The attributes to set
 * @param {Array|HTMLElement|string} [children=[]] - The children to append
 * @returns {HTMLElement} The created element
 * @example
 * // Create simple element
 * const div = createElement('div', { class: 'my-class' });
 * 
 * @example
 * // Create element with children
 * const button = createElement('button', 
 *   { class: 'btn', type: 'button' },
 *   ['Click me']
 * );
 * 
 * @since 1.0.0
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else if (key.startsWith('aria-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  
  // Append children
  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Add event listener with automatic cleanup
 * 
 * Enhanced addEventListener that returns a cleanup function.
 * Provides safe event handling with null checks and error handling.
 * 
 * @param {HTMLElement} element - The element to add the listener to
 * @param {string} event - The event name
 * @param {Function} callback - The callback function
 * @param {object} [options={}] - The event listener options
 * @returns {Function} A function to remove the event listener
 * @example
 * // Add event with cleanup
 * const cleanup = addEvent(button, 'click', handleClick);
 * 
 * @example
 * // Add event with options
 * const cleanup = addEvent(element, 'scroll', handleScroll, { passive: true });
 * 
 * @since 1.0.0
 */
export function addEvent(element, event, callback, options = {}) {
  if (!element) {
    console.warn(`Cannot add event listener: element is ${element}`);
    return () => {};
  }
  
  if (typeof callback !== 'function') {
    console.warn('Event callback must be a function');
    return () => {};
  }
  
  element.addEventListener(event, callback, options);
  
  return function cleanup() {
    element.removeEventListener(event, callback, options);
  };
}

/**
 * Check if an element is visible in the viewport
 * 
 * Determines if an element is currently visible in the viewport.
 * Useful for lazy loading and scroll-based animations.
 * 
 * @param {HTMLElement} element - The element to check
 * @param {number} [threshold=0] - Threshold for visibility (0-1)
 * @returns {boolean} Whether the element is visible
 * @example
 * // Check if element is visible
 * if (isElementVisible(element)) {
 *   // Element is in viewport
 * }
 * 
 * @example
 * // Check with threshold
 * if (isElementVisible(element, 0.5)) {
 *   // Element is at least 50% visible
 * }
 * 
 * @since 1.0.0
 */
export function isElementVisible(element, threshold = 0) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const verticalVisible = rect.top < windowHeight && rect.bottom > 0;
  const horizontalVisible = rect.left < windowWidth && rect.right > 0;
  
  if (threshold === 0) {
    return verticalVisible && horizontalVisible;
  }
  
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = rect.height * rect.width;
  
  return totalArea > 0 && (visibleArea / totalArea) >= threshold;
}

/**
 * Wait for an element to appear in the DOM
 * 
 * Polls for an element to appear in the DOM with a timeout.
 * Useful for waiting for dynamically created elements.
 * 
 * @param {string} selector - The CSS selector to wait for
 * @param {number} [timeout=5000] - Timeout in milliseconds
 * @param {HTMLElement|Document} [parent=document] - Parent element to search within
 * @returns {Promise<HTMLElement>} Promise that resolves with the element
 * @throws {Error} When timeout is reached
 * @example
 * // Wait for element to appear
 * try {
 *   const element = await waitForElement('.dynamic-content');
 *   // Element is now available
 * } catch (error) {
 *   console.error('Element did not appear:', error);
 * }
 * 
 * @since 1.0.0
 */
export function waitForElement(selector, timeout = 5000, parent = document) {
  return new Promise((resolve, reject) => {
    const element = parent.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = parent.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(parent, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Safely set innerHTML with script sanitization
 * 
 * Sets innerHTML while removing potentially dangerous script tags.
 * Provides basic XSS protection for dynamic content.
 * 
 * @param {HTMLElement} element - The element to update
 * @param {string} html - The HTML content to set
 * @returns {void}
 * @example
 * // Safely set HTML content
 * safeSetInnerHTML(element, '<p>Safe content</p>');
 * 
 * @since 1.0.0
 */
export function safeSetInnerHTML(element, html) {
  if (!element) {
    console.warn('Cannot set innerHTML: element is null');
    return;
  }
  
  // Remove script tags and event handlers
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
  
  element.innerHTML = sanitized;
}

/**
 * Get computed style property value
 * 
 * Safely gets a computed style property with fallback.
 * Handles browser compatibility and provides default values.
 * 
 * @param {HTMLElement} element - The element to get style from
 * @param {string} property - The CSS property name
 * @param {string} [defaultValue=''] - Default value if property not found
 * @returns {string} The computed style value
 * @example
 * // Get computed style
 * const color = getComputedStyleProperty(element, 'color');
 * 
 * @example
 * // Get with default
 * const width = getComputedStyleProperty(element, 'width', '100px');
 * 
 * @since 1.0.0
 */
export function getComputedStyleProperty(element, property, defaultValue = '') {
  if (!element) return defaultValue;
  
  try {
    const computed = window.getComputedStyle(element);
    return computed.getPropertyValue(property) || defaultValue;
  } catch (error) {
    console.warn(`Could not get computed style for ${property}:`, error);
    return defaultValue;
  }
}
