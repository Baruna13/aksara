import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MateriPage from './pages/MateriPage.jsx';
import BabPage from './pages/BabPage.jsx';
import KartuPage from './pages/KartuPage.jsx';
import KuisPage from './pages/KuisPage.jsx';
import ProgresPage from './pages/ProgresPage.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 24 }}>Memuat...</p>;
  return user ? children : <Navigate to="/masuk" replace />;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 24 }}>Memuat...</p>;
  return user ? <Navigate to="/beranda" replace /> : children;
}

const lindungi = (el) => <Protected>{el}</Protected>;

export default function App() {
  return (
    <Routes>
      <Route path="/masuk" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/beranda" element={lindungi(<Dashboard />)} />
      <Route path="/materi" element={lindungi(<MateriPage />)} />
      <Route path="/materi/:babId" element={lindungi(<BabPage />)} />
      <Route path="/materi/:babId/:kartuId" element={lindungi(<KartuPage />)} />
      <Route path="/kuis/:babId" element={lindungi(<KuisPage />)} />
      <Route path="/progres" element={lindungi(<ProgresPage />)} />
      <Route path="*" element={<Navigate to="/beranda" replace />} />
    </Routes>
  );
}
