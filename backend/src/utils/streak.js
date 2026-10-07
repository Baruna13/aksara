// Hitung hari belajar berturut-turut. Tanggal berformat 'YYYY-MM-DD' (zona WIB).
const geser = (iso, n) =>
  new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) + n * 86400000)
    .toISOString()
    .slice(0, 10);

export function hitungStreak(hari, today) {
  const set = new Set(hari);
  const belajarHariIni = set.has(today);
  // Kalau hari ini belum belajar, streak kemarin masih dihitung (belum putus)
  let cur = belajarHariIni ? today : geser(today, -1);
  let n = 0;
  while (set.has(cur)) {
    n++;
    cur = geser(cur, -1);
  }
  return { hari: n, belajarHariIni };
}
