import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, setToken, getToken } from '../api/auth';
import { useMontserrat } from '../utils/useMontserrat';

const FONT = "'Montserrat', sans-serif";

export default function Login() {
  useMontserrat();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getToken()) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await loginAdmin(usuario, password);
      setToken(token);
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al iniciar sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...s.page, fontFamily: FONT }}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logo}>LBZ</div>
          <div style={s.title}>Panel de Administración</div>
          <div style={s.subtitle}>Torneo Gaming</div>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Usuario</label>
            <input
              style={s.input}
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="usuario"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Contraseña</label>
            <input
              style={s.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div style={s.error}>{error}</div>}

          <button
            type="submit"
            style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d1117',
    padding: '24px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: '32px 32px 24px',
    textAlign: 'center',
    borderBottom: '1px solid #21262d',
  },
  logo: {
    fontSize: 32,
    fontWeight: 800,
    color: '#f97316',
    letterSpacing: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#e6edf3',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#8b949e',
    letterSpacing: 1,
    fontWeight: 500,
  },
  form: {
    padding: '24px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#c9d1d9',
    letterSpacing: '0.3px',
  },
  input: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 6,
    color: '#e6edf3',
    fontSize: 14,
    padding: '10px 12px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  error: {
    background: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid rgba(248, 81, 73, 0.4)',
    borderRadius: 6,
    color: '#f85149',
    fontSize: 13,
    padding: '10px 12px',
    fontWeight: 500,
  },
  btn: {
    background: '#238636',
    border: '1px solid #2ea043',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    padding: '10px 0',
    cursor: 'pointer',
    marginTop: 4,
    letterSpacing: '0.3px',
    fontFamily: 'inherit',
  },
  btnDisabled: {
    background: '#1a3327',
    border: '1px solid #1e4d30',
    color: '#4d8c5c',
    cursor: 'not-allowed',
  },
};
