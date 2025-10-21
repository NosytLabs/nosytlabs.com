// Unified Date Utilities - Consolidates formatters.ts and parsers.ts functionality
// This file eliminates duplication and provides a single source of truth for date operations

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full' | 'iso' | 'ISO' | 'timestamp' | 'custom' | string;
  customFormat?: string;
  timezone?: string; // legacy alias
  timeZone?: string; // match tests option key
  locale?: string;
  includeTime?: boolean;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
}

export interface DurationOptions {
  units?: string | ('years' | 'quarters' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds')[];
  precision?: number;
  compact?: boolean;
  locale?: string;
  separator?: string;
}

export interface DurationObject {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface TimeframeOptions {
  period: string;
  endDate?: Date;
}

// Consolidated constants
const DURATION_REGEX = /^(\d+)(ms|s|m|h|d|w|M|y)$/i;

const DURATION_MULTIPLIERS: Record<string, number> = {
  'ms': 1,
  's': 1000,
  'm': 60 * 1000,
  'h': 60 * 60 * 1000,
  'd': 24 * 60 * 60 * 1000,
  'w': 7 * 24 * 60 * 60 * 1000,
  'M': 30 * 24 * 60 * 60 * 1000,
  'y': 365 * 24 * 60 * 60 * 1000
};

const TIME_AGO_MULTIPLIERS: Record<string, number> = {
  'millisecond': 1,
  'milliseconds': 1,
  'second': 1000,
  'seconds': 1000,
  'minute': 60 * 1000,
  'minutes': 60 * 1000,
  'hour': 60 * 60 * 1000,
  'hours': 60 * 60 * 1000,
  'day': 24 * 60 * 60 * 1000,
  'days': 24 * 60 * 60 * 1000,
  'week': 7 * 24 * 60 * 60 * 1000,
  'weeks': 7 * 24 * 60 * 60 * 1000,
  'month': 30 * 24 * 60 * 60 * 1000,
  'months': 30 * 24 * 60 * 60 * 1000,
  'year': 365 * 24 * 60 * 60 * 1000,
  'years': 365 * 24 * 60 * 60 * 1000
};

// ===== VALIDATION FUNCTIONS =====

export function isValidDate(date: unknown, options?: { min?: Date; max?: Date; validator?: (date: Date) => boolean }): date is Date {
  if (date === null || date === undefined) {
    return false;
  }

  if (typeof date === 'function') {
    return false;
  }

  let dateObj: Date;

  // Handle Date objects first
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      return false;
    }
    dateObj = date;
  } else if (typeof date === 'number') {
    if (!isFinite(date)) {
      return false;
    }
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return false;
    }
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return false;
    }
  } else {
    return false;
  }

  // Apply all validations to the dateObj
  if (options?.min && dateObj < options.min) {
    return false;
  }
  if (options?.max && dateObj > options.max) {
    return false;
  }

  if (options?.validator && !options.validator(dateObj)) {
    return false;
  }

  return true;
}

export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// ===== PARSING FUNCTIONS =====

export function parseDate(input: string | number | Date, format?: string): Date | null {
  if (input === null || input === undefined) {
    return null;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const isoDate = new Date(trimmed);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    if (format) {
      try {
        if (format === 'dd/MM/yyyy' || format === 'DD/MM/YYYY') {
          const parts = trimmed.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
          }
        }
        
        if (format === 'MM/dd/yyyy' || format === 'MM/DD/YYYY') {
          const parts = trimmed.split('/');
          if (parts.length === 3) {
            const month = parseInt(parts[0], 10) - 1;
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
          }
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

export function parseRelativeTime(input: string): Date | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim().toLowerCase();
  const now = new Date();

  if (trimmed === 'now' || trimmed === 'today') {
    return now;
  }

  if (trimmed === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  if (trimmed === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  const match = trimmed.match(/^(\d+)\s*(millisecond|milliseconds|second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s*ago$/);
  if (match) {
    const amount = parseInt(match[1], 10);
    const unit = match[2];
    const multiplier = TIME_AGO_MULTIPLIERS[unit];
    if (multiplier) {
      return new Date(now.getTime() - (amount * multiplier));
    }
  }

  return null;
}

export function parseDuration(duration: string): number | null {
  if (!duration || typeof duration !== 'string') {
    return null;
  }

  const trimmed = duration.trim();
  const match = trimmed.match(DURATION_REGEX);
  
  if (!match) {
    return null;
  }

  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multiplier = DURATION_MULTIPLIERS[unit];

  return multiplier ? amount * multiplier : null;
}

// ===== FORMATTING FUNCTIONS =====

export function formatDate(date: Date | string | number | null | undefined, options: DateFormatOptions = {}): string {
  if (date === null || date === undefined) {
    return '';
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const { format, customFormat } = options;
  const timeZone = options.timeZone ?? options.timezone ?? 'UTC';

  const isTokenFormat = typeof format === 'string' && /[YMDHms]/.test(format) && !['short','medium','long','full','iso','ISO','timestamp','custom'].includes(format);
  const effectiveCustomFormat = customFormat ?? (isTokenFormat ? (format as string) : undefined);

  if (effectiveCustomFormat) {
    return formatCustomDate(dateObj, effectiveCustomFormat);
  }

  if (format === 'ISO' || format === 'iso') {
    return dateObj.toISOString();
  }
  
  if (format === 'timestamp') {
    return dateObj.getTime().toString();
  }

  const locale = options.locale || 'en-US';
  
  try {
    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    return dateObj.toLocaleDateString(locale, formatOptions);
  } catch {
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export function formatRelativeTime(date: Date | string | number | null | undefined, options: { locale?: string; baseDate?: Date; numeric?: 'auto' | 'always' } = {}): string {
  if (date === null || date === undefined) {
    return '';
  }
  
  const targetDate = new Date(date);
  const baseDate = options.baseDate || new Date();
  
  if (isNaN(targetDate.getTime())) {
    return '';
  }

  const diffMs = targetDate.getTime() - baseDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) {
    return 'just now';
  } else if (Math.abs(diffMinutes) < 60) {
    return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ${diffMinutes < 0 ? 'ago' : 'from now'}`;
  } else if (Math.abs(diffHours) < 24) {
    return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours < 0 ? 'ago' : 'from now'}`;
  } else if (Math.abs(diffDays) < 7) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ${diffDays < 0 ? 'ago' : 'from now'}`;
  } else {
    const locale = options?.locale || 'en-US';
    return formatDate(targetDate, { locale });
  }
}

export function formatDuration(duration: number | DurationObject | null | undefined, options: DurationOptions = {}): string {
  if (duration === null || duration === undefined) {
    return '';
  }

  let durationMs: number;
  
  if (typeof duration === 'number') {
    durationMs = duration;
  } else if (typeof duration === 'object') {
    durationMs = 0;
    if (duration.milliseconds) durationMs += duration.milliseconds;
    if (duration.seconds) durationMs += duration.seconds * 1000;
    if (duration.minutes) durationMs += duration.minutes * 60 * 1000;
    if (duration.hours) durationMs += duration.hours * 60 * 60 * 1000;
    if (duration.days) durationMs += duration.days * 24 * 60 * 60 * 1000;
  } else {
    return '';
  }

  const { compact = false, precision = 2, separator = ', ' } = options;
  
  const units = [
    { name: 'day', ms: 24 * 60 * 60 * 1000 },
    { name: 'hour', ms: 60 * 60 * 1000 },
    { name: 'minute', ms: 60 * 1000 },
    { name: 'second', ms: 1000 }
  ];

  const parts: string[] = [];
  let remaining = Math.abs(durationMs);

  for (const unit of units) {
    const count = Math.floor(remaining / unit.ms);
    if (count > 0) {
      const unitName = compact ? unit.name.charAt(0) : unit.name + (count !== 1 ? 's' : '');
      parts.push(`${count}${compact ? '' : ' '}${unitName}`);
      remaining -= count * unit.ms;
      
      if (parts.length >= precision) break;
    }
  }

  return parts.length > 0 ? parts.join(separator) : '0 seconds';
}

// ===== UTILITY FUNCTIONS =====

export function addDuration(date: Date, duration: string | DurationObject): Date {
  const result = new Date(date);
  
  if (typeof duration === 'string') {
    const durationMs = parseDuration(duration);
    if (durationMs !== null) {
      result.setTime(result.getTime() + durationMs);
    }
  } else if (typeof duration === 'object') {
    if (duration.milliseconds) result.setTime(result.getTime() + duration.milliseconds);
    if (duration.seconds) result.setTime(result.getTime() + duration.seconds * 1000);
    if (duration.minutes) result.setTime(result.getTime() + duration.minutes * 60 * 1000);
    if (duration.hours) result.setTime(result.getTime() + duration.hours * 60 * 60 * 1000);
    if (duration.days) result.setTime(result.getTime() + duration.days * 24 * 60 * 60 * 1000);
    if (duration.months) result.setMonth(result.getMonth() + duration.months);
    if (duration.years) result.setFullYear(result.getFullYear() + duration.years);
  }
  
  return result;
}

export function subtractDuration(date: Date, duration: string | DurationObject): Date {
  const result = new Date(date);
  
  if (typeof duration === 'string') {
    const durationMs = parseDuration(duration);
    if (durationMs !== null) {
      result.setTime(result.getTime() - durationMs);
    }
  } else if (typeof duration === 'object') {
    if (duration.milliseconds) result.setTime(result.getTime() - duration.milliseconds);
    if (duration.seconds) result.setTime(result.getTime() - duration.seconds * 1000);
    if (duration.minutes) result.setTime(result.getTime() - duration.minutes * 60 * 1000);
    if (duration.hours) result.setTime(result.getTime() - duration.hours * 60 * 60 * 1000);
    if (duration.days) result.setTime(result.getTime() - duration.days * 24 * 60 * 60 * 1000);
    if (duration.months) result.setMonth(result.getMonth() - duration.months);
    if (duration.years) result.setFullYear(result.getFullYear() - duration.years);
  }
  
  return result;
}

export function getDurationBetweenDates(startDate: Date, endDate: Date): number {
  return endDate.getTime() - startDate.getTime();
}

// Alias for backward compatibility
export const getDuration = getDurationBetweenDates;

export function getTimeAgo(date: Date | string, baseDate?: Date, options?: { locale?: string }): string {
  const targetDate = parseDate(date);
  if (!targetDate) return 'Invalid date';
  
  const base = baseDate || new Date();
  const diffMs = base.getTime() - targetDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  // Handle future dates
  if (diffMs < 0) {
    const futureDiffMinutes = Math.abs(diffMinutes);
    if (futureDiffMinutes < 1) return 'just now';
    if (futureDiffMinutes < 60) return `${futureDiffMinutes} minute${futureDiffMinutes === 1 ? '' : 's'} from now`;
    
    const futureDiffHours = Math.floor(futureDiffMinutes / 60);
    if (futureDiffHours < 24) return `${futureDiffHours} hour${futureDiffHours === 1 ? '' : 's'} from now`;
    
    const futureDiffDays = Math.floor(futureDiffHours / 24);
    if (futureDiffDays < 30) return `${futureDiffDays} day${futureDiffDays === 1 ? '' : 's'} from now`;
  }
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  // For older dates, format as date
  const locale = options?.locale || 'en-US';
  return formatDate(targetDate, { locale });
}

export function getTimeframe(options: TimeframeOptions): TimeRange {
  const { period, endDate = new Date() } = options;
  const end = new Date(endDate);
  const start = new Date(end);
  
  switch (period.toLowerCase()) {
    case 'day':
    case '1d':
      start.setDate(start.getDate() - 1);
      break;
    case 'week':
    case '1w':
    case 'last7days':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
    case '1m':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
    case '1y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      // Try to parse as duration string
      const durationMs = parseDuration(period);
      if (durationMs) {
        start.setTime(start.getTime() - durationMs);
      } else {
        throw new Error(`Invalid period: ${period}`);
      }
  }
  
  return { start, end };
}

export function calculateTimeRange(startDate: Date | string, endDate: Date | string): TimeRange {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided to calculateTimeRange');
  }
  
  return { start, end };
}

export function getTimezoneOffset(timezone: string): number {
  try {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (getTimezoneOffsetMs(timezone)));
    return targetTime.getTimezoneOffset();
  } catch {
    return 0;
  }
}

// ===== PRIVATE HELPER FUNCTIONS =====

function formatCustomDate(date: Date, format: string): string {
  const tokens: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'YY': date.getFullYear().toString().slice(-2),
    'MM': String(date.getMonth() + 1).padStart(2, '0'),
    'M': (date.getMonth() + 1).toString(),
    'DD': String(date.getDate()).padStart(2, '0'),
    'D': date.getDate().toString(),
    'HH': String(date.getHours()).padStart(2, '0'),
    'H': date.getHours().toString(),
    'mm': String(date.getMinutes()).padStart(2, '0'),
    'm': date.getMinutes().toString(),
    'ss': String(date.getSeconds()).padStart(2, '0'),
    's': date.getSeconds().toString()
  };

  let formatted = format;
  for (const [token, value] of Object.entries(tokens)) {
    formatted = formatted.replace(new RegExp(token, 'g'), value);
  }
  
  return formatted;
}

function getTimezoneOffsetMs(timezone: string): number {
  // Simplified timezone offset calculation
  const offsets: Record<string, number> = {
    'UTC': 0,
    'EST': -5 * 60 * 60 * 1000,
    'PST': -8 * 60 * 60 * 1000,
    'CST': -6 * 60 * 60 * 1000,
    'MST': -7 * 60 * 60 * 1000
  };
  
  return offsets[timezone] || 0;
}

// Export all functions for backward compatibility
export {
  parseDate as parse,
  formatDate as format,
  formatRelativeTime as relative,
  formatDuration as formatDurationAlias,
  isValidDate as validate
};