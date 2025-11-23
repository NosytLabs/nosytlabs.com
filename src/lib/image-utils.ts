/**
 * Image optimization utilities for blog posts and cards
 */

export function getOptimizedImagePath(path: string): string {
  if (!path) return '/images/blog-index-og.jpg';
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`;
}

export function getImageAlt(title: string, type: string = 'blog'): string {
  return `${title} - ${type} image`;
}

export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  className?: string;
}

export function createImageConfig(path: string, alt: string, options?: Partial<ImageConfig>): ImageConfig {
  return {
    src: getOptimizedImagePath(path),
    alt: alt || 'Image',
    loading: 'lazy',
    decoding: 'async',
    ...options
  };
}
