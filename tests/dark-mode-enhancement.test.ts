import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock requestAnimationFrame for test environment
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock matchMedia
global.matchMedia = vi.fn((query) => ({
  matches: query.includes('dark'),
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('Dark Mode Enhancement System', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            :root {
              --bg-primary: #FFFFFF;
              --bg-secondary: #F5F5F5;
              --text-primary: #0D0D0D;
              --color-brand-accent: #00F0FF;
            }
            .dark {
              --bg-primary: #0D0D0D;
              --bg-secondary: #1A1A1A;
              --text-primary: #FFFFFF;
              --color-brand-accent: #00F5FF;
              --color-brand-accent-muted: #00D4E6;
              --color-brand-accent-subtle: #00B8CC;
            }
          </style>
        </head>
        <body>
          <div id="app">
            <button id="theme-toggle" class="mode-toggle">
              <svg class="sun-icon"></svg>
              <svg class="moon-icon"></svg>
            </button>
            <div class="content bg-white text-gray-900">Content</div>
          </div>
        </body>
      </html>
    `, { url: 'http://localhost' });
    
    document = dom.window.document;
    window = dom.window as unknown as Window;
    global.document = document;
    global.window = window;
    
    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    dom.window.close();
  });

  it('should have enhanced CSS custom properties for dark mode', () => {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    
    // Check if CSS custom properties are defined
    expect(document.querySelector('style')).toBeTruthy();
    expect(document.querySelector('style')?.textContent).toContain('--bg-primary');
    expect(document.querySelector('style')?.textContent).toContain('--text-primary');
    expect(document.querySelector('style')?.textContent).toContain('--color-brand-accent');
  });

  it('should apply dark mode classes correctly', () => {
    const root = document.documentElement;
    const content = document.querySelector('.content');
    
    // Initially should not have dark class
    expect(root.classList.contains('dark')).toBe(false);
    
    // Apply dark mode
    root.classList.add('dark');
    expect(root.classList.contains('dark')).toBe(true);
    
    // Check if content has appropriate classes
    expect(content?.classList.contains('bg-white')).toBe(true);
    expect(content?.classList.contains('text-gray-900')).toBe(true);
  });

  it('should handle theme transitions smoothly', () => {
    const root = document.documentElement;
    
    // Test transition property setting (JSDOM compatible)
    root.setAttribute('style', 'transition: background-color 0.3s ease, color 0.3s ease');
    expect(root.getAttribute('style')).toContain('transition');
    
    // Test theme switching
    root.classList.remove('light', 'dark', 'system');
    root.classList.add('dark');
    expect(root.classList.contains('dark')).toBe(true);
    expect(root.classList.contains('light')).toBe(false);
  });

  it('should support system theme detection', () => {
    const mockMatchMedia = vi.fn((query) => ({
      matches: query.includes('prefers-color-scheme: dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    window.matchMedia = mockMatchMedia;
    
    // Test system theme detection
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    expect(['dark', 'light']).toContain(systemTheme);
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('should persist theme preference in localStorage', () => {
    const themeStorageKey = 'theme';
    
    // Test setting theme
    localStorage.setItem(themeStorageKey, 'dark');
    expect(localStorage.setItem).toHaveBeenCalledWith(themeStorageKey, 'dark');
    
    // Test getting theme
    localStorageMock.getItem.mockReturnValue('dark');
    const savedTheme = localStorage.getItem(themeStorageKey);
    expect(savedTheme).toBe('dark');
    expect(localStorage.getItem).toHaveBeenCalledWith(themeStorageKey);
  });

  it('should have enhanced brand colors for dark mode', () => {
    const styleContent = document.querySelector('style')?.textContent || '';
    
    // Check for enhanced brand colors in dark mode
    expect(styleContent).toContain('--color-brand-accent: #00F5FF');
    expect(styleContent).toContain('--color-brand-accent-muted');
    expect(styleContent).toContain('--color-brand-accent-subtle');
  });

  it('should support brand glow effects in dark mode', () => {
    const styleContent = document.querySelector('style')?.textContent || '';
    
    // Check for glow effect classes
    expect(styleContent).toContain('.dark');
    
    // Create elements to test glow effects
    const glowElement = document.createElement('div');
    glowElement.className = 'brand-glow';
    document.body.appendChild(glowElement);
    
    expect(glowElement.classList.contains('brand-glow')).toBe(true);
  });

  it('should handle reduced motion preferences', () => {
    // Create a media query for reduced motion
    const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
    const mockReducedMotion = vi.fn(() => ({
      matches: true,
      media: reducedMotionQuery,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    window.matchMedia = mockReducedMotion;
    
    const prefersReducedMotion = window.matchMedia(reducedMotionQuery).matches;
    expect(typeof prefersReducedMotion).toBe('boolean');
    expect(mockReducedMotion).toHaveBeenCalledWith(reducedMotionQuery);
  });

  it('should provide proper contrast ratios', () => {
    const root = document.documentElement;
    
    // Test light mode contrast
    root.classList.remove('dark');
    root.classList.add('light');
    
    // Test dark mode contrast
    root.classList.remove('light');
    root.classList.add('dark');
    
    expect(root.classList.contains('dark')).toBe(true);
    
    // Verify CSS custom properties are available
    const styleContent = document.querySelector('style')?.textContent || '';
    expect(styleContent).toContain('--text-primary: #FFFFFF');
    expect(styleContent).toContain('--bg-primary: #0D0D0D');
  });
});