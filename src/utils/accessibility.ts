/**
 * Unified Accessibility Utilities
 * Consolidates focus management, interaction states, and responsive accessibility enhancements
 * for comprehensive WCAG AA compliance. This module combines functionalities from
 * focus-management.ts, interaction-states.ts, AccessibilityEnhancer.ts, and ResponsiveStateManager.ts.
 */

import { logger } from './logger';

// ==================================
// INTERFACES AND TYPES
// ==================================

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

export interface BreakpointConfig {
  name: string;
  minWidth: number;
  maxWidth?: number;
  touchTarget: number;
  fontSize: {
    base: number;
    scale: number;
  };
}

export interface ResponsiveState {
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  touchDevice: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export type ResponsiveStateListener = (state: ResponsiveState) => void;


// ==================================
// RESPONSIVE STATE MANAGER
// ==================================

export class ResponsiveStateManager {
  private static instance: ResponsiveStateManager;
  private currentState: ResponsiveState;
  private listeners: Set<ResponsiveStateListener> = new Set();

  private readonly breakpoints: BreakpointConfig[] = [
    {
      name: 'mobile',
      minWidth: 0,
      maxWidth: 767,
      touchTarget: 44, // WCAG AA minimum touch target
      fontSize: { base: 16, scale: 1.0 },
    },
    {
      name: 'tablet',
      minWidth: 768,
      maxWidth: 1023,
      touchTarget: 44,
      fontSize: { base: 16, scale: 1.1 },
    },
    {
      name: 'desktop',
      minWidth: 1024,
      touchTarget: 32, // Smaller targets acceptable for mouse interaction
      fontSize: { base: 16, scale: 1.2 },
    },
  ];

  public static getInstance(): ResponsiveStateManager {
    if (!ResponsiveStateManager.instance) {
      ResponsiveStateManager.instance = new ResponsiveStateManager();
    }
    return ResponsiveStateManager.instance;
  }

  private constructor() {
    this.currentState = this.calculateCurrentState();
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.applyResponsiveStyles();
    }
  }

  public getCurrentState(): ResponsiveState {
    return { ...this.currentState };
  }

  public subscribe(callback: ResponsiveStateListener): () => void {
    this.listeners.add(callback);
    callback(this.currentState);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getCurrentBreakpoint(): BreakpointConfig {
    const found = this.breakpoints.find(bp => bp.name === this.currentState.breakpoint);
    if (found) return found;
    if (this.breakpoints.length === 0) {
      throw new Error('No breakpoints configured');
    }
    return this.breakpoints[0]!;
  }

  public matches(breakpointName: string): boolean {
    return this.currentState.breakpoint === breakpointName;
  }

  public getMinTouchTarget(): number {
    return this.getCurrentBreakpoint().touchTarget;
  }

  public getOptimalFontSize(baseSize: number = 16): number {
    const config = this.getCurrentBreakpoint();
    return Math.round(baseSize * config.fontSize.scale);
  }

  private calculateCurrentState(): ResponsiveState {
    if (typeof window === 'undefined') {
      return {
        breakpoint: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        touchDevice: false,
        screenReader: false,
        reducedMotion: false,
        highContrast: false,
      };
    }

    const width = window.innerWidth || 1024;
    const breakpoint = this.getBreakpointForWidth(width);

    return {
      breakpoint: breakpoint.name,
      isMobile: breakpoint.name === 'mobile',
      isTablet: breakpoint.name === 'tablet',
      isDesktop: breakpoint.name === 'desktop',
      touchDevice: this.isTouchDevice(),
      screenReader: this.isScreenReaderActive(),
      reducedMotion: this.getMediaQueryValue('(prefers-reduced-motion: reduce)'),
      highContrast: this.getMediaQueryValue('(prefers-contrast: high)'),
    };
  }

  private getBreakpointForWidth(width: number): BreakpointConfig {
    for (const breakpoint of this.breakpoints) {
      if (width >= breakpoint.minWidth && (!breakpoint.maxWidth || width <= breakpoint.maxWidth)) {
        return breakpoint;
      }
    }
    return this.breakpoints[this.breakpoints.length - 1]!;
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', this.debounce(() => this.updateState(), 150));
    window.addEventListener('orientationchange', () => setTimeout(() => this.updateState(), 100));

    if (typeof window.matchMedia === 'function') {
      this.setupMediaQueryListeners();
    }
  }

  private setupMediaQueryListeners(): void {
    if (!window.matchMedia) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', () => {
      this.currentState.reducedMotion = reducedMotionQuery.matches;
      this.notifyListeners();
    });

    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', () => {
      this.currentState.highContrast = highContrastQuery.matches;
      this.notifyListeners();
    });
  }

  private updateState(): void {
    const newState = this.calculateCurrentState();
    if (this.hasStateChanged(newState)) {
      this.currentState = newState;
      this.notifyListeners();
      this.applyResponsiveStyles();
    }
  }

  private applyResponsiveStyles(): void {
    if (typeof document === 'undefined') return;

    const config = this.getCurrentBreakpoint();
    document.documentElement.style.setProperty('--min-touch-target', `${config.touchTarget}px`);
    document.documentElement.style.setProperty('--responsive-font-scale', config.fontSize.scale.toString());
    document.documentElement.style.setProperty('--current-breakpoint', config.name);

    document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
    document.body.classList.add(`breakpoint-${config.name}`);

    if (this.currentState.touchDevice) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.remove('touch-device');
    }
  }

  private hasStateChanged(newState: ResponsiveState): boolean {
    return (
      newState.breakpoint !== this.currentState.breakpoint ||
      newState.touchDevice !== this.currentState.touchDevice ||
      newState.screenReader !== this.currentState.screenReader
    );
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentState);
      } catch (error) {
        logger.error(`Error in responsive state listener: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  }

  private isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0);
  }

  private isScreenReaderActive(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis?.speaking ||
      document.body.classList.contains('screen-reader-active')
    );
  }

  private getMediaQueryValue(query: string): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }

  private debounce<T extends (..._args: unknown[]) => unknown>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((..._args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, _args), wait);
    }) as T;
  }
}


// ==================================
// ACCESSIBILITY ENHANCER
// ==================================

export class AccessibilityEnhancer {
  private stateManager: ResponsiveStateManager;

  constructor(stateManager: ResponsiveStateManager) {
    this.stateManager = stateManager;
  }

  public applyResponsiveAccessibility(element: HTMLElement): void {
    const state = this.stateManager.getCurrentState();
    const config = this.stateManager.getCurrentBreakpoint();

    if (state.touchDevice && this.isInteractiveElement(element)) {
      const minSize = config.touchTarget;
      element.style.minHeight = `${minSize}px`;
      element.style.minWidth = `${minSize}px`;
    }

    if (this.isTextElement(element)) {
      const fontSize = this.stateManager.getOptimalFontSize();
      element.style.fontSize = `${fontSize}px`;
    }

    this.applyResponsiveSpacing(element, state);
    this.applyDeviceSpecificAttributes(element, state);
  }

  public enhanceFormAccessibility(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    const state = this.stateManager.getCurrentState();
    const minTouchTarget = this.stateManager.getMinTouchTarget();

    inputs.forEach(input => {
      const element = input as HTMLElement;
      if (state.touchDevice) {
        element.style.minHeight = `${minTouchTarget}px`;
        if (element.tagName === 'BUTTON') {
          element.style.minWidth = `${minTouchTarget}px`;
        }
      }
      this.enhanceInputAccessibility(element);
      element.style.marginBottom = state.isMobile ? '16px' : '12px';
    });

    this.addFormValidationEnhancements(form);
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab'];
    return (
      interactiveTags.includes(element.tagName.toLowerCase()) ||
      interactiveRoles.includes(element.getAttribute('role') || '') ||
      element.hasAttribute('onclick') ||
      element.hasAttribute('tabindex')
    );
  }

  private isTextElement(element: HTMLElement): boolean {
    const textTags = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th'];
    return (
      textTags.includes(element.tagName.toLowerCase()) ||
      (element.textContent?.trim().length ?? 0) > 0
    );
  }

  private applyResponsiveSpacing(element: HTMLElement, state: ResponsiveState): void {
    const spacing = state.isMobile ? '16px' : '12px';
    const largeSpacing = state.isMobile ? '24px' : '20px';

    if (element.classList.contains('spacing-normal')) {
      element.style.margin = spacing;
    }
    if (element.classList.contains('spacing-large')) {
      element.style.margin = largeSpacing;
    }
  }

  private applyDeviceSpecificAttributes(element: HTMLElement, state: ResponsiveState): void {
    if (state.touchDevice) element.setAttribute('data-touch-device', 'true');
    if (state.screenReader) element.setAttribute('data-screen-reader', 'true');
    if (state.reducedMotion) element.setAttribute('data-reduced-motion', 'true');
    if (state.highContrast) element.setAttribute('data-high-contrast', 'true');
  }

  private enhanceInputAccessibility(element: HTMLElement): void {
    const input = element as HTMLInputElement;
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.id) {
        logger.warn(`Input with id "${input.id}" has no associated label`, 'accessibility');
      }
    }
    if (input.required && !input.getAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
    if (input.getAttribute('aria-invalid') === 'true') {
      input.classList.add('error');
    }
  }

  private addFormValidationEnhancements(form: HTMLFormElement): void {
    form.addEventListener('submit', e => {
      const invalidInputs = form.querySelectorAll(':invalid');
      if (invalidInputs.length > 0) {
        e.preventDefault();
        const firstInvalid = invalidInputs[0] as HTMLElement;
        firstInvalid.focus();
        this.announceToScreenReader(
          `Form has ${invalidInputs.length} error${invalidInputs.length > 1 ? 's' : ''}. Please correct and try again.`,
          'assertive'
        );
      }
    });
  }

  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if ((window as any).announceToScreenReader) {
      (window as any).announceToScreenReader(message, priority);
      return;
    }
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    setTimeout(() => {
      liveRegion.textContent = message;
      setTimeout(() => {
        if (liveRegion.parentNode) {
          liveRegion.parentNode.removeChild(liveRegion);
        }
      }, 1000);
    }, 100);
  }
}


// ==================================
// UNIFIED ACCESSIBILITY MANAGER
// ==================================

export class UnifiedAccessibilityManager {
  private static instance: UnifiedAccessibilityManager;
  private focusHistory: HTMLElement[] = [];
  private activeFocusTraps: Set<HTMLElement> = new Set();
  private prefersReducedMotion: boolean = false;
  private prefersHighContrast: boolean = false;
  private isKeyboardUser: boolean = false;
  private colorScheme: 'light' | 'dark' = 'light';
  public responsiveManager: ResponsiveStateManager;
  public accessibilityEnhancer: AccessibilityEnhancer;

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
    this.responsiveManager = ResponsiveStateManager.getInstance();
    this.accessibilityEnhancer = new AccessibilityEnhancer(this.responsiveManager);

    if (typeof document !== 'undefined') {
      this.setupGlobalKeyboardHandlers();
      this.setupFocusTracking();
      this.setupMediaQueryListeners();
      this.setupKeyboardDetection();
      this.injectAccessibilityStyles();
    }
  }

  public getFocusableElements(container?: HTMLElement): HTMLElement[] {
    if (typeof document === 'undefined') return [];
    const actualContainer = container || document.body;
    const elements = Array.from(actualContainer.querySelectorAll(this.focusableSelector)) as HTMLElement[];
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

  public createFocusTrap(container: HTMLElement, options: FocusTrapOptions = {}): () => void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) {
      logger.warn('No focusable elements found in focus trap container', 'focus');
      return () => {};
    }

    const firstElement = focusableElements[0];
    const previouslyFocused = document.activeElement as HTMLElement;

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
    this.getFocusableElements(container)[0]?.focus();
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
    if (!element || element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
    if (element.getAttribute('tabindex') === '-1') {
      return false;
    }
    return element.matches(this.focusableSelector.split(', ').join(':not([tabindex="-1"]), '));
  }

  public applyInteractionStates(element: HTMLElement, options: InteractionStateOptions = {}): () => void {
    const {
      enableHover = true,
      enableFocus = true,
      enableActive = true,
      respectMotionPreferences = true,
      highContrast = false,
      customFocusColor,
    } = options;

    const originalStyles = {
      transition: element.style.transition,
      outline: element.style.outline,
      boxShadow: element.style.boxShadow,
    };

    this.applyBaseAccessibilityStyles(element, customFocusColor);

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
        if (keyEvent.key === ' ' || keyEvent.key === 'Enter') this.handleActiveStart(element);
      };
      handlers.keyup = (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === ' ' || keyEvent.key === 'Enter') this.handleActiveEnd(element);
      };
    }

    Object.entries(handlers).forEach(([event, handler]) => element.addEventListener(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => element.removeEventListener(event, handler));
      Object.entries(originalStyles).forEach(([property, value]) => {
        if (value) {
          (element.style as any)[property] = value;
        } else {
          element.style.removeProperty(property);
        }
      });
    };
  }

  public getPreferences(): AccessibilityPreferences {
    return {
      prefersReducedMotion: this.prefersReducedMotion,
      prefersHighContrast: this.prefersHighContrast,
      isKeyboardUser: this.isKeyboardUser,
      colorScheme: this.colorScheme,
    };
  }

  public getIsKeyboardUser(): boolean {
    return this.isKeyboardUser;
  }

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

  public getElementState(element: HTMLElement): InteractionState | undefined {
    return {
      hover: element.classList.contains('interaction-hover'),
      focus: element.classList.contains('interaction-focus'),
      active: element.classList.contains('interaction-active'),
      disabled: element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true',
    };
  }

  public focusElement(element: HTMLElement | string): boolean {
    try {
      const targetElement = typeof element === 'string' ? (document.querySelector(element) as HTMLElement) : element;
      if (!targetElement || !this.isFocusable(targetElement)) {
        logger.warn('Focus target is not focusable');
        return false;
      }
      targetElement.focus();
      this.addToFocusHistory(targetElement);
      if (targetElement.scrollIntoView) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      return true;
    } catch (error) {
      logger.error('Failed to focus element', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  public getFocusHistory(): HTMLElement[] {
    return [...this.focusHistory];
  }

  public clearFocusHistory(): void {
    this.focusHistory = [];
  }

  public hasActiveFocusTraps(): boolean {
    return this.activeFocusTraps.size > 0;
  }

  public getActiveFocusTraps(): HTMLElement[] {
    return Array.from(this.activeFocusTraps);
  }

  private setupGlobalKeyboardHandlers(): void {
    // Implementation for global keyboard handlers
  }

  private setupFocusTracking(): void {
    document.addEventListener('focusin', (event) => {
      if (event.target instanceof HTMLElement) {
        this.addToFocusHistory(event.target);
      }
    });
  }

  private addToFocusHistory(element: HTMLElement): void {
    this.focusHistory = this.focusHistory.filter(el => el !== element);
    this.focusHistory.push(element);
    if (this.focusHistory.length > 20) {
      this.focusHistory.shift();
    }
  }

  private setupMediaQueryListeners(): void {
    if (typeof window.matchMedia !== 'function') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => (this.prefersReducedMotion = e.matches));

    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    this.prefersHighContrast = contrastQuery.matches;
    contrastQuery.addEventListener('change', (e) => (this.prefersHighContrast = e.matches));

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.colorScheme = colorSchemeQuery.matches ? 'dark' : 'light';
    colorSchemeQuery.addEventListener('change', (e) => (this.colorScheme = e.matches ? 'dark' : 'light'));
  }

  private setupKeyboardDetection(): void {
    document.addEventListener('keydown', () => (this.isKeyboardUser = true));
    document.addEventListener('mousedown', () => (this.isKeyboardUser = false));
  }

  private injectAccessibilityStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-user :focus-visible {
        outline: 2px solid var(--element-focus-color, var(--color-focus-outline));
        outline-offset: 2px;
      }
      [data-prefers-reduced-motion="true"] * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

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
      this.accessibilityEnhancer.announceToScreenReader(`Hovering over ${this.getElementDescription(element)}`, 'polite');
    }
  }

  private handleHoverEnd(element: HTMLElement, respectMotion: boolean): void {
    element.classList.remove('interaction-hover');
    if (!this.prefersReducedMotion || !respectMotion) {
      element.style.transform = 'translateY(0)';
    }
  }

  private handleFocusStart(element: HTMLElement, customFocusColor?: string, highContrast?: boolean): void {
    element.classList.add('interaction-focus');
    if (this.isKeyboardUser) {
      const focusColor = customFocusColor || (highContrast ? 'Highlight' : 'var(--color-focus-outline)');
      element.style.outline = `2px solid ${focusColor}`;
      element.style.outlineOffset = '2px';
    }
  }

  private handleFocusEnd(element: HTMLElement): void {
    element.classList.remove('interaction-focus');
    element.style.outline = '';
  }

  private handleActiveStart(element: HTMLElement): void {
    element.classList.add('interaction-active');
    element.style.transform = 'translateY(1px)';
  }

  private handleActiveEnd(element: HTMLElement): void {
    element.classList.remove('interaction-active');
    element.style.transform = 'translateY(0)';
  }

  private updateGlobalMotionPreferences(reducedMotion: boolean): void {
    document.documentElement.setAttribute('data-prefers-reduced-motion', String(reducedMotion));
  }

  private updateGlobalContrastPreferences(highContrast: boolean): void {
    document.documentElement.setAttribute('data-prefers-high-contrast', String(highContrast));
  }

  private updateColorSchemePreferences(isDark: boolean): void {
    document.documentElement.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab'];
    return (
      interactiveTags.includes(element.tagName.toLowerCase()) ||
      interactiveRoles.includes(element.getAttribute('role') || '') ||
      element.hasAttribute('onclick') ||
      element.hasAttribute('tabindex')
    );
  }

  private isButtonLike(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === 'button' || element.getAttribute('role') === 'button';
  }

  private getElementDescription(element: HTMLElement): string {
    if (element.getAttribute('aria-label')) return element.getAttribute('aria-label')!;
    if (element.getAttribute('aria-labelledby')) {
      const label = document.getElementById(element.getAttribute('aria-labelledby')!);
      return label ? label.textContent || '' : '';
    }
    if (element.title) return element.title;
    return element.textContent?.trim() || '';
  }
}