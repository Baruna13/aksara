import { query, withTx } from '../db/index.js';
import { hitungStreak } from '../utils/streak.js';

const HARI_WIB = "(now() AT TIME ZONE 'Asia/Jakarta')::date";

const catatHariBelajar = (db, userId) =>
  db.query(`INSERT INTO study_days (user_id, day) VALUES ($1, ${HARI_WIB}) ON CONFLICT DO NOTHING`, [userId]);

// Dipanggil saat siswa membuka kartu. Aman dipanggil berulang.
export function tandaiDilihat(userId, kartuId) {
  return withTx(async (c) => {
    await c.query(
      `INSERT INTO letter_progress (user_id, kartu_id, seen_at) VALUES ($1, $2, now())
       ON CONFLICT (user_id, kartu_id)
       DO UPDATE SET seen_at = COALESCE(letter_progress.seen_at, now()), last_activity = now()`,
      [userId, kartuId]
    );
    await catatHariBelajar(c, userId);
  });
}

// Simpan hasil satu tantangan (latihan atau kuis). `lulus` menentukan tantangan dianggap selesai.
export function catatTantangan(userId, babId, tantanganId, hasil, lulus) {
  return withTx(async (c) => {
    await c.query(
      'INSERT INTO quiz_attempts (user_id, bab_id, tantangan_id, benar, total, bintang) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, babId, tantanganId, hasil.benar, hasil.total, hasil.bintang]
    );
    for (const [kartuId, n] of hasil.perKartu) {
      await c.query(
        `INSERT INTO letter_progress (user_id, kartu_id, benar, salah) VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, kartu_id)
         DO UPDATE SET benar = letter_progress.benar + EXCLUDED.benar,
                       salah = letter_progress.salah + EXCLUDED.salah,
                       last_activity = now()`,
        [userId, kartuId, n.benar, n.salah]
      );
    }
    await c.query(
      `INSERT INTO tantangan_progress (user_id, tantangan_id, selesai, percobaan, skor_terbaik, bintang_terbaik, selesai_at)
       VALUES ($1, $2, $3::boolean, 1, $4::int, $5::int, CASE WHEN $3::boolean THEN now() END)
       ON CONFLICT (user_id, tantangan_id)
       DO UPDATE SET selesai = tantangan_progress.selesai OR EXCLUDED.selesai,
                     percobaan = tantangan_progress.percobaan + 1,
                     skor_terbaik = GREATEST(tantangan_progress.skor_terbaik, EXCLUDED.skor_terbaik),
                     bintang_terbaik = GREATEST(tantangan_progress.bintang_terbaik, EXCLUDED.bintang_terbaik),
                     selesai_at = COALESCE(tantangan_progress.selesai_at, EXCLUDED.selesai_at)`,
      [userId, tantanganId, lulus, hasil.persen, hasil.bintang]
    );
    await catatHariBelajar(c, userId);
  });
}

// Semua yang dibutuhkan beranda, jalur belajar, dan halaman progres
export async function ambilStatus(userId) {
  const lp = await query('SELECT kartu_id, seen_at, benar, salah FROM letter_progress WHERE user_id = $1', [userId]);
  const tp = await query(
    'SELECT tantangan_id, selesai, percobaan, skor_terbaik, bintang_terbaik FROM tantangan_progress WHERE user_id = $1',
    [userId]
  );
  const hr = await query('SELECT day::text AS d FROM study_days WHERE user_id = $1 ORDER BY day DESC LIMIT 400', [userId]);
  const td = await query(`SELECT ${HARI_WIB}::text AS today`);

  return {
    kartu: new Map(lp.rows.map((r) => [r.kartu_id, r])),
    tantangan: new Map(tp.rows.map((r) => [r.tantangan_id, r])),
    streak: hitungStreak(hr.rows.map((r) => r.d), td.rows[0].today),
  };
}

export async function riwayatKuis(userId, limit = 10) {
  const { rows } = await query(
    'SELECT bab_id, tantangan_id, benar, total, bintang, created_at FROM quiz_attempts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  );
  return rows;
}
