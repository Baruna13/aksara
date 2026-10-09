// ISI MATERI AKSARA JAWA
// Semua isi di sini masih DRAF (status: "draf"): bacaan, contoh kata, dan penjelasan
// perlu dicocokkan dengan buku pelajaran / guru Bahasa Jawa sebelum dianggap final.
// Edit langsung file ini lewat GitHub; tidak perlu menyentuh database.
//
// Struktur:  BAB  ->  5 LANGKAH (jalur ala Duolingo)  ->  TANTANGAN
//   jenis langkah "mengenal": tantangan = sekelompok kartu yang harus dibuka
//   jenis langkah "latihan" : tantangan = satu ronde soal (kartuIds = kartu yang diuji, tipe, jumlahSoal)
//   jenis langkah "tulis"   : belum tersedia (menunggu fitur Nulis), tidak menghalangi langkah berikutnya
//   jenis langkah "kuis"    : satu kuis campuran untuk seluruh bab
// Kartu bab "huruf"      : aksara + bacaan + konsonan
// Kartu bab "sandhangan" : tanda + bunyi (aksara dasar untuk kuis: nglegena kecuali "ha")

export const META = {
  status: 'draf',
  catatan: 'Isi materi masih draf dan perlu diverifikasi guru atau buku pelajaran.',
};

// Persen benar minimal agar sebuah tantangan latihan dianggap selesai
export const AMBANG_LULUS = 60;

export const BAB = [
  {
    "id": "nglegena",
    "urutan": 1,
    "judul": "Aksara Nglegena",
    "ringkasan": "Kenali 20 aksara dasar",
    "warna": "hijau",
    "deskripsi": "20 aksara dasar Jawa (hanacaraka) dan cara membacanya.",
    "jenis": "huruf",
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
    "langkah": [
      {
        "id": "kenali",
        "urutan": 1,
        "judul": "Kenali aksara dasar",
        "jenis": "mengenal",
        "label": "Mengenal",
        "ikon": "mata",
        "tantangan": [
          {
            "kartuIds": [
              "ha",
              "na",
              "ca",
              "ra",
              "ka",
              "da",
              "ta"
            ]
          },
          {
            "kartuIds": [
              "sa",
              "wa",
              "la",
              "pa",
              "dha",
              "ja",
              "ya"
            ]
          },
          {
            "kartuIds": [
              "nya",
              "ma",
              "ga",
              "ba",
              "tha",
              "nga"
            ]
          }
        ]
      },
      {
        "id": "temukan",
        "urutan": 2,
        "judul": "Temukan bentuknya",
        "jenis": "latihan",
        "label": "Mengenal",
        "ikon": "mata",
        "tantangan": [
          {
            "kartuIds": [
              "ha",
              "na",
              "ca",
              "ra",
              "ka",
              "da",
              "ta"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "sa",
              "wa",
              "la",
              "pa",
              "dha",
              "ja",
              "ya"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "nya",
              "ma",
              "ga",
              "ba",
              "tha",
              "nga"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          }
        ]
      },
      {
        "id": "ingat",
        "urutan": 3,
        "judul": "Ingat bunyinya",
        "jenis": "latihan",
        "label": "Mengingat",
        "ikon": "otak",
        "tantangan": [
          {
            "kartuIds": [
              "ha",
              "na",
              "ca",
              "ra",
              "ka",
              "da",
              "ta"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "sa",
              "wa",
              "la",
              "pa",
              "dha",
              "ja",
              "ya"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "nya",
              "ma",
              "ga",
              "ba",
              "tha",
              "nga"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          }
        ]
      },
      {
        "id": "tulis",
        "urutan": 4,
        "judul": "Latihan menulis",
        "jenis": "tulis",
        "label": "Menulis",
        "ikon": "pensil",
        "tantangan": [
          {
            "tersedia": false,
            "kartuIds": [
              "ha",
              "na",
              "ca",
              "ra",
              "ka",
              "da",
              "ta"
            ]
          },
          {
            "tersedia": false,
            "kartuIds": [
              "sa",
              "wa",
              "la",
              "pa",
              "dha",
              "ja",
              "ya"
            ]
          },
          {
            "tersedia": false,
            "kartuIds": [
              "nya",
              "ma",
              "ga",
              "ba",
              "tha",
              "nga"
            ]
          }
        ]
      },
      {
        "id": "kuis",
        "urutan": 5,
        "judul": "Kuis aksara dasar",
        "jenis": "kuis",
        "label": "Kuis",
        "ikon": "bintang",
        "tantangan": [
          {
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
              "la",
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
            ],
            "tipe": "campur",
            "jumlahSoal": 5
          }
        ]
      }
    ],
    "preview": "ꦲ ꦤ ꦕ ꦫ ꦏ"
  },
  {
    "id": "sandhangan",
    "urutan": 2,
    "judul": "Sandhangan Swara",
    "ringkasan": "Ubah bunyi dengan sandhangan",
    "warna": "kuning",
    "deskripsi": "Tanda yang mengubah bunyi vokal aksara: wulu, pepet, suku, taling, dan taling tarung.",
    "jenis": "sandhangan",
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
    "langkah": [
      {
        "id": "kenali",
        "urutan": 1,
        "judul": "Kenali sandhangan",
        "jenis": "mengenal",
        "label": "Mengenal",
        "ikon": "mata",
        "tantangan": [
          {
            "kartuIds": [
              "wulu",
              "pepet"
            ]
          },
          {
            "kartuIds": [
              "suku",
              "taling"
            ]
          },
          {
            "kartuIds": [
              "tarung"
            ]
          }
        ]
      },
      {
        "id": "temukan",
        "urutan": 2,
        "judul": "Temukan tandanya",
        "jenis": "latihan",
        "label": "Mengenal",
        "ikon": "mata",
        "tantangan": [
          {
            "kartuIds": [
              "wulu",
              "pepet"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "suku",
              "taling"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "tarung"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          }
        ]
      },
      {
        "id": "ingat",
        "urutan": 3,
        "judul": "Ingat perubahan bunyi",
        "jenis": "latihan",
        "label": "Mengingat",
        "ikon": "otak",
        "tantangan": [
          {
            "kartuIds": [
              "wulu",
              "pepet"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "suku",
              "taling"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "tarung"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          }
        ]
      },
      {
        "id": "tulis",
        "urutan": 4,
        "judul": "Tulis sandhangan",
        "jenis": "tulis",
        "label": "Menulis",
        "ikon": "pensil",
        "tantangan": [
          {
            "tersedia": false,
            "kartuIds": [
              "wulu",
              "pepet"
            ]
          },
          {
            "tersedia": false,
            "kartuIds": [
              "suku",
              "taling"
            ]
          },
          {
            "tersedia": false,
            "kartuIds": [
              "tarung"
            ]
          }
        ]
      },
      {
        "id": "kuis",
        "urutan": 5,
        "judul": "Kuis sandhangan",
        "jenis": "kuis",
        "label": "Kuis",
        "ikon": "bintang",
        "tantangan": [
          {
            "kartuIds": [
              "wulu",
              "pepet",
              "suku",
              "taling",
              "tarung"
            ],
            "tipe": "campur",
            "jumlahSoal": 5
          }
        ]
      }
    ],
    "preview": "ꦏꦶ ꦏꦼ ꦏꦸ ꦏꦺ ꦏꦺꦴ"
  },
  {
    "id": "panyigeg",
    "urutan": 3,
    "judul": "Panyigeg & Pangkon",
    "ringkasan": "Lengkapi bunyi akhir kata",
    "warna": "ungu",
    "deskripsi": "Tanda penutup suku kata (layar, cecak, wignyan) dan pangkon.",
    "jenis": "sandhangan",
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
    "langkah": [
      {
        "id": "kenali",
        "urutan": 1,
        "judul": "Kenali bunyi akhir",
        "jenis": "mengenal",
        "label": "Mengenal",
        "ikon": "mata",
        "tantangan": [
          {
            "kartuIds": [
              "layar",
              "cecak"
            ]
          },
          {
            "kartuIds": [
              "wignyan"
            ]
          },
          {
            "kartuIds": [
              "pangkon"
            ]
          }
        ]
      },
      {
        "id": "temukan",
        "urutan": 2,
        "judul": "Temukan penandanya",
        "jenis": "latihan",
        "label": "Mengenal",
        "ikon": "mata",
        "tantangan": [
          {
            "kartuIds": [
              "layar",
              "cecak"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "wignyan"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "pangkon"
            ],
            "tipe": "latin_ke_aksara",
            "jumlahSoal": 5
          }
        ]
      },
      {
        "id": "ingat",
        "urutan": 3,
        "judul": "Ingat bunyi penutup",
        "jenis": "latihan",
        "label": "Mengingat",
        "ikon": "otak",
        "tantangan": [
          {
            "kartuIds": [
              "layar",
              "cecak"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "wignyan"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          },
          {
            "kartuIds": [
              "pangkon"
            ],
            "tipe": "aksara_ke_latin",
            "jumlahSoal": 5
          }
        ]
      },
      {
        "id": "tulis",
        "urutan": 4,
        "judul": "Tulis bunyi akhir",
        "jenis": "tulis",
        "label": "Menulis",
        "ikon": "pensil",
        "tantangan": [
          {
            "tersedia": false,
            "kartuIds": [
              "layar",
              "cecak"
            ]
          },
          {
            "tersedia": false,
            "kartuIds": [
              "wignyan"
            ]
          },
          {
            "tersedia": false,
            "kartuIds": [
              "pangkon"
            ]
          }
        ]
      },
      {
        "id": "kuis",
        "urutan": 5,
        "judul": "Kuis akhir",
        "jenis": "kuis",
        "label": "Kuis",
        "ikon": "bintang",
        "tantangan": [
          {
            "kartuIds": [
              "layar",
              "cecak",
              "wignyan",
              "pangkon"
            ],
            "tipe": "campur",
            "jumlahSoal": 5
          }
        ]
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
