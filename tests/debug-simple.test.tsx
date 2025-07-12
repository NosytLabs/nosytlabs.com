// Simple test without any imports to check if Vitest itself works
import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
  it('should run basic test', () => {
    expect(2 + 2).toBe(4);
  });
});