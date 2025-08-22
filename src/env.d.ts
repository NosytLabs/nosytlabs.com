/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Astro component module declarations

// Extend Astro's Locals interface
declare namespace App {
  interface Locals {
    csrfToken?: string;
    requestId?: string;
    clientIP?: string;
    sessionId?: string;
    nonce?: string;
    userAgent?: string;
    securityHeaders?: Record<string, string>;
  }
}

// Global type extensions
declare global {
  interface Window {
    NosytUtils?: {
      dom: {
        queryAll: (selector: string) => HTMLElement[];
        query: (selector: string) => HTMLElement | null;
      };
      events: {
        on: (element: HTMLElement, event: string, callback: (e: Event) => void) => void;
        off: (element: HTMLElement, event: string, callback: (e: Event) => void) => void;
      };
    };
    NosytLabs?: {
      config: {
        features: {
          darkMode: boolean;
          animations: boolean;
          lazyLoading: boolean;
          serviceWorker: boolean;
        };
      };
      init: () => void;
      initTheme: () => void;
      initCore: () => void;
    };
  }
}
