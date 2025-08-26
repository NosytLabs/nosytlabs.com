import type { z } from 'zod';
export {
  contactFormSchema,
  newsletterSchema,
  bookingInquirySchema,
  compositeBookingSchema,
  adminAuthSchema,
  fileUploadSchema,
  searchSchema,
} from '../utils/unified-validation';

// Simple adapter to match existing route usage pattern
export function validateAndSanitize<T>(data: unknown, schema: z.ZodSchema<T>): T {
  return schema.parse(data);
}