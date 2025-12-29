import { z } from "zod";

export const emailSchema = z.string().email("validation.invalidEmail");

export const passwordSchema = z
  .string()
  .min(8, "validation.passwordMin")
  .regex(/[A-Z]/, "validation.passwordUppercase")
  .regex(/[a-z]/, "validation.passwordLowercase")
  .regex(/[0-9]/, "validation.passwordNumber")
  .regex(/[!@#$%^&*]/, "validation.passwordSpecial");

export const phoneSchema = z
  .string()
  .regex(/^\+41\d{9}$/, "validation.invalidPhone")
  .optional()
  .or(z.literal(""));

export const postalCodeSchema = z
  .string()
  .regex(/^\d{4}$/, "validation.invalidPostalCode");
