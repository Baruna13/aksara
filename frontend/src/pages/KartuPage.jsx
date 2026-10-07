import { Link, useParams } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Card, Page, Status, Tombol, useLoad } from './ui.jsx';

export default function KartuPage() {
  const { babId, kartuId } = useParams();
  const { data: k, error, loading } = useLoad(() => belajar.kartu(babId, kartuId), [babId, kartuId]);

  return (
    <Page kembali={`/materi/${babId}`}>
      <Status loading={loading} error={error} />
      {k && (
        <>
          <Card style={{ textAlign: 'center' }}>
            <Aksara $size="5rem">{k.aksara}</Aksara>
            <h1>{k.nama ? `${k.nama} → ${k.bacaan}` : k.bacaan}</h1>
            {k.posisi && <p>Posisi: {k.posisi}</p>}
            {k.komponen && (
              <p><Aksara>{k.komponen.aksaraDasar}</Aksara> + <Aksara>{k.komponen.tanda}</Aksara> = <Aksara>{k.aksara}</Aksara></p>
            )}
          </Card>
          <Card>
            <h2>Contoh kata</h2>
            {k.contohKata.map((c) => <p key={c.kata}>{c.kata} = {c.arti}</p>)}
            {k.catatan && <p className="muted">{k.catatan}</p>}
            {k.statusKonten === 'draf' && <small className="muted">Isi masih draf.</small>}
          </Card>
          {k.cobaTulis.tersedia && <Tombol>Coba tulis</Tombol>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {k.sebelumnya ? <Link to={`/materi/${babId}/${k.sebelumnya}`}>← Sebelumnya</Link> : <span />}
            {k.berikutnya ? <Link to={`/materi/${babId}/${k.berikutnya}`}>Berikutnya →</Link> : <Link to={`/kuis/${babId}`}>Mulai kuis →</Link>}
          </div>
        </>
      )}
    </Page>
  );
}
