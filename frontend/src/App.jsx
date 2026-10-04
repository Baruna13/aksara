import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

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

export default function App() {
  return (
    <Routes>
      <Route path="/masuk" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/beranda" element={<Protected><Dashboard /></Protected>} />
      <Route path="*" element={<Navigate to="/beranda" replace />} />
    </Routes>
  );
}
