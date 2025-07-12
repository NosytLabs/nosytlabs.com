// Test to validate @/lib path alias resolution
import { describe, it, expect } from 'vitest';

describe('Path Alias Validation', () => {
  it('should resolve @/lib/utils import', async () => {
    try {
      // This should hang if our diagnosis is correct
      const { cn } = await import('@/lib/utils');
      expect(typeof cn).toBe('function');
    } catch (error) {
      console.error('Path alias resolution failed:', error);
      throw error;
    }
  });
});