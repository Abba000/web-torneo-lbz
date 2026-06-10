import { useState, useRef, useLayoutEffect, useCallback } from 'react';

const CS_LOGO_URL  = 'https://cdn.worldvectorlogo.com/logos/counter-strike.svg';
const LEIBNITZ_URL = 'https://leibnitz.edu.ar/wp-content/uploads/2024/01/LogoFooter.png';

// ── Trophy SVG ─────────────────────────────────────────────────
function CopaSVG({ size = 120, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <rect x="52" y="138" width="56" height="10" rx="2" fill="#a07828" />
      <rect x="44" y="128" width="72" height="12" rx="2" fill="#c49a30" />
      <rect x="72" y="108" width="16" height="22" rx="2" fill="#c49a30" />
      <path d="M38 30 Q34 72 52 90 Q62 100 80 102 Q98 100 108 90 Q126 72 122 30 Z" fill="#d4b84a" stroke="#a07828" strokeWidth="2" />
      <path d="M38 40 Q18 50 22 70 Q26 88 38 80" fill="none" stroke="#c49a30" strokeWidth="6" strokeLinecap="round" />
      <path d="M122 40 Q142 50 138 70 Q134 88 122 80" fill="none" stroke="#c49a30" strokeWidth="6" strokeLinecap="round" />
      <path d="M58 42 Q62 60 60 78" fill="none" stroke="rgba(255,255,200,0.35)" strokeWidth="5" strokeLinecap="round" />
      <polygon points="80,50 83,60 94,60 85,66 88,76 80,70 72,76 75,66 66,60 77,60" fill="#fff8c0" opacity="0.7" />
    </svg>
  );
}

// ── Shield icon ────────────────────────────────────────────────
function ShieldIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
        fill="currentColor" opacity="0.45" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Victory Modal ──────────────────────────────────────────────
function VictoryModal({ winner, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(14,18,8,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, animation: 'overlayIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        padding: 'clamp(20px, 5vw, 48px) clamp(24px, 6vw, 60px)',
        background: '#2a3020', border: '1px solid #4a5c30', borderRadius: '2px',
        boxShadow: '0 0 40px rgba(74,92,48,0.4)',
        animation: 'cardIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        maxWidth: '90vw', width: 'min(420px, 90vw)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ animation: 'copaFloat 3s ease-in-out infinite' }}>
          <CopaSVG size={Math.min(160, window.innerWidth * 0.28)} />
        </div>
        <p style={{ fontFamily: "'Teko', sans-serif", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', fontWeight: 600, letterSpacing: '3px', color: '#d4b84a', textAlign: 'center', textShadow: '0 0 14px rgba(212,184,74,0.4)' }}>
          ¡CAMPEÓN DEL TORNEO!
        </p>
        <p style={{ fontFamily: "'Teko', sans-serif", fontSize: 'clamp(1.4rem, 5vw, 2.4rem)', fontWeight: 700, color: '#7ab840', textAlign: 'center', letterSpacing: '2px', wordBreak: 'break-word', textShadow: '0 0 14px rgba(122,184,64,0.4)' }}>
          {winner}
        </p>
        <button onClick={onClose} style={{
          marginTop: '4px', background: '#3a5020', border: '1px solid #6a9030',
          borderRadius: '1px', color: '#a0b870', padding: 'clamp(6px,1.5vw,10px) clamp(18px,4vw,36px)',
          fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(0.5rem, 1.5vw, 0.7rem)',
          letterSpacing: '1.5px', cursor: 'pointer',
        }}>CONTINUAR</button>
      </div>
    </div>
  );
}

const ROUND_LABEL = {
  0: 'CUARTOS DE FINAL', 1: 'CUARTOS DE FINAL',
  2: 'CUARTOS DE FINAL', 3: 'CUARTOS DE FINAL',
  4: 'SEMIFINAL',        5: 'SEMIFINAL',
  6: 'GRAN FINAL',
};

const INITIAL_MATCHES = [
  { id: 0, team1: 'Equipo 1', team2: 'Equipo 2', winner: null },
  { id: 1, team1: 'Equipo 3', team2: 'Equipo 4', winner: null },
  { id: 2, team1: 'Equipo 5', team2: 'Equipo 6', winner: null },
  { id: 3, team1: 'Equipo 7', team2: 'Equipo 8', winner: null },
  { id: 4, team1: null, team2: null, winner: null },
  { id: 5, team1: null, team2: null, winner: null },
  { id: 6, team1: null, team2: null, winner: null },
];

const ADVANCE_MAP = { 0:[4,0], 1:[4,1], 2:[5,0], 3:[5,1], 4:[6,0], 5:[6,1] };

// ── TeamSlot ───────────────────────────────────────────────────
function TeamSlot({ name, isWinner, canAdvance, onClick, fs }) {
  const shieldSz = Math.max(12, fs * 1.4);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: `${fs * 0.5}px`,
      padding: `${fs * 0.45}px ${fs * 0.55}px`,
      background: isWinner ? '#2a3820' : (!name ? '#1e2618' : '#2a3820'),
      border: `1px solid ${isWinner ? '#7ab840' : (!name ? '#2a3818' : '#2a3818')}`,
      borderRadius: '1px', overflow: 'hidden',
      opacity: !name ? 0.38 : 1,
      transition: 'border-color 0.2s',
      flex: 1,
    }}>
      <div style={{
        width: `${shieldSz}px`, height: `${shieldSz}px`, flexShrink: 0,
        background: '#2a3820', border: '1px solid #4a5c30', borderRadius: '1px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4b84a',
      }}>
        <ShieldIcon size={Math.max(9, shieldSz * 0.7)} />
      </div>
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: `${fs}px`, letterSpacing: '0.3px',
        flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        color: '#a0b070', lineHeight: 1,
      }}>
        {name ?? 'POR DEFINIR'}
      </span>
      {isWinner && <span style={{ color: '#7ab840', fontSize: `${fs * 1.1}px`, fontWeight: 900, flexShrink: 0, lineHeight: 1 }}>✓</span>}
      {canAdvance && name && (
        <button onClick={onClick} style={{
          flexShrink: 0, background: '#3a5020', border: '1px solid #6a9030',
          borderRadius: '1px', color: '#a0b870', cursor: 'pointer',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: `${Math.max(8, fs * 0.85)}px`,
          padding: `${fs * 0.3}px ${fs * 0.5}px`, lineHeight: 1,
        }}>▶</button>
      )}
    </div>
  );
}

// ── MatchCard ──────────────────────────────────────────────────
function MatchCard({ match, onAdvance, cardW, fs }) {
  const canAdvance = !!match.team1 && !!match.team2 && !match.winner;
  const isEmpty = !match.team1 && !match.team2;
  return (
    <div style={{
      width: `${cardW}px`,
      padding: `${fs * 0.6}px`,
      display: 'flex', flexDirection: 'column', gap: `${fs * 0.28}px`,
      background: '#1e2618',
      border: `1px solid ${match.winner ? '#5a7040' : '#3a4c20'}`,
      borderRadius: '1px',
      opacity: isEmpty ? 0.45 : 1,
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: `${Math.max(7, fs * 0.65)}px`, letterSpacing: '1px', color: '#6a8040', textAlign: 'center', marginBottom: `${fs * 0.15}px` }}>
        {ROUND_LABEL[match.id]}
      </div>
      <TeamSlot name={match.team1} isWinner={match.winner === match.team1} canAdvance={canAdvance} onClick={() => onAdvance(match.id, match.team1)} fs={fs} />
      <div style={{ textAlign: 'center', fontSize: `${Math.max(7, fs * 0.65)}px`, letterSpacing: '2px', color: '#4a5c30', lineHeight: 1, padding: `${fs * 0.1}px 0` }}>VS</div>
      <TeamSlot name={match.team2} isWinner={match.winner === match.team2} canAdvance={canAdvance} onClick={() => onAdvance(match.id, match.team2)} fs={fs} />
    </div>
  );
}

// ── Bracket SVG overlay (connectors drawn on top) ──────────────
function BracketConnectors({ refs, bracketW, bracketH }) {
  const color = '#4a5c30';
  if (!bracketW || !bracketH) return null;

  function getCardCenter(ref) {
    if (!ref?.current) return null;
    const el = ref.current;
    const parent = el.closest('.bracket-canvas');
    if (!parent) return null;
    const pRect = parent.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    return {
      top:    eRect.top  - pRect.top,
      bottom: eRect.bottom - pRect.top,
      left:   eRect.left  - pRect.left,
      right:  eRect.right  - pRect.left,
      midY:   (eRect.top + eRect.bottom) / 2 - pRect.top,
      midX:   (eRect.left + eRect.right) / 2 - pRect.left,
    };
  }

  const c = {};
  refs.forEach((ref, i) => { c[i] = getCardCenter(ref); });
  if (Object.values(c).some(v => !v)) return null;

  const lines = [];
  const push = (x1, y1, x2, y2, key) =>
    lines.push(<line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" strokeLinecap="round" />);

  // QF0 → SF4 (left side, going right)
  const pivotL = c[0].right + (c[4].left - c[0].right) / 2;
  push(c[0].right, c[0].midY, pivotL, c[0].midY, 'l0h');
  push(pivotL, c[0].midY, pivotL, c[1].midY, 'lv');
  push(c[1].right, c[1].midY, pivotL, c[1].midY, 'l1h');
  push(pivotL, c[4].midY, c[4].left, c[4].midY, 'lsf');

  // SF4 → Final6
  push(c[4].right, c[4].midY, c[6].left, c[4].midY, 'lf4');

  // QF2,3 → SF5 (right side, going left)
  const pivotR = c[2].left - (c[2].left - c[5].right) / 2;
  push(c[2].left, c[2].midY, pivotR, c[2].midY, 'r2h');
  push(pivotR, c[2].midY, pivotR, c[3].midY, 'rv');
  push(c[3].left, c[3].midY, pivotR, c[3].midY, 'r3h');
  push(pivotR, c[5].midY, c[5].left, c[5].midY, 'rsf');

  // SF5 → Final6
  push(c[5].right, c[5].midY, c[6].right, c[5].midY, 'rf5');

  return (
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
      width={bracketW} height={bracketH}>
      {lines}
    </svg>
  );
}

// ── Global keyframes injected once ────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Teko:wght@500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes cardIn    { from { opacity: 0; transform: scale(0.8) translateY(16px) } to { opacity: 1; transform: scale(1) translateY(0) } }
  @keyframes copaFloat { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
  @keyframes champPulse { from { border-color: #4a5c30 } to { border-color: #7ab840; box-shadow: 0 0 14px rgba(122,184,64,0.2) } }
  .bracket-canvas { position: relative; }
`;

// ── Main component ─────────────────────────────────────────────
export default function KeyCs() {
  const [matches, setMatches]         = useState(INITIAL_MATCHES);
  const [champion, setChampion]       = useState(null);
  const [modalWinner, setModalWinner] = useState(null);
  const [dims, setDims]               = useState({ w: 0, h: 0 });
  const [, forceUpdate]               = useState(0);

  const wrapperRef = useRef(null);
  // Card refs: 0-3 = QF, 4-5 = SF, 6 = Final
  const cardRefs = useRef(Array.from({ length: 7 }, () => ({ current: null })));

  // Measure bracket wrapper
  const measure = useCallback(() => {
    if (!wrapperRef.current) return;
    const { width, height } = wrapperRef.current.getBoundingClientRect();
    setDims({ w: width, h: height });
    forceUpdate(n => n + 1); // re-render connectors
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [measure]);

  function advanceWinner(matchId, winner) {
    const updated = matches.map(m => m.id === matchId ? { ...m, winner } : m);
    if (matchId === 6) { setMatches(updated); setChampion(winner); setModalWinner(winner); return; }
    const [nextId, slot] = ADVANCE_MAP[matchId];
    setMatches(updated.map(m => {
      if (m.id !== nextId) return m;
      return slot === 0 ? { ...m, team1: winner } : { ...m, team2: winner };
    }));
  }

  function reset() { setMatches(INITIAL_MATCHES); setChampion(null); setModalWinner(null); }

  // ── Responsive sizing ──────────────────────────────────────
  const vw = dims.w || window.innerWidth;

  // Card width: fills available space (7 cols: 2 QF + 2 SF + 1 Final + gaps/connectors)
  // Approximate: total = 2*cardW + 2*connW + 2*cardW + 2*connW + cardW  → 5*cardW + 4*connW
  // connW ≈ 0.06*vw; solve for cardW
  const connFrac = 0.055;
  const cardW = Math.floor((vw * 0.98 - 4 * vw * connFrac) / 5);
  const cardWClamped = Math.max(90, Math.min(cardW, 260));
  const fs = Math.max(8, Math.min(cardWClamped * 0.072, 13)); // base font size
  const connW = Math.floor((vw * 0.98 - 5 * cardWClamped) / 4);
  const connWC = Math.max(20, connW);
  const trophySize = Math.max(60, Math.min(cardWClamped * 0.7, 130));

  // QF column height: 2 cards + gap between them
  const cardH = fs * 10.5; // approximate card height
  const qfGap = Math.max(cardH * 0.6, cardWClamped * 0.35);
  const qfColH = cardH * 2 + qfGap;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        minHeight: '100vh', width: '100%',
        background: '#1a1e10',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)',
        color: '#a0b070', fontFamily: "'Share Tech Mono', monospace",
        padding: 'clamp(8px,1.5vh,16px) clamp(8px,1.5vw,16px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 'clamp(8px,1.5vh,14px)',
      }}>

        {modalWinner && <VictoryModal winner={modalWinner} onClose={() => setModalWinner(null)} />}

        {/* ── Header ── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: 'clamp(8px,1.5vh,14px) clamp(12px,2vw,24px)',
          background: '#1a2010', border: '1px solid #4a5c30', borderRadius: '2px',
          gap: 'clamp(6px,1vw,12px)',
        }}>
          <div style={{ width: 'clamp(36px,6vw,80px)', height: 'clamp(36px,6vw,80px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={CS_LOGO_URL} alt="CS" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0.9) sepia(0.3) hue-rotate(30deg)' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Teko', sans-serif", fontSize: 'clamp(1.4rem,5vw,3.2rem)', fontWeight: 700, letterSpacing: 'clamp(1px,0.4vw,4px)', color: '#d4b84a', lineHeight: 1, textShadow: '0 0 20px rgba(212,184,74,0.35)' }}>
              TORNEO LEIBNITZ
            </h1>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(0.45rem,1.2vw,0.72rem)', color: '#6a8040', letterSpacing: 'clamp(1px,0.3vw,3px)', marginTop: '3px' }}>
              COUNTER-STRIKE
            </p>
          </div>
          <div style={{ width: 'clamp(36px,6vw,80px)', height: 'clamp(36px,6vw,80px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LEIBNITZ_URL} alt="Leibnitz" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0.9) sepia(0.3) hue-rotate(30deg)' }} />
          </div>
        </header>

        {/* ── Bracket ── */}
        <div ref={wrapperRef} className="bracket-canvas" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%',
          background: '#2a3020', border: '1px solid #4a5c30', borderRadius: '2px',
          padding: 'clamp(12px,2vh,28px) clamp(4px,0.5vw,12px)',
          gap: 0,
          overflow: 'hidden',
        }}>

          {/* QF left */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: `${qfColH}px`, flexShrink: 0 }}>
            <div ref={el => cardRefs.current[0].current = el}><MatchCard match={matches[0]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} /></div>
            <div ref={el => cardRefs.current[1].current = el}><MatchCard match={matches[1]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} /></div>
          </div>

          {/* Spacer connector left */}
          <div style={{ width: `${connWC}px`, flexShrink: 0 }} />

          {/* SF left */}
          <div style={{ flexShrink: 0, alignSelf: 'center' }} ref={el => cardRefs.current[4].current = el}>
            <MatchCard match={matches[4]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} />
          </div>

          {/* Inner connector left */}
          <div style={{ width: `${Math.max(16, connWC * 0.6)}px`, flexShrink: 0 }} />

          {/* Final + trophy */}
          <div style={{ flexShrink: 0, alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${fs * 0.8}px` }}>
            <CopaSVG size={trophySize} style={{ filter: 'drop-shadow(0 4px 14px rgba(212,184,74,0.3))' }} />
            <div ref={el => cardRefs.current[6].current = el}>
              <MatchCard match={matches[6]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} />
            </div>
            {champion && (
              <div style={{
                width: `${cardWClamped}px`, padding: `${fs * 0.7}px ${fs}px`,
                background: '#1a2010', border: '1px solid #4a5c30', borderRadius: '2px',
                textAlign: 'center', animation: 'champPulse 3s ease-in-out infinite alternate',
              }}>
                <div style={{ fontFamily: "'Teko', sans-serif", fontSize: `clamp(0.6rem,1.5vw,0.9rem)`, fontWeight: 600, letterSpacing: '3px', color: '#d4b84a' }}>CAMPEÓN</div>
                <div style={{ fontFamily: "'Teko', sans-serif", fontSize: `clamp(1rem,3vw,1.6rem)`, fontWeight: 700, color: '#7ab840', letterSpacing: '2px', wordBreak: 'break-word', textShadow: '0 0 10px rgba(122,184,64,0.35)', marginTop: '2px' }}>{champion}</div>
              </div>
            )}
          </div>

          {/* Inner connector right */}
          <div style={{ width: `${Math.max(16, connWC * 0.6)}px`, flexShrink: 0 }} />

          {/* SF right */}
          <div style={{ flexShrink: 0, alignSelf: 'center' }} ref={el => cardRefs.current[5].current = el}>
            <MatchCard match={matches[5]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} />
          </div>

          {/* Spacer connector right */}
          <div style={{ width: `${connWC}px`, flexShrink: 0 }} />

          {/* QF right */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: `${qfColH}px`, flexShrink: 0 }}>
            <div ref={el => cardRefs.current[2].current = el}><MatchCard match={matches[2]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} /></div>
            <div ref={el => cardRefs.current[3].current = el}><MatchCard match={matches[3]} onAdvance={advanceWinner} cardW={cardWClamped} fs={fs} /></div>
          </div>

          {/* SVG connectors drawn over everything */}
          <BracketConnectors refs={cardRefs.current} bracketW={dims.w} bracketH={dims.h} />

        </div>

        {/* ── Footer ── */}
        <footer style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 'clamp(6px,1vh,12px)',
          width: '100%', padding: 'clamp(8px,1vh,12px) clamp(12px,2vw,24px)',
          background: '#111808', border: '1px solid #3a4c20', borderRadius: '2px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(0.38rem,1.1vw,0.58rem)', letterSpacing: '1px', color: '#5a7040' }}>
            <span>CUARTOS</span><span>SEMIFINAL</span><span>GRAN FINAL</span><span>SEMIFINAL</span><span>CUARTOS</span>
          </div>
          <button onClick={reset} style={{
            background: '#2a3820', border: '1px solid #4a5c30', borderRadius: '1px',
            color: '#8a9a60', padding: 'clamp(5px,1vh,8px) clamp(14px,3vw,24px)',
            fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(0.5rem,1.3vw,0.68rem)',
            letterSpacing: '1.5px', cursor: 'pointer',
          }}>↺ REINICIAR TORNEO</button>
        </footer>

      </div>
    </>
  );
}
