// Isi satu langkah: daftar tantangan (kartu untuk "mengenal", ronde soal untuk "latihan"/"kuis").
import { Link, useParams } from 'react-router-dom';
import { belajar } from '../api.js';
import { Aksara, Bintang, Card, Page, Status, useLoad } from './ui.jsx';

export default function LangkahPage() {
  const { babId, langkahId } = useParams();
  const { data: l, error, loading } = useLoad(() => belajar.langkah(babId, langkahId), [babId, langkahId]);

  return (
    <Page judul={l?.judul ?? 'Langkah'} kembali={`/materi/${babId}`}>
      <Status loading={loading} error={error} />
      {l && (
        <>
          <p className="muted">{l.keterangan}</p>
          {l.tantangan.map((t) => {
            const terkunci = t.status === 'terkunci' || t.status === 'segera';
            return (
              <Card key={t.no} style={{ opacity: terkunci ? 0.55 : 1 }}>
                <h2>Tantangan {t.no} {t.selesai && '✓'}{t.status === 'terkunci' && '🔒'}</h2>

                {l.jenis === 'mengenal' && (
                  <div className="grid">
                    {t.kartu.map((k) => (
                      <Link key={k.id} to={`/materi/${babId}/${k.id}`}>
                        <Card style={{ textAlign: 'center' }}>
                          <Aksara $size="2rem">{k.aksara}</Aksara>
                          <div>{k.nama ?? k.bacaan} {k.dilihat && '✓'}</div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {(l.jenis === 'latihan' || l.jenis === 'kuis') && (
                  <>
                    <p className="muted">
                      {t.jumlahSoal} soal{t.lulusMinimal ? ` · lulus ≥ ${t.lulusMinimal}%` : ''}
                      {t.skorTerbaik !== null && ` · skor terbaik ${t.skorTerbaik}%`} <Bintang n={t.bintangTerbaik} />
                    </p>
                    {!terkunci && <Link to={`/materi/${babId}/langkah/${langkahId}/tantangan/${t.no}`}>
                      {t.selesai ? 'Ulangi' : 'Mulai'} →</Link>}
                  </>
                )}

                {l.jenis === 'tulis' && <p className="muted">Segera hadir.</p>}
              </Card>
            );
          })}
        </>
      )}
    </Page>
  );
}
