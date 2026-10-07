import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Bintang, Card, Page, Status, Tombol, useLoad } from './ui.jsx';

export default function KuisPage() {
  const { babId } = useParams();
  const [putaran, setPutaran] = useState(0); // naik 1 = kuis baru
  const { data: kuis, error, loading } = useLoad(() => belajar.mulaiKuis(babId), [babId, putaran]);
  const [jawaban, setJawaban] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [galat, setGalat] = useState('');

  const ulang = () => { setJawaban([]); setHasil(null); setGalat(''); setPutaran((n) => n + 1); };

  async function pilih(soal, teks) {
    const baru = [...jawaban, { ref: soal.ref, pilih: teks }];
    setJawaban(baru);
    if (baru.length === kuis.soal.length) {
      try { setHasil(await belajar.kirimKuis(babId, baru)); } catch (e) { setGalat(e.message); }
    }
  }

  if (hasil) {
    return (
      <Page judul="Hasil kuis" kembali={`/materi/${babId}`}>
        <Card style={{ textAlign: 'center' }}>
          <h1><Bintang n={hasil.bintang} /></h1>
          <p>Benar {hasil.skor.benar} dari {hasil.skor.total} ({hasil.skor.persen}%)</p>
          <p className="muted">Bintang terbaik: {hasil.bintangTerbaik}</p>
        </Card>
        {hasil.kartuPerluDiulang.length > 0 && (
          <Card>
            <h2>Perlu diulang</h2>
            {hasil.kartuPerluDiulang.map((k) => (
              <Link key={k.kartuId} to={`/materi/${babId}/${k.kartuId}`}><Aksara>{k.aksara}</Aksara> {k.nama ?? k.bacaan} </Link>
            ))}
          </Card>
        )}
        <Tombol onClick={ulang}>Ulangi kuis</Tombol>
      </Page>
    );
  }

  const soal = kuis?.soal[jawaban.length];
  const font = (jenis) => (jenis === 'aksara' ? { fontFamily: "'Noto Sans Javanese', serif", fontSize: '1.6rem' } : {});

  return (
    <Page judul="Kuis" kembali={`/materi/${babId}`}>
      <Status loading={loading} error={error || galat} />
      {soal && (
        <>
          <p className="muted">Soal {soal.no} dari {kuis.jumlahSoal}</p>
          <Card style={{ textAlign: 'center' }}>
            <p>{soal.perintah}</p>
            <div style={font(soal.tampilan.jenis)}>
              {soal.tampilan.jenis === 'aksara' ? <Aksara $size="4rem">{soal.tampilan.teks}</Aksara> : <h1>{soal.tampilan.teks}</h1>}
            </div>
          </Card>
          <div className="grid">
            {soal.pilihan.map((p) => (
              <Tombol key={p} style={font(soal.pilihanJenis)} onClick={() => pilih(soal, p)}>{p}</Tombol>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
