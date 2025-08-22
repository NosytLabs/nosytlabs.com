/**
 * Unified Accessibility Utilities
 * Consolidates focus management and interaction states for comprehensive WCAG AA compliance
 * Combines functionality from focus-management.ts and interaction-states.ts
 */

import { logger } from './logger';

// Define InteractionState interface if not already defined
export interface InteractionState {
  hover: boolean;
  focus: boolean;
  active: boolean;
  disabled: boolean;
}

export interface FocusableElement extends HTMLElement {
  focus(): void;
  blur(): void;
}

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | string;
  returnFocus?: HTMLElement;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
}

export interface InteractionStateOptions {
  enableHover?: boolean;
  enableFocus?: boolean;
  enableActive?: boolean;
  respectMotionPreferences?: boolean;
  highContrast?: boolean;
  customFocusColor?: string;
}

export interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  isKeyboardUser: boolean;
  colorScheme: 'light' | 'dark';
}

/**
 * Unified Accessibility Manager
 * Handles focus management, interaction states, and user preferences
 */
export class UnifiedAccessibilityManager {
  private static instance: UnifiedAccessibilityManager;

  // Focus management properties
  private focusHistory: HTMLElement[] = [];
  private activeFocusTraps: Set<HTMLElement> = new Set();

  // Interaction state properties
  private prefersReducedMotion: boolean = false;
  private prefersHighContrast: boolean = false;
  private isKeyboardUser: boolean = false;
  private colorScheme: 'light' | 'dark' = 'light';

  // Focusable elements selector
  private readonly focusableSelector = [
    'button:not([disabled]):not([aria-hidden="true"])',
    '[href]:not([disabled]):not([aria-hidden="true"])',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
    'select:not([disabled]):not([aria-hidden="true"])',
    'textarea:not([disabled]):not([aria-hidden="true"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
    'details:not([disabled]):not([aria-hidden="true"])',
    'summary:not([disabled]):not([aria-hidden="true"])',
    '[contenteditable="true"]:not([aria-hidden="true"])',
    'audio[controls]:not([disabled]):not([aria-hidden="true"])',
    'video[controls]:not([disabled]):not([aria-hidden="true"])',
    'iframe:not([disabled]):not([aria-hidden="true"])',
  ].join(', ');

  public static getInstance(): UnifiedAccessibilityManager {
    if (!UnifiedAccessibilityManager.instance) {
      UnifiedAccessibilityManager.instance = new UnifiedAccessibilityManager();
    }
    return UnifiedAccessibilityManager.instance;
  }

  private constructor() {
    if (typeof document !== 'undefined') {
      this.setupGlobalKeyboardHandlers();
      this.setupFocusTracking();
      this.setupMediaQueryListeners();
      this.setupKeyboardDetection();
      this.injectAccessibilityStyles();
    }
  }

  // ===================
  // FOCUS MANAGEMENT
  // ===================

  /**
   * Get all focusable elements within a container
   */
  public getFocusableElements(container?: HTMLElement): HTMLElement[] {
    if (typeof document === 'undefined') {
      return [];
    }

    const actualContainer = container || document.body;
    const elements = Array.from(
      actualContainer.querySelectorAll(this.focusableSelector)
    ) as HTMLElement[];

    return elements.filter(element => {
      const style = window.getComputedStyle(element);
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        !element.hasAttribute('inert')
      );
    });
  }

  /**
   * Create a focus trap within a container
   */
  public createFocusTrap(container: HTMLElement, options: FocusTrapOptions = {}): () => void {
    const focusableElements = this.getFocusableElements(container);

    if (focusableElements.length === 0) {
      logger.warn('No focusable elements found in focus trap container', 'focus');
      return () => {};
    }

    const firstElement = focusableElements[0];
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus initial element
    const initialFocus = options.initialFocus;
    if (typeof initialFocus === 'string') {
      const element = container.querySelector(initialFocus) as HTMLElement;
      element?.focus();
    } else if (initialFocus) {
      initialFocus.focus();
    } else {
      firstElement?.focus();
    }

    this.activeFocusTraps.add(container);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const currentFocusable = this.getFocusableElements(container);
        if (currentFocusable.length === 0) return;

        const currentFirst = currentFocusable[0];
        const currentLast = currentFocusable[currentFocusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === currentFirst) {
            event.preventDefault();
            currentLast?.focus();
          }
        } else {
          if (document.activeElement === currentLast) {
            event.preventDefault();
            currentFirst?.focus();
          }
        }
      } else if (event.key === 'Escape' && options.escapeDeactivates !== false) {
        event.preventDefault();
        deactivate();
      }
    };

    const handleClick = (event: Event) => {
      if (options.allowOutsideClick === false && !container.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
        firstElement?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    if (options.allowOutsideClick === false) {
      document.addEventListener('click', handleClick, true);
    }

    const deactivate = () => {
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick, true);
      this.activeFocusTraps.delete(container);

      const returnElement = options.returnFocus || previouslyFocused;
      if (returnElement && document.body.contains(returnElement)) {
        returnElement.focus();
      }
    };

    return deactivate;
  }

  /**
   * Navigation methods
   */
  public focusNext(container: HTMLElement = document.body): void {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex === -1) {
      focusableElements[0]?.focus();
    } else {
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex]?.focus();
    }
  }

  public focusPrevious(container: HTMLElement = document.body): void {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex === -1) {
      focusableElements[focusableElements.length - 1]?.focus();
    } else {
      const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      focusableElements[prevIndex]?.focus();
    }
  }

  public focusFirst(container: HTMLElement = document.body): void {
    const focusableElements = this.getFocusableElements(container);
    focusableElements[0]?.focus();
  }

  public focusLast(container: HTMLElement = document.body): void {
    const focusableElements = this.getFocusableElements(container);
    focusableElements[focusableElements.length - 1]?.focus();
  }

  public restoreFocus(): void {
    const lastFocused = this.focusHistory[this.focusHistory.length - 1];
    if (lastFocused && document.body.contains(lastFocused)) {
      lastFocused.focus();
    }
  }

  public isFocusable(element: HTMLElement): boolean {
    if (
      !element ||
      element.hasAttribute('disabled') ||
      element.getAttribute('aria-hidden') === 'true'
    ) {
      return false;
    }

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === '-1') {
      return false;
    }

    return element.matches(this.focusableSelector.split(', ').join(':not([tabindex="-1"]), '));
  }

  // ===================
  // INTERACTION STATES
  // ===================

  /**
   * Apply comprehensive interaction states to an element
   */
  public applyInteractionStates(
    element: HTMLElement,
    options: InteractionStateOptions = {}
  ): () => void {
    const {
      enableHover = true,
      enableFocus = true,
      enableActive = true,
      respectMotionPreferences = true,
      highContrast = false,
      customFocusColor,
    } = options;

    // Store original styles
    const originalStyles = {
      transition: element.style.transition,
      outline: element.style.outline,
      boxShadow: element.style.boxShadow,
    };

    // Apply base accessibility styles
    this.applyBaseAccessibilityStyles(element, customFocusColor);

    // Event handlers
    const handlers: { [key: string]: EventListener } = {};

    if (enableHover) {
      handlers.mouseenter = () => this.handleHoverStart(element, respectMotionPreferences);
      handlers.mouseleave = () => this.handleHoverEnd(element, respectMotionPreferences);
    }

    if (enableFocus) {
      handlers.focusin = () => this.handleFocusStart(element, customFocusColor, highContrast);
      handlers.focusout = () => this.handleFocusEnd(element);
    }

    if (enableActive) {
      handlers.mousedown = () => this.handleActiveStart(element);
      handlers.mouseup = () => this.handleActiveEnd(element);
      handlers.keydown = (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === ' ' || keyEvent.key === 'Enter') {
          this.handleActiveStart(element);
        }
      };
      handlers.keyup = (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === ' ' || keyEvent.key === 'Enter') {
          this.handleActiveEnd(element);
        }
      };
    }

    // Add event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });

    // Return cleanup function
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        element.removeEventListener(event, handler);
      });

      // Restore original styles
      Object.entries(originalStyles).forEach(([property, value]) => {
        if (value) {
          (element.style as any)[property] = value;
        } else {
          element.style.removeProperty(property);
        }
      });
    };
  }

  // ===================
  // ACCESSIBILITY PREFERENCES
  // ===================

  public getPreferences(): AccessibilityPreferences {
    return {
      prefersReducedMotion: this.prefersReducedMotion,
      prefersHighContrast: this.prefersHighContrast,
      isKeyboardUser: this.isKeyboardUser,
      colorScheme: this.colorScheme,
    };
  }

  /**
   * Check if keyboard navigation is being used
   */
  public getIsKeyboardUser(): boolean {
    return this.isKeyboardUser;
  }

  /**
   * Update accessibility preferences
   */
  public updatePreferences(preferences: Partial<AccessibilityPreferences>): void {
    if (preferences.prefersReducedMotion !== undefined) {
      this.prefersReducedMotion = preferences.prefersReducedMotion;
      this.updateGlobalMotionPreferences(preferences.prefersReducedMotion);
    }
    if (preferences.prefersHighContrast !== undefined) {
      this.prefersHighContrast = preferences.prefersHighContrast;
      this.updateGlobalContrastPreferences(preferences.prefersHighContrast);
    }
    if (preferences.isKeyboardUser !== undefined) {
      this.isKeyboardUser = preferences.isKeyboardUser;
    }
    if (preferences.colorScheme !== undefined) {
      this.colorScheme = preferences.colorScheme;
      this.updateColorSchemePreferences(preferences.colorScheme === 'dark');
    }
  }

  /**
   * Get current interaction state for an element
   */
  public getElementState(element: HTMLElement): InteractionState | undefined {
    // This is a simplified implementation - in a full implementation,
    // you would track element states in a WeakMap
    return {
      hover: element.classList.contains('interaction-hover'),
      focus: element.classList.contains('interaction-focus'),
      active: element.classList.contains('interaction-active'),
      disabled:
        element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true',
    };
  }

  /**
   * Set focus to an element with proper error handling
   */
  public focusElement(element: HTMLElement | string): boolean {
    try {
      const targetElement =
        typeof element === 'string' ? (document.querySelector(element) as HTMLElement) : element;

      if (!targetElement || !this.isFocusable(targetElement)) {
        logger.warn('Focus target is not focusable');
        return false;
      }

      targetElement.focus();
      this.addToFocusHistory(targetElement);

      // Ensure focus is visible
      if (targetElement.scrollIntoView) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }

      return true;
    } catch (error) {
      logger.error(
        'Failed to focus element',
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * Get the current focus history
   */
  public getFocusHistory(): HTMLElement[] {
    return [...this.focusHistory];
  }

  /**
   * Clear focus history
   */
  public clearFocusHistory(): void {
    this.focusHistory = [];
  }

  /**
   * Check if any focus traps are currently active
   */
  public hasActiveFocusTraps(): boolean {
    return this.activeFocusTraps.size > 0;
  }

  /**
   * Get all active focus trap containers
   */
  public getActiveFocusTraps(): HTMLElement[] {
    return Array.from(this.activeFocusTraps);
  }

  /**
   * Apply responsive touch targets for better accessibility
   */
  public applyResponsiveTouchTargets(element: HTMLElement): void {
    if (typeof document === 'undefined') return;

    // Ensure minimum touch target size (44px x 44px per WCAG AA)
    const computedStyle = window.getComputedStyle(element);
    const currentHeight = parseInt(computedStyle.height) || 0;
    const currentWidth = parseInt(computedStyle.width) || 0;
    
    const minTouchTarget = 44; // WCAG AA minimum
    
    if (currentHeight < minTouchTarget) {
      element.style.minHeight = `${minTouchTarget}px`;
    }
    
    if (currentWidth < minTouchTarget && element.tagName.toLowerCase() === 'button') {
      element.style.minWidth = `${minTouchTarget}px`;
    }
    
    // Add padding for better touch targets
    if (!computedStyle.padding || computedStyle.padding === '0px') {
      element.style.padding = '8px 12px';
    }
    
    // Ensure proper spacing between touch targets
    element.style.margin = element.style.margin || '4px';
  }

  // ===================
  // PRIVATE METHODS
  // ===================

  private applyBaseAccessibilityStyles(element: HTMLElement, customFocusColor?: string): void {
    if (this.isInteractiveElement(element) && !element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    if (this.isButtonLike(element) && !element.getAttribute('role')) {
      element.setAttribute('role', 'button');
    }

    const focusColor = customFocusColor || 'var(--focus-color, var(--color-focus-outline))';
    element.style.setProperty('--element-focus-color', focusColor);
  }

  private handleHoverStart(element: HTMLElement, respectMotion: boolean): void {
    if (this.isKeyboardUser) return;

    element.classList.add('interaction-hover');

    if (!this.prefersReducedMotion || !respectMotion) {
      element.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.transform = 'translateY(-1px)';
    }

    if (element.hasAttribute('aria-describedby') || element.hasAttribute('title')) {
      this.announceToScreenReader(`Hovering over ${this.getElementDescription(element)}`, 'polite');
    }
  }

  private handleHoverEnd(element: HTMLElement, respectMotion: boolean): void {
    element.classList.remove('interaction-hover');

    if (!this.prefersReducedMotion || !respectMotion) {
      element.style.transform = '';
    }
  }

  private handleFocusStart(
    element: HTMLElement,
    customColor?: string,
    highContrast?: boolean
  ): void {
    element.classList.add('interaction-focus');

    const focusColor = customColor || (highContrast ? 'CanvasText' : 'var(--color-focus-outline)');
    const focusWidth = highContrast || this.prefersHighContrast ? '3px' : '2px';
    const focusOffset = '2px';

    element.style.outline = `${focusWidth} solid ${focusColor}`;
    element.style.outlineOffset = focusOffset;
    element.style.setProperty('--element-focus-color', focusColor);

    if (!this.prefersReducedMotion && !(highContrast || this.prefersHighContrast)) {
      element.style.boxShadow =
        '0 0 0 4px color-mix(in srgb, var(--element-focus-color, var(--color-focus-outline)) 20%, transparent)';
    }

    this.announceToScreenReader(`Focused on ${this.getElementDescription(element)}`, 'polite');
  }

  private handleFocusEnd(element: HTMLElement): void {
    element.classList.remove('interaction-focus');
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.style.boxShadow = '';
  }

  private handleActiveStart(element: HTMLElement): void {
    element.classList.add('interaction-active');

    if (!this.prefersReducedMotion) {
      element.style.transform = 'scale(0.98)';
    }
  }

  private handleActiveEnd(element: HTMLElement): void {
    element.classList.remove('interaction-active');
    element.style.transform = '';
  }

  private setupGlobalKeyboardHandlers(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.handleEscapeKey(event);
      }

      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
        this.isKeyboardUser = true;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowNavigation(event);
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
      this.isKeyboardUser = false;
    });

    document.addEventListener('focusin', event => {
      const target = event.target as HTMLElement;
      if (target && this.isFocusable(target)) {
        this.addToFocusHistory(target);
      }
    });
  }

  private setupFocusTracking(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('focusin', event => {
      const target = event.target as HTMLElement;
      if (target && target !== document.body) {
        this.addToFocusHistory(target);
      }
    });
  }

  private setupMediaQueryListeners(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      this.prefersReducedMotion = false;
      this.prefersHighContrast = false;
      return;
    }

    // Reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = reducedMotionQuery.matches;
    reducedMotionQuery.addEventListener('change', e => {
      this.prefersReducedMotion = e.matches;
      this.updateGlobalMotionPreferences(e.matches);
    });

    // High contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    this.prefersHighContrast = highContrastQuery.matches;
    highContrastQuery.addEventListener('change', e => {
      this.prefersHighContrast = e.matches;
      this.updateGlobalContrastPreferences(e.matches);
    });

    // Color scheme preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.colorScheme = darkModeQuery.matches ? 'dark' : 'light';
    darkModeQuery.addEventListener('change', e => {
      this.colorScheme = e.matches ? 'dark' : 'light';
      this.updateColorSchemePreferences(e.matches);
    });
  }

  private setupKeyboardDetection(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        this.isKeyboardUser = true;
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      this.isKeyboardUser = false;
      document.body.classList.remove('keyboard-navigation');
    });
  }

  private injectAccessibilityStyles(): void {
    if (typeof document === 'undefined') return;

    const styleId = 'unified-accessibility-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Enhanced focus indicators for keyboard navigation */
      .keyboard-navigation *:focus {
        outline: 2px solid var(--element-focus-color, var(--color-focus-outline)) !important;
        outline-offset: 2px !important;
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .interaction-focus {
          outline-width: 3px !important;
          outline-color: CanvasText !important;
        }
        
        .interaction-hover {
          background-color: Highlight !important;
          color: HighlightText !important;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .interaction-hover,
        .interaction-focus,
        .interaction-active {
          transition: none !important;
          transform: none !important;
          animation: none !important;
        }
      }

      /* Enhanced interaction states */
      .interaction-hover {
        cursor: pointer;
      }

      .interaction-focus {
        position: relative;
        z-index: 1;
      }

      .interaction-active {
        position: relative;
      }

      /* Disabled state styling */
      [disabled], [aria-disabled="true"] {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Loading state styling */
      [aria-busy="true"] {
        cursor: wait;
        opacity: 0.8;
      }

      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }
    `;

    document.head.appendChild(style);
  }

  private addToFocusHistory(element: HTMLElement): void {
    const existingIndex = this.focusHistory.indexOf(element);
    if (existingIndex > -1) {
      this.focusHistory.splice(existingIndex, 1);
    }

    this.focusHistory.push(element);

    if (this.focusHistory.length > 10) {
      this.focusHistory.shift();
    }
  }

  private handleEscapeKey(_event: KeyboardEvent): void {
    if (this.activeFocusTraps.size > 0) {
      const traps = Array.from(this.activeFocusTraps);
      const lastTrap = traps[traps.length - 1];

      if (lastTrap) {
        const closeEvent = new CustomEvent('focustrap:close', {
          bubbles: true,
          cancelable: true,
          detail: { source: 'escape' },
        });

        lastTrap.dispatchEvent(closeEvent);
      }
    }

    const mobileMenu = document.querySelector('[data-mobile-menu]') as HTMLElement;
    if (mobileMenu && !mobileMenu.hidden) {
      const closeEvent = new CustomEvent('menu:close', {
        bubbles: true,
        cancelable: true,
        detail: { source: 'escape' },
      });
      mobileMenu.dispatchEvent(closeEvent);
    }
  }

  private handleArrowNavigation(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement;

    const menuContext = activeElement.closest('[role="menu"], [role="menubar"], nav, .navigation');
    if (!menuContext) return;

    const menuItems = Array.from(
      menuContext.querySelectorAll(
        '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], a, button'
      )
    ) as HTMLElement[];

    const currentIndex = menuItems.indexOf(activeElement);
    if (currentIndex === -1) return;

    let nextIndex: number;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % menuItems.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        break;
      default:
        return;
    }

    menuItems[nextIndex]?.focus();
  }

  private updateGlobalMotionPreferences(reducedMotion: boolean): void {
    if (typeof document === 'undefined') return;

    document.documentElement.style.setProperty(
      '--animation-duration',
      reducedMotion ? '0.01ms' : '250ms'
    );
    document.documentElement.style.setProperty(
      '--transition-duration',
      reducedMotion ? '0.01ms' : '200ms'
    );

    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }

  private updateGlobalContrastPreferences(highContrast: boolean): void {
    if (typeof document === 'undefined') return;

    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  private updateColorSchemePreferences(darkMode: boolean): void {
    if (typeof document === 'undefined') return;

    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'];

    return (
      interactiveTags.includes(element.tagName.toLowerCase()) ||
      interactiveRoles.includes(element.getAttribute('role') || '') ||
      element.hasAttribute('onclick') ||
      element.hasAttribute('tabindex')
    );
  }

  private isButtonLike(element: HTMLElement): boolean {
    return (
      element.tagName.toLowerCase() === 'button' ||
      element.getAttribute('role') === 'button' ||
      (element.hasAttribute('onclick') && !element.hasAttribute('href'))
    );
  }

  private getElementDescription(element: HTMLElement): string {
    return (
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      element.textContent?.trim() ||
      element.tagName.toLowerCase()
    );
  }

  private announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ): void {
    if ((window as any).announceToScreenReader) {
      (window as any).announceToScreenReader(message, priority);
    }
  }
}

// ===================
// SINGLETON INSTANCE
// ===================

let unifiedAccessibilityInstance: UnifiedAccessibilityManager | null = null;

const getUnifiedAccessibilityManager = (): UnifiedAccessibilityManager => {
  if (!unifiedAccessibilityInstance) {
    unifiedAccessibilityInstance = UnifiedAccessibilityManager.getInstance();
  }
  return unifiedAccessibilityInstance;
};

// ===================
// UNIFIED API EXPORTS
// ===================

// Focus Management API
export const createFocusTrap = (container: HTMLElement, options?: FocusTrapOptions) => {
  if (typeof document === 'undefined') return () => {};
  return getUnifiedAccessibilityManager().createFocusTrap(container, options);
};

export const getFocusableElements = (container?: HTMLElement) => {
  if (typeof document === 'undefined') return [];
  return getUnifiedAccessibilityManager().getFocusableElements(container);
};

export const focusFirst = (container?: HTMLElement) => {
  if (typeof document === 'undefined') return;
  return getUnifiedAccessibilityManager().focusFirst(container);
};

export const focusLast = (container?: HTMLElement) => {
  if (typeof document === 'undefined') return;
  return getUnifiedAccessibilityManager().focusLast(container);
};

export const focusNext = (container?: HTMLElement) => {
  if (typeof document === 'undefined') return;
  return getUnifiedAccessibilityManager().focusNext(container);
};

export const focusPrevious = (container?: HTMLElement) => {
  if (typeof document === 'undefined') return;
  return getUnifiedAccessibilityManager().focusPrevious(container);
};

export const isFocusable = (element: HTMLElement) => {
  if (typeof document === 'undefined') return false;
  return getUnifiedAccessibilityManager().isFocusable(element);
};

export const restoreFocus = () => {
  if (typeof document === 'undefined') return;
  return getUnifiedAccessibilityManager().restoreFocus();
};

// Interaction States API
export const applyInteractionStates = (element: HTMLElement, options?: InteractionStateOptions) => {
  if (typeof document === 'undefined') return () => {};
  return getUnifiedAccessibilityManager().applyInteractionStates(element, options);
};

// Responsive Touch Targets API
export const applyResponsiveTouchTargets = (element: HTMLElement) => {
  if (typeof document === 'undefined') return;
  return getUnifiedAccessibilityManager().applyResponsiveTouchTargets(element);
};

// Accessibility Preferences API
export const getAccessibilityPreferences = (): AccessibilityPreferences => {
  if (typeof document === 'undefined') {
    return {
      prefersReducedMotion: false,
      prefersHighContrast: false,
      isKeyboardUser: false,
      colorScheme: 'light',
    };
  }
  return getUnifiedAccessibilityManager().getPreferences();
};

export const getMotionPreference = () => {
  if (typeof document === 'undefined') return false;
  return getUnifiedAccessibilityManager().getPreferences().prefersReducedMotion;
};

export const getContrastPreference = () => {
  if (typeof document === 'undefined') return false;
  return getUnifiedAccessibilityManager().getPreferences().prefersHighContrast;
};

export const getKeyboardNavigation = () => {
  if (typeof document === 'undefined') return false;
  return getUnifiedAccessibilityManager().getPreferences().isKeyboardUser;
};

// ===================
// BACKWARD COMPATIBILITY
// ===================

// Legacy focus manager API
export const focusManager = {
  getInstance: getUnifiedAccessibilityManager,
  getFocusableElements,
  isFocusable,
  createFocusTrap,
  focusNext,
  focusPrevious,
  focusFirst,
  focusLast,
  restoreFocus,
};

// Legacy interaction state manager API
export const InteractionStateManager = UnifiedAccessibilityManager;

// Direct instance access
export const getFocusManager = getUnifiedAccessibilityManager;
export const getInteractionStateManager = getUnifiedAccessibilityManager;

// Export the main instance getter
export { getUnifiedAccessibilityManager };

// Note: UnifiedAccessibilityManager is already exported above
