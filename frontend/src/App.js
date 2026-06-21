import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ReservationPage from './pages/ReservationPage';
import ShopPage from './pages/ShopPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function AdminGate() {
  const [authed, setAuthed] = useState(localStorage.getItem('adminAuthed') === 'true');

  if (!authed) {
    return <AdminLoginPage onLogin={() => setAuthed(true)} />;
  }
  return (
    <AdminPage
      onLogout={() => {
        localStorage.removeItem('adminAuthed');
        setAuthed(false);
      }}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="app-nav">
          <Link to="/reservation">Rezervasiya</Link>
          <Link to="/shop">Mağaza</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/reservation" replace />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/admin" element={<AdminGate />} />
          <Route path="*" element={<Navigate to="/reservation" replace />} />
        </Routes>

        <nav className="mobile-nav">
          <Link to="/reservation" className="mobile-nav-link">
            <span>🗓</span>
            <span>Rezervasiya</span>
          </Link>
          <Link to="/shop" className="mobile-nav-link">
            <span>🛍</span>
            <span>Mağaza</span>
          </Link>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;
