import { z } from 'zod';

const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const PHONE_REGEX = /^\d+$/;

export const SignupSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        USERNAME_REGEX,
        "Username can only use letters, numbers, and underscores with no spaces",
      ),
    email: z.string().email().optional(),
    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, 'Phone must contain digits only')
      .min(10)
      .max(15)
      .optional(),
    password: z.string().min(6),
  })
  .refine(d => d.email || d.phone, {
    message: 'Either email or phone is required',
  });

export const LoginSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, 'Phone must contain digits only')
      .min(10)
      .max(15)
      .optional(),
    password: z.string().min(6),
  })
  .refine(d => d.email || d.phone, {
    message: 'Either email or phone is required',
  });

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});
