// Mengerjakan satu tantangan latihan/kuis: soal satu per satu, lalu hasil.
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Bintang, Card, Page, Status, Tombol, useLoad } from './ui.jsx';

export default function TantanganPage() {
  const { babId, langkahId, no } = useParams();
  const kembali = `/materi/${babId}/langkah/${langkahId}`;
  const [putaran, setPutaran] = useState(0); // naik 1 = ronde baru
  const { data, error, loading } = useLoad(() => belajar.soal(babId, langkahId, no), [babId, langkahId, no, putaran]);
  const [jawaban, setJawaban] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [galat, setGalat] = useState('');

  const ulang = () => { setJawaban([]); setHasil(null); setGalat(''); setPutaran((n) => n + 1); };

  async function pilih(soal, teks) {
    const baru = [...jawaban, { ref: soal.ref, pilih: teks }];
    setJawaban(baru);
    if (baru.length === data.soal.length) {
      try { setHasil(await belajar.kirim(babId, langkahId, no, baru)); } catch (e) { setGalat(e.message); }
    }
  }

  if (hasil) {
    return (
      <Page judul={hasil.lulus ? 'Mantap!' : 'Belum lulus'} kembali={kembali}>
        <Card style={{ textAlign: 'center' }}>
          <h1><Bintang n={hasil.bintang} /></h1>
          <p>Benar {hasil.skor.benar} dari {hasil.skor.total} ({hasil.skor.persen}%)</p>
          {hasil.pesan && <p className="err">{hasil.pesan}</p>}
          {hasil.langkahSelesai && <p><b>Langkah selesai!</b></p>}
          {hasil.langkahBerikutnyaTerbuka && <p>Langkah berikutnya terbuka.</p>}
          {hasil.babSelesai && <p><b>Bab selesai!</b></p>}
        </Card>
        {hasil.kartuPerluDiulang.length > 0 && (
          <Card>
            <h2>Perlu diulang</h2>
            {hasil.kartuPerluDiulang.map((k) => (
              <Link key={k.kartuId} to={`/materi/${babId}/${k.kartuId}`}><Aksara>{k.aksara}</Aksara> {k.nama ?? k.bacaan} </Link>
            ))}
          </Card>
        )}
        {!hasil.lulus && <Tombol onClick={ulang}>Coba lagi</Tombol>}
        <Link to={`/materi/${babId}`}><Tombol as="div" style={{ display: 'grid', placeItems: 'center' }}>Kembali ke jalur</Tombol></Link>
      </Page>
    );
  }

  const soal = data?.soal[jawaban.length];
  const fontPilihan = (jenis) => (jenis === 'aksara' ? { fontFamily: "'Noto Sans Javanese', serif", fontSize: '1.6rem' } : {});

  return (
    <Page judul="Tantangan" kembali={kembali}>
      <Status loading={loading} error={error || galat} />
      {soal && (
        <>
          <p className="muted">Soal {soal.no} dari {data.jumlahSoal}</p>
          <Card style={{ textAlign: 'center' }}>
            <p>{soal.perintah}</p>
            {soal.tampilan.jenis === 'aksara'
              ? <Aksara $size="4rem">{soal.tampilan.teks}</Aksara>
              : <h1>{soal.tampilan.teks}</h1>}
          </Card>
          <div className="grid">
            {soal.pilihan.map((p) => (
              <Tombol key={p} style={fontPilihan(soal.pilihanJenis)} onClick={() => pilih(soal, p)}>{p}</Tombol>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
