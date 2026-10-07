// ISI MATERI AKSARA JAWA
// Semua isi di sini masih DRAF (status: "draf"): bacaan, contoh kata, dan penjelasan
// perlu dicocokkan dengan buku pelajaran / guru Bahasa Jawa sebelum dianggap final.
// Edit langsung file ini lewat GitHub; tidak perlu menyentuh database.
//
// Kartu bab "huruf"      : aksara + bacaan + konsonan
// Kartu bab "sandhangan" : tanda + bunyi (aksara dasar yang dipakai untuk kuis: nglegena kecuali "ha")

export const META = {
  status: 'draf',
  catatan: 'Isi materi masih draf dan perlu diverifikasi guru atau buku pelajaran.',
};

export const BAB = [
  {
    "id": "nglegena",
    "urutan": 1,
    "judul": "Aksara nglegena",
    "ringkasan": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
    "jenis": "huruf",
    "kelompok": [
      {
        "judul": "Nglegena 1–10",
        "kartuIds": [
          "ha",
          "na",
          "ca",
          "ra",
          "ka",
          "da",
          "ta",
          "sa",
          "wa",
          "la"
        ]
      },
      {
        "judul": "Nglegena 11–20",
        "kartuIds": [
          "pa",
          "dha",
          "ja",
          "ya",
          "nya",
          "ma",
          "ga",
          "ba",
          "tha",
          "nga"
        ]
      }
    ],
    "kartu": [
      {
        "id": "ha",
        "aksara": "ꦲ",
        "bacaan": "ha",
        "konsonan": "h",
        "contohKata": [
          {
            "kata": "aksara",
            "arti": "huruf, tulisan"
          }
        ],
        "status": "draf",
        "catatan": "ꦲ (ha) juga dipakai untuk menulis bunyi “a” di awal kata, misalnya “aksara”. Bentuknya mirip ꦭ (la), jadi perhatikan baik-baik.",
        "mirip": [
          "la"
        ]
      },
      {
        "id": "na",
        "aksara": "ꦤ",
        "bacaan": "na",
        "konsonan": "n",
        "contohKata": [
          {
            "kata": "nandur",
            "arti": "menanam"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ca",
        "aksara": "ꦕ",
        "bacaan": "ca",
        "konsonan": "c",
        "contohKata": [
          {
            "kata": "caping",
            "arti": "topi petani"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ra",
        "aksara": "ꦫ",
        "bacaan": "ra",
        "konsonan": "r",
        "contohKata": [
          {
            "kata": "rasa",
            "arti": "rasa"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ka",
        "aksara": "ꦏ",
        "bacaan": "ka",
        "konsonan": "k",
        "contohKata": [
          {
            "kata": "kali",
            "arti": "sungai"
          }
        ],
        "status": "draf"
      },
      {
        "id": "da",
        "aksara": "ꦢ",
        "bacaan": "da",
        "konsonan": "d",
        "contohKata": [
          {
            "kata": "dalan",
            "arti": "jalan"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ta",
        "aksara": "ꦠ",
        "bacaan": "ta",
        "konsonan": "t",
        "contohKata": [
          {
            "kata": "tali",
            "arti": "tali"
          }
        ],
        "status": "draf"
      },
      {
        "id": "sa",
        "aksara": "ꦱ",
        "bacaan": "sa",
        "konsonan": "s",
        "contohKata": [
          {
            "kata": "sawah",
            "arti": "sawah"
          }
        ],
        "status": "draf"
      },
      {
        "id": "wa",
        "aksara": "ꦮ",
        "bacaan": "wa",
        "konsonan": "w",
        "contohKata": [
          {
            "kata": "wayang",
            "arti": "wayang"
          }
        ],
        "status": "draf"
      },
      {
        "id": "la",
        "aksara": "ꦭ",
        "bacaan": "la",
        "konsonan": "l",
        "contohKata": [
          {
            "kata": "lara",
            "arti": "sakit"
          }
        ],
        "status": "draf",
        "catatan": "Bentuknya mirip ꦲ (ha). Perhatikan perbedaannya.",
        "mirip": [
          "ha"
        ]
      },
      {
        "id": "pa",
        "aksara": "ꦥ",
        "bacaan": "pa",
        "konsonan": "p",
        "contohKata": [
          {
            "kata": "pasar",
            "arti": "pasar"
          }
        ],
        "status": "draf"
      },
      {
        "id": "dha",
        "aksara": "ꦝ",
        "bacaan": "dha",
        "konsonan": "dh",
        "contohKata": [
          {
            "kata": "dhahar",
            "arti": "makan (bahasa halus)"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ja",
        "aksara": "ꦗ",
        "bacaan": "ja",
        "konsonan": "j",
        "contohKata": [
          {
            "kata": "jaran",
            "arti": "kuda"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ya",
        "aksara": "ꦪ",
        "bacaan": "ya",
        "konsonan": "y",
        "contohKata": [
          {
            "kata": "yaiku",
            "arti": "yaitu"
          }
        ],
        "status": "draf"
      },
      {
        "id": "nya",
        "aksara": "ꦚ",
        "bacaan": "nya",
        "konsonan": "ny",
        "contohKata": [
          {
            "kata": "nyamuk",
            "arti": "nyamuk"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ma",
        "aksara": "ꦩ",
        "bacaan": "ma",
        "konsonan": "m",
        "contohKata": [
          {
            "kata": "manuk",
            "arti": "burung"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ga",
        "aksara": "ꦒ",
        "bacaan": "ga",
        "konsonan": "g",
        "contohKata": [
          {
            "kata": "gajah",
            "arti": "gajah"
          }
        ],
        "status": "draf"
      },
      {
        "id": "ba",
        "aksara": "ꦧ",
        "bacaan": "ba",
        "konsonan": "b",
        "contohKata": [
          {
            "kata": "banyu",
            "arti": "air"
          }
        ],
        "status": "draf"
      },
      {
        "id": "tha",
        "aksara": "ꦛ",
        "bacaan": "tha",
        "konsonan": "th",
        "contohKata": [
          {
            "kata": "thathit",
            "arti": "kilat"
          }
        ],
        "status": "draf"
      },
      {
        "id": "nga",
        "aksara": "ꦔ",
        "bacaan": "nga",
        "konsonan": "ng",
        "contohKata": [
          {
            "kata": "ngarep",
            "arti": "depan"
          }
        ],
        "status": "draf"
      }
    ],
    "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ"
  },
  {
    "id": "sandhangan",
    "urutan": 2,
    "judul": "Sandhangan swara",
    "ringkasan": "Tanda yang mengubah bunyi vokal aksara: wulu, pepet, suku, taling, dan taling tarung.",
    "jenis": "sandhangan",
    "kelompok": [
      {
        "judul": "Sandhangan swara",
        "kartuIds": [
          "wulu",
          "pepet",
          "suku",
          "taling",
          "tarung"
        ]
      }
    ],
    "kartu": [
      {
        "id": "wulu",
        "nama": "wulu",
        "tanda": "ꦶ",
        "bunyi": "i",
        "posisi": "di atas aksara",
        "contohKata": [
          {
            "kata": "pitik",
            "arti": "ayam"
          }
        ],
        "aksara": "ꦏꦶ",
        "bacaan": "ki",
        "status": "draf",
        "catatan": "Contoh: ꦏ (ka) + wulu = ki."
      },
      {
        "id": "pepet",
        "nama": "pepet",
        "tanda": "ꦼ",
        "bunyi": "ê",
        "posisi": "di atas aksara",
        "contohKata": [
          {
            "kata": "pecel",
            "arti": "makanan sayur dengan bumbu kacang"
          }
        ],
        "aksara": "ꦏꦼ",
        "bacaan": "kê",
        "status": "draf",
        "catatan": "Contoh: ꦏ (ka) + pepet = kê."
      },
      {
        "id": "suku",
        "nama": "suku",
        "tanda": "ꦸ",
        "bunyi": "u",
        "posisi": "di bawah aksara",
        "contohKata": [
          {
            "kata": "buku",
            "arti": "buku"
          }
        ],
        "aksara": "ꦏꦸ",
        "bacaan": "ku",
        "status": "draf",
        "catatan": "Contoh: ꦏ (ka) + suku = ku."
      },
      {
        "id": "taling",
        "nama": "taling",
        "tanda": "ꦺ",
        "bunyi": "é",
        "posisi": "di depan (sebelah kiri) aksara",
        "contohKata": [
          {
            "kata": "sate",
            "arti": "sate"
          }
        ],
        "catatan": "Bunyinya bisa é atau è, tergantung katanya. Contoh: ꦏ (ka) + taling = ké.",
        "aksara": "ꦏꦺ",
        "bacaan": "ké",
        "status": "draf"
      },
      {
        "id": "tarung",
        "nama": "taling tarung",
        "tanda": "ꦺꦴ",
        "bunyi": "o",
        "posisi": "mengapit aksara: taling di depan, tarung di belakang",
        "contohKata": [
          {
            "kata": "soto",
            "arti": "soto"
          }
        ],
        "aksara": "ꦏꦺꦴ",
        "bacaan": "ko",
        "status": "draf",
        "catatan": "Contoh: ꦏ (ka) + taling tarung = ko."
      }
    ],
    "preview": "ꦏꦶ ꦏꦼ ꦏꦸ ꦏꦺ ꦏꦺꦴ"
  },
  {
    "id": "panyigeg",
    "urutan": 3,
    "judul": "Panyigeg & pangkon",
    "ringkasan": "Tanda penutup suku kata (layar, cecak, wignyan) dan pangkon.",
    "jenis": "sandhangan",
    "kelompok": [
      {
        "judul": "Panyigeg & pangkon",
        "kartuIds": [
          "layar",
          "cecak",
          "wignyan",
          "pangkon"
        ]
      }
    ],
    "kartu": [
      {
        "id": "layar",
        "nama": "layar",
        "tanda": "ꦂ",
        "bunyi": "ar",
        "posisi": "di atas aksara",
        "contohKata": [
          {
            "kata": "kabar",
            "arti": "kabar, berita"
          }
        ],
        "aksara": "ꦏꦂ",
        "bacaan": "kar",
        "status": "draf",
        "catatan": "Layar menambah bunyi “r” di akhir suku kata. Contoh: ꦏ (ka) + layar = kar."
      },
      {
        "id": "cecak",
        "nama": "cecak",
        "tanda": "ꦁ",
        "bunyi": "ang",
        "posisi": "di atas aksara",
        "contohKata": [
          {
            "kata": "kembang",
            "arti": "bunga"
          }
        ],
        "aksara": "ꦏꦁ",
        "bacaan": "kang",
        "status": "draf",
        "catatan": "Cecak menambah bunyi “ng” di akhir suku kata. Contoh: ꦏ (ka) + cecak = kang."
      },
      {
        "id": "wignyan",
        "nama": "wignyan",
        "tanda": "ꦃ",
        "bunyi": "ah",
        "posisi": "di belakang aksara",
        "contohKata": [
          {
            "kata": "lemah",
            "arti": "tanah"
          }
        ],
        "aksara": "ꦏꦃ",
        "bacaan": "kah",
        "status": "draf",
        "catatan": "Wignyan menambah bunyi “h” di akhir suku kata. Contoh: ꦏ (ka) + wignyan = kah."
      },
      {
        "id": "pangkon",
        "nama": "pangkon",
        "tanda": "꧀",
        "bunyi": "",
        "posisi": "di belakang aksara",
        "contohKata": [
          {
            "kata": "bapak",
            "arti": "ayah"
          },
          {
            "kata": "tindak",
            "arti": "pergi (bahasa halus)"
          }
        ],
        "aksara": "ꦏ꧀",
        "bacaan": "k",
        "status": "draf",
        "catatan": "Pangkon mematikan bunyi “a” bawaan, sehingga aksara dibaca sebagai konsonan saja. Contoh: ꦏ (ka) + pangkon = k."
      }
    ],
    "preview": "ꦏꦂ ꦏꦁ ꦏꦃ ꦏ꧀"
  }
];

// ---- helper (jangan diubah kalau cuma mau edit isi materi) ----
export const getBab = (id) => BAB.find((b) => b.id === id);
export const semuaKartu = () => BAB.flatMap((b) => b.kartu.map((k) => ({ ...k, babId: b.id })));
export const totalKartu = () => BAB.reduce((n, b) => n + b.kartu.length, 0);
// Aksara dasar untuk kuis sandhangan: semua nglegena kecuali "ha" (ꦲ punya perilaku khusus)
export const DASAR = BAB[0].kartu.filter((k) => k.id !== 'ha');
