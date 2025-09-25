export function initMobileMenu() {
  document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  let isMenuOpen = false;

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;

      if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('animate-fade-in');
        mobileMenuButton.classList.add('menu-open');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('animate-fade-in');
        mobileMenuButton.classList.remove('menu-open');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target) && isMenuOpen) {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('animate-fade-in');
        mobileMenuButton.classList.remove('menu-open');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('animate-fade-in');
        mobileMenuButton.classList.remove('menu-open');
        mobileMenuButton.focus(); // Return focus to menu button
      }
    });

    // Keyboard navigation within mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      if (!isMenuOpen) return;

      const focusableElements = mobileMenu.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusableArray = Array.from(focusableElements);
      const currentIndex = focusableArray.indexOf(document.activeElement);

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift+Tab (previous)
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableArray.length - 1;
          focusableArray[prevIndex].focus();
        } else {
          // Tab (next)
          e.preventDefault();
          const nextIndex = currentIndex < focusableArray.length - 1 ? currentIndex + 1 : 0;
          focusableArray[nextIndex].focus();
        }
      }
    });
  }

  // Mobile dropdown functionality
  const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdownContent = toggle.nextElementSibling;
      const arrow = toggle.querySelector('svg');

      if (dropdownContent.classList.contains('hidden')) {
        dropdownContent.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
      } else {
        dropdownContent.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Add event listener to the mobile CTA button
  const mobileCTAButton = mobileMenu?.querySelector('button');
  if (mobileCTAButton) {
    mobileCTAButton.addEventListener('click', () => {
      window.location.href = '/contact';
    });
  }
  });
}