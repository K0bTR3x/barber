import { useState } from 'react';

const DEFAULT_USER = { username: 'eyvaz', password: 'cruze806' };

function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
      localStorage.setItem('adminAuthed', 'true');
      onLogin();
      return;
    }
    setError('Istifadəçi adı və ya şifrə yanlışdır.');
  };

  return (
    <main className="page-shell">
      <div className="page-card">
        <div className="page-inner" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p className="small-pill">ADMIN GİRİŞİ</p>
          <h1 className="page-title">/admin</h1>
          <p className="page-subtitle">
            Administrator panelinə daxil olmaq üçün istifadəçi adı və şifrəni yazın. Default hesab: <strong>eyvaz</strong> / <strong>cruze806</strong>.
          </p>

          <form onSubmit={handleLogin} className="input-group">
            <label>
              <span className="card-text">İstifadəçi adı</span>
              <input
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="eyvaz"
              />
            </label>
            <label>
              <span className="card-text">Şifrə</span>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="button-primary" style={{ width: '100%' }}>
              Daxil ol
            </button>
            {error && <div className="toast">{error}</div>}
          </form>
        </div>
      </div>
    </main>
  );
}

export default AdminLoginPage;
