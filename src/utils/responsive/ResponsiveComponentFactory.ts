/**
 * Responsive Component Factory
 * Creates responsive UI components with accessibility features
 */

import type { NavigationItem, ResponsiveImageConfig } from './types';

export class ResponsiveComponentFactory {

  constructor() {
  }

  /**
   * Create responsive image with accessibility features
   */
  public createResponsiveImage(config: ResponsiveImageConfig): HTMLPictureElement {
    const picture = document.createElement('picture');
    const img = document.createElement('img');

    // Set basic attributes
    img.src = config.src;
    img.alt = config.alt;
    img.loading = config.loading || 'lazy';

    // Apply responsive sizing
    if (config.srcset) {
      img.srcset = config.srcset;
    }

    if (config.sizes) {
      img.sizes = config.sizes;
    } else {
      // Generate default sizes based on breakpoints
      img.sizes = this.generateDefaultSizes();
    }

    // Apply aspect ratio for layout stability
    if (config.aspectRatio) {
      img.style.aspectRatio = config.aspectRatio;
    }

    // Add accessibility enhancements
    img.style.maxWidth = '100%';
    img.style.height = 'auto';

    // Prevent layout shift
    img.style.display = 'block';

    picture.appendChild(img);
    return picture;
  }

  /**
   * Create responsive navigation with accessibility
   */
  public createResponsiveNavigation(items: NavigationItem[]): HTMLElement {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    // const state = this.stateManager.getCurrentState();

    // if (state.isMobile) {
    //   return this.createMobileNavigation(nav, items);
    // } else {
    return this.createDesktopNavigation(nav, items);
    // }
  }

  /**
   * Generate default responsive image sizes
   */
  private generateDefaultSizes(): string {
    return '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw';
  }



  /**
   * Create desktop navigation
   */
  private createDesktopNavigation(nav: HTMLElement, items: NavigationItem[]): HTMLElement {
    nav.classList.add('desktop-navigation');

    const menu = document.createElement('ul');
    menu.setAttribute('role', 'menubar');
    menu.classList.add('desktop-menu');

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');

      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.text;
      link.setAttribute('role', 'menuitem');
      link.setAttribute('tabindex', index === 0 ? '0' : '-1');

      // Add icon if provided
      if (item.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = item.icon;
        iconSpan.setAttribute('aria-hidden', 'true');
        link.insertBefore(iconSpan, link.firstChild);
      }

      li.appendChild(link);
      menu.appendChild(li);
    });

    // Add keyboard navigation
    this.addDesktopKeyboardNavigation(menu);

    nav.appendChild(menu);
    return nav;
  }



  /**
   * Add keyboard navigation to desktop menu
   */
  private addDesktopKeyboardNavigation(menu: HTMLUListElement): void {
    const menuItems = menu.querySelectorAll('a[role="menuitem"]');

    menuItems.forEach((item, index) => {
      item.addEventListener('keydown', event => {
        const key = (event as KeyboardEvent).key;
        let targetIndex = index;

        switch (key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            targetIndex = (index + 1) % menuItems.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            targetIndex = (index - 1 + menuItems.length) % menuItems.length;
            break;
          case 'Home':
            event.preventDefault();
            targetIndex = 0;
            break;
          case 'End':
            event.preventDefault();
            targetIndex = menuItems.length - 1;
            break;
          default:
            return;
        }

        // Update tabindex and focus
        menuItems.forEach((menuItem, i) => {
          (menuItem as HTMLElement).setAttribute('tabindex', i === targetIndex ? '0' : '-1');
        });

        (menuItems[targetIndex] as HTMLElement).focus();
      });
    });
  }
}
