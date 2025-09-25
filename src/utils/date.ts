/**
 * Formats a date object into a human-readable string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}