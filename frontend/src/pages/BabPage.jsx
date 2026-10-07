import { Link, useParams } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Bintang, Card, Page, Status, Tombol, useLoad } from './ui.jsx';

export default function BabPage() {
  const { babId } = useParams();
  const { data: b, error, loading } = useLoad(() => belajar.bab(babId), [babId]);

  return (
    <Page judul={b ? b.judul : 'Bab'} kembali="/materi">
      <Status loading={loading} error={error} />
      {b && (
        <>
          <p className="muted">{b.ringkasan} · <Bintang n={b.bintangTerbaik} /></p>
          {b.kelompok.map((g) => (
            <section key={g.judul}>
              <h2>{g.judul}</h2>
              <div className="grid">
                {g.kartu.map((k) => (
                  <Link key={k.id} to={`/materi/${b.id}/${k.id}`}>
                    <Card style={{ opacity: k.dilihat ? 1 : 0.75, textAlign: 'center' }}>
                      <Aksara $size="2rem">{k.aksara}</Aksara>
                      <div>{k.nama ?? k.bacaan} {k.dilihat && '✓'}</div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          <Link to={`/kuis/${b.id}`}><Tombol as="div" style={{ display: 'grid', placeItems: 'center' }}>Mulai kuis bab ini</Tombol></Link>
        </>
      )}
    </Page>
  );
}
