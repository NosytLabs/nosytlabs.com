/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return the original string if invalid
  }
  
  // Format the date as "Month Day, Year"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get a relative time string (e.g., "2 days ago")
 * @param {string} dateString - The date string to format
 * @returns {string} The relative time string
 */
export function getRelativeTimeString(dateString) {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return the original string if invalid
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Format a date for use in HTML datetime attributes
 * @param {string} dateString - The date string to format
 * @returns {string} The ISO formatted date string
 */
export function formatISODate(dateString) {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return ''; // Return empty string if invalid
  }
  
  return date.toISOString();
}
