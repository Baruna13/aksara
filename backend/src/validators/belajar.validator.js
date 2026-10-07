import { z } from 'zod';

export const submitKuisSchema = z.object({
  jawaban: z
    .array(
      z.object({
        ref: z.string({ required_error: 'ref wajib diisi' }).min(1).max(60),
        pilih: z.string({ required_error: 'pilih wajib diisi' }).min(1).max(40),
      })
    )
    .min(1, 'Jawaban kosong')
    .max(20, 'Terlalu banyak jawaban'),
});
