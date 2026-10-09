import { BAB, META, AMBANG_LULUS, getBab, semuaKartu, totalKartu } from '../content/materi.js';
import { buatSoal, nilaiKuis } from '../content/kuis.js';
import { hitungJalur, ringkasBab, tid } from '../content/jalur.js';
import * as P from '../services/progress.service.js';
import { query } from '../db/index.js';
import { AppError } from '../utils/AppError.js';

const keterangan = (l) =>
  l.jenis === 'kuis'
    ? `${l.label} · ${l.tantangan[0].jumlahSoal} pertanyaan`
    : `${l.label} · ${l.tantangan.length} tantangan`;

const ringkasKartu = (k, st) => ({
  id: k.id,
  nama: k.nama ?? null,
  aksara: k.aksara,
  bacaan: k.bacaan,
  dilihat: Boolean(st.kartu.get(k.id)?.seen_at),
  benar: st.kartu.get(k.id)?.benar ?? 0,
  salah: st.kartu.get(k.id)?.salah ?? 0,
});

function infoBab(b, st) {
  const r = ringkasBab(b, st);
  return {
    id: b.id,
    urutan: b.urutan,
    judul: b.judul,
    ringkasan: b.ringkasan,
    deskripsi: b.deskripsi,
    warna: b.warna,
    preview: b.preview,
    jumlahKartu: b.kartu.length,
    jumlahLangkah: b.langkah.length,
    totalTantangan: r.totalTantangan,
    tantanganSelesai: r.tantanganSelesai,
    persen: r.persen,
    bintangTerbaik: r.bintangTerbaik,
    selesai: r.selesaiSemua,
  };
}

function ringkasan(st) {
  const info = BAB.map((b) => ringkasBab(b, st));
  return {
    kartuDilihat: semuaKartu().filter((k) => st.kartu.get(k.id)?.seen_at).length,
    totalKartu: totalKartu(),
    tantanganSelesai: info.reduce((n, r) => n + r.tantanganSelesai, 0),
    totalTantangan: info.reduce((n, r) => n + r.totalTantangan, 0),
    bintangDidapat: info.reduce((n, r) => n + r.bintangTerbaik, 0),
    maksBintang: BAB.length * 3,
    kuisSelesai: BAB.filter((b) => st.tantangan.get(tid(b.id, 'kuis', 1))?.selesai).length,
    totalKuis: BAB.length,
  };
}

// Langkah yang sedang dikerjakan pada bab pertama yang belum selesai
function lanjutkan(st) {
  for (const b of BAB) {
    const j = hitungJalur(b, st).find((x) => x.status === 'terbuka');
    if (j) {
      const t = j.tantangan.find((x) => x.status === 'terbuka');
      return {
        babId: b.id,
        babJudul: b.judul,
        langkahId: j.langkah.id,
        langkahJudul: j.langkah.judul,
        jenis: j.langkah.jenis,
        tantanganNo: t?.no ?? 1,
        keterangan: keterangan(j.langkah),
      };
    }
  }
  return null;
}

// Cari bab, langkah, dan tantangan dari parameter URL (404 kalau tidak ada)
function muat(req, st) {
  const bab = getBab(req.params.babId);
  const l = bab?.langkah.find((x) => x.id === req.params.langkahId);
  if (!bab || !l) throw new AppError(404, 'Langkah tidak ditemukan', 'LANGKAH_NOT_FOUND');
  const jalur = hitungJalur(bab, st);
  const entri = jalur.find((x) => x.langkah.id === l.id);
  let no = null;
  let t = null;
  let tEntri = null;
  if (req.params.no !== undefined) {
    no = Number(req.params.no);
    t = Number.isInteger(no) ? l.tantangan[no - 1] : null;
    if (!t) throw new AppError(404, 'Tantangan tidak ditemukan', 'TANTANGAN_NOT_FOUND');
    tEntri = entri.tantangan[no - 1];
  }
  return { bab, l, t, no, jalur, entri, tEntri };
}

// Hanya latihan/kuis yang berupa soal, dan harus sudah terbuka
function pastikanBisaDikerjakan({ l, entri, tEntri }) {
  if (l.jenis === 'tulis') throw new AppError(409, 'Latihan menulis segera hadir', 'COMING_SOON');
  if (l.jenis === 'mengenal') throw new AppError(400, 'Tantangan ini berupa kartu, bukan soal', 'NOT_A_QUIZ');
  if (entri.status === 'terkunci' || tEntri.status === 'terkunci') {
    throw new AppError(403, 'Selesaikan langkah sebelumnya dulu', 'LOCKED');
  }
}

// ---------- Beranda (keputusan 2)
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

// ---------- Pilih bab (keputusan 1: bab bebas)
export async function daftarBab(req, res) {
  const st = await P.ambilStatus(req.userId);
  res.json({ statusKonten: META.status, bab: BAB.map((b) => infoBab(b, st)) });
}

// ---------- Perjalanan belajar: jalur 5 langkah dalam satu bab
export async function detailBab(req, res) {
  const bab = getBab(req.params.babId);
  if (!bab) throw new AppError(404, 'Bab tidak ditemukan', 'BAB_NOT_FOUND');
  const st = await P.ambilStatus(req.userId);
  const r = ringkasBab(bab, st);
  res.json({
    statusKonten: META.status,
    ...infoBab(bab, st),
    saatIni: r.jalur.find((j) => j.status === 'terbuka')?.langkah.id ?? null, // penanda "MULAI DI SINI"
    langkah: r.jalur.map((j) => ({
      id: j.langkah.id,
      urutan: j.langkah.urutan,
      judul: j.langkah.judul,
      jenis: j.langkah.jenis,
      label: j.langkah.label,
      ikon: j.langkah.ikon,
      keterangan: keterangan(j.langkah),
      status: j.status,
      jumlahTantangan: j.tantangan.length,
      tantanganSelesai: j.tantangan.filter((t) => t.selesai).length,
    })),
  });
}

export async function detailLangkah(req, res) {
  const st = await P.ambilStatus(req.userId);
  const { bab, l, entri } = muat(req, st);
  const kartuById = new Map(bab.kartu.map((k) => [k.id, k]));

  res.json({
    statusKonten: META.status,
    babId: bab.id,
    babJudul: bab.judul,
    id: l.id,
    judul: l.judul,
    jenis: l.jenis,
    label: l.label,
    keterangan: keterangan(l),
    status: entri.status,
    tantangan: l.tantangan.map((t, i) => {
      const e = entri.tantangan[i];
      const prog = st.tantangan.get(tid(bab.id, l.id, i + 1));
      const dasar = { no: e.no, status: e.status, selesai: e.selesai };
      if (l.jenis === 'mengenal') {
        return { ...dasar, kartu: t.kartuIds.map((id) => ringkasKartu(kartuById.get(id), st)) };
      }
      if (l.jenis === 'tulis') return { ...dasar, tersedia: false };
      return {
        ...dasar,
        jumlahSoal: t.jumlahSoal,
        tipe: t.tipe,
        lulusMinimal: l.jenis === 'kuis' ? 0 : AMBANG_LULUS,
        percobaan: prog?.percobaan ?? 0,
        skorTerbaik: prog?.skor_terbaik ?? null,
        bintangTerbaik: prog?.bintang_terbaik ?? 0,
      };
    }),
  });
}

// ---------- Kartu (membuka kartu = otomatis ditandai "dilihat")
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

// ---------- Mengerjakan tantangan (latihan & kuis)
export async function soalTantangan(req, res) {
  const st = await P.ambilStatus(req.userId);
  const m = muat(req, st);
  pastikanBisaDikerjakan(m);
  const soal = buatSoal(m.bab, m.t);
  res.json({
    babId: m.bab.id,
    langkahId: m.l.id,
    tantanganNo: m.no,
    jumlahSoal: soal.length,
    lulusMinimal: m.l.jenis === 'kuis' ? 0 : AMBANG_LULUS,
    soal,
  });
}

export async function kirimTantangan(req, res) {
  const st = await P.ambilStatus(req.userId);
  const m = muat(req, st);
  pastikanBisaDikerjakan(m);

  const h = nilaiKuis(m.bab.id, req.body.jawaban, m.t);
  const lulus = m.l.jenis === 'kuis' || h.persen >= AMBANG_LULUS;
  await P.catatTantangan(req.userId, m.bab.id, tid(m.bab.id, m.l.id, m.no), h, lulus);

  const st2 = await P.ambilStatus(req.userId);
  const sesudah = ringkasBab(m.bab, st2);
  const entriBaru = sesudah.jalur.find((j) => j.langkah.id === m.l.id);
  const langkahSelesai = entriBaru.status === 'selesai';
  const idx = sesudah.jalur.findIndex((j) => j.langkah.id === m.l.id);
  const berikutnya = sesudah.jalur.slice(idx + 1).find((j) => j.status === 'terbuka');

  res.json({
    babId: m.bab.id,
    langkahId: m.l.id,
    tantanganNo: m.no,
    skor: { benar: h.benar, total: h.total, persen: h.persen },
    bintang: h.bintang,
    lulus,
    pesan: lulus ? null : `Butuh minimal ${AMBANG_LULUS}% benar untuk lanjut. Coba lagi ya!`,
    tantanganSelesai: lulus,
    langkahSelesai,
    langkahBerikutnyaTerbuka: berikutnya?.langkah.id ?? null,
    babSelesai: sesudah.selesaiSemua,
    persenBab: sesudah.persen,
    hasil: h.hasil,
    kartuPerluDiulang: [...h.perKartu]
      .filter(([, n]) => n.salah > 0)
      .map(([id]) => {
        const k = m.bab.kartu.find((x) => x.id === id);
        return { kartuId: id, nama: k.nama ?? null, aksara: k.aksara, bacaan: k.bacaan };
      }),
    streak: st2.streak,
  });
}

// ---------- Progres
export async function progres(req, res) {
  const st = await P.ambilStatus(req.userId);
  const seringSalah = semuaKartu()
    .map((k) => ({ k, s: st.kartu.get(k.id) }))
    .filter(({ s }) => s && s.salah > 0)
    .sort((a, b) => b.s.salah - a.s.salah || a.s.benar - b.s.benar)
    .slice(0, 5)
    .map(({ k, s }) => ({ kartuId: k.id, babId: k.babId, nama: k.nama ?? null, aksara: k.aksara, bacaan: k.bacaan, benar: s.benar, salah: s.salah }));

  const riwayat = (await P.riwayatKuis(req.userId, 10)).map((r) => ({
    babId: r.bab_id, tantanganId: r.tantangan_id, benar: r.benar, total: r.total, bintang: r.bintang, waktu: r.created_at,
  }));

  res.json({
    ringkasan: ringkasan(st),
    streak: st.streak,
    perBab: BAB.map((b) => infoBab(b, st)),
    seringSalah,
    riwayatKuis: riwayat,
  });
}
