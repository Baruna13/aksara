import styled from 'styled-components';
import { useAuth } from '../AuthContext.jsx';

const FITUR = [
  { nama: 'Belajar', ket: 'Materi + kuis aksara Jawa' },
  { nama: 'Scanner', ket: 'Pindai tulisan aksara Jawa' },
  { nama: 'Nulis', ket: 'Latihan menulis di layar' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <Wrap>
      <header>
        <h1>Sugeng rawuh, {user.name}!</h1>
        <button onClick={logout}>Keluar</button>
      </header>

      <section className="card">
        <h2>Akun kamu</h2>
        <dl>
          <dt>Username</dt><dd>{user.username}</dd>
          <dt>Email</dt><dd>{user.email || '-'}</dd>
          <dt>Bergabung</dt><dd>{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
        </dl>
      </section>

      <section className="grid">
        {FITUR.map((f) => (
          <div className="card disabled" key={f.nama}>
            <h2>{f.nama}</h2>
            <p>{f.ket}</p>
            <small>Segera hadir</small>
          </div>
        ))}
      </section>
    </Wrap>
  );
}

const Wrap = styled.main`
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  h1 { font-family: var(--font-DelaGothicOne); font-size: 22px; margin: 0; }
  h2 { font-family: var(--font-DelaGothicOne); font-size: 16px; margin: 0 0 8px; }

  button {
    height: 40px;
    padding: 0 18px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    background: #fff;
    box-shadow: 4px 4px var(--main-color);
    font-weight: 700;
    cursor: pointer;
  }
  button:active { transform: translate(2px, 2px); box-shadow: 2px 2px var(--main-color); }

  .card {
    background: #d3d3d3;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    box-shadow: 4px 4px var(--main-color);
    padding: 16px 20px;
  }
  .card p { margin: 0 0 8px; color: #555; }
  .card.disabled { opacity: 0.7; }

  dl { display: grid; grid-template-columns: max-content 1fr; gap: 6px 16px; margin: 0; }
  dt { font-weight: 700; }
  dd { margin: 0; word-break: break-all; }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
`;
