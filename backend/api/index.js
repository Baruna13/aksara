// Pintu masuk untuk Vercel (serverless). Di laptop/Render tetap pakai src/server.js.
import app from '../src/app.js';
import { initDb } from '../src/db/index.js';

let ready;

export default async function handler(req, res) {
  // Buat tabel sekali per instance (aman diulang). Kalau gagal, coba lagi di request berikutnya.
  ready ??= initDb().catch((e) => {
    ready = undefined;
    throw e;
  });

  try {
    await ready;
  } catch (e) {
    console.error('DB init gagal:', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: { message: 'Database tidak bisa dihubungi' } }));
  }

  return app(req, res);
}
