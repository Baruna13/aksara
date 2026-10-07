// Beranda klasik (keputusan 2): salam, "Lanjutkan belajar", 4 tombol fitur, ringkasan progres.
import { Link } from 'react-router-dom';
import { belajar } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Aksara, Card, Page, Status, Tombol, useLoad } from './ui.jsx';

export default function Dashboard() {
  const { logout } = useAuth();
  const { data: b, error, loading } = useLoad(belajar.beranda);

  return (
    <Page judul={b ? `Sugeng rawuh, ${b.nama}!` : 'Beranda'}>
      <Status loading={loading} error={error} />
      {b && (
        <>
          {b.lanjutkan ? (
            <Link to={`/materi/${b.lanjutkan.babId}/${b.lanjutkan.kartuId}`}>
              <Tombol as="div" style={{ display: 'grid', placeItems: 'center' }}>
                Lanjutkan belajar · <Aksara $size="1.2rem">{b.lanjutkan.aksara}</Aksara> {b.lanjutkan.bacaan}
              </Tombol>
            </Link>
          ) : (
            <Card>Semua kartu sudah kamu buka. Coba ulangi kuisnya!</Card>
          )}

          <div className="grid">
            {b.fitur.map((f) =>
              f.aktif ? (
                <Link key={f.id} to={f.rute}><Card>{f.judul}</Card></Link>
              ) : (
                <Card key={f.id} style={{ opacity: 0.5 }}>{f.judul}<br /><small>Segera hadir</small></Card>
              )
            )}
          </div>

          <Card>
            <h2>Progres kamu</h2>
            <p className="muted">
              Kartu: {b.ringkasan.kartuDilihat}/{b.ringkasan.totalKartu} · Bintang: {b.ringkasan.bintangDidapat}/{b.ringkasan.maksBintang} ·
              {' '}{b.streak.hari} hari berturut-turut
            </p>
          </Card>
        </>
      )}
      <Tombol onClick={logout}>Keluar</Tombol>
    </Page>
  );
}
