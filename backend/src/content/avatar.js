// KATALOG AVATAR "teman belajar" (modal "Pilih teman belajarmu").
// Hanya "aksa" yang namanya pasti dari desain; nama dan tagline lainnya DRAF, sesuaikan dengan Figma.
// `id` dipakai frontend untuk memilih gambar (mis. /avatar/aksa.png), jadi jangan diubah setelah dipakai user.

export const AVATAR_DEFAULT = 'aksa';

export const AVATAR = [
  { id: 'aksa', nama: 'Aksa', tagline: 'Teman belajar setia', sapaan: 'Aku teman setiap langkahmu.' },
  { id: 'pembaca', nama: 'Si Pembaca', tagline: 'Suka membaca aksara', sapaan: 'Ayo baca aksara bareng aku!' },
  { id: 'penulis', nama: 'Si Penulis', tagline: 'Rajin menulis aksara', sapaan: 'Yuk, kita tulis pelan-pelan.' },
  { id: 'pemikir', nama: 'Si Pemikir', tagline: 'Teliti dan sabar', sapaan: 'Pelan-pelan, pasti paham.' },
  { id: 'cendekia', nama: 'Si Cendekia', tagline: 'Pintar mengingat', sapaan: 'Aku bantu kamu mengingat.' },
  { id: 'ceria', nama: 'Si Ceria', tagline: 'Belajar jadi seru', sapaan: 'Belajar itu menyenangkan!' },
  { id: 'pemberani', nama: 'Si Pemberani', tagline: 'Berani mencoba', sapaan: 'Salah itu biasa, coba lagi!' },
  { id: 'gesit', nama: 'Si Gesit', tagline: 'Cepat tanggap', sapaan: 'Satu langkah lagi!' },
];

export const getAvatar = (id) => AVATAR.find((a) => a.id === id) ?? AVATAR.find((a) => a.id === AVATAR_DEFAULT);
export const avatarAda = (id) => AVATAR.some((a) => a.id === id);
