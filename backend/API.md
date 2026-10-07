# API Belajar (untuk frontend)

Semua endpoint di bawah **wajib login**: kirim header `Authorization: Bearer <accessToken>`
(token didapat dari `/api/auth/login`, `/register`, atau `/google`; `frontend/src/api.js` sudah mengurus
pemanggilan dan refresh token otomatis lewat fungsi `authed()`).

Error selalu berbentuk `{ "error": { "message": "...", "code": "..." } }`.
Pesan di `message` sudah berbahasa Indonesia dan boleh langsung ditampilkan.

> Isi materi masih **draf** (`statusKonten: "draf"`). Tampilkan penanda kecil "draf" kalau perlu, sampai isinya diverifikasi.

## Aturan tampilan
- Semua field `aksara` dan teks bertipe aksara harus dirender dengan font **Noto Sans Javanese** (sudah dimuat di `index.html`).
- Teks Latin (`bacaan`) pakai font biasa.

## Ringkasan endpoint

| Method | Path | Fungsi | Dipakai di |
|---|---|---|---|
| GET | `/api/beranda` | Salam, tombol "Lanjutkan belajar", tombol fitur, ringkasan progres | Beranda |
| GET | `/api/materi` | Daftar 3 bab + progres tiap bab | Halaman Materi |
| GET | `/api/materi/:babId` | Isi satu bab: kelompok dan kartu | Halaman Bab |
| GET | `/api/materi/:babId/kartu/:kartuId` | Detail satu kartu huruf. **Otomatis menandai kartu "dilihat"** | Kartu huruf |
| GET | `/api/kuis/:babId` | Ambil 10 soal acak | Kuis |
| POST | `/api/kuis/:babId/submit` | Kirim jawaban, dapat nilai dan bintang | Hasil kuis |
| GET | `/api/progres` | Statistik lengkap | Halaman Progres |

`babId`: `nglegena`, `sandhangan`, `panyigeg`. `kartuId`: lihat `babId` > kelompok > kartu > `id`.

---

## GET /api/beranda
Keputusan 2 (beranda klasik). `lanjutkan` bernilai `null` kalau semua kartu sudah dibuka.
`fitur[].aktif = false` artinya tombol ditampilkan tapi dinonaktifkan ("segera hadir").
`streak.hari` = hari belajar berturut-turut; kalau hari ini belum belajar tapi kemarin sudah, streak belum putus.

```json
{
  "nama": "Budi Santoso",
  "lanjutkan": {
    "babId": "nglegena",
    "babJudul": "Aksara nglegena",
    "kartuId": "ha",
    "aksara": "ꦲ",
    "bacaan": "ha"
  },
  "ringkasan": {
    "kartuDilihat": 0,
    "totalKartu": 29,
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
```json
{
  "statusKonten": "draf",
  "bab": [
    {
      "id": "nglegena",
      "urutan": 1,
      "judul": "Aksara nglegena",
      "ringkasan": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
      "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ",
      "jumlahKartu": 20,
      "kartuDilihat": 0,
      "persenDilihat": 0,
      "bintangTerbaik": 0,
      "skorTerbaik": null,
      "percobaanKuis": 0
    }
  ]
}
```

## GET /api/materi/:babId
```json
{
  "statusKonten": "draf",
  "id": "nglegena",
  "urutan": 1,
  "judul": "Aksara nglegena",
  "ringkasan": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
  "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ",
  "jumlahKartu": 20,
  "kartuDilihat": 0,
  "persenDilihat": 0,
  "bintangTerbaik": 0,
  "skorTerbaik": null,
  "percobaanKuis": 0,
  "kelompok": [
    {
      "judul": "Nglegena 1–10",
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
    "..."
  ]
}
```

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

Kartu sandhangan (bab 2 dan 3) punya `komponen` (aksara dasar + tanda) dan `posisi`:
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

`goresan` (animasi urutan goresan) dan `cobaTulis.tersedia` sengaja disiapkan: nanti diisi saat fitur Nulis ada.
Tombol "Coba tulis" tampilkan hanya kalau `cobaTulis.tersedia` bernilai `true`.

---

## Alur kuis

1. `GET /api/kuis/:babId` → 10 soal. Server **tidak menyimpan** soal dan **tidak mengirim kunci jawaban**.
2. Tampilkan soal satu per satu. Tiap soal punya:
   - `tampilan`: `{ jenis: "aksara" | "latin", teks }` → yang ditampilkan sebagai pertanyaan.
   - `pilihanJenis`: `"aksara"` atau `"latin"` → jenis tiap tombol pilihan (kalau `aksara`, pakai font Jawa).
   - `perintah`: kalimat instruksi siap tampil.
3. Kumpulkan jawaban: untuk tiap soal, kirim kembali `ref` (apa adanya) dan `pilih` (teks pilihan yang diketuk).
4. `POST /api/kuis/:babId/submit` dengan body `{ "jawaban": [{ "ref": "...", "pilih": "..." }, ...] }`.

```json
{
  "babId": "nglegena",
  "jumlahSoal": 10,
  "soal": [
    {
      "no": 1,
      "ref": "tha|aksara_ke_latin|",
      "tipe": "aksara_ke_latin",
      "perintah": "Bagaimana cara membaca aksara ini?",
      "tampilan": {
        "jenis": "aksara",
        "teks": "ꦛ"
      },
      "pilihanJenis": "latin",
      "pilihan": [
        "ka",
        "nya",
        "tha",
        "wa"
      ]
    },
    {
      "no": 2,
      "ref": "ra|aksara_ke_latin|",
      "tipe": "aksara_ke_latin",
      "perintah": "Bagaimana cara membaca aksara ini?",
      "tampilan": {
        "jenis": "aksara",
        "teks": "ꦫ"
      },
      "pilihanJenis": "latin",
      "pilihan": [
        "ra",
        "ja",
        "ka",
        "ha"
      ]
    }
  ]
}
```

Body submit:
```json
{ "jawaban": [ { "ref": "tha|aksara_ke_latin|", "pilih": "ka" } ] }
```

Respons submit. Bintang: **3★** jika ≥ 90%, **2★** jika ≥ 70%, **1★** jika selesai.
`kartuPerluDiulang` bisa dipakai untuk tombol "Pelajari lagi". `hasil[].jawabanBenar` untuk menampilkan koreksi.
```json
{
  "babId": "nglegena",
  "skor": {
    "benar": 10,
    "total": 10,
    "persen": 100
  },
  "bintang": 3,
  "bintangTerbaik": 3,
  "hasil": [
    {
      "ref": "tha|aksara_ke_latin|",
      "kartuId": "tha",
      "benar": true,
      "pilih": "tha",
      "jawabanBenar": "tha"
    },
    "..."
  ],
  "kartuPerluDiulang": [],
  "streak": {
    "hari": 1,
    "belajarHariIni": true
  }
}
```

Aturan: 1–20 jawaban per submit, `ref` tidak boleh kembar. Selain itu respons `400`.

## GET /api/progres
```json
{
  "ringkasan": {
    "kartuDilihat": 2,
    "totalKartu": 29,
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
      "judul": "Aksara nglegena",
      "ringkasan": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
      "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ",
      "jumlahKartu": 20,
      "kartuDilihat": 1,
      "persenDilihat": 5,
      "bintangTerbaik": 3,
      "skorTerbaik": 100,
      "percobaanKuis": 5
    },
    "..."
  ],
  "seringSalah": [
    {
      "kartuId": "ta",
      "babId": "nglegena",
      "nama": null,
      "aksara": "ꦠ",
      "bacaan": "ta",
      "benar": 1,
      "salah": 4
    },
    {
      "kartuId": "ha",
      "babId": "nglegena",
      "nama": null,
      "aksara": "ꦲ",
      "bacaan": "ha",
      "benar": 2,
      "salah": 3
    },
    "..."
  ],
  "riwayatKuis": [
    {
      "babId": "panyigeg",
      "benar": 10,
      "total": 10,
      "bintang": 3,
      "waktu": "2026-10-07T04:23:31.920Z"
    },
    {
      "babId": "sandhangan",
      "benar": 10,
      "total": 10,
      "bintang": 3,
      "waktu": "2026-10-07T04:23:31.912Z"
    },
    "..."
  ]
}
```

---

## Rute halaman yang disarankan
`/beranda` · `/materi` · `/materi/:babId` · `/materi/:babId/:kartuId` · `/kuis/:babId` · `/progres`
(field `fitur[].rute` di `/api/beranda` sudah berisi rute untuk tombol di beranda.)

## Catatan untuk yang membangun frontend
- Jangan hitung nilai, bintang, atau streak di frontend: semuanya sudah dihitung server.
- Membuka kartu = cukup `GET` kartu itu; tidak ada panggilan "tandai dilihat" terpisah.
- Contoh pemanggilan siap pakai ada di `frontend/src/api.js` (objek `belajar`).
