import { useState } from "react";
import { crearEquipo, crearJugador, vincularJugador } from "../api/formularioCounter";

const INITIAL_PLAYERS = Array.from({ length: 5 }, () => ({ name: "", nick: "" }));

export default function FormularioCounter() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState(INITIAL_PLAYERS.map((p) => ({ ...p })));
  const [registered, setRegistered] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const filledCount = players.filter((p) => p.name.trim().length > 0 && p.nick.trim().length > 0).length;
  const isReady = teamName.trim().length > 0 && filledCount === 5;

  const statusMsg = () => {
    if (loading) return "Conectando con el servidor...";
    if (error) return error;
    if (!teamName && filledCount === 0) return "Esperando que los jugadores se conecten...";
    if (!teamName) return "Ingresá el nombre del equipo para continuar.";
    if (filledCount < 5) return `Jugadores completos: ${filledCount}/5 — Falta nombre y nick...`;
    return "Todos los jugadores listos. Hacé clic en Registrar.";
  };

  const handlePlayerChange = (idx, field, value) => {
    setPlayers((prev) => {
      const next = prev.map((p) => ({ ...p }));
      next[idx][field] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { id_equipo } = await crearEquipo(teamName.trim());
      for (const player of players) {
        const { id_jugador } = await crearJugador(player.name.trim(), player.nick.trim());
        await vincularJugador(id_jugador, id_equipo);
      }
      setSnapshot({ teamName: teamName.trim(), players: players.map((p) => ({ ...p })) });
      setShowAlert(true);
    } catch (err) {
      const raw = err?.response?.data?.error || err?.response?.data?.message || "";
      const msg = raw.includes("duplicate key")
        ? "Un nickname ya está registrado. Cambiá el nick del jugador e intentá de nuevo."
        : raw || "Error al registrar. Verificá la conexión e intentá de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setRegistered(true);
  };

  const handleReset = () => {
    setTeamName("");
    setPlayers(INITIAL_PLAYERS.map((p) => ({ ...p })));
    setRegistered(false);
    setSnapshot(null);
    setError(null);
    setShowAlert(false);
  };

  if (registered && snapshot) {
    return <SuccessScreen teamName={snapshot.teamName} players={snapshot.players} onReset={handleReset} />;
  }

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 520px) {
          .csf-input { font-size: 16px !important; }
          .csf-body { padding: 12px 10px !important; gap: 12px !important; }
          .csf-block { padding: 8px 8px !important; }
          .csf-footer { flex-wrap: wrap; gap: 8px !important; }
          .csf-footer .csf-btn { flex: 1; text-align: center; justify-content: center; }
          .csf-title { font-size: 10px !important; letter-spacing: 0 !important; }
        }
      `}</style>
      {showAlert && snapshot && (
        <RetroAlert teamName={snapshot.teamName} onClose={handleAlertClose} />
      )}
      <div style={s.window}>

        <div style={s.titlebar}>
          <span style={s.titlebarText} className="csf-title">INSCRIPCIÓN DE EQUIPO PARA COUNTER-STRIKE</span>
        </div>

        <div style={s.body} className="csf-body">

          <div>
            <div style={s.sectionLabel}>Nombre del equipo</div>
            <div style={s.block} className="csf-block">
              <div style={s.fieldRow}>
                <span style={s.label}>Equipo:</span>
                <input
                  style={s.input}
                  className="csf-input"
                  type="text"
                  placeholder="Nombre del equipo..."
                  maxLength={24}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <div style={s.sectionLabel}>Jugadores (5)</div>
            <div style={s.block} className="csf-block">
              <div style={s.colHeader}>
                <span />
                <span />
                <span style={s.colHeaderLabel}>Nombre</span>
                <span />
                <span style={s.colHeaderLabel}>Nickname</span>
              </div>
              {players.map((player, idx) => (
                <PlayerRow
                  key={idx}
                  index={idx}
                  player={player}
                  isLast={idx === 4}
                  disabled={loading}
                  onChange={(field, val) => handlePlayerChange(idx, field, val)}
                />
              ))}
            </div>
          </div>

          <div style={s.divider} />

          <div style={s.footer} className="csf-footer">
            <button style={s.btn} className="csf-btn" onClick={handleReset} disabled={loading}>Cancelar</button>
            <button
              className="csf-btn"
              style={{
                ...s.btn,
                ...s.btnPrimary,
                ...(!isReady || loading ? s.btnDisabled : {}),
              }}
              disabled={!isReady || loading}
              onClick={handleSubmit}
            >
              {loading ? "Registrando..." : "Registrar ▶"}
            </button>
          </div>

        </div>

        <div style={{ ...s.statusBar, ...(error ? s.statusBarError : {}) }}>
          <div style={{ ...s.statusDot, ...(loading ? s.statusDotLoading : {}), ...(error ? s.statusDotError : {}) }} />
          <span>{statusMsg()}</span>
        </div>

      </div>
    </div>
  );
}

function PlayerRow({ index, player, isLast, disabled, onChange }) {
  return (
    <div style={{ ...s.playerRow, ...(isLast ? { marginBottom: 0 } : {}) }}>
      <span style={s.playerNum}>{String(index + 1).padStart(2, "0")}</span>
      <div style={s.playerIcon}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="#5a7040">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z" />
        </svg>
      </div>
      <input
        style={s.input}
        className="csf-input"
        type="text"
        placeholder="Nombre..."
        maxLength={20}
        value={player.name}
        disabled={disabled}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <span style={s.sep}>/</span>
      <input
        style={{ ...s.input, ...s.inputNick }}
        className="csf-input"
        type="text"
        placeholder="nick..."
        maxLength={16}
        value={player.nick}
        disabled={disabled}
        onChange={(e) => onChange("nick", e.target.value)}
      />
    </div>
  );
}

function RetroAlert({ teamName, onClose }) {
  return (
    <div style={s.alertOverlay}>
      <div style={s.alertBox}>
        <div style={s.alertTitlebar}>
          <span style={s.alertTitlebarDot} />
          <span style={s.alertTitlebarText}>SISTEMA — CONFIRMACIÓN</span>
        </div>
        <div style={s.alertBody}>
          <div style={s.alertIcon}>✓</div>
          <div style={s.alertMsg}>EQUIPO REGISTRADO</div>
          <div style={s.alertTeam}>{teamName}</div>
          <div style={s.alertSub}>fue agregado al torneo correctamente.</div>
          <button style={{ ...s.btn, ...s.btnPrimary, marginTop: 20 }} onClick={onClose}>
            OK ▶
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ teamName, players, onReset }) {
  return (
    <div style={s.successPage}>
      <div style={s.successTitle}>¡Equipo Registrado!</div>
      <div style={s.successList}>
        <div style={s.successTeamName}>Team {teamName}</div>
        {players.map((p, i) => (
          <div key={i} style={s.successItem}>
            <span style={{ color: "#d4b84a" }}>{">"}</span>
            <span>{p.name}</span>
            <span style={s.successNick}>{p.nick}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const mono = "'Share Tech Mono', monospace";

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    background: "#1a1e10",
    backgroundImage:
      "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)",
  },
  window: {
    width: "100%",
    maxWidth: 580,
    background: "#2a3020",
    border: "2px solid #4a5c30",
    fontFamily: mono,
  },
  titlebar: {
    background: "#1a2010",
    borderBottom: "2px solid #4a5c30",
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  titlebarIcon: { color: "#d4b84a", fontSize: 13 },
  titlebarText: { color: "#c8c8b8", fontSize: 12, letterSpacing: "0.5px" },
  titlebarClose: { marginLeft: "auto", color: "#6a7a50", fontSize: 14, cursor: "pointer" },
  tabs: {
    display: "flex",
    background: "#222815",
    borderBottom: "1px solid #3a4c20",
    padding: "0 8px",
  },
  tab: {
    padding: "7px 18px",
    fontSize: 12,
    color: "#6a8040",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    letterSpacing: "0.5px",
    fontFamily: mono,
  },
  tabActive: { color: "#d4b84a", borderBottom: "2px solid #d4b84a" },
  body: {
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#8a9a60",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottom: "1px solid #3a4c20",
    paddingBottom: 4,
  },
  block: {
    background: "#1e2618",
    border: "1px solid #3a4c20",
    padding: "12px 14px",
    borderRadius: 2,
  },
  fieldRow: { display: "flex", alignItems: "center", gap: 8 },
  label: { fontSize: 11, color: "#8a9a60", whiteSpace: "nowrap", letterSpacing: "0.5px", minWidth: 52 },
  colHeader: {
    display: "grid",
    gridTemplateColumns: "22px 22px 1fr 8px 1fr",
    alignItems: "center",
    gap: 6,
    paddingBottom: 5,
    borderBottom: "1px solid #2a3818",
    marginBottom: 7,
  },
  colHeaderLabel: { fontSize: 10, color: "#4a6030", letterSpacing: 1, textTransform: "uppercase" },
  playerRow: {
    display: "grid",
    gridTemplateColumns: "22px 22px 1fr 8px 1fr 8px",
    alignItems: "center",
    gap: 6,
    marginBottom: 7,
  },
  playerNum: { fontSize: 11, color: "#5a7040", textAlign: "right" },
  playerIcon: {
    width: 20, height: 20,
    background: "#2a3820",
    border: "1px solid #3a4c20",
    borderRadius: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  input: {
    background: "#0e1208",
    border: "1px solid #4a5c30",
    color: "#d4b84a",
    fontFamily: mono,
    fontSize: 12,
    padding: "5px 7px",
    outline: "none",
    width: "100%",
    borderRadius: 1,
    minWidth: 0,
  },
  inputNick: {
    color: "#7ab840",
    borderColor: "#3a5c20",
  },
  sep: { fontSize: 10, color: "#3a4c20", textAlign: "center" },
  playerStatus: {
    width: 7, height: 7,
    borderRadius: "50%",
    background: "#2a3820",
    border: "1px solid #3a5020",
    justifySelf: "",
  },
  playerStatusFilled: { background: "#5a9c30", border: "1px solid #7ab840" },
  divider: { height: 1, background: "#3a4c20" },
  footer: { display: "flex", justifyContent: "flex-end", gap: 8 },
  btn: {
    background: "#2a3820",
    border: "1px solid #4a6030",
    color: "#a0b070",
    fontFamily: mono,
    fontSize: 12,
    padding: "7px 18px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    borderRadius: 1,
  },
  btnPrimary: { background: "#3a5020", borderColor: "#6a9030", color: "#d4b84a" },
  btnDisabled: { background: "#1e2a12", borderColor: "#2a3818", color: "#4a5c2a", cursor: "not-allowed" },
  statusBar: {
    background: "#111808",
    borderTop: "1px solid #3a4c20",
    padding: "5px 14px",
    fontSize: 10,
    color: "#4a5c30",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  statusBarError: { color: "#b84a4a" },
  statusDot: { width: 6, height: 6, borderRadius: "50%", background: "#4a7020", flexShrink: 0 },
  statusDotLoading: { background: "#d4b84a" },
  statusDotError: { background: "#b84a4a" },
  successPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 16,
    padding: "24px 16px",
    background: "#0e1208",
    backgroundImage:
      "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)",
  },
  successTitle: {
    fontFamily: "'Teko', sans-serif",
    fontSize: 20,
    color: "#d4b84a",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  successSub: { fontSize: 12, color: "#6a8a40", letterSpacing: 2 },
  successList: {
    background: "#1a2010",
    border: "1px solid #4a5c30",
    padding: "12px 20px",
    borderRadius: 2,
    width: "100%",
    maxWidth: 360,
  },
  successTeamName: {
    fontSize: 13,
    color: "#d4b84a",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "1px solid #3a4c20",
    fontFamily: mono,
  },
  successItem: {
    fontSize: 12,
    color: "#a0b870",
    padding: "3px 0",
    display: "grid",
    gridTemplateColumns: "12px 1fr 1fr",
    alignItems: "center",
    gap: 8,
    fontFamily: mono,
  },
  successNick: { color: "#7ab840", fontSize: 11 },
  alertOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10, 14, 6, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  alertBox: {
    background: "#2a3020",
    border: "2px solid #6a9030",
    fontFamily: mono,
    width: "100%",
    maxWidth: 340,
  },
  alertTitlebar: {
    background: "#1a2010",
    borderBottom: "2px solid #4a5c30",
    padding: "5px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  alertTitlebarDot: {
    width: 7, height: 7,
    borderRadius: "50%",
    background: "#5a9c30",
    flexShrink: 0,
  },
  alertTitlebarText: { fontSize: 11, color: "#c8c8b8", letterSpacing: "1px" },
  alertBody: {
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    textAlign: "center",
  },
  alertIcon: {
    fontSize: 28,
    color: "#7ab840",
    lineHeight: 1,
    marginBottom: 4,
  },
  alertMsg: {
    fontSize: 14,
    color: "#d4b84a",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  alertTeam: {
    fontSize: 16,
    color: "#c8c8b8",
    marginTop: 2,
  },
  alertSub: {
    fontSize: 11,
    color: "#6a8a40",
    letterSpacing: "0.5px",
  },
};
