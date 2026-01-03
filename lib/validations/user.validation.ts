import { z } from "zod";

/**
 * User Form Validation Schema
 *
 * Used for the initial user registration (PatientForm).
 * Validates name, email, and phone fields.
 */
export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, "")),
      "Invalid phone number"
    ),
});

/**
 * Login Form Validation Schema
 */
export const LoginFormValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

/**
 * Registration Form Validation Schema (with password)
 */
export const RegisterFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, "")),
      "Invalid phone number"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// Type exports
export type UserFormValues = z.infer<typeof UserFormValidation>;
export type LoginFormValues = z.infer<typeof LoginFormValidation>;
export type RegisterFormValues = z.infer<typeof RegisterFormValidation>;

