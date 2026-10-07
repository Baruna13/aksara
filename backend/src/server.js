import app from './app.js';
import { env } from './config/env.js';
import { ensureDb, pool } from './db/index.js';

try {
  await ensureDb();
} catch (e) {
  console.error('Gagal terhubung ke database:', e.message);
  console.error('Cek DATABASE_URL di .env, dan pastikan database jalan (docker compose up -d).');
  process.exit(1);
}

const server = app.listen(env.PORT, () => {
  console.log(`Aksara backend jalan di http://localhost:${env.PORT}`);
});

// Matikan rapi saat Ctrl+C / dihentikan hosting
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  });
}
