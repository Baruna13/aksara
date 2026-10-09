import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';
import { AppError } from '../utils/AppError.js';
import { verifyGoogleToken, findOrCreateGoogleUser } from '../services/google.service.js';
import { issueTokens, rotateRefreshToken, revokeRefreshToken } from '../services/token.service.js';

const DUMMY_HASH = bcrypt.hashSync('dummy-password', 12); // biar waktu respons login sama

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  username: u.username,
  email: u.email,
  avatar: u.avatar,
  createdAt: u.created_at,
});

export async function register(req, res) {
  const { name, username, email, password } = req.body;

  const dupUser = await query('SELECT 1 FROM users WHERE lower(username) = lower($1)', [username]);
  if (dupUser.rowCount) throw new AppError(409, 'Username sudah dipakai', 'USERNAME_TAKEN');

  if (email) {
    const dupEmail = await query('SELECT 1 FROM users WHERE lower(email) = lower($1)', [email]);
    if (dupEmail.rowCount) throw new AppError(409, 'Email sudah terdaftar', 'EMAIL_TAKEN');
  }

  const hash = await bcrypt.hash(password, 12);
  let user;
  try {
    const ins = await query(
      'INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, username, email ?? null, hash]
    );
    user = ins.rows[0];
  } catch (e) {
    // Dua pendaftaran bersamaan dengan data sama: index unik menolak yang kedua
    if (e.code === '23505') throw new AppError(409, 'Username atau email sudah dipakai', 'DUPLICATE');
    throw e;
  }

  res.status(201).json({ user: publicUser(user), ...(await issueTokens(user.id)) });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  const { rows } = await query(
    'SELECT * FROM users WHERE lower(username) = lower($1) OR lower(email) = lower($1) LIMIT 1',
    [identifier]
  );
  const user = rows[0];

  const ok = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
  if (!user || !user.password_hash || !ok) {
    throw new AppError(401, 'Username/email atau password salah', 'BAD_CREDENTIALS');
  }

  res.json({ user: publicUser(user), ...(await issueTokens(user.id)) });
}

export async function googleLogin(req, res) {
  const profile = await verifyGoogleToken(req.body.idToken);
  const { user, created } = await findOrCreateGoogleUser(profile);
  res
    .status(created ? 201 : 200)
    .json({ user: publicUser(user), isNewUser: created, ...(await issueTokens(user.id)) });
}

export async function refresh(req, res) {
  const result = await rotateRefreshToken(req.body.refreshToken);
  if (!result) throw new AppError(401, 'Sesi berakhir, silakan login lagi', 'INVALID_REFRESH');
  res.json({ accessToken: result.accessToken, refreshToken: result.refreshToken });
}

export async function logout(req, res) {
  await revokeRefreshToken(req.body.refreshToken);
  res.status(204).end();
}

export async function me(req, res) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.userId]);
  if (!rows[0]) throw new AppError(404, 'User tidak ditemukan', 'NOT_FOUND');
  res.json({ user: publicUser(rows[0]) });
}
