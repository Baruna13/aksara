// Komponen sederhana bersama. Sengaja polos: silakan diganti/restyle sesuai desain.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Ambil data dari API: { data, error, loading }
export function useLoad(fn, deps = []) {
  const [state, set] = useState({ data: null, error: '', loading: true });
  useEffect(() => {
    let alive = true;
    set({ data: null, error: '', loading: true });
    fn()
      .then((data) => alive && set({ data, error: '', loading: false }))
      .catch((e) => alive && set({ data: null, error: e.message, loading: false }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export function Status({ loading, error }) {
  if (loading) return <p>Memuat...</p>;
  if (error) return <p className="err">{error}</p>;
  return null;
}

export const Aksara = styled.span`
  font-family: 'Noto Sans Javanese', serif;
  font-size: ${(p) => p.$size || '1.6rem'};
  line-height: 1.5;
`;

export const Bintang = ({ n = 0, maks = 3 }) => (
  <span aria-label={`${n} dari ${maks} bintang`}>{'★'.repeat(n)}{'☆'.repeat(maks - n)}</span>
);

export function Page({ judul, kembali, children }) {
  return (
    <Wrap>
      {kembali && <Link to={kembali}>← Kembali</Link>}
      {judul && <h1>{judul}</h1>}
      {children}
    </Wrap>
  );
}

export const Card = styled.div`
  background: #d3d3d3;
  border: 2px solid #323232;
  border-radius: 5px;
  box-shadow: 4px 4px #323232;
  padding: 14px 18px;
`;

export const Tombol = styled.button`
  height: 40px;
  padding: 0 18px;
  border: 2px solid #323232;
  border-radius: 5px;
  background: #fff;
  box-shadow: 4px 4px #323232;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Wrap = styled.main`
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  h1 { font-family: var(--font-DelaGothicOne); font-size: 22px; margin: 0; }
  h2 { font-size: 16px; margin: 0 0 6px; }
  a { color: inherit; }
  .err { color: #8c1d18; font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 14px; }
  .muted { color: #666; }
`;
