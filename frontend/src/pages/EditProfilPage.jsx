// Edit Profil: nama panggilan, email, ganti avatar, ganti/pasang kata sandi.
import { useEffect, useState } from 'react';
import { akun } from '../api.js';
import { Card, Page, Status, Tombol, useLoad } from './ui.jsx';

function Pesan({ p }) {
  if (!p) return null;
  return <p className={p.galat ? 'err' : 'muted'} role="status">{p.teks}</p>;
}

export default function EditProfilPage() {
  const { data: p, error, loading } = useLoad(akun.profil);
  const { data: av } = useLoad(akun.avatar);

  const [form, setForm] = useState({ nama: '', email: '' });
  const [avatar, setAvatar] = useState('aksa');
  const [pesanInfo, setPesanInfo] = useState(null);
  const [pesanAvatar, setPesanAvatar] = useState(null);
  const [sandi, setSandi] = useState({ saatIni: '', baru: '', ulang: '' });
  const [lihat, setLihat] = useState(false);
  const [pesanSandi, setPesanSandi] = useState(null);

  useEffect(() => {
    if (p) { setForm({ nama: p.nama, email: p.email ?? '' }); setAvatar(p.avatar.id); }
  }, [p]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function simpanInfo(e) {
    e.preventDefault();
    setPesanInfo(null);
    try {
      const data = { nama: form.nama };
      if (!p.metodeMasuk.google) data.email = form.email; // email akun Google terkunci
      await akun.ubahProfil(data);
      setPesanInfo({ teks: 'Perubahan disimpan.' });
    } catch (err) { setPesanInfo({ teks: err.message, galat: true }); }
  }

  async function pakaiAvatar() {
    setPesanAvatar(null);
    try { await akun.ubahProfil({ avatar }); setPesanAvatar({ teks: 'Avatar diganti.' }); }
    catch (err) { setPesanAvatar({ teks: err.message, galat: true }); }
  }

  async function gantiSandi(e) {
    e.preventDefault();
    setPesanSandi(null);
    if (sandi.baru !== sandi.ulang) return setPesanSandi({ teks: 'Pengulangan kata sandi baru tidak sama.', galat: true });
    try {
      const body = { sandiBaru: sandi.baru };
      if (p.metodeMasuk.password) body.sandiSaatIni = sandi.saatIni;
      const d = await akun.ubahSandi(body);
      setSandi({ saatIni: '', baru: '', ulang: '' });
      setPesanSandi({ teks: d.pesan });
    } catch (err) { setPesanSandi({ teks: err.message, galat: true }); }
  }

  const tipe = lihat ? 'text' : 'password';

  return (
    <Page judul="Edit Profil" kembali="/profil">
      <Status loading={loading} error={error} />
      {p && (
        <>
          <Card>
            <h2>Teman belajarmu</h2>
            <div className="grid">
              {av?.avatar.map((a) => (
                <label key={a.id} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="avatar" checked={avatar === a.id} onChange={() => setAvatar(a.id)} />
                  {' '}{a.nama}<br /><small className="muted">{a.tagline}</small>
                </label>
              ))}
            </div>
            <Tombol type="button" onClick={pakaiAvatar}>Pakai avatar ini</Tombol>
            <Pesan p={pesanAvatar} />
          </Card>

          <Card>
            <h2>Informasi profil</h2>
            <form onSubmit={simpanInfo} style={{ display: 'grid', gap: 10 }}>
              <label>Nama panggilan<br /><input value={form.nama} onChange={set('nama')} required minLength={2} maxLength={50} /></label>
              <label>Email<br />
                <input type="email" value={form.email} onChange={set('email')} disabled={p.metodeMasuk.google} placeholder="nama@email.com" />
              </label>
              {p.metodeMasuk.google && <small className="muted">Email berasal dari akun Google dan tidak bisa diubah di sini.</small>}
              <Tombol type="submit">Simpan perubahan</Tombol>
              <Pesan p={pesanInfo} />
            </form>
          </Card>

          <Card>
            <h2>{p.metodeMasuk.password ? 'Ganti kata sandi' : 'Pasang kata sandi'}</h2>
            {!p.metodeMasuk.password && <p className="muted">Kamu masuk lewat Google. Pasang kata sandi kalau ingin bisa masuk dengan username juga.</p>}
            <form onSubmit={gantiSandi} style={{ display: 'grid', gap: 10 }}>
              {p.metodeMasuk.password && (
                <label>Kata sandi saat ini<br /><input type={tipe} autoComplete="current-password" value={sandi.saatIni} onChange={(e) => setSandi((s) => ({ ...s, saatIni: e.target.value }))} required /></label>
              )}
              <label>Kata sandi baru<br /><input type={tipe} autoComplete="new-password" minLength={8} placeholder="Minimal 8 karakter" value={sandi.baru} onChange={(e) => setSandi((s) => ({ ...s, baru: e.target.value }))} required /></label>
              <label>Ulangi kata sandi baru<br /><input type={tipe} autoComplete="new-password" value={sandi.ulang} onChange={(e) => setSandi((s) => ({ ...s, ulang: e.target.value }))} required /></label>
              <label><input type="checkbox" checked={lihat} onChange={(e) => setLihat(e.target.checked)} /> Tampilkan kata sandi</label>
              <Tombol type="submit">{p.metodeMasuk.password ? 'Perbarui kata sandi' : 'Pasang kata sandi'}</Tombol>
              <Pesan p={pesanSandi} />
            </form>
          </Card>
        </>
      )}
    </Page>
  );
}
