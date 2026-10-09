const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const KEY = 'aksara_tokens';

export const tokenStore = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  },
  set(t) { localStorage.setItem(KEY, JSON.stringify(t)); },
  clear() { localStorage.removeItem(KEY); },
};

async function raw(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        ...(body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Tidak bisa terhubung ke server. Cek koneksi atau URL backend.');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || 'Terjadi kesalahan');
    err.status = res.status;
    throw err;
  }
  return data;
}

// Refresh token sekali pakai, jadi panggilan bersamaan harus berbagi satu proses.
let refreshing = null;
function refreshTokens() {
  const t = tokenStore.get();
  if (!t?.refreshToken) return Promise.reject(new Error('Tidak ada sesi'));
  if (!refreshing) {
    refreshing = raw('/api/auth/refresh', { method: 'POST', body: { refreshToken: t.refreshToken } })
      .then((n) => {
        tokenStore.set({ accessToken: n.accessToken, refreshToken: n.refreshToken });
        return n;
      })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

// Request yang butuh login. Kalau 401, coba refresh sekali lalu ulangi.
export async function authed(path, opts = {}) {
  let t = tokenStore.get();
  try {
    return await raw(path, { ...opts, token: t?.accessToken });
  } catch (e) {
    if (e.status !== 401 || !t?.refreshToken) throw e;
    try {
      t = await refreshTokens();
    } catch {
      tokenStore.clear();
      throw e;
    }
    return raw(path, { ...opts, token: t.accessToken });
  }
}

export const api = {
  login: (identifier, password) => raw('/api/auth/login', { method: 'POST', body: { identifier, password } }),
  register: (data) => raw('/api/auth/register', { method: 'POST', body: data }),
  google: (idToken) => raw('/api/auth/google', { method: 'POST', body: { idToken } }),
  me: () => authed('/api/auth/me'),
  logout: async () => {
    const t = tokenStore.get();
    if (t?.refreshToken) {
      try { await raw('/api/auth/logout', { method: 'POST', body: { refreshToken: t.refreshToken } }); } catch { /* abaikan */ }
    }
  },
};

// ---- Fitur belajar (lihat backend/API.md) ----
const base = (babId, langkahId, no) => `/api/materi/${babId}/langkah/${langkahId}/tantangan/${no}`;

export const belajar = {
  beranda: () => authed('/api/beranda'),
  progres: () => authed('/api/progres'),
  daftarBab: () => authed('/api/materi'),
  jalur: (babId) => authed(`/api/materi/${babId}`), // perjalanan belajar: 5 langkah
  langkah: (babId, langkahId) => authed(`/api/materi/${babId}/langkah/${langkahId}`),
  // membuka kartu = otomatis ditandai "dilihat" oleh server
  kartu: (babId, kartuId) => authed(`/api/materi/${babId}/kartu/${kartuId}`),
  soal: (babId, langkahId, no) => authed(`${base(babId, langkahId, no)}/soal`),
  kirim: (babId, langkahId, no, jawaban) =>
    authed(`${base(babId, langkahId, no)}/submit`, { method: 'POST', body: { jawaban } }),
};
