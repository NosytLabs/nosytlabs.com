import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Service Worker', () => {
  const publicDir = join(process.cwd(), 'public');
  
  it('should have service worker file', () => {
    const swPath = join(publicDir, 'service-worker.js');
    expect(existsSync(swPath)).toBe(true);
  });
  
  it('should have proper cache configuration', () => {
    const swPath = join(publicDir, 'service-worker.js');
    const content = readFileSync(swPath, 'utf-8');
    
    expect(content).toContain('CACHE_NAME');
    expect(content).toContain('urlsToCache');
    expect(content).toContain('addEventListener(\'install\'');
    expect(content).toContain('addEventListener(\'fetch\'');
    expect(content).toContain('addEventListener(\'activate\'');
  });
  
  it('should cache essential resources', () => {
    const swPath = join(publicDir, 'service-worker.js');
    const content = readFileSync(swPath, 'utf-8');
    
    expect(content).toContain('/');
    expect(content).toContain('/about');
    expect(content).toContain('/services');
    expect(content).toContain('/contact');
  });
  
  it('should have offline functionality', () => {
    const swPath = join(publicDir, 'service-worker.js');
    const content = readFileSync(swPath, 'utf-8');
    
    expect(content).toContain('caches.match');
    expect(content).toContain('return response');
    expect(content).toContain('fetch(fetchRequest)');
  });
});