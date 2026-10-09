// Logika "perjalanan belajar" ala Duolingo: status tiap langkah dan tantangan.
//
//  selesai  : semua tantangannya selesai
//  terbuka  : langkah yang sedang dikerjakan ("MULAI DI SINI"); hanya satu per bab
//  terkunci : menunggu langkah sebelumnya selesai
//  segera   : belum tersedia (Latihan menulis); TIDAK menghalangi langkah berikutnya
//
// Di dalam langkah, tantangan juga berurutan: tantangan n terbuka setelah n-1 selesai.

export const tid = (babId, langkahId, no) => `${babId}/${langkahId}/${no}`;

// st = { kartu: Map(kartu_id -> row), tantangan: Map(tantangan_id -> row) }
function tantanganSelesai(bab, l, t, no, st) {
  if (l.jenis === 'tulis') return false;
  if (l.jenis === 'mengenal') return t.kartuIds.every((id) => Boolean(st.kartu.get(id)?.seen_at));
  return st.tantangan.get(tid(bab.id, l.id, no))?.selesai === true;
}

export function hitungJalur(bab, st) {
  let gerbang = true;
  return bab.langkah.map((l) => {
    const daftar = l.tantangan.map((t, i) => ({ no: i + 1, selesai: tantanganSelesai(bab, l, t, i + 1, st) }));

    if (l.jenis === 'tulis') {
      return { langkah: l, status: 'segera', tantangan: daftar.map((d) => ({ ...d, status: 'segera' })) };
    }

    const tuntas = daftar.every((d) => d.selesai);
    const status = tuntas ? 'selesai' : gerbang ? 'terbuka' : 'terkunci';
    let terbukaBerikutnya = status === 'terbuka';
    const tantangan = daftar.map((d) => {
      if (d.selesai) return { ...d, status: 'selesai' };
      if (terbukaBerikutnya) {
        terbukaBerikutnya = false;
        return { ...d, status: 'terbuka' };
      }
      return { ...d, status: 'terkunci' };
    });

    gerbang = gerbang && tuntas;
    return { langkah: l, status, tantangan };
  });
}

export function ringkasBab(bab, st) {
  const jalur = hitungJalur(bab, st);
  const dihitung = jalur.filter((j) => j.status !== 'segera'); // langkah yang sudah tersedia
  const total = dihitung.reduce((n, j) => n + j.tantangan.length, 0);
  const selesai = dihitung.reduce((n, j) => n + j.tantangan.filter((t) => t.selesai).length, 0);
  const kuisAkhir = st.tantangan.get(tid(bab.id, 'kuis', 1));
  return {
    jalur,
    totalTantangan: total,
    tantanganSelesai: selesai,
    persen: total ? Math.round((selesai / total) * 100) : 0,
    bintangTerbaik: kuisAkhir?.bintang_terbaik ?? 0,
    selesaiSemua: total > 0 && selesai === total,
  };
}

// "Pelajaran" di layar profil = langkah yang sudah tersedia (Latihan menulis belum dihitung).
// Total otomatis naik dari 12 ke 15 begitu langkah menulis tersedia.
export function ringkasPelajaran(bab, st) {
  const tersedia = hitungJalur(bab, st).filter((j) => j.status !== 'segera');
  return {
    totalPelajaran: tersedia.length,
    pelajaranSelesai: tersedia.filter((j) => j.status === 'selesai').length,
  };
}
