import { useState } from 'react';
import copaImg from '../assets/copa.png';
import './key.css';

// ── Configurable URLs (edit here, not in the UI) ──────────────
const CS_LOGO_URL    = 'https://cdn.worldvectorlogo.com/logos/counter-strike.svg';
const LEIBNITZ_URL   = 'https://leibnitz.edu.ar/wp-content/uploads/2024/01/LogoFooter.png';
// ─────────────────────────────────────────────────────────────

type Match = {
  id: number;
  team1: string | null;
  team2: string | null;
  winner: string | null;
};

const INITIAL_MATCHES: Match[] = [
  { id: 0, team1: 'Equipo 1', team2: 'Equipo 2', winner: null },
  { id: 1, team1: 'Equipo 3', team2: 'Equipo 4', winner: null },
  { id: 2, team1: 'Equipo 5', team2: 'Equipo 6', winner: null },
  { id: 3, team1: 'Equipo 7', team2: 'Equipo 8', winner: null },
  { id: 4, team1: null, team2: null, winner: null },
  { id: 5, team1: null, team2: null, winner: null },
  { id: 6, team1: null, team2: null, winner: null },
];

// matchId -> [nextMatchId, slot: 0=team1 | 1=team2]
const ADVANCE_MAP: Record<number, [number, 0 | 1]> = {
  0: [4, 0], 1: [4, 1],
  2: [5, 0], 3: [5, 1],
  4: [6, 0], 5: [6, 1],
};

const ROUND_LABEL: Record<number, string> = {
  0: 'CUARTOS DE FINAL', 1: 'CUARTOS DE FINAL',
  2: 'CUARTOS DE FINAL', 3: 'CUARTOS DE FINAL',
  4: 'SEMIFINAL',        5: 'SEMIFINAL',
  6: 'GRAN FINAL',
};

// ── Victory Modal ──────────────────────────────────────────────

function VictoryModal({
  winner, isFinal, onClose,
}: {
  winner: string;
  isFinal: boolean;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <img src={copaImg} className="modal-copa" alt="Copa Leibnitz" />
        <p className="modal-label">{isFinal ? '¡CAMPEÓN DEL TORNEO!' : '¡EQUIPO GANADOR!'}</p>
        <p className="modal-team">{winner}</p>
        <button className="modal-close-btn" onClick={onClose}>CONTINUAR</button>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
      <path
        d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
        fill="currentColor" opacity="0.45" stroke="currentColor" strokeWidth="1.5"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamSlot({
  name, isWinner, canAdvance, onClick,
}: {
  name: string | null;
  isWinner: boolean;
  canAdvance: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`team-slot${isWinner ? ' slot-winner' : ''}${!name ? ' slot-tbd' : ''}`}>
      <div className="team-shield"><ShieldIcon /></div>
      <span className="team-name">{name ?? 'POR DEFINIR'}</span>
      {isWinner && <span className="winner-check">✓</span>}
      {canAdvance && name && (
        <button className="advance-btn" onClick={onClick} title="Avanzar al ganador">
          ▶
        </button>
      )}
    </div>
  );
}

function MatchCard({
  match, onAdvance,
}: {
  match: Match;
  onAdvance: (id: number, winner: string) => void;
}) {
  const canAdvance = !!match.team1 && !!match.team2 && !match.winner;
  const isEmpty = !match.team1 && !match.team2;

  return (
    <div className={`match-card${match.winner ? ' card-done' : ''}${isEmpty ? ' card-waiting' : ''}`}>
      <div className="match-label">{ROUND_LABEL[match.id]}</div>
      <TeamSlot
        name={match.team1}
        isWinner={match.winner === match.team1}
        canAdvance={canAdvance}
        onClick={() => match.team1 && onAdvance(match.id, match.team1)}
      />
      <div className="match-vs">VS</div>
      <TeamSlot
        name={match.team2}
        isWinner={match.winner === match.team2}
        canAdvance={canAdvance}
        onClick={() => match.team2 && onAdvance(match.id, match.team2)}
      />
    </div>
  );
}

// SVG bracket connector — heights must match the CSS values:
//   match card height = 136px, QF col height = 360px
//   top match center y = 68, bottom y = 292, midpoint y = 180
function ConnectorQF({ side }: { side: 'left' | 'right' }) {
  const color = '#4a5c30';
  const W = 50, H = 360;
  const topY = 68, botY = 292, midY = 180;
  const pivot   = side === 'left' ? 30 : 20;
  const sfEnd   = side === 'left' ? W  : 0;
  const qfStart = side === 'left' ? 0  : W;

  return (
    <svg className="connector-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <line x1={qfStart} y1={topY} x2={pivot}  y2={topY} stroke={color} strokeWidth="2" />
      <line x1={pivot}   y1={topY} x2={pivot}  y2={botY} stroke={color} strokeWidth="2" />
      <line x1={qfStart} y1={botY} x2={pivot}  y2={botY} stroke={color} strokeWidth="2" />
      <line x1={pivot}   y1={midY} x2={sfEnd}  y2={midY} stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function KeyCs() {
  const [matches, setMatches]         = useState<Match[]>(INITIAL_MATCHES);
  const [champion, setChampion]       = useState<string | null>(null);
  const [modalWinner, setModalWinner] = useState<string | null>(null);

  function advanceWinner(matchId: number, winner: string) {
    const updated = matches.map(m => m.id === matchId ? { ...m, winner } : m);

    if (matchId === 6) {
      setMatches(updated);
      setChampion(winner);
      setModalWinner(winner);
      return;
    }

    const [nextId, slot] = ADVANCE_MAP[matchId];
    setMatches(updated.map(m => {
      if (m.id !== nextId) return m;
      return slot === 0 ? { ...m, team1: winner } : { ...m, team2: winner };
    }));
  }

  function reset() {
    setMatches(INITIAL_MATCHES);
    setChampion(null);
    setModalWinner(null);
  }

  return (
    <div className="bracket-page">

      {/* Victory modal */}
      {modalWinner && (
        <VictoryModal
          winner={modalWinner}
          isFinal={true}
          onClose={() => setModalWinner(null)}
        />
      )}

      {/* ── Header ── */}
      <header className="bracket-header">
        <div className="header-logo-wrap">
          <img src={CS_LOGO_URL} className="header-logo" alt="Counter-Strike Logo" />
        </div>
        <div className="header-center">
          <h1 className="bracket-title">TORNEO LEIBNITZ</h1>
          <p className="bracket-subtitle">COUNTER-STRIKE</p>
        </div>
        <div className="header-logo-wrap">
          <img src={LEIBNITZ_URL} className="header-logo" alt="Instituto Leibnitz" />
        </div>
      </header>

      {/* ── Bracket ── */}
      <div className="bracket-wrapper">

        {/* QF Left */}
        <div className="bracket-col qf-col">
          <MatchCard match={matches[0]} onAdvance={advanceWinner} />
          <MatchCard match={matches[1]} onAdvance={advanceWinner} />
        </div>

        <ConnectorQF side="left" />

        {/* SF Left */}
        <div className="bracket-col sf-col">
          <MatchCard match={matches[4]} onAdvance={advanceWinner} />
        </div>

        <div className="inner-connector" />

        {/* Final + Trophy */}
        <div className="bracket-col final-col">
          <div className="trophy-wrap">
            <img src={copaImg} className="trophy-img" alt="Copa Leibnitz" />
          </div>
          <MatchCard match={matches[6]} onAdvance={advanceWinner} />
          {champion && (
            <div className="champion-box">
              <div className="champion-label">CAMPEÓN</div>
              <div className="champion-name">{champion}</div>
            </div>
          )}
        </div>

        <div className="inner-connector" />

        {/* SF Right */}
        <div className="bracket-col sf-col">
          <MatchCard match={matches[5]} onAdvance={advanceWinner} />
        </div>

        <ConnectorQF side="right" />

        {/* QF Right */}
        <div className="bracket-col qf-col">
          <MatchCard match={matches[2]} onAdvance={advanceWinner} />
          <MatchCard match={matches[3]} onAdvance={advanceWinner} />
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="bracket-footer">
        <div className="footer-labels">
          <span>CUARTOS DE FINAL</span>
          <span>SEMIFINAL</span>
          <span>GRAN FINAL</span>
          <span>SEMIFINAL</span>
          <span>CUARTOS DE FINAL</span>
        </div>
        <button className="reset-btn" onClick={reset}>↺ REINICIAR TORNEO</button>
      </footer>

    </div>
  );
}
