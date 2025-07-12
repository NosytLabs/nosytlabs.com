/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Astro component module declarations

// Global type extensions
declare global {
  interface Window {
    NosytUtils?: any;
    NosytLabs?: any;
  }
}