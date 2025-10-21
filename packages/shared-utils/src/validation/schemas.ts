import { z } from 'zod';
import { validatePasswordStrength } from './password-validator';

export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(254, 'Email must be less than 254 characters')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be no more than 128 characters long')
  .refine(
    (password) => validatePasswordStrength(password).isValid,
    (password) => ({
      message: validatePasswordStrength(password).feedback.join('; ')
    })
  );

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be no more than 30 characters long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .regex(/^[a-zA-Z]/, 'Username must start with a letter');

export const phoneSchema = z.string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  .max(16, 'Phone number must be no more than 16 digits');

export const urlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL must be no more than 2048 characters');

export const uuidSchema = z.string()
  .uuid('Invalid UUID format');

export const dateSchema = z.string()
  .datetime({ message: 'Invalid date format' })
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date');

export const authSchemas = {
  login: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
  }),
  
  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be no more than 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be no more than 50 characters'),
    phone: phoneSchema.optional(),
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
  }),
  
  forgotPassword: z.object({
    email: emailSchema
  }),
  
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }),
  
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
};

export const userSchemas = {
  profileUpdate: z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be no more than 50 characters').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be no more than 50 characters').optional(),
    phone: phoneSchema.optional(),
    bio: z.string().max(500, 'Bio must be no more than 500 characters').optional(),
    avatar: urlSchema.optional()
  }),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    language: z.string().length(2, 'Language code must be 2 characters').optional(),
    timezone: z.string().max(50, 'Timezone must be no more than 50 characters').optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional()
    }).optional()
  })
};

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be no more than 100 characters'),
  filters: z.record(z.string()).optional(),
  pagination: paginationSchema.optional()
});

export const commonSchemas = {
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  phone: phoneSchema,
  url: urlSchema,
  uuid: uuidSchema,
  date: dateSchema,
  pagination: paginationSchema,
  search: searchSchema,
  auth: authSchemas,
  user: userSchemas
};