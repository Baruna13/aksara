# Aksara Backend (Auth + PostgreSQL)

Node.js + Express + PostgreSQL + JWT. Dipakai web maupun Android nanti.

## Jalanin (Windows / Mac / Linux)
```bash
docker compose up -d        # nyalain PostgreSQL (butuh Docker Desktop)
npm install
copy .env.example .env      # Mac/Linux: cp .env.example .env
# isi JWT_ACCESS_SECRET di .env
npm run dev
```
Tabel dibuat otomatis saat server nyala. Cek: http://localhost:4000/health

### Perintah Docker yang berguna
| Perintah | Fungsi |
|---|---|
| `docker compose up -d` | Nyalakan database |
| `docker compose ps` | Cek status (harus "healthy") |
| `docker compose logs db` | Lihat log database |
| `docker compose down` | Matikan (data TETAP ada) |
| `docker compose down -v` | Matikan + HAPUS semua data |
| `docker exec -it aksara-db psql -U aksara -d aksara` | Masuk ke database untuk cek isi tabel, mis. `SELECT * FROM users;` |

Kalau error "port 5432 is already allocated": di PC lu sudah ada Postgres lain. Ubah di `docker-compose.yml` jadi `"5433:5432"` dan di `.env` jadi `...@localhost:5433/aksara`.

## Endpoint
| Method | Path | Body | Keterangan |
|---|---|---|---|
| POST | /api/auth/register | name, username, email (opsional), password | Daftar + langsung dapat token |
| POST | /api/auth/login | identifier (username/email), password | Masuk |
| POST | /api/auth/google | idToken (dari Google) | Masuk/daftar via Google |
| POST | /api/auth/refresh | refreshToken | Tukar token (sekali pakai) |
| POST | /api/auth/logout | refreshToken | Cabut sesi |
| GET | /api/auth/me | header `Authorization: Bearer <accessToken>` | Data user login |

Response register/login: `{ "user": {...}, "accessToken": "...", "refreshToken": "..." }`

## Melindungi route lain
```js
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/index.js';
router.get('/progress', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT * FROM progress WHERE user_id = $1', [req.userId]);
  res.json(rows);
});
```

## Login Google
1. Google Cloud Console -> Credentials -> OAuth client ID -> **Web application**.
2. Authorized JavaScript origins: `http://localhost:4000`, `http://localhost:5173`, dan domain frontend online nanti.
3. Isi `GOOGLE_CLIENT_ID` di `.env`. Halaman tes: http://localhost:4000/dev/google (mati di production).

## Deploy
Backend ini butuh server Node biasa (Render, Railway, Fly.io, VPS), bukan serverless.
Database online: pakai PostgreSQL terkelola (Neon, Supabase, Railway, dll). Kodenya sama persis, cukup ganti env:
- `DATABASE_URL` = connection string dari penyedia database
- `DATABASE_SSL=true` (kebanyakan penyedia mewajibkan SSL)
- `NODE_ENV=production`
- `JWT_ACCESS_SECRET` = string acak BARU (jangan pakai yang di laptop)
- `CORS_ORIGINS` = domain frontend (https)
- `GOOGLE_CLIENT_ID`
Start command: `npm start`.

Ke depannya, kalau tabel bertambah banyak (materi, kuis, progres), sebaiknya pakai alat migrasi seperti `node-pg-migrate` atau Prisma supaya perubahan skema terlacak. Untuk tahap auth ini `initDb()` sudah cukup.
