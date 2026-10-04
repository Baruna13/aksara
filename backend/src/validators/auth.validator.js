import { z } from 'zod';

const password = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .max(72, 'Password maksimal 72 karakter');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(50),
  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter')
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya huruf, angka, dan underscore'),
  email: z.string().trim().email('Format email salah').optional().or(z.literal('').transform(() => undefined)),
  password,
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Username/email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: 'refreshToken wajib diisi' }).min(1, 'refreshToken wajib diisi'),
});

export const googleSchema = z.object({
  idToken: z.string({ required_error: 'idToken wajib diisi' }).min(20, 'idToken tidak valid'),
});
