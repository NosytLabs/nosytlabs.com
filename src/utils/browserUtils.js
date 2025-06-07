/**
 * @fileoverview Browser Detection and Capability Utilities
 * 
 * Consolidated browser detection and capability checking functions.
 * Provides consistent browser feature detection and user preference handling.
 * 
 * @module browserUtils
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

/**
 * Check if the user prefers reduced motion
 * 
 * Detects if the user has enabled reduced motion preferences.
 * Used to disable or reduce animations for accessibility.
 * 
 * @returns {boolean} Whether reduced motion is preferred
 * @example
 * if (prefersReducedMotion()) {
 *   // Skip animations
 * }
 * 
 * @since 1.0.0
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers dark color scheme
 * 
 * Detects if the user has enabled dark mode preferences.
 * Used for automatic theme switching.
 * 
 * @returns {boolean} Whether dark mode is preferred
 * @example
 * if (prefersDarkMode()) {
 *   document.body.classList.add('dark-theme');
 * }
 * 
 * @since 1.0.0
 */
export function prefersDarkMode() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if the device is a mobile device
 * 
 * Detects mobile devices based on user agent string.
 * Includes phones and tablets.
 * 
 * @returns {boolean} Whether the device is mobile
 * @example
 * if (isMobile()) {
 *   // Apply mobile-specific behavior
 * }
 * 
 * @since 1.0.0
 */
export function isMobile() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if the device is a touch device
 * 
 * Detects touch capability using multiple methods for better accuracy.
 * 
 * @returns {boolean} Whether the device supports touch
 * @example
 * if (isTouch()) {
 *   // Enable touch-specific interactions
 * }
 * 
 * @since 1.0.0
 */
export function isTouch() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         navigator.msMaxTouchPoints > 0;
}

/**
 * Check if the device is a tablet
 * 
 * Detects tablet devices based on user agent and screen size.
 * 
 * @returns {boolean} Whether the device is a tablet
 * @example
 * if (isTablet()) {
 *   // Apply tablet-specific layout
 * }
 * 
 * @since 1.0.0
 */
export function isTablet() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent;
  const isTabletUA = /iPad|Android(?!.*Mobile)|Tablet|PlayBook|Silk/i.test(userAgent);
  
  // Also check screen size for better detection
  const hasTabletScreenSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
  
  return isTabletUA || (isTouch() && hasTabletScreenSize);
}

/**
 * Get the browser name and version
 * 
 * Detects the browser name and version from user agent.
 * Returns standardized browser information.
 * 
 * @returns {object} Browser information object
 * @example
 * const { name, version } = getBrowserInfo();
 * console.log(`Browser: ${name} ${version}`);
 * 
 * @since 1.0.0
 */
export function getBrowserInfo() {
  if (typeof navigator === 'undefined') {
    return { name: 'Unknown', version: 'Unknown' };
  }
  
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  
  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  // Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  // Internet Explorer
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    name = 'Internet Explorer';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  
  return { name, version };
}

/**
 * Check if the browser supports a specific feature
 * 
 * Tests for browser feature support using feature detection.
 * More reliable than user agent sniffing.
 * 
 * @param {string} feature - The feature to test for
 * @returns {boolean} Whether the feature is supported
 * @example
 * if (supportsFeature('webp')) {
 *   // Use WebP images
 * }
 * 
 * @example
 * if (supportsFeature('serviceWorker')) {
 *   // Register service worker
 * }
 * 
 * @since 1.0.0
 */
export function supportsFeature(feature) {
  if (typeof window === 'undefined') {
    return false;
  }
  
  switch (feature.toLowerCase()) {
    case 'webp':
      return supportsWebP();
    case 'avif':
      return supportsAVIF();
    case 'serviceworker':
      return 'serviceWorker' in navigator;
    case 'intersectionobserver':
      return 'IntersectionObserver' in window;
    case 'mutationobserver':
      return 'MutationObserver' in window;
    case 'resizeobserver':
      return 'ResizeObserver' in window;
    case 'webgl':
      return supportsWebGL();
    case 'webgl2':
      return supportsWebGL2();
    case 'localstorage':
      return supportsLocalStorage();
    case 'sessionstorage':
      return supportsSessionStorage();
    case 'indexeddb':
      return 'indexedDB' in window;
    case 'fetch':
      return 'fetch' in window;
    case 'promises':
      return 'Promise' in window;
    case 'modules':
      return supportsESModules();
    default:
      return false;
  }
}

/**
 * Check WebP image format support
 * 
 * @returns {boolean} Whether WebP is supported
 * @example
 * if (supportsWebP()) {
 *   // Use WebP images
 * }
 * 
 * @since 1.0.0
 */
function supportsWebP() {
  if (typeof document === 'undefined') {
    return false;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Check AVIF image format support
 * 
 * @returns {boolean} Whether AVIF is supported
 * @example
 * if (supportsAVIF()) {
 *   // Use AVIF images
 * }
 * 
 * @since 1.0.0
 */
function supportsAVIF() {
  if (typeof document === 'undefined') {
    return false;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

/**
 * Check WebGL support
 * 
 * @returns {boolean} Whether WebGL is supported
 * @example
 * if (supportsWebGL()) {
 *   // Initialize WebGL context
 * }
 * 
 * @since 1.0.0
 */
function supportsWebGL() {
  if (typeof document === 'undefined') {
    return false;
  }
  
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (error) {
    return false;
  }
}

/**
 * Check WebGL 2 support
 * 
 * @returns {boolean} Whether WebGL 2 is supported
 * @example
 * if (supportsWebGL2()) {
 *   // Use WebGL 2 features
 * }
 * 
 * @since 1.0.0
 */
function supportsWebGL2() {
  if (typeof document === 'undefined') {
    return false;
  }
  
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch (error) {
    return false;
  }
}

/**
 * Check localStorage support
 * 
 * @returns {boolean} Whether localStorage is supported and available
 * @example
 * if (supportsLocalStorage()) {
 *   localStorage.setItem('key', 'value');
 * }
 * 
 * @since 1.0.0
 */
function supportsLocalStorage() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check sessionStorage support
 * 
 * @returns {boolean} Whether sessionStorage is supported and available
 * @example
 * if (supportsSessionStorage()) {
 *   sessionStorage.setItem('key', 'value');
 * }
 * 
 * @since 1.0.0
 */
function supportsSessionStorage() {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check ES modules support
 * 
 * @returns {boolean} Whether ES modules are supported
 * @example
 * if (supportsESModules()) {
 *   // Use ES module imports
 * }
 * 
 * @since 1.0.0
 */
function supportsESModules() {
  if (typeof document === 'undefined') {
    return false;
  }
  
  const script = document.createElement('script');
  return 'noModule' in script;
}

/**
 * Get device pixel ratio
 * 
 * Returns the device pixel ratio for high-DPI display detection.
 * 
 * @returns {number} Device pixel ratio
 * @example
 * const ratio = getDevicePixelRatio();
 * if (ratio > 1) {
 *   // Use high-resolution images
 * }
 * 
 * @since 1.0.0
 */
export function getDevicePixelRatio() {
  if (typeof window === 'undefined') {
    return 1;
  }
  
  return window.devicePixelRatio || 1;
}

/**
 * Get viewport dimensions
 * 
 * Returns the current viewport width and height.
 * 
 * @returns {object} Viewport dimensions object
 * @example
 * const { width, height } = getViewportDimensions();
 * console.log(`Viewport: ${width}x${height}`);
 * 
 * @since 1.0.0
 */
export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth || document.documentElement.clientWidth || 0,
    height: window.innerHeight || document.documentElement.clientHeight || 0
  };
}

/**
 * Check if the browser is online
 * 
 * Returns the current online status of the browser.
 * 
 * @returns {boolean} Whether the browser is online
 * @example
 * if (isOnline()) {
 *   // Make network requests
 * }
 * 
 * @since 1.0.0
 */
export function isOnline() {
  if (typeof navigator === 'undefined') {
    return true; // Assume online if we can't detect
  }
  
  return navigator.onLine;
}
