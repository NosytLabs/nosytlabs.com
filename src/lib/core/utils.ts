/**
 * Core Utility Functions
 * 
 * Consolidated utility functions for common operations including string manipulation,
 * number formatting, browser detection, and ID generation.
 * 
 * @module core/utils
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ========================================
// CSS CLASS UTILITIES
// ========================================

/**
 * Utility function for combining Tailwind CSS classes.
 * Uses clsx for conditional classes and twMerge for deduplication.
 * 
 * @param inputs - Class values to combine
 * @returns Combined and deduplicated class string
 * 
 * @example
 * ```typescript
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'text-white')
 * // Returns: 'px-4 py-2 bg-blue-500 text-white'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ========================================
// NUMBER UTILITIES
// ========================================

/**
 * Clamps a number between minimum and maximum values.
 * 
 * @param value - The number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 * 
 * @example
 * ```typescript
 * clamp(150, 0, 100) // Returns: 100
 * clamp(-10, 0, 100) // Returns: 0
 * clamp(50, 0, 100)  // Returns: 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a byte count into a human-readable file size string.
 * 
 * @param bytes - Number of bytes to format
 * @returns Formatted file size string (e.g., "1.5 MB")
 * 
 * @example
 * ```typescript
 * formatFileSize(0)          // Returns: '0 Bytes'
 * formatFileSize(1024)       // Returns: '1 KB'
 * formatFileSize(1536000)    // Returns: '1.46 MB'
 * formatFileSize(1073741824) // Returns: '1 GB'
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ========================================
// STRING UTILITIES
// ========================================

/**
 * Capitalizes the first letter of a string and lowercases the rest.
 * 
 * @param str - The string to capitalize
 * @returns The capitalized string
 * 
 * @example
 * ```typescript
 * capitalize('hello world') // Returns: 'Hello world'
 * capitalize('HELLO')       // Returns: 'Hello'
 * capitalize('h')           // Returns: 'H'
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to kebab-case format.
 * 
 * @param str - The string to convert
 * @returns The kebab-cased string
 * 
 * @example
 * ```typescript
 * toKebabCase('HelloWorld')      // Returns: 'hello-world'
 * toKebabCase('hello_world')     // Returns: 'hello-world'
 * toKebabCase('hello world')     // Returns: 'hello-world'
 * toKebabCase('helloWorld123')   // Returns: 'hello-world123'
 * ```
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to camelCase format.
 * 
 * @param str - The string to convert
 * @returns The camelCased string
 * 
 * @example
 * ```typescript
 * toCamelCase('hello-world')     // Returns: 'helloWorld'
 * toCamelCase('hello_world')     // Returns: 'helloWorld'
 * toCamelCase('hello world')     // Returns: 'helloWorld'
 * toCamelCase('HelloWorld')      // Returns: 'helloWorld'
 * ```
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Converts a string to PascalCase format.
 * 
 * @param str - The string to convert
 * @returns The PascalCased string
 * 
 * @example
 * ```typescript
 * toPascalCase('hello-world')    // Returns: 'HelloWorld'
 * toPascalCase('hello_world')    // Returns: 'HelloWorld'
 * toPascalCase('hello world')    // Returns: 'HelloWorld'
 * ```
 */
export function toPascalCase(str: string): string {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed.
 * 
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns The truncated string
 * 
 * @example
 * ```typescript
 * truncate('Hello World', 5)           // Returns: 'Hello...'
 * truncate('Hello', 10)                // Returns: 'Hello'
 * truncate('Hello World', 8, '…')      // Returns: 'Hello Wo…'
 * ```
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// ========================================
// BROWSER UTILITIES
// ========================================

/**
 * Checks if code is running in a browser environment.
 * 
 * @returns True if running in browser, false otherwise
 * 
 * @example
 * ```typescript
 * if (isBrowser()) {
 *   // Safe to use window, document, etc.
 *   console.log(window.location.href);
 * }
 * ```
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Generates a random unique ID with an optional prefix.
 * 
 * @param prefix - Optional prefix for the ID (default: 'id')
 * @returns A unique ID string
 * 
 * @example
 * ```typescript
 * generateId()           // Returns: 'id-a1b2c3d4e'
 * generateId('user')     // Returns: 'user-x9y8z7w6v'
 * generateId('product')  // Returns: 'product-m5n4o3p2q'
 * ```
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

// ========================================
// OBJECT UTILITIES
// ========================================

/**
 * Creates a deep clone of an object.
 * 
 * @param obj - The object to clone
 * @returns A deep clone of the object
 * 
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // Still 2
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Deep merges multiple objects into a single object.
 * Later objects override earlier ones.
 * 
 * @param objects - Objects to merge
 * @returns Merged object
 * 
 * @example
 * ```typescript
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * deepMerge(obj1, obj2); // Returns: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
export function deepMerge<T>(...objects: Partial<T>[]): T {
  const result = {} as T;
  
  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = deepMerge(result[key] || {} as T[Extract<keyof T, string>], value);
        } else {
          result[key] = value as T[Extract<keyof T, string>];
        }
      }
    }
  }
  
  return result;
}

/**
 * Picks specified properties from an object.
 * 
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only the specified keys
 * 
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * pick(obj, ['a', 'c']); // Returns: { a: 1, c: 3 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits specified properties from an object.
 * 
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without the specified keys
 * 
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * omit(obj, ['b']); // Returns: { a: 1, c: 3 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

// ========================================
// ARRAY UTILITIES
// ========================================

/**
 * Returns an array with only unique values.
 * 
 * @param array - Array to filter
 * @returns Array with unique values
 * 
 * @example
 * ```typescript
 * unique([1, 2, 2, 3, 3, 3]); // Returns: [1, 2, 3]
 * unique(['a', 'b', 'a', 'c']); // Returns: ['a', 'b', 'c']
 * ```
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Splits an array into chunks of specified size.
 * 
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 * 
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2); // Returns: [[1, 2], [3, 4], [5]]
 * chunk(['a', 'b', 'c'], 2); // Returns: [['a', 'b'], ['c']]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffles an array randomly (Fisher-Yates algorithm).
 * 
 * @param array - Array to shuffle
 * @returns New shuffled array
 * 
 * @example
 * ```typescript
 * shuffle([1, 2, 3, 4, 5]); // Returns: [3, 1, 5, 2, 4] (random order)
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ========================================
// DELAY UTILITIES
// ========================================

/**
 * Creates a promise that resolves after a specified delay.
 * 
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 * 
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * console.log('1 second later');
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Debounces a function call.
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * debouncedSearch('hello'); // Will only execute after 300ms of no calls
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttles a function call.
 * 
 * @param fn - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
