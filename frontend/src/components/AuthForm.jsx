import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';
import { useAuth } from '../AuthContext.jsx';

const HAS_GOOGLE = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export default function AuthForm() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('masuk'); // 'masuk' | 'daftar'
  const [f, setF] = useState({ name: '', username: '', email: '', identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setF((s) => ({ ...s, [key]: e.target.value }));
  const isLogin = mode === 'masuk';

  async function run(fn) {
    setError('');
    setBusy(true);
    try {
      await fn();
      navigate('/beranda', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const submit = (e) => {
    e.preventDefault();
    run(() =>
      isLogin
        ? login(f.identifier, f.password)
        : register({ name: f.name, username: f.username, email: f.email, password: f.password })
    );
  };

  const switchMode = () => {
    setError('');
    setMode(isLogin ? 'daftar' : 'masuk');
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={submit}>
        <p>
          Sugeng rawuh,
          <span>{isLogin ? 'masuk untuk lanjut belajar' : 'daftar akun baru'}</span>
        </p>

        {HAS_GOOGLE ? (
          <div className="googleWrap">
            {/* Tombol tampilan kita */}
            <button type="button" className="oauthButton" tabIndex={-1} aria-hidden="true">
              <GoogleIcon />
              Lanjut dengan Google
            </button>
            {/* Tombol asli Google, transparan, menutupi tombol di atas supaya klik tetap resmi */}
            <div className="googleOverlay">
              <GoogleLogin
                width="250"
                text="continue_with"
                onSuccess={(res) => run(() => loginWithGoogle(res.credential))}
                onError={() => setError('Login Google gagal atau dibatalkan')}
              />
            </div>
          </div>
        ) : (
          <p className="hint">Isi VITE_GOOGLE_CLIENT_ID di .env untuk mengaktifkan login Google.</p>
        )}

        <div className="separator">
          <div />
          <span>ATAU</span>
          <div />
        </div>

        {isLogin ? (
          <input
            type="text"
            placeholder="Username atau email"
            autoComplete="username"
            value={f.identifier}
            onChange={set('identifier')}
            required
          />
        ) : (
          <>
            <input type="text" placeholder="Nama lengkap" autoComplete="name" value={f.name} onChange={set('name')} required />
            <input type="text" placeholder="Username" autoComplete="username" value={f.username} onChange={set('username')} required />
            <input type="email" placeholder="Email (opsional)" autoComplete="email" value={f.email} onChange={set('email')} />
          </>
        )}
        <input
          type="password"
          placeholder="Password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={f.password}
          onChange={set('password')}
          required
        />

        {error && <div className="error" role="alert">{error}</div>}

        <button type="submit" className="oauthButton" disabled={busy}>
          {busy ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 17 5-5-5-5" />
            <path d="m13 17 5-5-5-5" />
          </svg>
        </button>

        <button type="button" className="link" onClick={switchMode}>
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </form>
    </StyledWrapper>
  );
}

function GoogleIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );
}

const StyledWrapper = styled.div`
  .form {
    --background: #d3d3d3;
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 20px;
    background: var(--background);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .form > p {
    font-family: var(--font-DelaGothicOne);
    color: var(--font-color);
    font-weight: 700;
    font-size: 20px;
    margin: 0 0 15px;
    display: flex;
    flex-direction: column;
  }

  .form > p > span {
    font-family: var(--font-SpaceMono);
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .form > p.hint {
    font-family: var(--font-SpaceMono);
    font-size: 12px;
    font-weight: 600;
    color: var(--font-color-sub);
    width: 250px;
    margin: 0;
  }

  .separator {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .separator > div {
    width: 100px;
    height: 3px;
    border-radius: 5px;
    background-color: var(--font-color-sub);
  }

  .separator > span {
    color: var(--font-color);
    font-family: var(--font-SpaceMono);
    font-weight: 600;
  }

  .oauthButton {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 16px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
    transition: all 250ms;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .oauthButton::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background-color: #212121;
    z-index: -1;
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
  }

  .oauthButton:hover:not(:disabled),
  .googleWrap:hover .oauthButton {
    color: #e8e8e8;
  }

  .oauthButton:hover:not(:disabled)::before,
  .googleWrap:hover .oauthButton::before {
    width: 100%;
  }

  .oauthButton:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  /* Wadah tombol Google: tombol tampilan + overlay Google asli di atasnya */
  .googleWrap {
    position: relative;
    width: 250px;
    height: 40px;
  }

  .googleWrap .oauthButton {
    pointer-events: none;
  }

  .googleOverlay {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.01;
    z-index: 2;
    cursor: pointer;
  }

  .form > input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .form > input:focus {
    border-color: var(--input-focus);
  }

  .error {
    width: 250px;
    padding: 8px 10px;
    border: 2px solid #b3261e;
    border-radius: 5px;
    background: #fde7e5;
    color: #8c1d18;
    font-size: 13px;
    font-weight: 600;
  }

  .link {
    align-self: center;
    background: none;
    border: none;
    padding: 0;
    color: var(--font-color-sub);
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  .link:hover {
    color: var(--font-color);
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
