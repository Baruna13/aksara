import { Router } from 'express';
import * as ctrl from '../controllers/belajar.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { submitKuisSchema } from '../validators/belajar.validator.js';

const router = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/beranda', requireAuth, wrap(ctrl.beranda));
router.get('/progres', requireAuth, wrap(ctrl.progres));
router.get('/materi', requireAuth, wrap(ctrl.daftarBab));
router.get('/materi/:babId', requireAuth, wrap(ctrl.detailBab));
router.get('/materi/:babId/kartu/:kartuId', requireAuth, wrap(ctrl.detailKartu));
router.get('/kuis/:babId', requireAuth, wrap(ctrl.mulaiKuis));
router.post('/kuis/:babId/submit', requireAuth, validate(submitKuisSchema), wrap(ctrl.kirimKuis));

export default router;
