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
  `);
}
