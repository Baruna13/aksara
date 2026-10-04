import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

// Pasang di route yang butuh login: router.get('/x', requireAuth, handler)
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Token tidak ada', 'NO_TOKEN'));
  }
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.userId = Number(payload.sub);
    next();
  } catch {
    next(new AppError(401, 'Token tidak valid atau kedaluwarsa', 'INVALID_TOKEN'));
  }
}
