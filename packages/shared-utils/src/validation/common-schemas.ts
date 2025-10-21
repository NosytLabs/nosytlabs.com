import { z } from "zod";

export const emailSchema = z
  .string()
  .transform((email) => email.toLowerCase().trim())
  .pipe(
    z
      .string()
      .email("Invalid email format")
      .max(255, "Email must be 255 characters or less"),
  );

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be 128 characters or less")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

export const usernameSchema = z
  .string()
  .transform((username) => username.trim())
  .pipe(
    z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be 30 characters or less")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens",
      ),
  );

export const displayNameSchema = z
  .string()
  .min(1, "Display name is required")
  .max(100, "Display name must be 100 characters or less")
  .regex(
    /^[a-zA-Z0-9\s._-]+$/,
    "Display name can only contain letters, numbers, spaces, periods, underscores, and hyphens",
  )
  .transform((name) => name.trim());

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number format")
  .transform((phone) => phone.replace(/[\s\-\(\)]/g, ""));

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .max(2048, "URL must be 2048 characters or less")
  .transform((url) => url.trim());

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const dateSchema = z
  .string()
  .datetime("Invalid date format")
  .transform((date) => new Date(date));

export const colorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Invalid color format (must be hex color like #FF0000)",
  );

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug must be 100 characters or less")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  )
  .transform((slug) => slug.toLowerCase().trim());

export const idSchema = z
  .union([z.string(), z.number()])
  .transform((id) => (typeof id === "string" ? parseInt(id, 10) : id))
  .refine((id) => id > 0, "ID must be a positive number");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const searchSchema = z.object({
  q: z
    .string()
    .min(1, "Search query is required")
    .max(255, "Search query too long"),
  filters: z.record(z.string()).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required").max(255),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(50),
  zipCode: z.string().min(1, "ZIP code is required").max(20),
  country: z.string().min(1, "Country is required").max(100).default("USA"),
});

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const fileSchema = z.object({
  name: z.string().min(1),
  size: z.number().int().min(0),
  type: z.string().min(1),
  lastModified: z.number().int().min(0),
});

export const imageFileSchema = fileSchema.extend({
  type: z.string().regex(/^image\//, "File must be an image"),
  size: z
    .number()
    .int()
    .max(10 * 1024 * 1024, "Image size must be 10MB or less"), // 10MB
});

export const videoFileSchema = fileSchema.extend({
  type: z.string().regex(/^video\//, "File must be a video"),
  size: z
    .number()
    .int()
    .max(100 * 1024 * 1024, "Video size must be 100MB or less"), // 100MB
});

export const metadataSchema = z.object({
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
  createdBy: uuidSchema.optional(),
  updatedBy: uuidSchema.optional(),
  version: z.number().int().min(0).optional(),
  isDeleted: z.boolean().optional().default(false),
});

export const authSchemas = {
  login: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),

  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    displayName: displayNameSchema.optional(),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
  }),

  forgotPassword: z.object({
    email: emailSchema,
  }),

  resetPassword: z
    .object({
      token: z.string().min(1, "Reset token is required"),
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  changePassword: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
};

export const userSchemas = {
  profile: z.object({
    displayName: displayNameSchema.optional(),
    bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
    avatar: urlSchema.optional(),
    phone: phoneSchema.optional(),
    dateOfBirth: dateSchema.optional(),
    timezone: z.string().max(50).optional(),
    language: z.string().length(2).optional(),
    theme: z.enum(["light", "dark", "system"]).optional().default("system"),
  }),

  preferences: z.object({
    notifications: z
      .object({
        email: z.boolean().default(true),
        push: z.boolean().default(true),
        sms: z.boolean().default(false),
      })
      .optional(),
    privacy: z
      .object({
        profileVisible: z.boolean().default(true),
        showEmail: z.boolean().default(false),
        showPhone: z.boolean().default(false),
      })
      .optional(),
  }),
};

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z
      .string()
      .datetime()
      .transform((date) => new Date(date))
      .optional()
      .default(() => new Date().toISOString()),
  });
};

export const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
  timestamp: dateSchema.default(() => new Date().toISOString()),
});

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  value: z.unknown().optional(),
});

export const commonSchemas = {
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  displayName: displayNameSchema,
  phone: phoneSchema,
  url: urlSchema,
  uuid: uuidSchema,
  date: dateSchema,
  color: colorSchema,
  slug: slugSchema,
  id: idSchema,
  pagination: paginationSchema,
  search: searchSchema,
  address: addressSchema,
  coordinates: coordinatesSchema,
  file: fileSchema,
  imageFile: imageFileSchema,
  videoFile: videoFileSchema,
  metadata: metadataSchema,
  auth: authSchemas,
  user: userSchemas,
  apiResponse: apiResponseSchema,
  error: errorSchema,
  validationError: validationErrorSchema,
};
