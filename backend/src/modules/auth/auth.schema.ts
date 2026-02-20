import { z } from "zod";

const USERNAME_REGEX = /^(?=.*\d)[A-Za-z0-9_]+$/;

export const SignupSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        USERNAME_REGEX,
        "Username must include at least one number and can only use letters, numbers, and underscores with no spaces",
      ),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6),
  })
  .refine((d) => d.email || d.phone, { message: "Either email or phone is required" });

export const LoginSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6),
  })
  .refine((d) => d.email || d.phone, { message: "Either email or phone is required" });
