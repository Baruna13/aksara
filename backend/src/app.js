import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import belajarRoutes from './routes/belajar.routes.js';
import devRoutes from './routes/dev.routes.js';
import { ensureDb } from './db/index.js';
import { AppError } from './utils/AppError.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Di belakang proxy hosting (Vercel/Render): IP asli klien ada di header X-Forwarded-For.
// Perlu agar rate limit membaca IP yang benar.
if (env.NODE_ENV === 'production') app.set('trust proxy', 1);

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

// Pastikan tabel database sudah ada sebelum route /api dijalankan.
// Ditaruh di dalam app supaya tetap jalan di serverless (Vercel), apa pun pintu masuknya.
app.use('/api', async (_req, _res, next) => {
  try {
    await ensureDb();
    next();
  } catch (e) {
    console.error('DB init gagal:', e.message);
    next(new AppError(503, 'Database tidak bisa dihubungi', 'DB_UNAVAILABLE'));
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);

app.use('/api', belajarRoutes); // beranda, materi, kuis, progres

// Nanti tambah di sini:
// app.use('/api/scanner', scannerRoutes);
// app.use('/api/nulis', nulisRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
