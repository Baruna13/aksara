import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as ctrl from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema, refreshSchema, googleSchema } from '../validators/auth.validator.js';

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Terlalu banyak percobaan, coba lagi nanti', code: 'RATE_LIMIT' } },
});

// Express 4 tidak menangkap error async otomatis, jadi dibungkus.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', limiter, validate(registerSchema), wrap(ctrl.register));
router.post('/login', limiter, validate(loginSchema), wrap(ctrl.login));
router.post('/google', limiter, validate(googleSchema), wrap(ctrl.googleLogin));
router.post('/refresh', validate(refreshSchema), wrap(ctrl.refresh));
router.post('/logout', validate(refreshSchema), wrap(ctrl.logout));
router.get('/me', requireAuth, wrap(ctrl.me));

export default router;
