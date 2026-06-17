import { useState, useEffect } from 'react';
import { getBracket, setGanador } from '../api/bracket';
import { getToken } from '../api/auth';

const YQF  = [380, 828];
const YSF  = 604;
const YFIN = 604;
const YTHD = 738;

const XQF_L = 380, XSF_L = 660, XC = 960, XSF_R = 1260, XQF_R = 1540;
const XSL = XSF_L, XSR = XSF_R;
const SW = 180, SHW = 90;
const CF = 210, CHF = 105;
const CT = 195;

const R_QF_L = XQF_L + SHW;             // 470
const L_SF_L = XSF_L - SHW;             // 570
const M_QFL  = Math.round((R_QF_L + L_SF_L) / 2);  // 520

const R_SF_L = XSF_L + SHW;             // 750
const L_FI   = XC    - CHF;             // 855
const R_FI   = XC    + CHF;             // 1065
const L_SF_R = XSF_R - SHW;             // 1170

const R_SF_R = XSF_R + SHW;             // 1350
const L_QF_R = XQF_R - SHW;             // 1450
const M_QFR  = Math.round((L_QF_R + R_SF_R) / 2);  // 1400

const R_SL = R_SF_L, L_SR = L_SF_R;
const M_SL_FIN = Math.round((R_SL + L_FI) / 2);
const M_SR_FIN = Math.round((R_FI + L_SR) / 2);

const titleTop = (firstY, cardH, titleH = 24) => firstY - cardH / 2 - 8 - titleH;
const TOP_QF    = titleTop(YQF[0], 58, 24);
const TOP_SF    = titleTop(YSF,    58, 24);
const TOP_FINAL = titleTop(YFIN,   84, 26);
const TOP_THIRD = titleTop(YTHD,   76, 26);

const CARD = ({ x, y, w = SW, h = 58, gold = false, bronze = false,
                t1 = null, t2 = null, winner = null, isAdmin = false, onWinner = null }) => {
  const accent = gold ? '#d4b84a' : bronze ? '#c07830' : null;
  const bd = gold ? '3px solid #d4b84a' : bronze ? '2px solid #c07830' : '2px solid #4a5c30';
  const bg = gold ? '#1e2a10' : bronze ? '#1a2010' : 'rgba(26,32,16,0.97)';
  const nc = bronze ? '#c8b870' : '#c8c8b8';
  const sep = bronze ? '#3a3010' : '#2a3818';
  const teamH = h / 2;

  const label1 = t1?.nombre || 'POR DEFINIR';
  const label2 = t2?.nombre || 'POR DEFINIR';

  const canPick = isAdmin && onWinner && t1 && t2 && !winner;
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
          fontSize: '0.75rem', fontWeight: w1 ? 800 : 700, color: nc, flex: 1,
          textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
          opacity: !t1 ? 0.4 : 1,
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
        }}
      >
        {w2 && <span style={{ fontSize: '0.6rem', color: accent || '#7ab840', fontWeight: 800, flexShrink: 0 }}>▶</span>}
        <span style={{ width: 14, height: 10, background: '#3a4c20', borderRadius: 1, border: '1px solid #4a6030', flexShrink: 0 }} />
        <span style={{
          fontSize: '0.75rem', fontWeight: w2 ? 800 : 700, color: nc, flex: 1,
          textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
          opacity: !t2 ? 0.4 : 1,
        }}>{label2}</span>
        {canPick && <span style={{ fontSize: '0.55rem', color: 'rgba(74,92,48,0.7)', flexShrink: 0 }}>✓</span>}
      </div>
    </div>
  );
};

export default function LlavesCounter() {
  const [scale,   setScale]   = useState(1);
  const [bracket, setBracket] = useState(null);
  const isAdmin = !!getToken();

  useEffect(() => {
    const calc = () => {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      setScale(Math.min(sx, sy));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

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
    isAdmin,
    onWinner: isAdmin ? (w) => handleWinner(id, w) : null,
  });

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1a1e10', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)', backgroundSize: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{
        position: 'relative', width: 1920, height: 1080,
        transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0,
        backgroundColor: '#1a1e10',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)',
        backgroundSize: 'auto',
        fontFamily: "'Share Tech Mono', monospace",
        color: '#c8c8b8', overflow: 'hidden',
      }}>

        {/* HEADER */}
        <div style={{ position: 'absolute', top: 30, left: 40, right: 40, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
          <div style={{ height: 2, flex: 1, maxWidth: 300, background: 'linear-gradient(90deg,transparent,rgba(212,184,74,0.6))' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', letterSpacing: 5, color: '#d4b84a', fontWeight: 600 }}>TORNEO COUNTER LBZ</div>
            <h1 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2.4rem', letterSpacing: 6, margin: '2px 0 0 0', color: '#c8c8b8', textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>FASE ELIMINATORIA</h1>
            <div style={{ width: 90, height: 3, background: '#d4b84a', margin: '4px auto 0', borderRadius: 2 }} />
          </div>
          <div style={{ height: 2, flex: 1, maxWidth: 300, background: 'linear-gradient(90deg,rgba(212,184,74,0.6),transparent)' }} />
        </div>

        {/* SVG CONNECTORS */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: 1920, height: 1080, zIndex: 1 }} viewBox="0 0 1920 1080">
          <path d={bk(YQF[0], YQF[1], YSF, R_QF_L, M_QFL,  L_SF_L)} {...ls}/>
          <path d={`M${R_SL},${YSF} H${L_FI}`} {...ls}/>
          <path d={bk(YQF[0], YQF[1], YSF, L_QF_R, M_QFR, R_SF_R)} {...ls}/>
          <path d={`M${L_SR},${YSF} H${R_FI}`} {...ls}/>
        </svg>

        {/* TITLES */}
        {[XQF_L, XQF_R].map((x) => (
          <div key={`qf${x}`} style={{
            position: 'absolute', top: TOP_QF, left: x - 100, width: 200, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.82rem', letterSpacing: 2,
            color: '#8a9a60', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 2,
          }}>CUARTOS DE FINAL</div>
        ))}
        {[XSL, XSR].map((x) => (
          <div key={`sf${x}`} style={{
            position: 'absolute', top: TOP_SF, left: x - 100, width: 200, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', letterSpacing: 2,
            color: '#8a9a60', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 2,
          }}>SEMIFINAL</div>
        ))}

        <div style={{
          position: 'absolute', left: XC - 110, top: TOP_FINAL, width: 220, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', letterSpacing: 3,
          color: '#d4b84a', textShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2,
        }}>GRAN FINAL</div>

        <div style={{
          position: 'absolute', left: XC - 110, top: TOP_THIRD, width: 220, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', letterSpacing: 3,
          color: '#c07830', textShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2,
        }}>3° PUESTO</div>

        {/* MATCH CARDS */}
        {YQF.map((y, i) => <CARD key={`QL${i}`} x={XQF_L} y={y} {...cp(`qf_l_${i}`)} />)}
        <CARD x={XSL} y={YSF} {...cp('sf_l')} />
        <CARD x={XC} y={YFIN} w={CF} h={84} gold   {...cp('final')} />
        <CARD x={XC} y={YTHD} w={CT} h={76} bronze {...cp('third')} />
        <CARD x={XSR} y={YSF} {...cp('sf_r')} />
        {YQF.map((y, i) => <CARD key={`QR${i}`} x={XQF_R} y={y} {...cp(`qf_r_${i}`)} />)}

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>
    </div>
  );
}
