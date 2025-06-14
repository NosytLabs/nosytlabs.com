/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Astro component module declarations
declare module '*.astro' {
  const Component: any;
  export default Component;
}

// Global type extensions
declare global {
  interface Window {
    NosytUtils?: any;
    NosytLabs?: any;
  }
}