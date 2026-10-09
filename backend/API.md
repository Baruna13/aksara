# API Belajar (untuk frontend)

Semua endpoint di bawah **wajib login**: kirim header `Authorization: Bearer <accessToken>`
(`frontend/src/api.js` sudah mengurus pemanggilan dan refresh token lewat fungsi `authed()` dan objek `belajar`).

Error selalu berbentuk `{ "error": { "message": "...", "code": "..." } }`; `message` berbahasa Indonesia dan boleh langsung ditampilkan.

> Isi materi masih **draf** (`statusKonten: "draf"`). Tampilkan penanda kecil sampai isinya diverifikasi.

## Struktur belajar (sesuai desain Figma "Perjalanan belajar")

```
Bab (3)  ->  Langkah (5 per bab, berupa jalur ala Duolingo)  ->  Tantangan
```

| Langkah | id | jenis | Isi tantangan |
|---|---|---|---|
| 1. Kenali ... | `kenali` | `mengenal` | 3 tantangan; tiap tantangan = sekelompok **kartu** yang harus dibuka |
| 2. Temukan ... | `temukan` | `latihan` | 3 tantangan; 5 soal "baca latin, pilih aksara" |
| 3. Ingat ... | `ingat` | `latihan` | 3 tantangan; 5 soal "lihat aksara, pilih bacaan" |
| 4. Latihan menulis | `tulis` | `tulis` | **Belum tersedia** (menunggu fitur Nulis) |
| 5. Kuis ... | `kuis` | `kuis` | 1 kuis, 5 pertanyaan campuran dari seluruh bab |

`babId`: `nglegena`, `sandhangan`, `panyigeg`. `langkahId`: `kenali`, `temukan`, `ingat`, `tulis`, `kuis`.

### Status (untuk menggambar jalur dan ikon gembok)
| status | arti | tampilan |
|---|---|---|
| `selesai` | semua tantangan selesai | node berwarna / centang |
| `terbuka` | sedang dikerjakan (hanya 1 per bab) | node aktif + label **MULAI DI SINI** |
| `terkunci` | menunggu langkah sebelumnya | node pudar + gembok |
| `segera` | belum tersedia (Latihan menulis) | node pudar, "segera hadir" |

Aturan kunci:
- Langkah dibuka **berurutan**; langkah berikutnya terbuka setelah langkah sebelumnya selesai.
- **Latihan menulis (`segera`) tidak menghalangi**: setelah Ingat selesai, Kuis langsung terbuka.
- Di dalam satu langkah, tantangan juga berurutan (tantangan 2 terbuka setelah 1 selesai).
- Tantangan `mengenal` selesai kalau **semua kartunya sudah dibuka**.
- Tantangan `latihan` selesai kalau benar **minimal 60%** (3 dari 5). Kalau kurang, boleh diulang tanpa batas.
- `kuis` selalu menyelesaikan langkah (minimal 1 bintang). Bintang: **3★** ≥ 90%, **2★** ≥ 70%, **1★** selesai.
- Tantangan/langkah yang sudah `selesai` boleh dikerjakan ulang; skor jelek tidak membatalkan status selesai.
- `persen` bab = tantangan selesai / total tantangan (Latihan menulis belum dihitung), yaitu angka "9%" di desain.

Aturan tampilan: teks aksara (`aksara`, dan pilihan jika `pilihanJenis: "aksara"`) pakai font **Noto Sans Javanese** (sudah dimuat di `index.html`).

## Ringkasan endpoint

| Method | Path | Fungsi | Layar |
|---|---|---|---|
| GET | `/api/beranda` | Salam, "Lanjutkan belajar", tombol fitur, ringkasan | Beranda |
| GET | `/api/materi` | 3 bab + persen tiap bab (+ `warna`) | Pilih bab |
| GET | `/api/materi/:babId` | **Jalur 5 langkah** satu bab | Perjalanan belajar |
| GET | `/api/materi/:babId/langkah/:langkahId` | Daftar tantangan dalam langkah | Detail langkah |
| GET | `/api/materi/:babId/langkah/:langkahId/tantangan/:no/soal` | Ambil 5 soal | Latihan / kuis |
| POST | `/api/materi/:babId/langkah/:langkahId/tantangan/:no/submit` | Kirim jawaban | Hasil |
| GET | `/api/materi/:babId/kartu/:kartuId` | Detail kartu. **Otomatis menandai kartu "dilihat"** | Kartu huruf |
| GET | `/api/progres` | Statistik lengkap | Progres |

---

## GET /api/beranda
`lanjutkan` menunjuk langkah yang sedang dikerjakan di bab pertama yang belum selesai (`null` kalau semua selesai).
Untuk tombol, arahkan ke `/materi/:babId/langkah/:langkahId`.
```json
{
  "nama": "Tes budi_a",
  "lanjutkan": {
    "babId": "nglegena",
    "babJudul": "Aksara Nglegena",
    "langkahId": "kenali",
    "langkahJudul": "Kenali aksara dasar",
    "jenis": "mengenal",
    "tantanganNo": 1,
    "keterangan": "Mengenal · 3 tantangan"
  },
  "ringkasan": {
    "kartuDilihat": 0,
    "totalKartu": 29,
    "tantanganSelesai": 0,
    "totalTantangan": 30,
    "bintangDidapat": 0,
    "maksBintang": 9,
    "kuisSelesai": 0,
    "totalKuis": 3
  },
  "streak": {
    "hari": 0,
    "belajarHariIni": false
  },
  "fitur": [
    {
      "id": "belajar",
      "judul": "Belajar",
      "aktif": true,
      "rute": "/materi"
    },
    {
      "id": "latihan",
      "judul": "Latihan menulis",
      "aktif": false,
      "rute": null
    },
    {
      "id": "scan",
      "judul": "Scan aksara",
      "aktif": false,
      "rute": null
    },
    {
      "id": "progres",
      "judul": "Progres",
      "aktif": true,
      "rute": "/progres"
    }
  ]
}
```

## GET /api/materi
Layar "pilih bab". `warna`: `hijau` | `kuning` | `ungu` (sesuai kartu bab di Figma).
```json
{
  "statusKonten": "draf",
  "bab": [
    {
      "id": "nglegena",
      "urutan": 1,
      "judul": "Aksara Nglegena",
      "ringkasan": "Kenali 20 aksara dasar",
      "deskripsi": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
      "warna": "hijau",
      "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ",
      "jumlahKartu": 20,
      "jumlahLangkah": 5,
      "totalTantangan": 10,
      "tantanganSelesai": 0,
      "persen": 0,
      "bintangTerbaik": 0,
      "selesai": false
    },
    "..."
  ]
}
```

## GET /api/materi/:babId  (jalur belajar)
Inilah layar "Perjalanan belajar". `langkah` sudah berurutan; `saatIni` = id langkah yang diberi label "MULAI DI SINI".
`keterangan` siap tampil ("Mengenal · 3 tantangan", "Kuis · 5 pertanyaan"). `ikon`: `mata` | `otak` | `pensil` | `bintang`.
```json
{
  "statusKonten": "draf",
  "id": "nglegena",
  "urutan": 1,
  "judul": "Aksara Nglegena",
  "ringkasan": "Kenali 20 aksara dasar",
  "deskripsi": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
  "warna": "hijau",
  "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ",
  "jumlahKartu": 20,
  "jumlahLangkah": 5,
  "totalTantangan": 10,
  "tantanganSelesai": 0,
  "persen": 0,
  "bintangTerbaik": 0,
  "selesai": false,
  "saatIni": "kenali",
  "langkah": [
    {
      "id": "kenali",
      "urutan": 1,
      "judul": "Kenali aksara dasar",
      "jenis": "mengenal",
      "label": "Mengenal",
      "ikon": "mata",
      "keterangan": "Mengenal · 3 tantangan",
      "status": "terbuka",
      "jumlahTantangan": 3,
      "tantanganSelesai": 0
    },
    {
      "id": "temukan",
      "urutan": 2,
      "judul": "Temukan bentuknya",
      "jenis": "latihan",
      "label": "Mengenal",
      "ikon": "mata",
      "keterangan": "Mengenal · 3 tantangan",
      "status": "terkunci",
      "jumlahTantangan": 3,
      "tantanganSelesai": 0
    },
    {
      "id": "ingat",
      "urutan": 3,
      "judul": "Ingat bunyinya",
      "jenis": "latihan",
      "label": "Mengingat",
      "ikon": "otak",
      "keterangan": "Mengingat · 3 tantangan",
      "status": "terkunci",
      "jumlahTantangan": 3,
      "tantanganSelesai": 0
    },
    {
      "id": "tulis",
      "urutan": 4,
      "judul": "Latihan menulis",
      "jenis": "tulis",
      "label": "Menulis",
      "ikon": "pensil",
      "keterangan": "Menulis · 3 tantangan",
      "status": "segera",
      "jumlahTantangan": 3,
      "tantanganSelesai": 0
    },
    {
      "id": "kuis",
      "urutan": 5,
      "judul": "Kuis aksara dasar",
      "jenis": "kuis",
      "label": "Kuis",
      "ikon": "bintang",
      "keterangan": "Kuis · 5 pertanyaan",
      "status": "terkunci",
      "jumlahTantangan": 1,
      "tantanganSelesai": 0
    }
  ]
}
```

Contoh sesudah beberapa langkah dikerjakan (`persen` naik, `saatIni` pindah):
```json
{
  "id": "nglegena",
  "persen": 30,
  "tantanganSelesai": 3,
  "totalTantangan": 10,
  "saatIni": "temukan",
  "langkah": [
    {
      "id": "kenali",
      "status": "selesai",
      "tantanganSelesai": 3,
      "jumlahTantangan": 3
    },
    {
      "id": "temukan",
      "status": "terbuka",
      "tantanganSelesai": 0,
      "jumlahTantangan": 3
    },
    {
      "id": "ingat",
      "status": "terkunci",
      "tantanganSelesai": 0,
      "jumlahTantangan": 3
    },
    {
      "id": "tulis",
      "status": "segera",
      "tantanganSelesai": 0,
      "jumlahTantangan": 3
    },
    {
      "id": "kuis",
      "status": "terkunci",
      "tantanganSelesai": 0,
      "jumlahTantangan": 1
    }
  ]
}
```

## GET /api/materi/:babId/langkah/:langkahId
Langkah `mengenal` memuat `kartu` per tantangan (ketuk kartu untuk membukanya; itu otomatis menandainya dilihat).
Langkah `latihan`/`kuis` memuat `jumlahSoal`, `lulusMinimal`, `skorTerbaik`, `bintangTerbaik`. Langkah `tulis`: `tersedia: false`.
```json
{
  "statusKonten": "draf",
  "babId": "nglegena",
  "babJudul": "Aksara Nglegena",
  "id": "kenali",
  "judul": "Kenali aksara dasar",
  "jenis": "mengenal",
  "label": "Mengenal",
  "keterangan": "Mengenal · 3 tantangan",
  "status": "terbuka",
  "tantangan": [
    {
      "no": 1,
      "status": "terbuka",
      "selesai": false,
      "kartu": [
        {
          "id": "ha",
          "nama": null,
          "aksara": "ꦲ",
          "bacaan": "ha",
          "dilihat": false,
          "benar": 0,
          "salah": 0
        },
        {
          "id": "na",
          "nama": null,
          "aksara": "ꦤ",
          "bacaan": "na",
          "dilihat": false,
          "benar": 0,
          "salah": 0
        },
        "..."
      ]
    },
    {
      "no": 2,
      "status": "terkunci",
      "selesai": false,
      "kartu": [
        {
          "id": "sa",
          "nama": null,
          "aksara": "ꦱ",
          "bacaan": "sa",
          "dilihat": false,
          "benar": 0,
          "salah": 0
        },
        {
          "id": "wa",
          "nama": null,
          "aksara": "ꦮ",
          "bacaan": "wa",
          "dilihat": false,
          "benar": 0,
          "salah": 0
        },
        "..."
      ]
    },
    "..."
  ]
}
```

## GET .../tantangan/:no/soal
Hanya untuk `latihan` dan `kuis`. Server **tidak menyimpan** soal dan **tidak mengirim kunci**.
Tiap soal punya `tampilan` (`{jenis: "aksara"|"latin", teks}`), `perintah`, `pilihanJenis`, dan `pilihan`.
```json
{
  "babId": "nglegena",
  "langkahId": "temukan",
  "tantanganNo": 1,
  "jumlahSoal": 5,
  "lulusMinimal": 60,
  "soal": [
    {
      "no": 1,
      "ref": "ca|latin_ke_aksara|",
      "tipe": "latin_ke_aksara",
      "perintah": "Mana aksara yang dibaca “ca”?",
      "tampilan": {
        "jenis": "latin",
        "teks": "ca"
      },
      "pilihanJenis": "aksara",
      "pilihan": [
        "ꦧ",
        "ꦪ",
        "ꦒ",
        "ꦕ"
      ]
    },
    {
      "no": 2,
      "ref": "ha|latin_ke_aksara|",
      "tipe": "latin_ke_aksara",
      "perintah": "Mana aksara yang dibaca “ha”?",
      "tampilan": {
        "jenis": "latin",
        "teks": "ha"
      },
      "pilihanJenis": "aksara",
      "pilihan": [
        "ꦭ",
        "ꦢ",
        "ꦏ",
        "ꦲ"
      ]
    }
  ]
}
```

## POST .../tantangan/:no/submit
Kirim **tepat sebanyak `jumlahSoal`** jawaban: tiap soal kirim kembali `ref` (apa adanya) dan `pilih` (teks pilihan yang diketuk).
```json
{ "jawaban": [ { "ref": "ca|latin_ke_aksara|", "pilih": "ꦧ" } ] }
```
Respons: `lulus` menentukan tantangan selesai. Kalau `lulus: false`, tampilkan `pesan` dan tawarkan ulangi.
`langkahBerikutnyaTerbuka` berisi id langkah yang baru terbuka (untuk animasi buka gembok) atau `null`.
```json
{
  "babId": "nglegena",
  "langkahId": "temukan",
  "tantanganNo": 3,
  "skor": {
    "benar": 5,
    "total": 5,
    "persen": 100
  },
  "bintang": 3,
  "lulus": true,
  "pesan": null,
  "tantanganSelesai": true,
  "langkahSelesai": true,
  "langkahBerikutnyaTerbuka": "ingat",
  "babSelesai": false,
  "persenBab": 60,
  "hasil": [
    {
      "ref": "ga|latin_ke_aksara|",
      "kartuId": "ga",
      "benar": true,
      "pilih": "ꦒ",
      "jawabanBenar": "ꦒ"
    }
  ],
  "kartuPerluDiulang": [],
  "streak": {
    "hari": 1,
    "belajarHariIni": true
  }
}
```

Respons kuis akhir (`bintang`, `babSelesai`):
```json
{
  "babId": "nglegena",
  "langkahId": "kuis",
  "tantanganNo": 1,
  "skor": {
    "benar": 5,
    "total": 5,
    "persen": 100
  },
  "bintang": 3,
  "lulus": true,
  "pesan": null,
  "tantanganSelesai": true,
  "langkahSelesai": true,
  "langkahBerikutnyaTerbuka": null,
  "babSelesai": true,
  "persenBab": 100,
  "hasil": [
    {
      "ref": "la|latin_ke_aksara|",
      "kartuId": "la",
      "benar": true,
      "pilih": "ꦭ",
      "jawabanBenar": "ꦭ"
    }
  ],
  "kartuPerluDiulang": [],
  "streak": {
    "hari": 1,
    "belajarHariIni": true
  }
}
```

### Error yang mungkin
| HTTP | code | Kapan |
|---|---|---|
| 403 | `LOCKED` | Langkah/tantangan masih terkunci |
| 409 | `COMING_SOON` | Langkah `tulis` (belum tersedia) |
| 400 | `NOT_A_QUIZ` | Meminta soal untuk langkah `mengenal` |
| 400 | `WRONG_ANSWER_COUNT` | Jumlah jawaban tidak sama dengan `jumlahSoal` |
| 400 | `QUESTION_NOT_IN_CHALLENGE` / `INVALID_QUESTION` / `DUPLICATE_ANSWER` | `ref` tidak sesuai tantangan |
| 404 | `*_NOT_FOUND` | bab / langkah / tantangan / kartu tidak ada |

## GET /api/materi/:babId/kartu/:kartuId
Kartu huruf (bab 1):
```json
{
  "statusKonten": "draf",
  "babId": "nglegena",
  "babJudul": "Aksara nglegena",
  "id": "ha",
  "nama": null,
  "aksara": "ꦲ",
  "bacaan": "ha",
  "tanda": null,
  "posisi": null,
  "komponen": null,
  "contohKata": [
    {
      "kata": "aksara",
      "arti": "huruf, tulisan"
    }
  ],
  "catatan": "ꦲ (ha) juga dipakai untuk menulis bunyi “a” di awal kata, misalnya “aksara”. Bentuknya mirip ꦭ (la), jadi perhatikan baik-baik.",
  "mirip": [
    "la"
  ],
  "goresan": null,
  "cobaTulis": {
    "tersedia": false
  },
  "sebelumnya": null,
  "berikutnya": "na",
  "statistik": {
    "benar": 0,
    "salah": 0
  }
}
```

Kartu sandhangan (bab 2 dan 3) punya `komponen` dan `posisi`:
```json
{
  "statusKonten": "draf",
  "babId": "sandhangan",
  "babJudul": "Sandhangan swara",
  "id": "wulu",
  "nama": "wulu",
  "aksara": "ꦏꦶ",
  "bacaan": "ki",
  "tanda": "ꦶ",
  "posisi": "di atas aksara",
  "komponen": {
    "aksaraDasar": "ꦏ",
    "tanda": "ꦶ"
  },
  "contohKata": [
    {
      "kata": "pitik",
      "arti": "ayam"
    }
  ],
  "catatan": "Contoh: ꦏ (ka) + wulu = ki.",
  "mirip": [],
  "goresan": null,
  "cobaTulis": {
    "tersedia": false
  },
  "sebelumnya": null,
  "berikutnya": "pepet",
  "statistik": {
    "benar": 0,
    "salah": 0
  }
}
```

`goresan` (animasi urutan goresan) dan `cobaTulis.tersedia` sengaja disiapkan untuk fitur Nulis nanti.
`sebelumnya`/`berikutnya` berurutan dalam satu bab; untuk navigasi di dalam tantangan pakai daftar `kartu` dari endpoint langkah.

## GET /api/progres
```json
{
  "ringkasan": {
    "kartuDilihat": 29,
    "totalKartu": 29,
    "tantanganSelesai": 30,
    "totalTantangan": 30,
    "bintangDidapat": 9,
    "maksBintang": 9,
    "kuisSelesai": 3,
    "totalKuis": 3
  },
  "streak": {
    "hari": 1,
    "belajarHariIni": true
  },
  "perBab": [
    {
      "id": "nglegena",
      "urutan": 1,
      "judul": "Aksara Nglegena",
      "ringkasan": "Kenali 20 aksara dasar",
      "deskripsi": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
      "warna": "hijau",
      "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ",
      "jumlahKartu": 20,
      "jumlahLangkah": 5,
      "totalTantangan": 10,
      "tantanganSelesai": 10,
      "persen": 100,
      "bintangTerbaik": 3,
      "selesai": true
    },
    "..."
  ],
  "seringSalah": [
    {
      "kartuId": "ra",
      "babId": "nglegena",
      "nama": null,
      "aksara": "ꦫ",
      "bacaan": "ra",
      "benar": 0,
      "salah": 4
    },
    "..."
  ],
  "riwayatKuis": [
    {
      "babId": "panyigeg",
      "tantanganId": "panyigeg/kuis/1",
      "benar": 5,
      "total": 5,
      "bintang": 3,
      "waktu": "2026-10-09T04:12:36.246Z"
    },
    {
      "babId": "panyigeg",
      "tantanganId": "panyigeg/ingat/3",
      "benar": 5,
      "total": 5,
      "bintang": 3,
      "waktu": "2026-10-09T04:12:36.237Z"
    },
    "..."
  ]
}
```

---

## Rute halaman yang disarankan
`/beranda` · `/materi` · `/materi/:babId` (jalur) · `/materi/:babId/langkah/:langkahId` · `/materi/:babId/langkah/:langkahId/tantangan/:no` · `/materi/:babId/:kartuId` · `/progres`

## Catatan untuk yang membangun frontend
- Jangan hitung nilai, bintang, persen, status gembok, atau streak di frontend: semuanya sudah dihitung server.
- Setelah menyelesaikan tantangan atau membuka kartu, ambil ulang `GET /api/materi/:babId` untuk memperbarui jalur.
- Struktur dan isi jalur (judul langkah, pembagian kartu per tantangan) ada di `backend/src/content/materi.js` dan bisa diubah tanpa menyentuh kode lain.
