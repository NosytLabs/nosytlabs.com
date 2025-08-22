import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to merge Tailwind CSS classes with clsx.
 *
 * @param inputs - An array of class values to be merged.
 * @returns The merged CSS class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * A simple utility function to format numbers as currency.
 *
 * @param amount - The numerical amount to format.
 * @param currency - The currency code (e.g., "USD", "EUR").
 * @param locale - The locale for formatting (e.g., "en-US").
 * @returns The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * A utility function to capitalize the first letter of a string.
 *
 * @param str - The input string.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
