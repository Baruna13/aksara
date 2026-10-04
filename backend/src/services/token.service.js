import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { query } from '../db/index.js';
import { env } from '../config/env.js';

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

export function signAccessToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TTL });
}

export async function createRefreshToken(userId) {
  const raw = crypto.randomBytes(48).toString('hex');
  const expires = new Date(Date.now() + env.REFRESH_TTL_DAYS * 86400_000);
  await query('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [
    userId,
    sha256(raw),
    expires,
  ]);
  return raw;
}

export async function issueTokens(userId) {
  return { accessToken: signAccessToken(userId), refreshToken: await createRefreshToken(userId) };
}

// Refresh token dipakai sekali (rotation). Pencabutan dilakukan dalam SATU query
// supaya dua request bersamaan tidak bisa sama-sama lolos. Kalau token lama dipakai
// lagi (indikasi dicuri), semua sesi user itu dicabut.
export async function rotateRefreshToken(raw) {
  const hash = sha256(raw);

  const claimed = await query(
    `UPDATE refresh_tokens SET revoked = true
     WHERE token_hash = $1 AND revoked = false AND expires_at > now()
     RETURNING user_id`,
    [hash]
  );
  if (claimed.rows[0]) {
    const userId = claimed.rows[0].user_id;
    return { userId, ...(await issueTokens(userId)) };
  }

  const old = await query('SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1', [hash]);
  if (old.rows[0] && old.rows[0].expires_at > new Date()) {
    await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [old.rows[0].user_id]);
  }
  return null;
}

export async function revokeRefreshToken(raw) {
  await query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [sha256(raw)]);
}
