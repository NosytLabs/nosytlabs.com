/**
 * @fileoverview File Processing Utilities
 * 
 * Consolidated file processing and optimization functions.
 * Provides consistent file handling, validation, and processing utilities.
 * 
 * @module fileUtils
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

import { handleError, ErrorSeverity, ErrorCategory } from './errorUtils.js';

/**
 * Supported file extensions for different categories
 * 
 * @readonly
 * @type {object}
 */
export const FILE_EXTENSIONS = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif'],
  SCRIPTS: ['.js', '.ts', '.jsx', '.tsx', '.mjs'],
  STYLES: ['.css', '.scss', '.sass', '.less'],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt', '.md'],
  ARCHIVES: ['.zip', '.rar', '.tar', '.gz', '.7z'],
  VIDEOS: ['.mp4', '.webm', '.avi', '.mov', '.wmv'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.m4a', '.flac']
};

/**
 * Maximum file sizes for different categories (in bytes)
 * 
 * @readonly
 * @type {object}
 */
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024,      // 5MB
  SCRIPT: 1 * 1024 * 1024,     // 1MB
  STYLE: 500 * 1024,           // 500KB
  DOCUMENT: 10 * 1024 * 1024,  // 10MB
  ARCHIVE: 50 * 1024 * 1024,   // 50MB
  VIDEO: 100 * 1024 * 1024,    // 100MB
  AUDIO: 20 * 1024 * 1024      // 20MB
};

/**
 * Get file extension from filename or path
 * 
 * Extracts the file extension from a filename or file path.
 * Returns lowercase extension for consistency.
 * 
 * @param {string} filename - The filename or path
 * @returns {string} The file extension (including dot)
 * @example
 * const ext = getFileExtension('image.jpg'); // '.jpg'
 * const ext = getFileExtension('/path/to/script.js'); // '.js'
 * 
 * @since 1.0.0
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  
  return filename.substring(lastDotIndex).toLowerCase();
}

/**
 * Get file category based on extension
 * 
 * Determines the file category (image, script, style, etc.) based on extension.
 * 
 * @param {string} filename - The filename or path
 * @returns {string} The file category
 * @example
 * const category = getFileCategory('image.jpg'); // 'image'
 * const category = getFileCategory('script.js'); // 'script'
 * 
 * @since 1.0.0
 */
export function getFileCategory(filename) {
  const extension = getFileExtension(filename);
  
  for (const [category, extensions] of Object.entries(FILE_EXTENSIONS)) {
    if (extensions.includes(extension)) {
      return category.toLowerCase();
    }
  }
  
  return 'unknown';
}

/**
 * Validate file based on extension and size
 * 
 * Validates a file against allowed extensions and size limits.
 * Returns validation result with details.
 * 
 * @param {File|object} file - File object or file info
 * @param {object} [options={}] - Validation options
 * @param {string[]} [options.allowedExtensions] - Allowed file extensions
 * @param {number} [options.maxSize] - Maximum file size in bytes
 * @param {boolean} [options.strictMode=false] - Whether to use strict validation
 * @returns {object} Validation result
 * @example
 * const result = validateFile(file, {
 *   allowedExtensions: ['.jpg', '.png'],
 *   maxSize: 5 * 1024 * 1024 // 5MB
 * });
 * 
 * if (result.valid) {
 *   // File is valid
 * } else {
 *   console.error(result.errors);
 * }
 * 
 * @since 1.0.0
 */
export function validateFile(file, options = {}) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    fileInfo: {
      name: file.name || 'unknown',
      size: file.size || 0,
      type: file.type || 'unknown',
      extension: getFileExtension(file.name || ''),
      category: getFileCategory(file.name || '')
    }
  };
  
  const {
    allowedExtensions,
    maxSize,
    strictMode = false
  } = options;
  
  // Validate extension
  if (allowedExtensions && allowedExtensions.length > 0) {
    if (!allowedExtensions.includes(result.fileInfo.extension)) {
      result.valid = false;
      result.errors.push(`File extension ${result.fileInfo.extension} is not allowed`);
    }
  }
  
  // Validate size
  const sizeLimit = maxSize || MAX_FILE_SIZES[result.fileInfo.category.toUpperCase()];
  if (sizeLimit && result.fileInfo.size > sizeLimit) {
    result.valid = false;
    result.errors.push(`File size ${formatFileSize(result.fileInfo.size)} exceeds limit of ${formatFileSize(sizeLimit)}`);
  }
  
  // Strict mode validations
  if (strictMode) {
    // Check for suspicious file names
    if (result.fileInfo.name.includes('..') || result.fileInfo.name.includes('/') || result.fileInfo.name.includes('\\')) {
      result.valid = false;
      result.errors.push('File name contains invalid characters');
    }
    
    // Check for empty files
    if (result.fileInfo.size === 0) {
      result.valid = false;
      result.errors.push('File is empty');
    }
  }
  
  return result;
}

/**
 * Format file size in human-readable format
 * 
 * Converts file size in bytes to human-readable format (KB, MB, GB).
 * 
 * @param {number} bytes - File size in bytes
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted file size
 * @example
 * const size = formatFileSize(1024); // '1.00 KB'
 * const size = formatFileSize(1048576); // '1.00 MB'
 * 
 * @since 1.0.0
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate unique filename to avoid conflicts
 * 
 * Generates a unique filename by appending a timestamp or counter.
 * Useful for preventing file name conflicts.
 * 
 * @param {string} originalName - Original filename
 * @param {object} [options={}] - Generation options
 * @param {boolean} [options.useTimestamp=true] - Whether to use timestamp
 * @param {boolean} [options.useCounter=false] - Whether to use counter
 * @param {string} [options.separator='_'] - Separator character
 * @returns {string} Unique filename
 * @example
 * const unique = generateUniqueFilename('image.jpg');
 * // Returns: 'image_1640995200000.jpg'
 * 
 * @example
 * const unique = generateUniqueFilename('document.pdf', {
 *   useTimestamp: false,
 *   useCounter: true
 * });
 * // Returns: 'document_1.pdf'
 * 
 * @since 1.0.0
 */
export function generateUniqueFilename(originalName, options = {}) {
  const {
    useTimestamp = true,
    useCounter = false,
    separator = '_'
  } = options;
  
  const extension = getFileExtension(originalName);
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  
  let suffix = '';
  
  if (useTimestamp) {
    suffix = separator + Date.now();
  } else if (useCounter) {
    // In a real application, you'd track counters in storage
    suffix = separator + Math.floor(Math.random() * 1000);
  }
  
  return baseName + suffix + extension;
}

/**
 * Extract filename from URL or path
 * 
 * Extracts the filename from a URL or file path.
 * Handles query parameters and fragments.
 * 
 * @param {string} urlOrPath - URL or file path
 * @returns {string} Extracted filename
 * @example
 * const filename = extractFilename('/path/to/file.jpg'); // 'file.jpg'
 * const filename = extractFilename('https://example.com/image.png?v=1'); // 'image.png'
 * 
 * @since 1.0.0
 */
export function extractFilename(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') {
    return '';
  }
  
  try {
    // Handle URLs
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      const url = new URL(urlOrPath);
      const pathname = url.pathname;
      return pathname.substring(pathname.lastIndexOf('/') + 1);
    }
    
    // Handle file paths
    const parts = urlOrPath.split(/[/\\]/);
    return parts[parts.length - 1] || '';
  } catch (error) {
    handleError(error, 'Extract filename', ErrorSeverity.LOW, ErrorCategory.VALIDATION);
    return '';
  }
}

/**
 * Check if file is an image
 * 
 * Determines if a file is an image based on extension or MIME type.
 * 
 * @param {string|File} fileOrName - Filename or File object
 * @returns {boolean} Whether the file is an image
 * @example
 * const isImg = isImageFile('photo.jpg'); // true
 * const isImg = isImageFile(fileObject); // true/false
 * 
 * @since 1.0.0
 */
export function isImageFile(fileOrName) {
  let filename = '';
  let mimeType = '';
  
  if (typeof fileOrName === 'string') {
    filename = fileOrName;
  } else if (fileOrName && typeof fileOrName === 'object') {
    filename = fileOrName.name || '';
    mimeType = fileOrName.type || '';
  }
  
  // Check by extension
  const extension = getFileExtension(filename);
  if (FILE_EXTENSIONS.IMAGES.includes(extension)) {
    return true;
  }
  
  // Check by MIME type
  if (mimeType && mimeType.startsWith('image/')) {
    return true;
  }
  
  return false;
}

/**
 * Get optimized image dimensions
 * 
 * Calculates optimized image dimensions based on constraints.
 * Maintains aspect ratio while fitting within limits.
 * 
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {object} constraints - Size constraints
 * @param {number} [constraints.maxWidth] - Maximum width
 * @param {number} [constraints.maxHeight] - Maximum height
 * @param {number} [constraints.quality=0.8] - Quality factor (0-1)
 * @returns {object} Optimized dimensions
 * @example
 * const optimized = getOptimizedImageDimensions(1920, 1080, {
 *   maxWidth: 800,
 *   maxHeight: 600
 * });
 * // Returns: { width: 800, height: 450 }
 * 
 * @since 1.0.0
 */
export function getOptimizedImageDimensions(originalWidth, originalHeight, constraints) {
  const {
    maxWidth = Infinity,
    maxHeight = Infinity,
    quality = 0.8
  } = constraints;
  
  let { width, height } = { width: originalWidth, height: originalHeight };
  
  // Calculate aspect ratio
  const aspectRatio = width / height;
  
  // Scale down if necessary
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio,
    quality
  };
}

/**
 * Create file download
 * 
 * Creates a download link for a file or blob.
 * Handles browser compatibility for file downloads.
 * 
 * @param {Blob|string} data - File data or URL
 * @param {string} filename - Filename for download
 * @param {string} [mimeType] - MIME type for the file
 * @returns {void}
 * @example
 * // Download text file
 * createFileDownload('Hello World', 'hello.txt', 'text/plain');
 * 
 * @example
 * // Download blob
 * createFileDownload(blob, 'data.json', 'application/json');
 * 
 * @since 1.0.0
 */
export function createFileDownload(data, filename, mimeType) {
  try {
    let url;
    
    if (typeof data === 'string') {
      // Create blob from string
      const blob = new Blob([data], { type: mimeType || 'text/plain' });
      url = URL.createObjectURL(blob);
    } else if (data instanceof Blob) {
      // Use blob directly
      url = URL.createObjectURL(data);
    } else {
      throw new Error('Data must be a string or Blob');
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
  } catch (error) {
    handleError(error, 'File download', ErrorSeverity.MEDIUM, ErrorCategory.RUNTIME);
  }
}

/**
 * Read file as text
 * 
 * Reads a File object as text with encoding support.
 * Returns a promise that resolves with the file content.
 * 
 * @param {File} file - File object to read
 * @param {string} [encoding='UTF-8'] - Text encoding
 * @returns {Promise<string>} Promise that resolves with file content
 * @example
 * const content = await readFileAsText(file);
 * console.log(content);
 * 
 * @since 1.0.0
 */
export function readFileAsText(file, encoding = 'UTF-8') {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file object'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Failed to read file: ${error.message}`));
    };
    
    reader.readAsText(file, encoding);
  });
}

/**
 * Read file as data URL
 * 
 * Reads a File object as a data URL (base64).
 * Useful for displaying images or embedding files.
 * 
 * @param {File} file - File object to read
 * @returns {Promise<string>} Promise that resolves with data URL
 * @example
 * const dataUrl = await readFileAsDataURL(file);
 * img.src = dataUrl;
 * 
 * @since 1.0.0
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file object'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Failed to read file: ${error.message}`));
    };
    
    reader.readAsDataURL(file);
  });
}
