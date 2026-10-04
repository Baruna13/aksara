import { OAuth2Client } from 'google-auth-library';
import { query } from '../db/index.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const client = new OAuth2Client();

// Verifikasi ID token ke Google (tanda tangan, audience, kedaluwarsa)
export async function verifyGoogleToken(idToken) {
  if (!env.GOOGLE_CLIENT_IDS.length) {
    throw new AppError(503, 'Login Google belum dikonfigurasi di server', 'GOOGLE_NOT_CONFIGURED');
  }
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_IDS });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(401, 'Token Google tidak valid', 'INVALID_GOOGLE_TOKEN');
  }
  if (!payload?.email || !payload.email_verified) {
    throw new AppError(401, 'Email Google belum terverifikasi', 'GOOGLE_EMAIL_UNVERIFIED');
  }
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
  };
}

async function generateUsername(email) {
  let base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 14);
  if (base.length < 3) base = (base + 'user').slice(0, 14);
  let candidate = base;
  for (;;) {
    const { rowCount } = await query('SELECT 1 FROM users WHERE lower(username) = lower($1)', [candidate]);
    if (!rowCount) return candidate;
    candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

// 1) sudah pernah login Google -> pakai akun itu
// 2) email sudah terdaftar manual -> sambungkan akun Google ke akun itu
// 3) belum ada -> buat akun baru
export async function findOrCreateGoogleUser({ googleId, email, name }) {
  let { rows } = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  if (rows[0]) return { user: rows[0], created: false };

  ({ rows } = await query('SELECT * FROM users WHERE lower(email) = lower($1)', [email]));
  if (rows[0]) {
    const upd = await query('UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *', [googleId, rows[0].id]);
    return { user: upd.rows[0], created: false };
  }

  const displayName = (name.trim() + ' ').slice(0, 50).trim().padEnd(2, ' ');
  try {
    const ins = await query(
      'INSERT INTO users (name, username, email, google_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [displayName, await generateUsername(email), email, googleId]
    );
    return { user: ins.rows[0], created: true };
  } catch (e) {
    // Dua request login Google bersamaan untuk akun yang sama: ambil akun yang sudah terbuat
    if (e.code === '23505') {
      const again = await query('SELECT * FROM users WHERE google_id = $1 OR lower(email) = lower($2)', [googleId, email]);
      if (again.rows[0]) return { user: again.rows[0], created: false };
    }
    throw e;
  }
}
