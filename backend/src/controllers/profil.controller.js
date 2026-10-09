import bcrypt from 'bcryptjs';
import { BAB } from '../content/materi.js';
import { ringkasBab, ringkasPelajaran } from '../content/jalur.js';
import { AVATAR, getAvatar, avatarAda } from '../content/avatar.js';
import * as P from '../services/progress.service.js';
import { issueTokens } from '../services/token.service.js';
import { query, withTx } from '../db/index.js';
import { AppError } from '../utils/AppError.js';

async function ambilUser(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  if (!rows[0]) throw new AppError(404, 'User tidak ditemukan', 'NOT_FOUND');
  return rows[0];
}

// Bentuk respons layar "Progres Saya" / profil
function bentukProfil(u, st) {
  const perBab = BAB.map((b) => {
    const r = ringkasBab(b, st);
    const p = ringkasPelajaran(b, st);
    return {
      babId: b.id,
      urutan: b.urutan,
      judul: b.judul,
      warna: b.warna,
      ...p,
      persen: r.persen, // berbasis tantangan, jadi bar progres naik halus
      selesai: r.selesaiSemua,
    };
  });
  const totalPelajaran = perBab.reduce((n, b) => n + b.totalPelajaran, 0);
  const pelajaranSelesai = perBab.reduce((n, b) => n + b.pelajaranSelesai, 0);
  const av = getAvatar(u.avatar);

  return {
    id: u.id,
    nama: u.name,
    username: u.username,
    email: u.email,
    avatar: av,
    tagline: 'Teman belajar aksara Jawa',
    metodeMasuk: { password: Boolean(u.password_hash), google: Boolean(u.google_id) },
    bergabung: u.created_at,
    streak: st.streak,
    ringkasan: {
      pelajaranSelesai,
      totalPelajaran,
      babTuntas: perBab.filter((b) => b.selesai).length,
      totalBab: perBab.length,
      persen: totalPelajaran ? Math.round((pelajaranSelesai / totalPelajaran) * 100) : 0,
    },
    perjalanan: perBab,
  };
}

export async function ambilProfil(req, res) {
  const u = await ambilUser(req.userId);
  res.json(bentukProfil(u, await P.ambilStatus(req.userId)));
}

export async function ubahProfil(req, res) {
  const u = await ambilUser(req.userId);
  const { nama, email, avatar } = req.body;
  const set = [];
  const val = [];
  const tambah = (kolom, nilai) => { val.push(nilai); set.push(`${kolom} = $${val.length}`); };

  if (nama !== undefined) tambah('name', nama);

  if (avatar !== undefined) {
    if (!avatarAda(avatar)) throw new AppError(400, 'Avatar tidak dikenal', 'INVALID_AVATAR');
    tambah('avatar', avatar);
  }

  if (email !== undefined) {
    const baru = email === '' || email === null ? null : email;
    const sama = (baru ?? '').toLowerCase() === (u.email ?? '').toLowerCase();
    if (!sama) {
      // Akun yang tersambung ke Google memakai email dari Google, jadi tidak bisa diganti dari sini
      if (u.google_id) throw new AppError(403, 'Email akun Google tidak bisa diubah', 'GOOGLE_EMAIL_LOCKED');
      if (baru) {
        const dup = await query('SELECT 1 FROM users WHERE lower(email) = lower($1) AND id <> $2', [baru, u.id]);
        if (dup.rowCount) throw new AppError(409, 'Email sudah dipakai akun lain', 'EMAIL_TAKEN');
      }
      tambah('email', baru);
    }
  }

  if (set.length) {
    val.push(u.id);
    try {
      await query(`UPDATE users SET ${set.join(', ')} WHERE id = $${val.length}`, val);
    } catch (e) {
      if (e.code === '23505') throw new AppError(409, 'Email sudah dipakai akun lain', 'EMAIL_TAKEN');
      throw e;
    }
  }
  res.json(bentukProfil(await ambilUser(u.id), await P.ambilStatus(u.id)));
}

// Ganti kata sandi (atau pasang kata sandi untuk akun Google yang belum punya).
// Semua sesi lama dicabut; sesi perangkat ini dilanjutkan dengan token baru di respons.
export async function ubahSandi(req, res) {
  const u = await ambilUser(req.userId);
  const { sandiSaatIni, sandiBaru } = req.body;

  if (u.password_hash) {
    if (!sandiSaatIni) throw new AppError(400, 'Kata sandi saat ini wajib diisi', 'CURRENT_PASSWORD_REQUIRED');
    // Sengaja 400 (bukan 401): 401 akan memicu frontend mencoba refresh token
    if (!(await bcrypt.compare(sandiSaatIni, u.password_hash))) {
      throw new AppError(400, 'Kata sandi saat ini salah', 'WRONG_PASSWORD');
    }
    if (sandiSaatIni === sandiBaru) {
      throw new AppError(400, 'Kata sandi baru harus berbeda dari yang lama', 'SAME_PASSWORD');
    }
  }

  const hash = await bcrypt.hash(sandiBaru, 12);
  await withTx(async (c) => {
    await c.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, u.id]);
    // Dihapus (bukan ditandai revoked) agar token lama yang dicoba lagi hanya ditolak biasa,
    // tidak dianggap pencurian token yang memutus semua sesi, termasuk sesi baru ini.
    await c.query('DELETE FROM refresh_tokens WHERE user_id = $1', [u.id]);
  });

  res.json({
    pesan: u.password_hash ? 'Kata sandi berhasil diperbarui' : 'Kata sandi berhasil dipasang',
    ...(await issueTokens(u.id)),
  });
}

export async function daftarAvatar(req, res) {
  const { rows } = await query('SELECT avatar FROM users WHERE id = $1', [req.userId]);
  res.json({ dipakai: rows[0]?.avatar ?? 'aksa', avatar: AVATAR });
}
