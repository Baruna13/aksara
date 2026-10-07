import { Link } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Bintang, Card, Page, Status, useLoad } from './ui.jsx';

export default function MateriPage() {
  const { data, error, loading } = useLoad(belajar.daftarBab);
  return (
    <Page judul="Materi" kembali="/beranda">
      <Status loading={loading} error={error} />
      {data?.bab.map((b) => (
        <Link key={b.id} to={`/materi/${b.id}`}>
          <Card>
            <h2>Bab {b.urutan} · {b.judul}</h2>
            <Aksara>{b.preview}</Aksara>
            <p className="muted">{b.kartuDilihat}/{b.jumlahKartu} kartu · <Bintang n={b.bintangTerbaik} /></p>
          </Card>
        </Link>
      ))}
      {data?.statusKonten === 'draf' && <small className="muted">Isi materi masih draf.</small>}
    </Page>
  );
}
