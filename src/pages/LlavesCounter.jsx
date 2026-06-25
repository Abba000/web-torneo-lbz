import { useState, useEffect } from 'react';
import { getBracket, setGanador } from '../api/bracket';
import { getToken } from '../api/auth';

const YPR  = [380, 828];
const YSF  = 604;
const YFIN = 604;
const YTHD = 738;

const XPR_L = 380, XSF_L = 660, XC = 960, XSF_R = 1260, XPR_R = 1540;
const SW = 180, SHW = 90;
const CF = 210, CHF = 105;
const CT = 195;

const R_PR_L  = XPR_L + SHW;
const L_SF_L  = XSF_L - SHW;
const M_PRL   = Math.round((R_PR_L + L_SF_L) / 2);

const R_SF_L  = XSF_L + SHW;
const L_FI    = XC    - CHF;
const R_FI    = XC    + CHF;
const L_SF_R  = XSF_R - SHW;

const R_SF_R  = XSF_R + SHW;
const L_PR_R  = XPR_R - SHW;
const M_PRR   = Math.round((L_PR_R + R_SF_R) / 2);

const titleTop = (firstY, cardH, titleH = 24) => firstY - cardH / 2 - 8 - titleH;
const TOP_PR    = titleTop(YPR[0], 58, 24);
const TOP_SF    = titleTop(YSF,    58, 24);
const TOP_FINAL = titleTop(YFIN,   84, 26);
const TOP_THIRD = titleTop(YTHD,   76, 26);

const REP_PANEL_H = 130;

const CARD = ({ x, y, w = SW, h = 58, gold = false, bronze = false, bye = false,
                t1 = null, t2 = null, winner = null, isAdmin = false, onWinner = null }) => {
  if (!t1 && !t2 && !bye) return null;

  const accent = gold ? '#d4b84a' : bronze ? '#c07830' : null;
  const bd  = gold ? '3px solid #d4b84a' : bronze ? '2px solid #c07830' : '2px solid #4a5c30';
  const bg  = gold ? '#1e2a10' : bronze ? '#1a2010' : 'rgba(26,32,16,0.97)';
  const nc  = bronze ? '#c8b870' : '#c8c8b8';
  const sep = bronze ? '#3a3010' : '#2a3818';
  const teamH = h / 2;

  const label1 = t1?.nombre || 'POR DEFINIR';
  const label2 = bye ? 'LIBRE' : (t2?.nombre || 'POR DEFINIR');

  const canPick = !bye && isAdmin && onWinner && t1 && t2 && !winner;
  const w1 = winner === 1;
  const w2 = winner === 2;
  const winBg = gold ? 'rgba(212,184,74,0.2)' : 'rgba(122,184,64,0.18)';

  return (
    <div style={{
      position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h,
      background: bg, border: bd, borderRadius: 6,
      boxShadow: gold ? '0 10px 30px rgba(0,0,0,0.4)' : '0 6px 16px rgba(0,0,0,0.25)',
      overflow: 'hidden', zIndex: 10, boxSizing: 'border-box',
    }}>
      <div
        onClick={canPick ? () => onWinner(1) : undefined}
        title={canPick ? `Ganó ${label1}` : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
          height: teamH, boxSizing: 'border-box', borderBottom: `1px solid ${sep}`,
          background: w1 ? winBg : 'transparent',
          cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
        }}
      >
        {w1 && <span style={{ fontSize: '0.6rem', color: accent || '#7ab840', fontWeight: 800, flexShrink: 0 }}>▶</span>}
        <span style={{ width: 14, height: 10, background: '#3a4c20', borderRadius: 1, border: '1px solid #4a6030', flexShrink: 0 }} />
        <span style={{
          fontSize: '0.75rem', fontWeight: w1 ? 800 : 700, color: nc, fontFamily: "'Share Tech Mono',monospace",
          textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
          opacity: !t1 ? 0.4 : 1, flex: 1,
        }}>{label1}</span>
        {canPick && <span style={{ fontSize: '0.55rem', color: 'rgba(74,92,48,0.7)', flexShrink: 0 }}>✓</span>}
      </div>
      <div
        onClick={canPick ? () => onWinner(2) : undefined}
        title={canPick ? `Ganó ${label2}` : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
          height: teamH, boxSizing: 'border-box',
          background: w2 ? winBg : 'transparent',
          cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
          opacity: bye ? 0.4 : 1,
        }}
      >
        {w2 && <span style={{ fontSize: '0.6rem', color: accent || '#7ab840', fontWeight: 800, flexShrink: 0 }}>▶</span>}
        {!bye && <span style={{ width: 14, height: 10, background: '#3a4c20', borderRadius: 1, border: '1px solid #4a6030', flexShrink: 0 }} />}
        <span style={{
          fontSize: bye ? '0.62rem' : '0.75rem',
          fontWeight: w2 ? 800 : 700,
          color: bye ? '#556040' : nc,
          fontFamily: "'Share Tech Mono',monospace",
          textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
          fontStyle: bye ? 'italic' : 'normal',
          opacity: (!t2 && !bye) ? 0.4 : 1, flex: 1,
        }}>{label2}</span>
        {canPick && <span style={{ fontSize: '0.55rem', color: 'rgba(74,92,48,0.7)', flexShrink: 0 }}>✓</span>}
      </div>
    </div>
  );
};

const REP_CARD = ({ t1 = null, t2 = null, winner = null, label, isAdmin = false, onWinner = null }) => {
  const n1 = t1?.nombre || 'ESPERANDO';
  const n2 = t2?.nombre || 'ESPERANDO';
  const canPick = isAdmin && onWinner && t1 && t2 && !winner;
  const w1 = winner === 1;
  const w2 = winner === 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {label && (
        <span style={{ fontSize: '0.6rem', color: 'rgba(180,200,100,0.4)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Share Tech Mono',monospace" }}>
          {label}
        </span>
      )}
      <div style={{ width: 170, background: 'rgba(26,32,16,0.97)', border: '2px solid #4a5c30', borderRadius: 5, overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>
        <div
          onClick={canPick ? () => onWinner(1) : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px',
            height: 26, boxSizing: 'border-box', borderBottom: '1px solid #2a3818',
            background: w1 ? 'rgba(122,184,64,0.22)' : 'transparent',
            cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
        >
          {w1 && <span style={{ fontSize: '0.55rem', color: '#7ab840', fontWeight: 800, flexShrink: 0 }}>▶</span>}
          <span style={{ width: 10, height: 7, background: '#3a4c20', borderRadius: 1, border: '1px solid #4a6030', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: w1 ? 800 : 700, color: '#c8c8b8', fontFamily: "'Share Tech Mono',monospace", textTransform: 'uppercase', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', opacity: !t1 ? 0.4 : 1 }}>{n1}</span>
          {canPick && <span style={{ fontSize: '0.48rem', color: 'rgba(74,92,48,0.6)' }}>✓</span>}
        </div>
        <div
          onClick={canPick ? () => onWinner(2) : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px',
            height: 26, boxSizing: 'border-box',
            background: w2 ? 'rgba(122,184,64,0.22)' : 'transparent',
            cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
        >
          {w2 && <span style={{ fontSize: '0.55rem', color: '#7ab840', fontWeight: 800, flexShrink: 0 }}>▶</span>}
          <span style={{ width: 10, height: 7, background: '#3a4c20', borderRadius: 1, border: '1px solid #4a6030', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: w2 ? 800 : 700, color: '#c8c8b8', fontFamily: "'Share Tech Mono',monospace", textTransform: 'uppercase', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', opacity: !t2 ? 0.4 : 1 }}>{n2}</span>
          {canPick && <span style={{ fontSize: '0.48rem', color: 'rgba(74,92,48,0.6)' }}>✓</span>}
        </div>
      </div>
    </div>
  );
};

export default function LlavesCounter() {
  const [scale,   setScale]   = useState(1);
  const [bracket, setBracket] = useState(null);
  const isAdmin = !!getToken();

  const showRepPanel = !!bracket?.sorteado;

  useEffect(() => {
    const calc = () => {
      const availH = window.innerHeight - (bracket?.sorteado ? REP_PANEL_H : 0);
      const sx = window.innerWidth / 1920;
      const sy = availH / 1080;
      setScale(Math.min(sx, sy));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [bracket?.sorteado]);

  useEffect(() => {
    getBracket('counter').then(r => setBracket(r.data)).catch(() => {});
  }, []);

  const handleWinner = async (matchId, w) => {
    try {
      const r = await setGanador('counter', matchId, w);
      if (r.success) setBracket(r.data);
    } catch {}
  };

  const bk = (y1, y2, ym, x1, xm, x2) =>
    `M${x1},${y1} H${xm} V${y2} H${x1} M${xm},${ym} H${x2}`;
  const ls = { fill: 'none', stroke: 'rgba(74,92,48,0.9)', strokeWidth: 2.5 };

  const m = bracket?.matches || {};
  const cp = (id) => ({
    t1:      m[id]?.t1     ?? null,
    t2:      m[id]?.t2     ?? null,
    winner:  m[id]?.winner ?? null,
    bye:     m[id]?.bye    ?? false,
    isAdmin,
    onWinner: isAdmin && !m[id]?.bye ? (w) => handleWinner(id, w) : null,
  });

  const repEntries = Object.entries(m)
    .filter(([id, match]) => id.startsWith('rep_') && (match.t1 || match.t2))
    .sort(([a], [b]) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));

  const realPrevCount = Object.entries(m)
    .filter(([id, match]) => id.startsWith('prev_') && match.t1 && match.t2 && !match.bye)
    .length;
  const expectedRep = Math.ceil(realPrevCount / 2);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      backgroundColor: '#1a1e10',
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)',
      overflow: 'hidden',
    }}>

      {/* ── BRACKET PRINCIPAL ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'relative', width: 1920, height: 1080,
          transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0,
          backgroundColor: '#1a1e10',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)',
          fontFamily: "'Share Tech Mono',monospace",
          color: '#c8c8b8', overflow: 'hidden',
        }}>

          {/* HEADER */}
          <div style={{ position: 'absolute', top: 30, left: 40, right: 40, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
            <div style={{ height: 2, flex: 1, maxWidth: 300, background: 'linear-gradient(90deg,transparent,rgba(212,184,74,0.6))' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', letterSpacing: 5, color: '#d4b84a', fontWeight: 600 }}>TORNEO COUNTER LBZ</div>
              <h1 style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '2.4rem', letterSpacing: 6, margin: '2px 0 0 0', color: '#c8c8b8', textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>FASE ELIMINATORIA</h1>
              <div style={{ width: 90, height: 3, background: '#d4b84a', margin: '4px auto 0', borderRadius: 2 }} />
            </div>
            <div style={{ height: 2, flex: 1, maxWidth: 300, background: 'linear-gradient(90deg,rgba(212,184,74,0.6),transparent)' }} />
          </div>

          {/* SVG CONECTORES */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: 1920, height: 1080, zIndex: 1 }} viewBox="0 0 1920 1080">
            <path d={bk(YPR[0], YPR[1], YSF, R_PR_L, M_PRL, L_SF_L)} {...ls}/>
            <path d={`M${R_SF_L},${YSF} H${L_FI}`} {...ls}/>
            <path d={bk(YPR[0], YPR[1], YSF, L_PR_R, M_PRR, R_SF_R)} {...ls}/>
            <path d={`M${L_SF_R},${YSF} H${R_FI}`} {...ls}/>
          </svg>

          {/* TÍTULOS */}
          {[XPR_L, XPR_R].map((x) => (
            <div key={`pr${x}`} style={{
              position: 'absolute', top: TOP_PR, left: x - 100, width: 200, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Share Tech Mono',monospace", fontSize: '0.82rem', letterSpacing: 2,
              color: '#8a9a60', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 2,
            }}>PREVIAS</div>
          ))}
          {[XSF_L, XSF_R].map((x) => (
            <div key={`sf${x}`} style={{
              position: 'absolute', top: TOP_SF, left: x - 100, width: 200, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Share Tech Mono',monospace", fontSize: '0.9rem', letterSpacing: 2,
              color: '#8a9a60', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 2,
            }}>SEMIFINAL</div>
          ))}
          <div style={{ position: 'absolute', left: XC - 110, top: TOP_FINAL, width: 220, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono',monospace", fontSize: '1.1rem', letterSpacing: 3, color: '#d4b84a', textShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2 }}>GRAN FINAL</div>
          <div style={{ position: 'absolute', left: XC - 110, top: TOP_THIRD, width: 220, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono',monospace", fontSize: '1.1rem', letterSpacing: 3, color: '#c07830', textShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2 }}>3° PUESTO</div>

          {/* TARJETAS */}
          {YPR.map((y, i) => <CARD key={`PL${i}`} x={XPR_L} y={y} {...cp(`prev_l_${i}`)} />)}
          <CARD x={XSF_L} y={YSF} {...cp('sf_l')} />
          <CARD x={XC} y={YFIN} w={CF} h={84} gold   {...cp('final')} />
          <CARD x={XC} y={YTHD} w={CT} h={76} bronze {...cp('third')} />
          <CARD x={XSF_R} y={YSF} {...cp('sf_r')} />
          {YPR.map((y, i) => <CARD key={`PR${i}`} x={XPR_R} y={y} {...cp(`prev_r_${i}`)} />)}

        </div>
      </div>

      {/* ── PANEL REPECHAJE ───────────────────────────────────────────────── */}
      {showRepPanel && (
        <div style={{
          flexShrink: 0,
          height: REP_PANEL_H,
          backgroundColor: '#111508',
          borderTop: '2px solid #d4b84a',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 160, flexShrink: 0, height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRight: '1px solid rgba(212,184,74,0.3)',
            padding: '0 16px', boxSizing: 'border-box',
          }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '1.1rem', letterSpacing: 4, color: '#d4b84a', lineHeight: 1 }}>
              REPECHAJE
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', color: 'rgba(180,200,100,0.4)', letterSpacing: 2, marginTop: 4, textAlign: 'center' }}>
              SEGUNDA<br/>OPORTUNIDAD
            </div>
          </div>

          <div style={{
            flex: 1, height: '100%',
            display: 'flex', alignItems: 'center',
            gap: 16, padding: '0 24px',
            overflowX: 'auto',
          }}>
            {repEntries.length === 0 ? (
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem', color: 'rgba(180,200,100,0.25)', letterSpacing: 1 }}>
                Los equipos que pierdan en previas aparecerán aquí ({expectedRep} {expectedRep === 1 ? 'partido' : 'partidos'} esperados)
              </span>
            ) : (
              repEntries.map(([id, match], idx) => (
                <REP_CARD
                  key={id}
                  t1={match.t1}
                  t2={match.t2}
                  winner={match.winner}
                  label={`Partido ${idx + 1}`}
                  isAdmin={isAdmin}
                  onWinner={isAdmin ? (w) => handleWinner(id, w) : null}
                />
              ))
            )}
            {Array.from({ length: Math.max(0, expectedRep - repEntries.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.6rem', color: 'rgba(180,200,100,0.2)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Share Tech Mono',monospace" }}>
                  Partido {repEntries.length + i + 1}
                </span>
                <div style={{ width: 170, height: 52, background: 'rgba(74,92,48,0.08)', border: '1.5px dashed rgba(74,92,48,0.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(180,200,100,0.2)', fontFamily: "'Share Tech Mono',monospace" }}>POR DISPUTAR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>
    </div>
  );
}
