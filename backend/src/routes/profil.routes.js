import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as ctrl from '../controllers/profil.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { ubahProfilSchema, ubahSandiSchema } from '../validators/profil.validator.js';

const router = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Batasi tebak-tebakan kata sandi lama memakai token curian
const batasSandi = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Terlalu banyak percobaan, coba lagi nanti', code: 'RATE_LIMIT' } },
});

router.get('/profil', requireAuth, wrap(ctrl.ambilProfil));
router.patch('/profil', requireAuth, validate(ubahProfilSchema), wrap(ctrl.ubahProfil));
router.post('/profil/kata-sandi', requireAuth, batasSandi, validate(ubahSandiSchema), wrap(ctrl.ubahSandi));
router.get('/avatar', requireAuth, wrap(ctrl.daftarAvatar));

export default router;
