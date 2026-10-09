// "Perjalanan belajar": jalur 5 langkah ala Duolingo untuk satu bab.
import { Link, useParams } from 'react-router-dom';
import { belajar } from '../api.js';
import { Bintang, Card, Page, Status, useLoad } from './ui.jsx';

const TANDA = { selesai: '✓', terbuka: '▶', terkunci: '🔒', segera: '⏳' };

export default function PerjalananPage() {
  const { babId } = useParams();
  const { data: b, error, loading } = useLoad(() => belajar.jalur(babId), [babId]);

  return (
    <Page judul="Perjalanan belajar" kembali="/materi">
      <Status loading={loading} error={error} />
      {b && (
        <>
          <Card>
            <h2>Bab {b.urutan} · {b.judul}</h2>
            <p className="muted">{b.ringkasan} · {b.persen}% · <Bintang n={b.bintangTerbaik} /></p>
          </Card>

          {b.langkah.map((l) => {
            const bisaDibuka = l.status === 'terbuka' || l.status === 'selesai';
            const isi = (
              <Card style={{ opacity: bisaDibuka ? 1 : 0.55 }}>
                {l.id === b.saatIni && <small><b>MULAI DI SINI</b></small>}
                <h2>{TANDA[l.status]} {l.judul}</h2>
                <p className="muted">{l.keterangan} · {l.tantanganSelesai}/{l.jumlahTantangan}
                  {l.status === 'segera' && ' · segera hadir'}</p>
              </Card>
            );
            return bisaDibuka
              ? <Link key={l.id} to={`/materi/${b.id}/langkah/${l.id}`}>{isi}</Link>
              : <div key={l.id}>{isi}</div>;
          })}
          <small className="muted">Selesaikan satu langkah untuk membuka langkah berikutnya.</small>
        </>
      )}
    </Page>
  );
}
