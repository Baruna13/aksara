import { Link } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Bintang, Card, Page, Status, useLoad } from './ui.jsx';

export default function ProgresPage() {
  const { data: p, error, loading } = useLoad(belajar.progres);
  return (
    <Page judul="Progres" kembali="/beranda">
      <Status loading={loading} error={error} />
      {p && (
        <>
          <Card>
            <p>{p.streak.hari} hari berturut-turut {p.streak.belajarHariIni ? '(sudah belajar hari ini)' : '(belum belajar hari ini)'}</p>
            <p>Kartu {p.ringkasan.kartuDilihat}/{p.ringkasan.totalKartu} · Bintang {p.ringkasan.bintangDidapat}/{p.ringkasan.maksBintang}</p>
          </Card>
          <Card>
            <h2>Per bab</h2>
            {p.perBab.map((b) => (
              <p key={b.id}>{b.judul}: {b.kartuDilihat}/{b.jumlahKartu} kartu · <Bintang n={b.bintangTerbaik} /> · {b.percobaanKuis}x kuis</p>
            ))}
          </Card>
          <Card>
            <h2>Sering salah</h2>
            {p.seringSalah.length === 0 && <p className="muted">Belum ada. Coba kerjakan kuis dulu.</p>}
            {p.seringSalah.map((k) => (
              <p key={k.kartuId}>
                <Link to={`/materi/${k.babId}/${k.kartuId}`}><Aksara>{k.aksara}</Aksara> {k.nama ?? k.bacaan}</Link> · salah {k.salah}x, benar {k.benar}x
              </p>
            ))}
          </Card>
        </>
      )}
    </Page>
  );
}
