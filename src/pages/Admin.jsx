import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInscriptosFifa, getInscriptosCounter, deleteJugadorFifa, deleteEquipoCounter } from '../api/admin';
import { sortear, resetBracket } from '../api/bracket';
import { removeToken } from '../api/auth';
import { useMontserrat } from '../utils/useMontserrat';

const FONT = "'Montserrat', sans-serif";
const ORANGE = '#f97316';

export default function Admin() {
  useMontserrat();
  const navigate = useNavigate();
  const [tab, setTab] = useState('fifa');
  const [fifa, setFifa] = useState([]);
  const [counter, setCounter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sorteoStatus, setSorteoStatus] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const [resFifa, resCounter] = await Promise.all([
          getInscriptosFifa(),
          getInscriptosCounter(),
        ]);
        setFifa(resFifa.data);
        setCounter(resCounter.data);
      } catch (err) {
        if (err?.response?.status === 401) {
          removeToken();
          navigate('/login', { replace: true });
        } else {
          setError(err?.response?.data?.message || err.message || 'Error al cargar los datos.');
        }
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login', { replace: true });
  };

  const pedirConfirm = (tipo, id, nombre) => setConfirm({ tipo, id, nombre });

  const handleSortear = async (game) => {
    setSorteoStatus('Sorteando...');
    try {
      const r = await sortear(game);
      if (r.success) setSorteoStatus(`Sorteo ${game.toUpperCase()} realizado`);
      else setSorteoStatus('Error al sortear');
    } catch (e) {
      setSorteoStatus(e?.response?.data?.message || 'Error al sortear');
    }
    setTimeout(() => setSorteoStatus(''), 3000);
  };

  const handleReset = async (game) => {
    if (!window.confirm(`¿Reiniciar el bracket de ${game.toUpperCase()}? Se perderán todos los resultados.`)) return;
    setSorteoStatus('Reiniciando...');
    try {
      const r = await resetBracket(game);
      if (r.success) setSorteoStatus(`Bracket ${game.toUpperCase()} reiniciado`);
      else setSorteoStatus('Error al reiniciar');
    } catch {
      setSorteoStatus('Error al reiniciar');
    }
    setTimeout(() => setSorteoStatus(''), 3000);
  };

  const handleConfirmDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      if (confirm.tipo === 'fifa') {
        await deleteJugadorFifa(confirm.id);
        setFifa((prev) => prev.filter((j) => j.id_jugador !== confirm.id));
      } else {
        await deleteEquipoCounter(confirm.id);
        setCounter((prev) => prev.filter((e) => e.id_equipo !== confirm.id));
      }
      setConfirm(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al eliminar.');
      setConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ ...s.page, fontFamily: FONT }}>
      {confirm && (
        <ConfirmModal
          nombre={confirm.nombre}
          tipo={confirm.tipo}
          deleting={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={s.container}>
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <span style={s.logo}>LBZ</span>
            <span style={s.topbarTitle}>Panel de Administración</span>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
        </div>

        <div style={s.links}>
          {[
            { label: 'Formulario FIFA', href: '/formulario-fifa' },
            { label: 'Formulario Counter', href: '/formulario-counter' },
            { label: 'Llaves FIFA', href: '/llaves-fifa' },
            { label: 'Llaves Counter', href: '/llaves-counter' },
          ].map(({ label, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={s.linkBtn}>
              {label} ↗
            </a>
          ))}
        </div>

        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(tab === 'fifa' ? s.tabActive : {}) }}
            onClick={() => setTab('fifa')}
          >
            FIFA
            <span style={{ ...s.badge, ...(tab === 'fifa' ? s.badgeActive : {}) }}>
              {fifa.length}
            </span>
          </button>
          <button
            style={{ ...s.tab, ...(tab === 'counter' ? s.tabActive : {}) }}
            onClick={() => setTab('counter')}
          >
            Counter-Strike
            <span style={{ ...s.badge, ...(tab === 'counter' ? s.badgeActive : {}) }}>
              {counter.length}
            </span>
          </button>
        </div>

        <div style={s.content}>
          {loading && <div style={s.state}>Cargando inscripciones...</div>}
          {error && <div style={{ ...s.state, color: '#f85149' }}>{error}</div>}

          {!loading && !error && tab === 'fifa' && (
            <FifaPanel jugadores={fifa} onDelete={(j) => pedirConfirm('fifa', j.id_jugador, j.nickname)} />
          )}
          {!loading && !error && tab === 'counter' && (
            <CounterPanel equipos={counter} onDelete={(e) => pedirConfirm('counter', e.id_equipo, e.nombre_equipo)} />
          )}
        </div>

        {/* SORTEO PANEL */}
        <div style={s.sorteoCard}>
          <div style={s.sorteoTitle}>GESTIÓN DE SORTEOS</div>
          <div style={s.sorteoRow}>
            <button style={s.sorteoBtn} onClick={() => handleSortear('fifa')}>
              Sortear FIFA
            </button>
            <button style={s.sorteoBtn} onClick={() => handleSortear('counter')}>
              Sortear Counter
            </button>
            <button style={{ ...s.sorteoBtn, ...s.resetBtn }} onClick={() => handleReset('fifa')}>
              Reset FIFA
            </button>
            <button style={{ ...s.sorteoBtn, ...s.resetBtn }} onClick={() => handleReset('counter')}>
              Reset Counter
            </button>
          </div>
          {sorteoStatus && (
            <div style={s.sorteoMsg}>{sorteoStatus}</div>
          )}
        </div>

      </div>
    </div>
  );
}

function ConfirmModal({ nombre, tipo, deleting, onConfirm, onCancel }) {
  const esEquipo = tipo === 'counter';
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalIcon}>⚠</div>
        <div style={s.modalTitle}>¿Confirmar eliminación?</div>
        <div style={s.modalDesc}>
          {esEquipo
            ? <>Se eliminará el equipo <strong style={{ color: '#e6edf3' }}>{nombre}</strong> y todos sus jugadores de forma permanente.</>
            : <>Se eliminará el jugador <strong style={{ color: '#e6edf3' }}>{nombre}</strong> de forma permanente.</>}
        </div>
        <div style={s.modalActions}>
          <button style={s.cancelBtn} onClick={onCancel} disabled={deleting}>
            Cancelar
          </button>
          <button style={s.deleteBtn} onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FifaPanel({ jugadores, onDelete }) {
  if (jugadores.length === 0) {
    return <div style={s.empty}>No hay jugadores inscriptos en FIFA todavía.</div>;
  }
  return (
    <div>
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>Jugadores inscriptos</span>
        <span style={s.sectionCount}>{jugadores.length} jugador{jugadores.length !== 1 ? 'es' : ''}</span>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 40 }}>#</th>
            <th style={s.th}>Nombre</th>
            <th style={s.th}>Nickname</th>
            <th style={{ ...s.th, width: 70, textAlign: 'center' }}>Estado</th>
            <th style={{ ...s.th, width: 60 }} />
          </tr>
        </thead>
        <tbody>
          {jugadores.map((j, i) => (
            <tr key={j.id_jugador} style={i % 2 === 0 ? s.trEven : s.trOdd}>
              <td style={{ ...s.td, color: '#8b949e' }}>{i + 1}</td>
              <td style={s.td}>{j.nombre_completo}</td>
              <td style={{ ...s.td, color: ORANGE }}>{j.nickname}</td>
              <td style={{ ...s.td, textAlign: 'center' }}>
                <span style={j.state ? s.badgeOn : s.badgeOff}>
                  {j.state ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ ...s.td, textAlign: 'right' }}>
                <button style={s.trashBtn} onClick={() => onDelete(j)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CounterPanel({ equipos, onDelete }) {
  if (equipos.length === 0) {
    return <div style={s.empty}>No hay equipos inscriptos en Counter-Strike todavía.</div>;
  }
  return (
    <div style={s.equiposList}>
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>Equipos inscriptos</span>
        <span style={s.sectionCount}>{equipos.length} equipo{equipos.length !== 1 ? 's' : ''}</span>
      </div>
      {equipos.map((equipo) => (
        <div key={equipo.id_equipo} style={s.equipoCard}>
          <div style={s.equipoHeader}>
            <div style={s.equipoHeaderLeft}>
              <span style={s.equipoNombre}>{equipo.nombre_equipo}</span>
              <span style={s.equipoTag}>{equipo.jugadores?.length ?? 0} jugadores</span>
            </div>
            <button
              style={s.deleteEquipoBtn}
              onClick={() => onDelete(equipo)}
              title="Eliminar equipo"
            >
              Eliminar equipo
            </button>
          </div>
          <table style={{ ...s.table, marginTop: 0 }}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 36 }}>#</th>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Nickname</th>
              </tr>
            </thead>
            <tbody>
              {(equipo.jugadores || []).map((j, i) => (
                <tr key={j.id_jugador} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                  <td style={{ ...s.td, color: '#8b949e' }}>{i + 1}</td>
                  <td style={s.td}>{j.nombre_completo}</td>
                  <td style={{ ...s.td, color: '#d4b84a' }}>{j.nickname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0d1117',
    padding: '0 0 48px',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 16px',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid #21262d',
    marginBottom: 24,
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    color: ORANGE,
    letterSpacing: 4,
  },
  topbarTitle: { fontSize: 15, color: '#8b949e', fontWeight: 500 },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #30363d',
    borderRadius: 6,
    color: '#8b949e',
    fontSize: 13,
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  links: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  linkBtn: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 6,
    color: '#c9d1d9',
    fontSize: 12,
    fontWeight: 600,
    padding: '7px 14px',
    textDecoration: 'none',
    letterSpacing: '0.2px',
    fontFamily: 'inherit',
  },
  tabs: {
    display: 'flex',
    gap: 4,
    borderBottom: '1px solid #21262d',
    marginBottom: 24,
  },
  tab: {
    background: 'transparent',
    border: 'none',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    color: '#8b949e',
    fontSize: 14,
    fontWeight: 500,
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: -1,
    fontFamily: 'inherit',
  },
  tabActive: {
    color: '#e6edf3',
    borderBottomColor: ORANGE,
  },
  badge: {
    background: '#21262d',
    borderRadius: 10,
    color: '#8b949e',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 7px',
    minWidth: 20,
    textAlign: 'center',
  },
  badgeActive: {
    background: '#7a2d05',
    color: ORANGE,
  },
  content: { minHeight: 200 },
  state: {
    color: '#8b949e',
    fontSize: 14,
    padding: '40px 0',
    textAlign: 'center',
  },
  empty: {
    color: '#8b949e',
    fontSize: 14,
    padding: '40px 0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: '#c9d1d9' },
  sectionCount: { fontSize: 12, color: '#8b949e' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    color: '#8b949e',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    borderBottom: '1px solid #21262d',
    background: '#161b22',
  },
  td: { padding: '10px 12px', color: '#e6edf3', borderBottom: '1px solid #21262d' },
  trEven: { background: '#0d1117' },
  trOdd: { background: '#161b22' },
  trashBtn: {
    background: 'rgba(248, 81, 73, 0.08)',
    border: '1px solid rgba(248, 81, 73, 0.3)',
    borderRadius: 6,
    color: '#f85149',
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.3px',
  },
  badgeOn: {
    background: 'rgba(35, 134, 54, 0.15)',
    border: '1px solid rgba(35, 134, 54, 0.4)',
    borderRadius: 10,
    color: '#3fb950',
    fontSize: 11,
    padding: '2px 8px',
  },
  badgeOff: {
    background: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid rgba(248, 81, 73, 0.3)',
    borderRadius: 10,
    color: '#f85149',
    fontSize: 11,
    padding: '2px 8px',
  },
  equiposList: { display: 'flex', flexDirection: 'column', gap: 20 },
  equipoCard: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 8,
    overflow: 'hidden',
  },
  equipoHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #21262d',
    background: '#1c2128',
  },
  equipoHeaderLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  equipoNombre: { fontSize: 15, fontWeight: 700, color: '#e6edf3', letterSpacing: '0.5px' },
  equipoTag: {
    fontSize: 11,
    color: '#8b949e',
    background: '#21262d',
    borderRadius: 10,
    padding: '2px 10px',
  },
  deleteEquipoBtn: {
    background: 'rgba(248, 81, 73, 0.08)',
    border: '1px solid rgba(248, 81, 73, 0.3)',
    borderRadius: 6,
    color: '#f85149',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  sorteoCard: {
    marginTop: 32,
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 8,
    padding: '20px 24px',
  },
  sorteoTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: ORANGE,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  sorteoRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  sorteoBtn: {
    background: 'rgba(249,115,22,0.1)',
    border: '1px solid rgba(249,115,22,0.4)',
    borderRadius: 6,
    color: ORANGE,
    fontSize: 13,
    fontWeight: 700,
    padding: '8px 18px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.3px',
  },
  resetBtn: {
    background: 'rgba(248,81,73,0.08)',
    border: '1px solid rgba(248,81,73,0.3)',
    color: '#f85149',
  },
  sorteoMsg: {
    marginTop: 10,
    fontSize: 13,
    color: '#8b949e',
    fontStyle: 'italic',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 16,
  },
  modal: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 10,
    padding: '32px 28px',
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'inherit',
  },
  modalIcon: {
    fontSize: 28,
    color: '#f0a500',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#e6edf3',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 13,
    color: '#8b949e',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  modalActions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #30363d',
    borderRadius: 6,
    color: '#8b949e',
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  deleteBtn: {
    background: '#b91c1c',
    border: '1px solid #dc2626',
    borderRadius: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    padding: '8px 20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
