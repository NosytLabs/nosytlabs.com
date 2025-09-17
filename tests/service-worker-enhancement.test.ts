import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Service Worker Enhancements', () => {
  const publicDir = join(process.cwd(), 'public');
  
  it('should have enhanced service worker file', () => {
    const swPath = join(publicDir, 'service-worker.js');
    expect(existsSync(swPath)).toBe(true);
  });
  
  it('should have updated cache name', () => {
    const swPath = join(publicDir, 'service-worker.js');
    const content = readFileSync(swPath, 'utf-8');
    
    expect(content).toContain('CACHE_NAME = \'nosytlabs-v10\'');
  });
  
  it('should cache additional resources', () => {
    const swPath = join(publicDir, 'service-worker.js');
    const content = readFileSync(swPath, 'utf-8');
    
    expect(content).toContain('/book-a-consultation');
    expect(content).toContain('/images/og-image.jpg');
    expect(content).toContain('/images/twitter-image.jpg');
  });
  
  it('should have proper cache configuration', () => {
    const swPath = join(publicDir, 'service-worker.js');
    const content = readFileSync(swPath, 'utf-8');
    
    expect(content).toContain('addEventListener(\'install\'');
    expect(content).toContain('addEventListener(\'fetch\'');
    expect(content).toContain('addEventListener(\'activate\'');
  });
});