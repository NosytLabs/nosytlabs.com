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
  
  // Ensure FormData is available in API routes
  interface FormData {
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: string | Blob): void;
    append(name: string, value: string | Blob): void;
    delete(name: string): void;
    entries(): IterableIterator<[string, FormDataEntryValue]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<FormDataEntryValue>;
    forEach(callbackfn: (value: FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void;
  }
}
