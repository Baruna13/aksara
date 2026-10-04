# Rembug AksaraLens - Frontend (tahap 1: Login)

React + Vite + styled-components. Ngobrol dengan folder `backend`.

## Jalanin (Windows)
```bash
npm install
copy .env.example .env
npm run dev
```
Buka http://localhost:5173 (backend harus jalan di http://localhost:4000).

## Isi .env
```
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=<sama dengan GOOGLE_CLIENT_ID di backend>
```
Setiap ubah `.env`, restart `npm run dev`.

## Google Cloud
Tambahkan ke **Authorized JavaScript origins** pada Client ID:
- `http://localhost:5173`
- domain frontend online nanti (mis. `https://nama-app.vercel.app`)

## Struktur
- `src/api.js` - pemanggil API + refresh token otomatis saat 401
- `src/AuthContext.jsx` - state login (`useAuth()`: user, login, register, loginWithGoogle, logout)
- `src/components/AuthForm.jsx` - form masuk/daftar + tombol Google
- `src/pages/` - LoginPage dan Dashboard
- Rute: `/masuk` (hanya tamu), `/beranda` (harus login)

## Deploy ke Vercel
Framework: Vite. Env var `VITE_API_URL` diisi URL backend online (https), `VITE_GOOGLE_CLIENT_ID` diisi Client ID.
Tambahkan juga domain Vercel ke `CORS_ORIGINS` di backend.
Karena pakai React Router, tambahkan `vercel.json` berisi:
`{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
