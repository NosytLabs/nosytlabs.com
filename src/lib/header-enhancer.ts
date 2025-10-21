import { throttle } from './core/utils';

export function initializeHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const mobileMenuButton = document.getElementById('mobile-menu-button') as HTMLButtonElement;
  const mobileMenu = document.getElementById('mobile-menu') as HTMLElement;
  const mobileMenuClose = document.getElementById('mobile-menu-close') as HTMLButtonElement;
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  let isMenuOpen = false;

  // Ensure the mobile menu's top positioning is controlled by CSS variable
  // Remove any inline top styles or hardcoded Tailwind classes that could override it
  if (mobileMenu) {
    // Clear any inline top that may have been set previously
    mobileMenu.style.top = '';
    // Remove hardcoded top utility classes if present (e.g., top-16, top-20, etc.)
    const topUtilityClasses = Array.from(mobileMenu.classList).filter(cls => cls.startsWith('top-') && !cls.includes('['));
    topUtilityClasses.forEach(cls => mobileMenu.classList.remove(cls));

    // Guard against any script re-applying inline top by observing attribute mutations
    const topStyleObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'style') {
          // If an inline top sneaks in, clear it to keep CSS variable in control
          if (mobileMenu.style.top) {
            mobileMenu.style.top = '';
          }
          // Also remove any accidentally applied hardcoded top-* utility classes
          const strayTopClasses = Array.from(mobileMenu.classList).filter(cls => cls.startsWith('top-') && !cls.includes('['));
          strayTopClasses.forEach(cls => mobileMenu.classList.remove(cls));
        }
      }
    });
    topStyleObserver.observe(mobileMenu, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  // Portal mobile menu to body to escape transformed ancestor stacking context
  try {
    if (mobileMenu && mobileMenu.parentElement && mobileMenu.parentElement !== document.body) {
      document.body.appendChild(mobileMenu);
      (mobileMenu as HTMLElement).dataset.portalized = 'true';
    }
  } catch (_e) {
    // No-op: if moving fails, continue with existing structure
  }

  // Function to toggle mobile menu
  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    // Prefer direct style control to avoid conflicts with global CSS rules
    // that may keep the element hidden despite class changes.
    mobileMenu.style.display = isMenuOpen ? 'block' : 'none';
    // Slide the entire container into view to match Tailwind class intent
    mobileMenu.style.transform = isMenuOpen ? 'translateX(0)' : 'translateX(100%)';
    // Update accessibility state
    mobileMenu.setAttribute('aria-hidden', String(!isMenuOpen));

    // Ensure top remains governed by CSS variable, not inline overrides
    if (mobileMenu.style.top) {
      mobileMenu.style.top = '';
    }
    menuIcon?.classList.toggle('hidden');
    closeIcon?.classList.toggle('hidden');
    mobileMenuButton.setAttribute('aria-expanded', String(isMenuOpen));
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    // Ensure overlay captures clicks and header does not intercept
    mobileMenu.style.pointerEvents = isMenuOpen ? 'auto' : 'none';
    if (header) {
      header.style.pointerEvents = isMenuOpen ? 'none' : '';
    }
    
    // Focus management
    if (isMenuOpen) {
      // Focus first menu item when opening
      const firstMenuItem = mobileMenu.querySelector('a[href]') as HTMLElement;
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }
  }

  // Mobile menu event listener
  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  // Explicit close button handler (fixes timeout when attempting to close)
  mobileMenuClose?.addEventListener('click', () => {
    if (isMenuOpen) toggleMobileMenu();
  });

  // Close mobile menu when clicking a link inside the menu
  mobileMenu.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.closest('a')) {
      // Close the menu on navigation
      if (isMenuOpen) toggleMobileMenu();
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e: MouseEvent) => {
    if (!isMenuOpen) return;
    const target = e.target as HTMLElement;
    const withinMenu = target.closest('#mobile-menu');
    const isButton = target.closest('#mobile-menu-button');
    if (!withinMenu && !isButton) {
      toggleMobileMenu();
    }
  });

  // Enhanced keyboard navigation for mobile menu
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMobileMenu();
      mobileMenuButton.focus(); // Return focus to menu button
    }
  });

  // Focus trap for mobile menu
  function trapFocus(e: KeyboardEvent) {
    if (!isMenuOpen) return;
    
    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  document.addEventListener('keydown', trapFocus);

  // Scroll-based header class management with throttling for performance
  const throttledScrollHandler = throttle(() => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 16); // ~60fps
  
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
}
