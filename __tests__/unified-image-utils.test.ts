import { describe, it, expect } from 'vitest';
import { generateImageFormats, createOptimizedImageConfig } from '../src/utils/unified-image-utils';

describe('Image Utilities', () => {
  it('should generate correct image formats', () => {
    const result = generateImageFormats('test.jpg', 90);
    expect(result.webp).toBe('test.webp');
    expect(result.fallback).toBe('test.jpg');
    expect(result.avif).toBe('test.avif');
  });

  it('should create optimized config', () => {
    const config = createOptimizedImageConfig('test.png', 'Test image', {
      width: 100,
      height: 100,
      quality: 80,
    });
    expect(config.quality).toBe(80);
    expect(config.width).toBe(100);
  });
});
