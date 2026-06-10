import { useState, useEffect, createContext, useContext } from 'react';

// ─── Paleta CS 1.6 ────────────────────────────────────────────────
const GOLD       = '#c8b866';
const BG_PAGE    = '#0d1208';
const BG_CARD    = '#0a0e06';
const BORDER_DIM = '#2a3018';
const BORDER_ACT = '#4a5a2a';
const TEXT_ALIVE = '#6a8a4a';
const TEXT_DEAD  = '#1a2010';
const TEXT_MUTED = '#3a4a2a';
const CONNECTOR  = '#6a7a3a';

// ─── Layout dinámico ─────────────────────────────────────────────
const LayoutCtx = createContext(null);
function useDims() { return useContext(LayoutCtx); }

// Dimensiones naturales de referencia (base de cálculo)
const NAT_MATCH_W   = 220;
const NAT_CONN_W    = 60;
const NAT_MATCH_H   = 100;
const NAT_BRACKET_H = 620;

function computeDims() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const PAD = 32;

  const naturalW = NAT_MATCH_W * 3 + NAT_CONN_W * 2;   // 780
  const naturalH = NAT_BRACKET_H + 50;                   // 670 (bracket + etiquetas)

  const scaleW = (vw - PAD * 2) / naturalW;
  const scaleH = (vh - PAD * 2) / naturalH;
  const s = Math.min(scaleW, scaleH, 1.5); // nunca agrandar más de 1.5×

  const MATCH_W   = Math.max(Math.round(NAT_MATCH_W * s), 100);
  const CONN_W    = Math.max(Math.round(NAT_CONN_W  * s), 30);
  const MATCH_H   = Math.max(Math.round(NAT_MATCH_H * s), 60);
  const BRACKET_H = Math.max(Math.round(NAT_BRACKET_H * s), 300);
  const fontSize  = Math.max(Math.round(14 * Math.min(s, 1)), 9);

  return { MATCH_W, CONN_W, MATCH_H, BRACKET_H, SLOT_H: Math.floor(MATCH_H / 2), fontSize, s };
}

// ─── Helpers ──────────────────────────────────────────────────────
function calcCenters(n, bracketH, matchH) {
  const free = bracketH - n * matchH;
  const gap  = free / n;
  return Array.from({ length: n }, (_, i) => gap / 2 + i * (matchH + gap) + matchH / 2);
}

function makeMatch(id, t1, t2) {
  return { id, team1: t1 || null, team2: t2 || null, winner: null };
}

function buildBracket(teams) {
  return {
    quarterFinals: [
      makeMatch('qf-0', teams[0], teams[1]),
      makeMatch('qf-1', teams[2], teams[3]),
      makeMatch('qf-2', teams[4], teams[5]),
      makeMatch('qf-3', teams[6], teams[7]),
    ],
    semiFinals: [makeMatch('sf-0', null, null), makeMatch('sf-1', null, null)],
    final:      makeMatch('final', null, null),
    champion:   null,
  };
}

// ─── SVG conectores ───────────────────────────────────────────────
function ConnectorSVG({ srcYs, tgtYs }) {
  const { CONN_W, BRACKET_H } = useDims();
  const mid = CONN_W / 2;
  const paths = [];
  for (let i = 0; i < tgtYs.length; i++) {
    const y1 = srcYs[i * 2], y2 = srcYs[i * 2 + 1], yt = tgtYs[i];
    paths.push(<path key={`a${i}`} d={`M 0 ${y1} H ${mid} V ${yt} H ${CONN_W}`} stroke={CONNECTOR} strokeWidth="1.5" fill="none" strokeOpacity="0.6" />);
    paths.push(<path key={`b${i}`} d={`M 0 ${y2} H ${mid}`}                    stroke={CONNECTOR} strokeWidth="1.5" fill="none" strokeOpacity="0.6" />);
  }
  return (
    <svg width={CONN_W} height={BRACKET_H} style={{ minWidth: CONN_W, flexShrink: 0, display: 'block' }}>
      {paths}
    </svg>
  );
}

// ─── Slot de equipo ───────────────────────────────────────────────
function TeamSlot({ team, isWinner, isLoser, canClick, onSelect, isLast }) {
  const { SLOT_H, fontSize } = useDims();
  const [hovered, setHovered]     = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const bg = isWinner
    ? 'rgba(200,184,102,0.08)'
    : isLoser
    ? 'rgba(0,0,0,0.4)'
    : hovered && canClick
    ? 'rgba(200,184,102,0.05)'
    : 'transparent';

  const style = {
    height: SLOT_H,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: Math.max(Math.round(SLOT_H * 0.24), 6),
    paddingRight: 6,
    borderBottom: isLast ? 'none' : `1px solid ${BORDER_DIM}`,
    borderLeft: `3px solid ${isWinner ? GOLD : 'transparent'}`,
    background: bg,
    transition: 'background 0.15s',
    userSelect: 'none',
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box',
  };

  if (!team || !team.name || team.name.trim() === '') {
    return (
      <div style={style}>
        <span style={{ color: '#253018', fontSize: Math.max(fontSize - 2, 8), letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Por definir
        </span>
      </div>
    );
  }

  const btnW = Math.max(Math.round(SLOT_H * 0.6), 20);
  const btnH = Math.max(Math.round(SLOT_H * 0.46), 16);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {isWinner && (
        <span style={{ color: GOLD, marginRight: 6, fontSize: Math.max(fontSize - 2, 8), flexShrink: 0 }}>▶</span>
      )}
      <span style={{
        color: isWinner ? GOLD : isLoser ? TEXT_DEAD : TEXT_ALIVE,
        fontSize,
        fontWeight: isWinner ? 700 : 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1,
        textShadow: isWinner ? `0 0 8px rgba(200,184,102,0.5)` : 'none',
      }}>
        {team.name}
      </span>
      {canClick && !isWinner && (
        <button
          onClick={onSelect}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          title="Pasar a la siguiente ronda"
          style={{
            marginLeft: 4,
            flexShrink: 0,
            width: btnW,
            height: btnH,
            background: btnHovered ? 'rgba(200,184,102,0.25)' : 'rgba(200,184,102,0.08)',
            border: `1px solid ${btnHovered ? GOLD : BORDER_ACT}`,
            color: btnHovered ? GOLD : TEXT_ALIVE,
            fontSize: Math.max(fontSize - 1, 9),
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          →
        </button>
      )}
    </div>
  );
}

// ─── Tarjeta de partido ───────────────────────────────────────────
function MatchCard({ match, onSelectWinner }) {
  const { MATCH_W, MATCH_H } = useDims();
  const both = !!(match.team1?.name && match.team2?.name);
  return (
    <div style={{
      width: MATCH_W,
      height: MATCH_H,
      background: BG_CARD,
      border: `1px solid ${match.winner ? BORDER_ACT : BORDER_DIM}`,
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {[match.team1, match.team2].map((team, idx) => {
        const isWinner = !!team && team.id === match.winner?.id;
        const isLoser  = !!match.winner && !isWinner && !!team;
        return (
          <TeamSlot
            key={idx}
            team={team}
            isWinner={isWinner}
            isLoser={isLoser}
            canClick={!!team && both}
            onSelect={() => team && onSelectWinner(team)}
            isLast={idx === 1}
          />
        );
      })}
    </div>
  );
}

// ─── Columna de ronda ─────────────────────────────────────────────
function RoundColumn({ matches, center, onSelectWinner }) {
  const { BRACKET_H, MATCH_W } = useDims();
  return (
    <div style={{
      height: BRACKET_H,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: center ? 'center' : 'space-around',
      minWidth: MATCH_W,
      flexShrink: 0,
    }}>
      {matches.map(match => (
        <MatchCard
          key={match.id}
          match={match}
          onSelectWinner={winner => onSelectWinner(match.id, winner)}
        />
      ))}
    </div>
  );
}

// ─── Componente principal exportado ──────────────────────────────
export default function LlavesCounter({ teams: teamsProp }) {
  const BLANK_TEAMS = Array.from({ length: 8 }, (_, i) => ({ id: `slot-${i}`, name: '' }));
  const teams = teamsProp?.length === 8 ? teamsProp : BLANK_TEAMS;

  const [bracket, setBracket] = useState(() => buildBracket(teams));
  const [dims, setDims]       = useState(() => computeDims());

  useEffect(() => {
    function handleResize() { setDims(computeDims()); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setBracket(buildBracket(teams));
  }, [JSON.stringify(teams?.map(t => t.id)), JSON.stringify(teams?.map(t => t.name))]);

  const { MATCH_W, CONN_W, MATCH_H, BRACKET_H, fontSize, s } = dims;

  const QF_Y = calcCenters(4, BRACKET_H, MATCH_H);
  const SF_Y = calcCenters(2, BRACKET_H, MATCH_H);
  const FN_Y = [BRACKET_H / 2];

  function handleSelectWinner(round, matchId, winner) {
    setBracket(prev => {
      let qf = prev.quarterFinals.map(m => m.id === matchId && round === 'quarterFinals' ? { ...m, winner } : m);
      let sf = prev.semiFinals.map(m  => m.id === matchId && round === 'semiFinals'  ? { ...m, winner } : m);
      let fin      = { ...prev.final };
      let champion = prev.champion;

      if (round === 'quarterFinals') {
        const sf0t1 = qf[0].winner || null, sf0t2 = qf[1].winner || null;
        const ch0 = sf0t1?.id !== prev.semiFinals[0].team1?.id || sf0t2?.id !== prev.semiFinals[0].team2?.id;
        sf[0] = { ...sf[0], team1: sf0t1, team2: sf0t2, winner: ch0 ? null : sf[0].winner };

        const sf1t1 = qf[2].winner || null, sf1t2 = qf[3].winner || null;
        const ch1 = sf1t1?.id !== prev.semiFinals[1].team1?.id || sf1t2?.id !== prev.semiFinals[1].team2?.id;
        sf[1] = { ...sf[1], team1: sf1t1, team2: sf1t2, winner: ch1 ? null : sf[1].winner };
      }

      if (round === 'quarterFinals' || round === 'semiFinals') {
        const ft1 = sf[0].winner || null, ft2 = sf[1].winner || null;
        const fch = ft1?.id !== prev.final.team1?.id || ft2?.id !== prev.final.team2?.id;
        fin      = { ...fin, team1: ft1, team2: ft2, winner: fch ? null : fin.winner };
        champion = fin.winner;
      }

      if (round === 'final') { fin = { ...fin, winner }; champion = winner; }

      return { quarterFinals: qf, semiFinals: sf, final: fin, champion };
    });
  }

  const labelFs = Math.max(Math.round(11 * Math.min(s, 1)), 8);

  const roundLabels = [
    { label: 'Cuartos de Final', width: MATCH_W },
    { label: '',                 width: CONN_W  },
    { label: 'Semifinales',      width: MATCH_W },
    { label: '',                 width: CONN_W  },
    { label: 'Gran Final',       width: MATCH_W },
  ];

  return (
    <LayoutCtx.Provider value={dims}>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${BG_PAGE} 0%, #111608 50%, #0a0f06 100%)`,
        backgroundImage: `
          linear-gradient(160deg, ${BG_PAGE} 0%, #111608 50%, #0a0f06 100%),
          repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)
        `,
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        color: TEXT_ALIVE,
        margin: 0,
        padding: 0,
      }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Banner de Campeón */}
          {bracket.champion?.name && (
            <div style={{
              marginBottom: Math.max(Math.round(20 * s), 12),
              padding: `${Math.max(Math.round(16 * s), 8)}px ${Math.max(Math.round(32 * s), 16)}px`,
              background: 'rgba(200,184,102,0.08)',
              border: `2px solid ${GOLD}`,
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(200,184,102,0.1)',
            }}>
              <div style={{ color: TEXT_MUTED, fontSize: Math.max(Math.round(12 * Math.min(s, 1)), 8), letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 8 }}>
                🏆 Campeón del Torneo
              </div>
              <div style={{ color: GOLD, fontSize: Math.max(Math.round(28 * Math.min(s, 1.2)), 16), fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: `0 0 24px rgba(200,184,102,0.7)` }}>
                {bracket.champion.name}
              </div>
            </div>
          )}

          {/* Etiquetas de ronda */}
          <div style={{ display: 'flex', marginBottom: Math.max(Math.round(12 * s), 6) }}>
            {roundLabels.map(({ label, width }, i) => (
              <div key={i} style={{
                width, minWidth: width, textAlign: 'center',
                color: label ? BORDER_ACT : 'transparent',
                fontSize: labelFs, letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                {label || '.'}
              </div>
            ))}
          </div>

          {/* Columnas */}
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <RoundColumn
              matches={bracket.quarterFinals}
              center={false}
              onSelectWinner={(id, w) => handleSelectWinner('quarterFinals', id, w)}
            />
            <ConnectorSVG srcYs={QF_Y} tgtYs={SF_Y} />
            <RoundColumn
              matches={bracket.semiFinals}
              center={false}
              onSelectWinner={(id, w) => handleSelectWinner('semiFinals', id, w)}
            />
            <ConnectorSVG srcYs={SF_Y} tgtYs={FN_Y} />
            <RoundColumn
              matches={[bracket.final]}
              center={true}
              onSelectWinner={(id, w) => handleSelectWinner('final', id, w)}
            />
          </div>
        </div>
      </div>
    </LayoutCtx.Provider>
  );
}