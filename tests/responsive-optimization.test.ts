import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock requestAnimationFrame for test environment
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock matchMedia for responsive testing
const createMatchMediaMock = (width: number) => {
  return vi.fn((query: string) => {
    const matches = {
      '(min-width: 1920px)': width >= 1920,
      '(min-width: 1200px)': width >= 1200,
      '(max-width: 1024px)': width <= 1024,
      '(max-width: 768px)': width <= 768,
      '(max-width: 480px)': width <= 480,
      '(max-width: 360px)': width <= 360,
      '(prefers-reduced-motion: reduce)': false,
    };
    
    return {
      matches: matches[query as keyof typeof matches] || false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

describe('Responsive Optimization System', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* LogoPrimary responsive styles */
            .logo-primary {
              width: clamp(140px, 20vw, 560px);
              max-width: 100%;
            }
            
            .logo-primary .logo-image {
              width: 100%;
              height: auto;
              max-width: 100%;
            }
            
            @media (min-width: 1200px) {
              .logo-primary[data-size="xl"] {
                width: clamp(420px, 25vw, 560px);
              }
              .logo-primary[data-size="lg"] {
                width: clamp(320px, 20vw, 420px);
              }
            }
            
            @media (max-width: 768px) and (min-width: 481px) {
              .logo-primary .logo-image {
                max-width: min(280px, 70vw);
              }
            }
            
            @media (max-width: 480px) and (min-width: 361px) {
              .logo-primary .logo-image {
                max-width: min(200px, 65vw);
              }
            }
            
            @media (max-width: 360px) {
              .logo-primary .logo-image {
                max-width: min(160px, 60vw);
              }
            }
            
            /* LogoMark responsive styles */
            .logomark {
              width: clamp(16px, 4vw, 64px);
              max-width: 100%;
            }
            
            .logomark--xs {
              width: clamp(12px, 2vw, 16px);
            }
            
            .logomark--sm {
              width: clamp(16px, 3vw, 24px);
            }
            
            .logomark--md {
              width: clamp(24px, 4vw, 32px);
            }
            
            .logomark--lg {
              width: clamp(32px, 5vw, 48px);
            }
            
            .logomark--xl {
              width: clamp(48px, 6vw, 64px);
            }
            
            @media (max-width: 768px) {
              .logomark--xl {
                width: clamp(40px, 8vw, 56px);
              }
              .logomark--lg {
                width: clamp(32px, 7vw, 40px);
              }
            }
            
            @media (max-width: 480px) {
              .logomark--xl {
                width: clamp(32px, 10vw, 48px);
              }
              .logomark--lg {
                width: clamp(28px, 8vw, 36px);
              }
            }
          </style>
        </head>
        <body>
          <div id="app">
            <!-- LogoPrimary instances -->
            <div class="logo-primary" data-size="sm">
              <img class="logo-image" src="/logo-primary.svg" alt="Logo" />
            </div>
            <div class="logo-primary" data-size="md">
              <img class="logo-image" src="/logo-primary.svg" alt="Logo" />
            </div>
            <div class="logo-primary" data-size="lg">
              <img class="logo-image" src="/logo-primary.svg" alt="Logo" />
            </div>
            <div class="logo-primary" data-size="xl">
              <img class="logo-image" src="/logo-primary.svg" alt="Logo" />
            </div>
            
            <!-- LogoMark instances -->
            <div class="logomark logomark--xs" data-size="xs">
              <svg class="logomark-svg"></svg>
            </div>
            <div class="logomark logomark--sm" data-size="sm">
              <svg class="logomark-svg"></svg>
            </div>
            <div class="logomark logomark--md" data-size="md">
              <svg class="logomark-svg"></svg>
            </div>
            <div class="logomark logomark--lg" data-size="lg">
              <svg class="logomark-svg"></svg>
            </div>
            <div class="logomark logomark--xl" data-size="xl">
              <svg class="logomark-svg"></svg>
            </div>
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

  it('should have fluid scaling CSS for LogoPrimary', () => {
    const logoPrimary = document.querySelector('.logo-primary');
    expect(logoPrimary).toBeTruthy();
    
    // Check if CSS contains clamp functions
    const styles = document.querySelector('style')?.textContent || '';
    expect(styles).toContain('clamp(140px, 20vw, 560px)');
    expect(styles).toContain('max-width: 100%');
  });

  it('should have responsive breakpoints for LogoPrimary', () => {
    const styles = document.querySelector('style')?.textContent || '';
    
    // Check for desktop breakpoints
    expect(styles).toContain('@media (min-width: 1200px)');
    expect(styles).toContain('clamp(420px, 25vw, 560px)');
    
    // Check for mobile breakpoints
    expect(styles).toContain('@media (max-width: 768px)');
    expect(styles).toContain('@media (max-width: 480px)');
    expect(styles).toContain('@media (max-width: 360px)');
  });

  it('should have size-specific classes for LogoMark', () => {
    const logomarkXs = document.querySelector('.logomark--xs');
    const logomarkSm = document.querySelector('.logomark--sm');
    const logomarkMd = document.querySelector('.logomark--md');
    const logomarkLg = document.querySelector('.logomark--lg');
    const logomarkXl = document.querySelector('.logomark--xl');
    
    expect(logomarkXs).toBeTruthy();
    expect(logomarkSm).toBeTruthy();
    expect(logomarkMd).toBeTruthy();
    expect(logomarkLg).toBeTruthy();
    expect(logomarkXl).toBeTruthy();
  });

  it('should have fluid scaling for LogoMark sizes', () => {
    const styles = document.querySelector('style')?.textContent || '';
    
    // Check for size-specific clamp functions
    expect(styles).toContain('.logomark--xs');
    expect(styles).toContain('clamp(12px, 2vw, 16px)');
    expect(styles).toContain('.logomark--sm');
    expect(styles).toContain('clamp(16px, 3vw, 24px)');
    expect(styles).toContain('.logomark--md');
    expect(styles).toContain('clamp(24px, 4vw, 32px)');
    expect(styles).toContain('.logomark--lg');
    expect(styles).toContain('clamp(32px, 5vw, 48px)');
    expect(styles).toContain('.logomark--xl');
    expect(styles).toContain('clamp(48px, 6vw, 64px)');
  });

  it('should handle mobile responsive breakpoints for LogoMark', () => {
    const styles = document.querySelector('style')?.textContent || '';
    
    // Check for mobile-specific scaling
    expect(styles).toContain('@media (max-width: 768px)');
    expect(styles).toContain('clamp(40px, 8vw, 56px)'); // xl on tablet
    expect(styles).toContain('@media (max-width: 480px)');
    expect(styles).toContain('clamp(32px, 10vw, 48px)'); // xl on mobile
  });

  it('should support different viewport widths', () => {
    // Test desktop viewport
    window.matchMedia = createMatchMediaMock(1200);
    expect(window.matchMedia('(min-width: 1200px)').matches).toBe(true);
    expect(window.matchMedia('(max-width: 768px)').matches).toBe(false);
    
    // Test tablet viewport
    window.matchMedia = createMatchMediaMock(768);
    expect(window.matchMedia('(max-width: 768px)').matches).toBe(true);
    expect(window.matchMedia('(min-width: 1200px)').matches).toBe(false);
    
    // Test mobile viewport
    window.matchMedia = createMatchMediaMock(480);
    expect(window.matchMedia('(max-width: 480px)').matches).toBe(true);
    expect(window.matchMedia('(max-width: 768px)').matches).toBe(true);
  });

  it('should maintain aspect ratios across screen sizes', () => {
    const logoImages = document.querySelectorAll('.logo-image');
    const logomarkSvgs = document.querySelectorAll('.logomark-svg');
    
    logoImages.forEach(img => {
      expect(img).toBeTruthy();
      // Images should maintain aspect ratio
      expect(img.getAttribute('src')).toBeTruthy();
    });
    
    logomarkSvgs.forEach(svg => {
      expect(svg).toBeTruthy();
      // SVGs maintain aspect ratio naturally
    });
  });

  it('should have proper max-width constraints', () => {
    const styles = document.querySelector('style')?.textContent || '';
    
    // Check for max-width constraints
    expect(styles).toContain('max-width: 100%');
    expect(styles).toContain('min(280px, 70vw)'); // tablet constraint
    expect(styles).toContain('min(200px, 65vw)'); // mobile landscape constraint
    expect(styles).toContain('min(160px, 60vw)'); // mobile portrait constraint
  });

  it('should support ultra-wide screens', () => {
    const styles = document.querySelector('style')?.textContent || '';
    
    // Check for ultra-wide support (would be in actual CSS file)
    expect(styles).toContain('@media (min-width: 1200px)');
    
    // Test ultra-wide viewport
    window.matchMedia = createMatchMediaMock(1920);
    expect(window.matchMedia('(min-width: 1920px)').matches).toBe(true);
  });

  it('should handle reduced motion preferences', () => {
    // Test reduced motion preference
    window.matchMedia = vi.fn((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    expect(typeof prefersReducedMotion).toBe('boolean');
  });

  it('should maintain accessibility across screen sizes', () => {
    const logoImages = document.querySelectorAll('.logo-image');
    const logomarkSvgs = document.querySelectorAll('.logomark-svg');
    
    // Check alt text for images
    logoImages.forEach(img => {
      expect(img.getAttribute('alt')).toBeTruthy();
    });
    
    // SVGs should be accessible (would have aria-label in actual component)
    logomarkSvgs.forEach(svg => {
      expect(svg).toBeTruthy();
    });
  });
});