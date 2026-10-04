import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import devRoutes from './routes/dev.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Halaman tes dev dipasang sebelum helmet supaya script Google tidak diblokir.
// Otomatis mati di production.
if (env.NODE_ENV !== 'production') app.use('/dev', devRoutes);

app.use(helmet());
app.use(
  cors({
    // Request tanpa Origin (mobile app, curl) tetap diizinkan
    origin: (origin, cb) => cb(null, !origin || env.CORS_ORIGINS.includes(origin)),
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);

// Nanti tambah di sini:
// app.use('/api/belajar', belajarRoutes);
// app.use('/api/scanner', scannerRoutes);
// app.use('/api/nulis', nulisRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
