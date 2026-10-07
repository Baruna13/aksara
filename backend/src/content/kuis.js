import { getBab, DASAR } from './materi.js';
import { AppError } from '../utils/AppError.js';

const TIPE = ['aksara_ke_latin', 'latin_ke_aksara'];

const acak = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pilihTipe = () => TIPE[Math.floor(Math.random() * TIPE.length)];

// Bentuk (aksara + bacaan) sebuah item soal
function bentuk(bab, kartu, dasar) {
  if (bab.jenis === 'huruf') return { aksara: kartu.aksara, bacaan: kartu.bacaan };
  return { aksara: dasar.aksara + kartu.tanda, bacaan: dasar.konsonan + kartu.bunyi };
}

function susun(bab, kartu, dasar, tipe) {
  const benar = bentuk(bab, kartu, dasar);
  const lainnya = bab.kartu.filter((k) => k.id !== kartu.id);

  // Pengecoh: untuk huruf yang mirip (mis. ha/la) sertakan pasangannya dulu
  let pengecoh = acak(lainnya);
  if (kartu.mirip?.length) {
    const mirip = lainnya.filter((k) => kartu.mirip.includes(k.id));
    pengecoh = [...mirip, ...pengecoh.filter((k) => !mirip.includes(k))];
  }
  const teks = (b) => (tipe === 'aksara_ke_latin' ? b.bacaan : b.aksara);
  const opsi = new Set([teks(benar)]);
  for (const k of pengecoh) {
    if (opsi.size >= 4) break;
    opsi.add(teks(bentuk(bab, k, dasar)));
  }

  const aksaraKeLatin = tipe === 'aksara_ke_latin';
  return {
    ref: [kartu.id, tipe, dasar?.id ?? ''].join('|'),
    tipe,
    perintah: aksaraKeLatin ? 'Bagaimana cara membaca aksara ini?' : `Mana aksara yang dibaca “${benar.bacaan}”?`,
    tampilan: aksaraKeLatin ? { jenis: 'aksara', teks: benar.aksara } : { jenis: 'latin', teks: benar.bacaan },
    pilihanJenis: aksaraKeLatin ? 'latin' : 'aksara',
    pilihan: acak([...opsi]),
  };
}

export function buatKuis(babId, jumlah = 10) {
  const bab = getBab(babId);
  if (!bab) return null;
  const soal = [];

  if (bab.jenis === 'huruf') {
    for (const k of acak(bab.kartu).slice(0, jumlah)) soal.push(susun(bab, k, null, pilihTipe()));
  } else {
    // Bagi rata ke semua sandhangan, tiap soal memakai aksara dasar yang berbeda
    const urut = acak(bab.kartu);
    const dipakai = new Set();
    for (let i = 0; i < jumlah; i++) {
      const k = urut[i % urut.length];
      let dasar;
      do dasar = DASAR[Math.floor(Math.random() * DASAR.length)];
      while (dipakai.has(k.id + dasar.id));
      dipakai.add(k.id + dasar.id);
      soal.push(susun(bab, k, dasar, pilihTipe()));
    }
  }
  return soal.map((s, i) => ({ no: i + 1, ...s }));
}

// Jawaban benar dihitung ulang dari ref (tanpa menyimpan soal di server)
export function kunci(babId, ref) {
  const bab = getBab(babId);
  if (!bab) return null;
  const [kartuId, tipe, dasarId = ''] = String(ref).split('|');
  const kartu = bab.kartu.find((k) => k.id === kartuId);
  if (!kartu || !TIPE.includes(tipe)) return null;
  let dasar = null;
  if (bab.jenis !== 'huruf') {
    dasar = DASAR.find((d) => d.id === dasarId);
    if (!dasar) return null;
  }
  const b = bentuk(bab, kartu, dasar);
  return { kartuId, benar: tipe === 'aksara_ke_latin' ? b.bacaan : b.aksara };
}

export function hitungBintang(persen) {
  if (persen >= 90) return 3;
  if (persen >= 70) return 2;
  return 1; // selesai = minimal 1 bintang
}

export function nilaiKuis(babId, jawaban) {
  const refs = new Set();
  const hasil = [];
  const perKartu = new Map();

  for (const j of jawaban) {
    if (refs.has(j.ref)) throw new AppError(400, 'Soal yang sama dikirim dua kali', 'DUPLICATE_ANSWER');
    refs.add(j.ref);
    const k = kunci(babId, j.ref);
    if (!k) throw new AppError(400, 'Soal tidak valid', 'INVALID_QUESTION');
    const benar = j.pilih === k.benar;
    hasil.push({ ref: j.ref, kartuId: k.kartuId, benar, pilih: j.pilih, jawabanBenar: k.benar });
    const c = perKartu.get(k.kartuId) ?? { benar: 0, salah: 0 };
    benar ? c.benar++ : c.salah++;
    perKartu.set(k.kartuId, c);
  }

  const total = hasil.length;
  const jumlahBenar = hasil.filter((h) => h.benar).length;
  const persen = Math.round((jumlahBenar / total) * 100);
  return { benar: jumlahBenar, total, persen, bintang: hitungBintang(persen), hasil, perKartu };
}
