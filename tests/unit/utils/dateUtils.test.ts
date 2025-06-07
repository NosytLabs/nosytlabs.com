/**
 * Date Utilities Unit Tests
 * 
 * @fileoverview Comprehensive unit tests for date utility functions
 * including formatting, parsing, validation, and relative time calculations.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, parseDate, getRelativeTime, isValidDate } from '@/utils/dateUtils';

describe('Date Utilities', () => {
  // Mock current date for consistent testing
  const mockDate = new Date('2024-01-15T12:00:00.000Z');
  
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date);
      
      expect(result).toBe('January 15, 2024');
    });

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date, 'MM/dd/yyyy');
      
      expect(result).toBe('01/15/2024');
    });

    it('should format date with short format', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date, 'short');
      
      expect(result).toBe('Jan 15, 2024');
    });

    it('should format date with ISO format', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date, 'iso');
      
      expect(result).toBe('2024-01-15');
    });

    it('should handle invalid date input', () => {
      const result = formatDate(new Date('invalid'));
      
      expect(result).toBe('Invalid Date');
    });

    it('should handle null input', () => {
      const result = formatDate(null as any);
      
      expect(result).toBe('Invalid Date');
    });

    it('should handle string date input', () => {
      const result = formatDate('2024-01-15');
      
      expect(result).toBe('January 15, 2024');
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date string', () => {
      const result = parseDate('2024-01-15T12:00:00.000Z');
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(15);
    });

    it('should parse date string in various formats', () => {
      const formats = [
        '2024-01-15',
        '01/15/2024',
        'January 15, 2024',
        'Jan 15, 2024'
      ];

      formats.forEach(format => {
        const result = parseDate(format);
        expect(result).toBeInstanceOf(Date);
        expect(isValidDate(result)).toBe(true);
      });
    });

    it('should return null for invalid date string', () => {
      const result = parseDate('invalid-date');
      
      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      const result = parseDate('');
      
      expect(result).toBeNull();
    });

    it('should handle null input', () => {
      const result = parseDate(null as any);
      
      expect(result).toBeNull();
    });

    it('should parse timestamp', () => {
      const timestamp = 1705320000000; // 2024-01-15T12:00:00.000Z
      const result = parseDate(timestamp);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(timestamp);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "just now" for very recent dates', () => {
      const recentDate = new Date(mockDate.getTime() - 30000); // 30 seconds ago
      const result = getRelativeTime(recentDate);
      
      expect(result).toBe('just now');
    });

    it('should return minutes ago for recent dates', () => {
      const minutesAgo = new Date(mockDate.getTime() - 5 * 60 * 1000); // 5 minutes ago
      const result = getRelativeTime(minutesAgo);
      
      expect(result).toBe('5 minutes ago');
    });

    it('should return hours ago for dates within a day', () => {
      const hoursAgo = new Date(mockDate.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
      const result = getRelativeTime(hoursAgo);
      
      expect(result).toBe('3 hours ago');
    });

    it('should return days ago for dates within a week', () => {
      const daysAgo = new Date(mockDate.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const result = getRelativeTime(daysAgo);
      
      expect(result).toBe('3 days ago');
    });

    it('should return weeks ago for dates within a month', () => {
      const weeksAgo = new Date(mockDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
      const result = getRelativeTime(weeksAgo);
      
      expect(result).toBe('2 weeks ago');
    });

    it('should return months ago for dates within a year', () => {
      const monthsAgo = new Date(mockDate.getTime() - 3 * 30 * 24 * 60 * 60 * 1000); // ~3 months ago
      const result = getRelativeTime(monthsAgo);
      
      expect(result).toBe('3 months ago');
    });

    it('should return years ago for very old dates', () => {
      const yearsAgo = new Date(mockDate.getTime() - 2 * 365 * 24 * 60 * 60 * 1000); // ~2 years ago
      const result = getRelativeTime(yearsAgo);
      
      expect(result).toBe('2 years ago');
    });

    it('should handle future dates', () => {
      const futureDate = new Date(mockDate.getTime() + 60 * 60 * 1000); // 1 hour in future
      const result = getRelativeTime(futureDate);
      
      expect(result).toBe('in 1 hour');
    });

    it('should handle invalid date input', () => {
      const result = getRelativeTime(new Date('invalid'));
      
      expect(result).toBe('Invalid Date');
    });

    it('should use custom reference date', () => {
      const referenceDate = new Date('2024-01-10T12:00:00.000Z');
      const targetDate = new Date('2024-01-08T12:00:00.000Z');
      const result = getRelativeTime(targetDate, referenceDate);
      
      expect(result).toBe('2 days ago');
    });

    it('should handle singular vs plural correctly', () => {
      const oneMinuteAgo = new Date(mockDate.getTime() - 60 * 1000); // 1 minute ago
      const result = getRelativeTime(oneMinuteAgo);
      
      expect(result).toBe('1 minute ago');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid Date objects', () => {
      const validDate = new Date('2024-01-15T12:00:00.000Z');
      const result = isValidDate(validDate);
      
      expect(result).toBe(true);
    });

    it('should return false for invalid Date objects', () => {
      const invalidDate = new Date('invalid-date');
      const result = isValidDate(invalidDate);
      
      expect(result).toBe(false);
    });

    it('should return false for non-Date objects', () => {
      const notADate = '2024-01-15';
      const result = isValidDate(notADate as any);
      
      expect(result).toBe(false);
    });

    it('should return false for null', () => {
      const result = isValidDate(null as any);
      
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = isValidDate(undefined as any);
      
      expect(result).toBe(false);
    });

    it('should return false for numbers', () => {
      const result = isValidDate(1705320000000 as any);
      
      expect(result).toBe(false);
    });

    it('should handle edge cases', () => {
      // Test various edge cases
      const edgeCases = [
        new Date(0), // Unix epoch
        new Date('1970-01-01T00:00:00.000Z'), // Unix epoch as string
        new Date(8640000000000000), // Max safe date
        new Date(-8640000000000000), // Min safe date
      ];

      edgeCases.forEach(date => {
        expect(isValidDate(date)).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work together for date processing pipeline', () => {
      const dateString = '2024-01-10T12:00:00.000Z';
      
      // Parse the date
      const parsedDate = parseDate(dateString);
      expect(parsedDate).not.toBeNull();
      
      // Validate the parsed date
      expect(isValidDate(parsedDate!)).toBe(true);
      
      // Format the date
      const formattedDate = formatDate(parsedDate!);
      expect(formattedDate).toBe('January 10, 2024');
      
      // Get relative time
      const relativeTime = getRelativeTime(parsedDate!);
      expect(relativeTime).toBe('5 days ago');
    });

    it('should handle error cases gracefully in pipeline', () => {
      const invalidDateString = 'not-a-date';
      
      // Parse should return null
      const parsedDate = parseDate(invalidDateString);
      expect(parsedDate).toBeNull();
      
      // Subsequent operations should handle null gracefully
      expect(isValidDate(parsedDate as any)).toBe(false);
      expect(formatDate(parsedDate as any)).toBe('Invalid Date');
      expect(getRelativeTime(parsedDate as any)).toBe('Invalid Date');
    });
  });
});
