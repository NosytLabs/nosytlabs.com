// Export password validation
export * from "./password-validator";

// Export schemas - explicit exports to avoid conflicts
export {
  emailSchema,
  phoneSchema,
  urlSchema,
  usernameSchema,
  uuidSchema,
  searchSchema,
  userSchemas,
} from "./schemas";

// Export common schemas with different names to avoid conflicts
export {
  emailSchema as commonEmailSchema,
  phoneSchema as commonPhoneSchema,
  urlSchema as commonUrlSchema,
  usernameSchema as commonUsernameSchema,
  uuidSchema as commonUuidSchema,
  searchSchema as commonSearchSchema,
  userSchemas as commonUserSchemas,
} from "./common-schemas";

// Export validation functions
export { sanitizeInput, escapeHtml } from "../sanitization";

// Export email validation from dedicated module
export { validateEmail, isValidEmail } from "./email-validator";

// URL validation function
export function validateUrl(
  url: string,
  options?: { allowedProtocols?: string[] },
): boolean {
  try {
    const urlObj = new URL(url);
    if (options?.allowedProtocols) {
      return options.allowedProtocols.includes(urlObj.protocol.slice(0, -1));
    }
    return ["http", "https"].includes(urlObj.protocol.slice(0, -1));
  } catch {
    return false;
  }
}

// Phone number validation function
export function validatePhoneNumber(phone: string, country?: string): boolean {
  if (country === "US") {
    // US phone number validation
    const usPhoneRegex =
      /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return usPhoneRegex.test(phone.replace(/\s/g, ""));
  }

  // International phone number validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}
