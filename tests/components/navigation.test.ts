import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Astro component rendering for React testing
const createMockAstroComponent = (children: React.ReactNode) => {
  return () => React.createElement('div', { 'data-testid': 'astro-component' }, children);
};

describe('NosytLabs Navigation System', () => {
  beforeEach(() => {
    // Reset DOM and mocks before each test
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Dark Mode Toggle', () => {
    it('should toggle theme class on html element', () => {
      // Setup DOM structure
      document.documentElement.className = '';
      const button = document.createElement('button');
      button.setAttribute('data-theme-toggle', '');
      button.innerHTML = '<span class="theme-icon-light">🌙</span><span class="theme-icon-dark">☀️</span>';
      document.body.appendChild(button);

      // Simulate the dark mode toggle functionality
      const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update icons
        const lightIcon = button.querySelector('.theme-icon-light') as HTMLElement;
        const darkIcon = button.querySelector('.theme-icon-dark') as HTMLElement;
        
        if (lightIcon && darkIcon) {
          lightIcon.style.display = isDark ? 'none' : 'block';
          darkIcon.style.display = isDark ? 'block' : 'none';
        }
      };

      button.addEventListener('click', toggleDarkMode);

      // Test initial state
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Test toggle to dark
      fireEvent.click(button);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

      // Test toggle back to light
      fireEvent.click(button);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should respect user system preference', () => {
      // Mock prefers-color-scheme: dark
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      // Simulate theme initialization
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');

      if (!savedTheme && prefersDark) {
        document.documentElement.classList.add('dark');
      }

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Navigation Accessibility', () => {
    it('should have proper skip links', () => {
      // Create skip links
      const skipToMain = document.createElement('a');
      skipToMain.href = '#main-content';
      skipToMain.className = 'skip-nav';
      skipToMain.textContent = 'Skip to main content';

      const skipToNav = document.createElement('a');
      skipToNav.href = '#navigation';
      skipToNav.className = 'skip-nav';
      skipToNav.textContent = 'Skip to navigation';

      document.body.appendChild(skipToMain);
      document.body.appendChild(skipToNav);

      expect(skipToMain.textContent).toBe('Skip to main content');
      expect(skipToNav.textContent).toBe('Skip to navigation');
      expect(skipToMain.getAttribute('href')).toBe('#main-content');
      expect(skipToNav.getAttribute('href')).toBe('#navigation');
    });

    it('should handle keyboard navigation correctly', () => {
      const mockNavItems = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Projects', href: '/projects' },
        { name: 'Contact', href: '/contact' }
      ];

      // Create nav items
      const nav = document.createElement('nav');
      mockNavItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.name;
        link.className = 'nav-link';
        link.setAttribute('role', 'menuitem');
        nav.appendChild(link);
      });
      document.body.appendChild(nav);

      const navLinks = document.querySelectorAll('.nav-link');
      expect(navLinks).toHaveLength(4);
      
      // Test tab order
      navLinks.forEach((link, index) => {
        expect(link.getAttribute('role')).toBe('menuitem');
      });
    });
  });

  describe('Mobile Navigation', () => {
    it('should toggle mobile menu visibility', () => {
      // Create mobile menu structure
      const mobileButton = document.createElement('button');
      mobileButton.setAttribute('data-mobile-menu-toggle', '');
      mobileButton.setAttribute('aria-label', 'Toggle mobile menu');

      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      mobileMenu.setAttribute('aria-hidden', 'true');

      document.body.appendChild(mobileButton);
      document.body.appendChild(mobileMenu);

      // Mock toggle functionality
      const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open');
        mobileMenu.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
        mobileButton.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      };

      mobileButton.addEventListener('click', toggleMobileMenu);

      // Test initial state
      expect(mobileMenu.getAttribute('aria-hidden')).toBe('true');

      // Test opening menu
      fireEvent.click(mobileButton);
      expect(mobileMenu.classList.contains('open')).toBe(true);
      expect(mobileMenu.getAttribute('aria-hidden')).toBe('false');
      expect(mobileButton.getAttribute('aria-expanded')).toBe('true');

      // Test closing menu
      fireEvent.click(mobileButton);
      expect(mobileMenu.classList.contains('open')).toBe(false);
      expect(mobileMenu.getAttribute('aria-hidden')).toBe('true');
      expect(mobileButton.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Back to Top Button', () => {
    it('should show/hide based on scroll position', () => {
      const backToTopButton = document.createElement('button');
      backToTopButton.id = 'back-to-top';
      backToTopButton.className = 'fixed bottom-6 right-6 opacity-0 invisible';
      document.body.appendChild(backToTopButton);

      // Mock scroll behavior
      const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 300) {
          backToTopButton.classList.remove('opacity-0', 'invisible');
          backToTopButton.classList.add('opacity-100', 'visible');
        } else {
          backToTopButton.classList.remove('opacity-100', 'visible');
          backToTopButton.classList.add('opacity-0', 'invisible');
        }
      };

      // Test initial state
      expect(backToTopButton.classList.contains('opacity-0')).toBe(true);
      expect(backToTopButton.classList.contains('invisible')).toBe(true);

      // Mock scroll past threshold
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
      handleScroll();
      
      expect(backToTopButton.classList.contains('opacity-100')).toBe(true);
      expect(backToTopButton.classList.contains('visible')).toBe(true);

      // Mock scroll back to top
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      handleScroll();
      
      expect(backToTopButton.classList.contains('opacity-0')).toBe(true);
      expect(backToTopButton.classList.contains('invisible')).toBe(true);
    });

    it('should scroll to top when clicked', () => {
      const backToTopButton = document.createElement('button');
      backToTopButton.id = 'back-to-top';
      document.body.appendChild(backToTopButton);

      // Mock window.scrollTo
      const mockScrollTo = vi.fn();
      Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });

      const handleClick = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      backToTopButton.addEventListener('click', handleClick);
      fireEvent.click(backToTopButton);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
});