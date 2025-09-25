/// <reference path="../.astro/types.d.ts" />

// Extend HTML form element to include Netlify attributes
declare global {
  namespace JSX {
    interface IntrinsicElements {
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
        'data-netlify'?: boolean | string;
        'data-netlify-honeypot'?: string;
        netlify?: boolean | string;
      };
    }
  }
}