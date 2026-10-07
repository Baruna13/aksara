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

## Deploy ke Vercel (tanpa kartu kredit)
Backend ini bisa jalan sebagai serverless function di Vercel lewat `api/index.js` + `vercel.json`. Database tetap di Neon (atau Postgres online lain).

1. Vercel -> Add New Project -> pilih repo.
2. **Root Directory: `backend`**, **Framework Preset: Other**. Build command dan output directory biarkan kosong.
3. Environment Variables:
   - `NODE_ENV=production`
   - `JWT_ACCESS_SECRET` = string acak BARU
   - `DATABASE_URL` = connection string Neon (pakai yang "pooled"/`-pooler`)
   - `DATABASE_SSL=true`
   - `GOOGLE_CLIENT_ID`
   - `CORS_ORIGINS` = domain frontend (https, tanpa garis miring)
4. Deploy, lalu tes `https://<nama-backend>.vercel.app/health`.

Catatan serverless:
- Tabel dibuat otomatis pada request pertama setelah instance bangun.
- Rate limit (`express-rate-limit`) disimpan di memori per instance, jadi di Vercel sifatnya longgar. Cukup untuk tahap ini; kalau nanti serius, pindahkan ke penyimpanan bersama (mis. Upstash Redis).
- Tidak ada "tidur satu menit" seperti hosting gratis berbasis container, tapi request pertama setelah lama sepi bisa sedikit lebih lambat.

## Deploy ke server biasa (Render, Railway, VPS)
Pakai `npm start` (`src/server.js`) dengan env yang sama. Tambahkan `PORT` kalau diminta platform.

## Database online
Pakai PostgreSQL terkelola (Neon, Supabase, dll). Kodenya sama persis, cukup ganti `DATABASE_URL` dan `DATABASE_SSL=true`.

Ke depannya, kalau tabel bertambah banyak (materi, kuis, progres), sebaiknya pakai alat migrasi seperti `node-pg-migrate` atau Prisma. Untuk tahap auth ini `initDb()` sudah cukup.
