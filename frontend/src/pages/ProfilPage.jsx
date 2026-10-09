// "Progres Saya": avatar, statistik, dan "Perjalanan belajarmu".
import { Link } from 'react-router-dom';
import { akun } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Card, Page, Status, Tombol, useLoad } from './ui.jsx';

export default function ProfilPage() {
  const { logout } = useAuth();
  const { data: p, error, loading } = useLoad(akun.profil);

  return (
    <Page judul="Progres Saya" kembali="/beranda">
      <Status loading={loading} error={error} />
      {p && (
        <>
          <Card style={{ textAlign: 'center' }}>
            {/* Ganti dengan gambar: /avatar/{p.avatar.id}.png */}
            <h1>{p.avatar.nama}</h1>
            <p className="muted">“{p.avatar.sapaan}”</p>
            <h2>{p.nama}</h2>
            <small className="muted">{p.tagline}</small>
            <div><Link to="/profil/edit">Edit profil</Link></div>
          </Card>

          <Card>
            <h2>{p.ringkasan.pelajaranSelesai}/{p.ringkasan.totalPelajaran} pelajaran selesai · {p.ringkasan.persen}%</h2>
            <p className="muted">
              Bab tuntas {p.ringkasan.babTuntas}/{p.ringkasan.totalBab} · {p.streak.hari} hari berturut-turut
            </p>
            {p.ringkasan.pelajaranSelesai === 0 && (
              <p>Langkah pertamamu menunggu. Mulai satu pelajaran dan lihat progresmu tumbuh.</p>
            )}
          </Card>

          <h2>Perjalanan belajarmu</h2>
          {p.perjalanan.map((b) => (
            <Link key={b.babId} to={`/materi/${b.babId}`}>
              <Card data-warna={b.warna}>
                <small>BAB {String(b.urutan).padStart(2, '0')}</small>
                <h2>{b.judul} {b.selesai && '✓'}</h2>
                <p className="muted">{b.pelajaranSelesai} dari {b.totalPelajaran} pelajaran selesai · {b.persen}%</p>
              </Card>
            </Link>
          ))}

          <Link to="/progres">Lihat detail progres (huruf yang sering salah)</Link>
          <Tombol onClick={logout}>Keluar</Tombol>
        </>
      )}
    </Page>
  );
}
