import pg from 'pg';
import { env } from '../config/env.js';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: process.env.VERCEL ? 3 : 10,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
});

// Error pada koneksi idle jangan sampai membuat server crash
pool.on('error', (err) => console.error('Postgres pool error:', err.message));

export const query = (text, params) => pool.query(text, params);

// Jalankan beberapa query dalam satu transaksi (otomatis rollback kalau error)
export async function withTx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

// Dibuat otomatis saat server nyala (aman dijalankan berulang kali).
// Username & email dibuat unik tanpa peduli huruf besar/kecil lewat index lower().
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name          TEXT NOT NULL,
      username      TEXT NOT NULL,
      email         TEXT,
      password_hash TEXT,              -- kosong untuk akun yang daftar lewat Google
      google_id     TEXT UNIQUE,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (lower(username));
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx    ON users (lower(email));

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked    BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens (user_id);

    -- Progres belajar per kartu (kartu_id = id di src/content/materi.js)
    CREATE TABLE IF NOT EXISTS letter_progress (
      user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kartu_id      TEXT NOT NULL,
      seen_at       TIMESTAMPTZ,
      benar         INTEGER NOT NULL DEFAULT 0,
      salah         INTEGER NOT NULL DEFAULT 0,
      last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, kartu_id)
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bab_id     TEXT NOT NULL,
      benar      INTEGER NOT NULL,
      total      INTEGER NOT NULL,
      bintang    INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS quiz_attempts_user_idx ON quiz_attempts (user_id, bab_id);

    -- Hari-hari ada aktivitas belajar (untuk hari berturut-turut), tanggal zona WIB
    CREATE TABLE IF NOT EXISTS study_days (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      day     DATE NOT NULL,
      PRIMARY KEY (user_id, day)
    );
  `);
}

// Dipanggil otomatis sebelum route /api. Hanya jalan sekali per instance;
// kalau gagal, request berikutnya mencoba lagi.
let ready;
export function ensureDb() {
  ready ??= initDb().catch((e) => {
    ready = undefined;
    throw e;
  });
  return ready;
}
