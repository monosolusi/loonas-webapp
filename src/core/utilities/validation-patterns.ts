// src/core/utils/validation-patterns.ts

import Joi from "joi";

/**
 * Password must contain:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Minimum 8 characters
 */
export const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)
  .message(
    "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

/**
 * Standard email validation
 */
export const emailSchema = Joi.string().email();

/**
 * Validation regex patterns for client-side use
 */
export const ValidationPatterns = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * Validation helper functions
 */
export const isValidPassword = (password: string): boolean => ValidationPatterns.password.test(password);

export const isValidEmail = (email: string): boolean => ValidationPatterns.email.test(email);

export const isNonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
