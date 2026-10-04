import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Data tidak valid';
    return next(new AppError(400, message, 'VALIDATION_ERROR'));
  }
  req.body = result.data;
  next();
};
