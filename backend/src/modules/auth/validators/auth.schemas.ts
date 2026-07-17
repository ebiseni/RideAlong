import { z } from "zod";

/**
 * Shared field validators
 */

const emailSchema = z
  .string()
  .email("Invalid email format")
  .transform((email) => email.trim().toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Full name is required");

/**
 * Register
 * POST /api/auth/register
 */

export const registerSchema = z.object({
  body: z.object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
  }),
});

/**
 * Login
 * POST /api/auth/login
 */

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

/**
 * Reset Password
 * POST /api/auth/reset-password
 */

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: passwordSchema,
  }),
});

/**
 * Change Password
 * PATCH /api/users/me/password
 */

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string()
        .min(1, "Current password is required"),

      newPassword: passwordSchema,
    })
    .refine(
      (data) => data.currentPassword !== data.newPassword,
      {
        message:
          "New password must be different from the current password",
        path: ["newPassword"],
      }
    ),
});

/**
 * Inferred Types
 */

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;

export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;