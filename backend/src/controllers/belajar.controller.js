import { BAB, META, getBab, semuaKartu, totalKartu } from '../content/materi.js';
import { buatKuis, nilaiKuis } from '../content/kuis.js';
import * as P from '../services/progress.service.js';
import { query } from '../db/index.js';
import { AppError } from '../utils/AppError.js';

const ringkasKartu = (k, st) => ({
  id: k.id,
  nama: k.nama ?? null,
  aksara: k.aksara,
  bacaan: k.bacaan,
  dilihat: Boolean(st.kartu.get(k.id)?.seen_at),
  benar: st.kartu.get(k.id)?.benar ?? 0,
  salah: st.kartu.get(k.id)?.salah ?? 0,
});

function ringkasBab(b, st) {
  const dilihat = b.kartu.filter((k) => st.kartu.get(k.id)?.seen_at).length;
  const kz = st.kuis.get(b.id);
  return {
    id: b.id,
    urutan: b.urutan,
    judul: b.judul,
    ringkasan: b.ringkasan,
    preview: b.preview,
    jumlahKartu: b.kartu.length,
    kartuDilihat: dilihat,
    persenDilihat: Math.round((dilihat / b.kartu.length) * 100),
    bintangTerbaik: kz?.bintang ?? 0,
    skorTerbaik: kz?.terbaik ?? null,
    percobaanKuis: kz?.percobaan ?? 0,
  };
}

const ringkasan = (st) => {
  const dilihat = semuaKartu().filter((k) => st.kartu.get(k.id)?.seen_at).length;
  const bintang = BAB.reduce((n, b) => n + (st.kuis.get(b.id)?.bintang ?? 0), 0);
  return {
    kartuDilihat: dilihat,
    totalKartu: totalKartu(),
    bintangDidapat: bintang,
    maksBintang: BAB.length * 3,
    kuisSelesai: BAB.filter((b) => st.kuis.has(b.id)).length,
    totalKuis: BAB.length,
  };
};

// Kartu pertama (urutan bab) yang belum pernah dibuka
function lanjutkan(st) {
  const k = semuaKartu().find((x) => !st.kartu.get(x.id)?.seen_at);
  if (!k) return null;
  const bab = getBab(k.babId);
  return { babId: bab.id, babJudul: bab.judul, kartuId: k.id, aksara: k.aksara, bacaan: k.bacaan };
}

// Keputusan 2: beranda klasik
export async function beranda(req, res) {
  const u = await query('SELECT name FROM users WHERE id = $1', [req.userId]);
  if (!u.rows[0]) throw new AppError(404, 'User tidak ditemukan', 'NOT_FOUND');
  const st = await P.ambilStatus(req.userId);
  res.json({
    nama: u.rows[0].name,
    lanjutkan: lanjutkan(st),
    ringkasan: ringkasan(st),
    streak: st.streak,
    fitur: [
      { id: 'belajar', judul: 'Belajar', aktif: true, rute: '/materi' },
      { id: 'latihan', judul: 'Latihan menulis', aktif: false, rute: null },
      { id: 'scan', judul: 'Scan aksara', aktif: false, rute: null },
      { id: 'progres', judul: 'Progres', aktif: true, rute: '/progres' },
    ],
  });
}

// Keputusan 1: bab bebas
export async function daftarBab(req, res) {
  const st = await P.ambilStatus(req.userId);
  res.json({ statusKonten: META.status, bab: BAB.map((b) => ringkasBab(b, st)) });
}

export async function detailBab(req, res) {
  const bab = getBab(req.params.babId);
  if (!bab) throw new AppError(404, 'Bab tidak ditemukan', 'BAB_NOT_FOUND');
  const st = await P.ambilStatus(req.userId);
  const byId = new Map(bab.kartu.map((k) => [k.id, k]));
  res.json({
    statusKonten: META.status,
    ...ringkasBab(bab, st),
    kelompok: bab.kelompok.map((g) => ({
      judul: g.judul,
      kartu: g.kartuIds.map((id) => ringkasKartu(byId.get(id), st)),
    })),
  });
}

// Membuka kartu = otomatis ditandai "dilihat" (aman dipanggil berulang)
export async function detailKartu(req, res) {
  const bab = getBab(req.params.babId);
  const idx = bab ? bab.kartu.findIndex((k) => k.id === req.params.kartuId) : -1;
  if (idx < 0) throw new AppError(404, 'Kartu tidak ditemukan', 'KARTU_NOT_FOUND');
  const k = bab.kartu[idx];

  await P.tandaiDilihat(req.userId, k.id);
  const st = await P.ambilStatus(req.userId);
  // Untuk sandhangan: aksara dasar yang dipakai sebagai contoh (ꦏ ka)
  const dasar = bab.jenis === 'huruf' ? null : getBab('nglegena').kartu.find((x) => x.id === 'ka');

  res.json({
    statusKonten: k.status,
    babId: bab.id,
    babJudul: bab.judul,
    id: k.id,
    nama: k.nama ?? null,
    aksara: k.aksara,
    bacaan: k.bacaan,
    tanda: k.tanda ?? null,
    posisi: k.posisi ?? null,
    komponen: dasar ? { aksaraDasar: dasar.aksara, tanda: k.tanda } : null,
    contohKata: k.contohKata,
    catatan: k.catatan ?? null,
    mirip: k.mirip ?? [],
    goresan: null, // diisi nanti (animasi urutan goresan)
    cobaTulis: { tersedia: false }, // diaktifkan saat fitur Nulis siap
    sebelumnya: bab.kartu[idx - 1]?.id ?? null,
    berikutnya: bab.kartu[idx + 1]?.id ?? null,
    statistik: { benar: st.kartu.get(k.id)?.benar ?? 0, salah: st.kartu.get(k.id)?.salah ?? 0 },
  });
}

export function mulaiKuis(req, res) {
  const soal = buatKuis(req.params.babId, 10);
  if (!soal) throw new AppError(404, 'Bab tidak ditemukan', 'BAB_NOT_FOUND');
  res.json({ babId: req.params.babId, jumlahSoal: soal.length, soal });
}

export async function kirimKuis(req, res) {
  const babId = req.params.babId;
  const bab = getBab(babId);
  if (!bab) throw new AppError(404, 'Bab tidak ditemukan', 'BAB_NOT_FOUND');

  const h = nilaiKuis(babId, req.body.jawaban);
  await P.catatKuis(req.userId, babId, h);
  const st = await P.ambilStatus(req.userId);

  const perluDiulang = [...h.perKartu]
    .filter(([, n]) => n.salah > 0)
    .map(([id]) => {
      const k = bab.kartu.find((x) => x.id === id);
      return { kartuId: id, nama: k.nama ?? null, aksara: k.aksara, bacaan: k.bacaan };
    });

  res.json({
    babId,
    skor: { benar: h.benar, total: h.total, persen: h.persen },
    bintang: h.bintang,
    bintangTerbaik: st.kuis.get(babId)?.bintang ?? h.bintang,
    hasil: h.hasil,
    kartuPerluDiulang: perluDiulang,
    streak: st.streak,
  });
}

export async function progres(req, res) {
  const st = await P.ambilStatus(req.userId);
  const kartuAll = semuaKartu();

  const seringSalah = kartuAll
    .map((k) => ({ k, s: st.kartu.get(k.id) }))
    .filter(({ s }) => s && s.salah > 0)
    .sort((a, b) => b.s.salah - a.s.salah || a.s.benar - b.s.benar)
    .slice(0, 5)
    .map(({ k, s }) => ({ kartuId: k.id, babId: k.babId, nama: k.nama ?? null, aksara: k.aksara, bacaan: k.bacaan, benar: s.benar, salah: s.salah }));

  const riwayat = (await P.riwayatKuis(req.userId, 10)).map((r) => ({
    babId: r.bab_id, benar: r.benar, total: r.total, bintang: r.bintang, waktu: r.created_at,
  }));

  res.json({
    ringkasan: ringkasan(st),
    streak: st.streak,
    perBab: BAB.map((b) => ringkasBab(b, st)),
    seringSalah,
    riwayatKuis: riwayat,
  });
}
