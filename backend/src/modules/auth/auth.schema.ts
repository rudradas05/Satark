import { z } from 'zod';

export const SignupSchema = z
  .object({
    userName: z.string().min(3),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6),
  })
  .refine(d => d.email || d.phone, {
    message: 'Either email or phone is required',
  });

export const LoginSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6),
  })
  .refine(d => d.email || d.phone, {
    message: 'Either email or phone is required',
  });

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});
