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

export function catatKuis(userId, babId, hasil) {
  return withTx(async (c) => {
    await c.query(
      'INSERT INTO quiz_attempts (user_id, bab_id, benar, total, bintang) VALUES ($1, $2, $3, $4, $5)',
      [userId, babId, hasil.benar, hasil.total, hasil.bintang]
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
    await catatHariBelajar(c, userId);
  });
}

// Semua yang dibutuhkan beranda & halaman progres dalam sekali ambil
export async function ambilStatus(userId) {
  const lp = await query('SELECT kartu_id, seen_at, benar, salah FROM letter_progress WHERE user_id = $1', [userId]);
  const kz = await query(
    `SELECT bab_id, MAX(bintang)::int AS bintang, MAX(ROUND(100.0 * benar / total))::int AS terbaik,
            COUNT(*)::int AS percobaan
     FROM quiz_attempts WHERE user_id = $1 GROUP BY bab_id`,
    [userId]
  );
  const hr = await query('SELECT day::text AS d FROM study_days WHERE user_id = $1 ORDER BY day DESC LIMIT 400', [userId]);
  const td = await query(`SELECT ${HARI_WIB}::text AS today`);

  return {
    kartu: new Map(lp.rows.map((r) => [r.kartu_id, r])),
    kuis: new Map(kz.rows.map((r) => [r.bab_id, r])),
    streak: hitungStreak(hr.rows.map((r) => r.d), td.rows[0].today),
  };
}

export async function riwayatKuis(userId, limit = 10) {
  const { rows } = await query(
    'SELECT bab_id, benar, total, bintang, created_at FROM quiz_attempts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  );
  return rows;
}
