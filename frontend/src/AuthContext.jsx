import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from './api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Saat app dibuka: kalau ada token tersimpan, ambil data user.
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!tokenStore.get()) { setLoading(false); return; }
      try {
        const d = await api.me();
        if (alive) setUser(d.user);
      } catch { /* token gagal -> tetap belum login */ }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const finish = (data) => {
    tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    login: async (identifier, password) => finish(await api.login(identifier, password)),
    register: async (form) => finish(await api.register(form)),
    loginWithGoogle: async (idToken) => finish(await api.google(idToken)),
    logout: async () => {
      await api.logout();
      tokenStore.clear();
      setUser(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
