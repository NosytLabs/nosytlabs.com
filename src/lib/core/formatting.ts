/**
 * Formatting Utilities
 * 
 * Utilities for formatting dates, numbers, currency, and other data types
 * into human-readable strings.
 * 
 * @module core/formatting
 */

// ========================================
// DATE FORMATTING
// ========================================

/**
 * Formats a date into a readable string.
 * 
 * @param date - Date to format
 * @param format - Format style ('short', 'medium', 'long', 'full')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date('2025-01-10'), 'medium')
 * // Returns: 'Jan 10, 2025'
 * 
 * formatDate(new Date('2025-01-10'), 'long')
 * // Returns: 'January 10, 2025'
 * ```
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const formatOptions = {
    short: { month: 'numeric' as const, day: 'numeric' as const, year: '2-digit' as const },
    medium: { month: 'short' as const, day: 'numeric' as const, year: 'numeric' as const },
    long: { month: 'long' as const, day: 'numeric' as const, year: 'numeric' as const },
    full: { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const, year: 'numeric' as const }
  };
  
  const options: Intl.DateTimeFormatOptions = formatOptions[format];
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Formats a date and time into a readable string.
 * 
 * @param date - Date to format
 * @param includeSeconds - Whether to include seconds
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date-time string
 * 
 * @example
 * ```typescript
 * formatDateTime(new Date('2025-01-10T14:30:00'))
 * // Returns: 'Jan 10, 2025, 2:30 PM'
 * ```
 */
export function formatDateTime(
  date: Date | string | number,
  includeSeconds: boolean = false,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Formats a date as a relative time string (e.g., "2 hours ago").
 * 
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Relative time string
 * 
 * @example
 * ```typescript
 * formatRelativeTime(new Date(Date.now() - 3600000))
 * // Returns: '1 hour ago'
 * 
 * formatRelativeTime(new Date(Date.now() + 86400000))
 * // Returns: 'in 1 day'
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];
  
  for (const { unit, seconds } of units) {
    const value = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (value >= 1) {
      return rtf.format(diffInSeconds < 0 ? value : -value, unit);
    }
  }
  
  return rtf.format(0, 'second');
}

// ========================================
// NUMBER FORMATTING
// ========================================

/**
 * Formats a number with thousands separators.
 * 
 * @param value - Number to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * formatNumber(1234567)
 * // Returns: '1,234,567'
 * 
 * formatNumber(1234567.89)
 * // Returns: '1,234,567.89'
 * ```
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a number as a percentage.
 * 
 * @param value - Number to format (0-1 range)
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted percentage string
 * 
 * @example
 * ```typescript
 * formatPercentage(0.1234)
 * // Returns: '12%'
 * 
 * formatPercentage(0.1234, 2)
 * // Returns: '12.34%'
 * ```
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formats a number with a specific number of decimal places.
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * formatDecimal(123.456, 2)
 * // Returns: '123.46'
 * 
 * formatDecimal(123, 2)
 * // Returns: '123.00'
 * ```
 */
export function formatDecimal(
  value: number,
  decimals: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formats a number in compact notation (e.g., 1.2K, 3.4M).
 * 
 * @param value - Number to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted compact number string
 * 
 * @example
 * ```typescript
 * formatCompactNumber(1234)
 * // Returns: '1.2K'
 * 
 * formatCompactNumber(1234567)
 * // Returns: '1.2M'
 * ```
 */
export function formatCompactNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
}

// ========================================
// CURRENCY FORMATTING
// ========================================

/**
 * Formats a number as currency.
 * 
 * @param value - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56)
 * // Returns: '$1,234.56'
 * 
 * formatCurrency(1234.56, 'EUR', 'de-DE')
 * // Returns: '1.234,56 €'
 * ```
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

// ========================================
// PHONE NUMBER FORMATTING
// ========================================

/**
 * Formats a US phone number.
 * 
 * @param value - Phone number string (digits only)
 * @returns Formatted phone number
 * 
 * @example
 * ```typescript
 * formatPhoneNumber('1234567890')
 * // Returns: '(123) 456-7890'
 * 
 * formatPhoneNumber('123456')
 * // Returns: '123-456'
 * ```
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length > 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  return cleaned;
}

// ========================================
// TEXT FORMATTING
// ========================================

/**
 * Formats a string to title case.
 * 
 * @param value - String to format
 * @returns Title cased string
 * 
 * @example
 * ```typescript
 * formatTitleCase('hello world')
 * // Returns: 'Hello World'
 * 
 * formatTitleCase('the quick brown fox')
 * // Returns: 'The Quick Brown Fox'
 * ```
 */
export function formatTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a string to sentence case.
 * 
 * @param value - String to format
 * @returns Sentence cased string
 * 
 * @example
 * ```typescript
 * formatSentenceCase('HELLO WORLD')
 * // Returns: 'Hello world'
 * ```
 */
export function formatSentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Pluralizes a word based on count.
 * 
 * @param count - Number to check
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, adds 's' by default)
 * @returns Pluralized string with count
 * 
 * @example
 * ```typescript
 * pluralize(1, 'item')
 * // Returns: '1 item'
 * 
 * pluralize(5, 'item')
 * // Returns: '5 items'
 * 
 * pluralize(2, 'person', 'people')
 * // Returns: '2 people'
 * ```
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
}

// ========================================
// LIST FORMATTING
// ========================================

/**
 * Formats an array into a human-readable list.
 * 
 * @param items - Array of items to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted list string
 * 
 * @example
 * ```typescript
 * formatList(['apples', 'oranges', 'bananas'])
 * // Returns: 'apples, oranges, and bananas'
 * 
 * formatList(['apples', 'oranges'])
 * // Returns: 'apples and oranges'
 * ```
 */
export function formatList(items: string[], locale: string = 'en-US'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  
  // Fallback for environments without Intl.ListFormat support
  if (typeof Intl !== 'undefined' && 'ListFormat' in Intl) {
    return new (Intl as unknown as { ListFormat: new (locale: string, options: { style: string; type: string }) => { format: (items: string[]) => string } }).ListFormat(locale, { style: 'long', type: 'conjunction' }).format(items);
  }
  
  // Manual fallback
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(', ')}, and ${lastItem}`;
}
