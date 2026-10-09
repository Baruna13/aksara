import { z } from 'zod';

export const ubahProfilSchema = z
  .object({
    nama: z.string().trim().min(2, 'Nama panggilan minimal 2 karakter').max(50, 'Nama panggilan maksimal 50 karakter').optional(),
    // string kosong atau null = hapus email
    email: z.union([z.string().trim().email('Format email salah'), z.literal(''), z.null()]).optional(),
    avatar: z.string().min(1).max(30).optional(),
  })
  .refine((v) => v.nama !== undefined || v.email !== undefined || v.avatar !== undefined, {
    message: 'Tidak ada yang diubah',
  });

export const ubahSandiSchema = z.object({
  sandiSaatIni: z.string().max(72).optional(),
  sandiBaru: z
    .string({ required_error: 'Kata sandi baru wajib diisi' })
    .min(8, 'Kata sandi baru minimal 8 karakter')
    .max(72, 'Kata sandi baru maksimal 72 karakter'),
});
