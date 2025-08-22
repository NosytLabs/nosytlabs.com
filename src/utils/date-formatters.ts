/**
 * Utility functions for formatting dates consistently throughout the application
 */

/**
 * Formats a date for display in blog posts and meta information
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Formats a date for display in a more compact format
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateCompact(date: Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date for display relative to now (e.g., "2 days ago")
 * @param date - The date to format
 * @returns Relative time string
 */
export function formatDateRelative(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

/**
 * Formats a date for ISO string (useful for datetime attributes)
 * @param date - The date to format
 * @returns ISO string
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Formats a date for sitemap.xml
 * @param date - The date to format
 * @returns Date in sitemap format (YYYY-MM-DD)
 */
export function formatDateSitemap(date: Date): string {
  return date.toISOString().split('T')[0] || '';
}

/**
 * Formats a date for RSS feeds
 * @param date - The date to format
 * @returns RFC 2822 formatted date
 */
export function formatDateRSS(date: Date): string {
  return date.toUTCString();
}

/**
 * Parses a date string and returns a Date object
 * @param dateString - The date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Checks if a date is in the future
 * @param date - The date to check
 * @returns Whether the date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date.getTime() > new Date().getTime();
}

/**
 * Checks if a date is in the past
 * @param date - The date to check
 * @returns Whether the date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date.getTime() < new Date().getTime();
}
