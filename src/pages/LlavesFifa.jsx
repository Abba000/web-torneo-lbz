import { useState, useEffect } from 'react';
import { getBracket, setGanador } from '../api/bracket';
import { getToken } from '../api/auth';

// ─── POSICIONES Y ────────────────────────────────────────────────────────────
const YOCT = [212, 324, 436, 548, 660, 772, 884, 996];
const YQF  = [268, 492, 716, 940];
const YCF  = [380, 828];
const YSF  = 604;
const YFIN = 604;
const YTHD = 738;

// ─── POSICIONES X ────────────────────────────────────────────────────────────
const XOL = 160, XQL = 360, XCL = 560, XSL = 760;
const XC  = 960;
const XSR = 1160, XCR = 1360, XQR = 1560, XOR = 1760;

const CW = 150, HW = 75;
const CF = 170, HF = 85;
const CT = 155;

const R_OL = XOL + HW;
const L_QL = XQL - HW, R_QL = XQL + HW;
const L_CL = XCL - HW, R_CL = XCL + HW;
const L_SL = XSL - HW, R_SL = XSL + HW;
const L_FI = XC  - HF, R_FI = XC  + HF;
const L_SR = XSR - HW, R_SR = XSR + HW;
const L_CR = XCR - HW, R_CR = XCR + HW;
const L_QR = XQR - HW, R_QR = XQR + HW;
const L_OR = XOR - HW;

const M_OL_QL = Math.round((R_OL + L_QL) / 2);
const M_QL_CL = Math.round((R_QL + L_CL) / 2);
const M_CL_SL = Math.round((R_CL + L_SL) / 2);
const M_CR_SR = Math.round((R_SR + L_CR) / 2);
const M_QR_CR = Math.round((R_CR + L_QR) / 2);
const M_OR_QR = Math.round((R_QR + L_OR) / 2);

const titleTop = (firstY, cardH, titleH = 24) => firstY - cardH / 2 - 8 - titleH;

const ROUND_TITLES = [
  { label: '16AVOS',           x: XOL, top: titleTop(YOCT[0], 58), fs: '0.8rem'  },
  { label: 'OCTAVOS',          x: XQL, top: titleTop(YQF[0],  58), fs: '0.84rem' },
  { label: 'CUARTOS DE FINAL', x: XCL, top: titleTop(YCF[0],  58), fs: '0.84rem' },
  { label: 'SEMIFINAL',        x: XSL, top: titleTop(YSF,     58), fs: '0.9rem'  },
  { label: 'SEMIFINAL',        x: XSR, top: titleTop(YSF,     58), fs: '0.9rem'  },
  { label: 'CUARTOS DE FINAL', x: XCR, top: titleTop(YCF[0],  58), fs: '0.84rem' },
  { label: 'OCTAVOS',          x: XQR, top: titleTop(YQF[0],  58), fs: '0.84rem' },
  { label: '16AVOS',           x: XOR, top: titleTop(YOCT[0], 58), fs: '0.8rem'  },
];

const TOP_FINAL = titleTop(YFIN, 84, 26);
const TOP_THIRD = titleTop(YTHD, 76, 26);

// ─── TARJETA DE PARTIDO (bracket principal) ──────────────────────────────────
const CARD = ({ x, y, w = CW, h = 58, gold = false, bronze = false, bye = false,
                p1 = null, p2 = null, winner = null, isAdmin = false, onWinner = null }) => {
  if (!p1 && !p2 && !bye) return null;

  const accent = gold ? '#dfb74c' : bronze ? '#c07830' : null;
  const bd = gold ? '3px solid #dfb74c' : bronze ? '2px solid #c07830' : '2px solid #fff';
  const bg = gold ? '#fff' : bronze ? 'rgba(255,255,255,0.93)' : 'rgba(255,255,255,0.95)';
  const nc = bronze ? '#3a2a10' : '#224422';
  const sep = bronze ? '#e8ddd0' : '#e2e8e2';
  const teamH = h / 2;

  const label1 = p1 ? (p1.nickname || p1.nombre || 'POR DEFINIR') : 'POR DEFINIR';
  const label2 = bye ? 'LIBRE' : (p2 ? (p2.nickname || p2.nombre || 'POR DEFINIR') : 'POR DEFINIR');

  const canPick = isAdmin && onWinner && (p1 || p2) && !winner;
  const w1 = winner === 1;
  const w2 = winner === 2;
  const winBg = gold ? 'rgba(223,183,76,0.2)' : 'rgba(100,200,100,0.18)';

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
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px',
          height: teamH, boxSizing: 'border-box', borderBottom: `1px solid ${sep}`,
          background: w1 ? winBg : 'transparent',
          cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
        }}
      >
        {w1 && <span style={{ fontSize: '0.6rem', color: accent || '#4caf50', fontWeight: 800, flexShrink: 0 }}>▶</span>}
        <span style={{ width: 14, height: 10, background: '#ddd', borderRadius: 1, border: '1px solid #ccc', flexShrink: 0 }} />
        <span style={{
          fontSize: '0.72rem', fontWeight: w1 ? 800 : 700, color: nc, flex: 1,
          textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
          opacity: !p1 ? 0.4 : 1,
        }}>{label1}</span>
        {canPick && <span style={{ fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>✓</span>}
      </div>
      <div
        onClick={canPick ? () => onWinner(2) : undefined}
        title={canPick ? `Ganó ${label2}` : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px',
          height: teamH, boxSizing: 'border-box',
          background: w2 ? winBg : 'transparent',
          cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
          opacity: bye ? 0.4 : 1,
        }}
      >
        {w2 && <span style={{ fontSize: '0.6rem', color: accent || '#4caf50', fontWeight: 800, flexShrink: 0 }}>▶</span>}
        {!bye && <span style={{ width: 14, height: 10, background: '#ddd', borderRadius: 1, border: '1px solid #ccc', flexShrink: 0 }} />}
        <span style={{
          fontSize: bye ? '0.62rem' : '0.72rem',
          fontWeight: w2 ? 800 : 700,
          color: bye ? '#999' : nc, flex: 1,
          textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
          fontStyle: bye ? 'italic' : 'normal',
          opacity: (!p2 && !bye) ? 0.4 : 1,
        }}>{label2}</span>
        {canPick && <span style={{ fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>✓</span>}
      </div>
    </div>
  );
};

// ─── TARJETA COMPACTA DE REPECHAJE ───────────────────────────────────────────
const REP_CARD = ({ p1 = null, p2 = null, winner = null, label, isAdmin = false, onWinner = null }) => {
  const n1 = p1 ? (p1.nickname || p1.nombre || '?') : 'ESPERANDO';
  const n2 = p2 ? (p2.nickname || p2.nombre || '?') : 'ESPERANDO';
  const canPick = isAdmin && onWinner && (p1 || p2) && !winner;
  const w1 = winner === 1;
  const w2 = winner === 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {label && (
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Barlow Condensed',sans-serif" }}>
          {label}
        </span>
      )}
      <div style={{ width: 170, background: 'rgba(255,255,255,0.95)', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 5, overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.35)' }}>
        <div
          onClick={canPick ? () => onWinner(1) : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px',
            height: 26, boxSizing: 'border-box', borderBottom: '1px solid #e2e8e2',
            background: w1 ? 'rgba(100,200,100,0.22)' : 'transparent',
            cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
        >
          {w1 && <span style={{ fontSize: '0.55rem', color: '#4caf50', fontWeight: 800, flexShrink: 0 }}>▶</span>}
          <span style={{ width: 10, height: 7, background: '#ddd', borderRadius: 1, border: '1px solid #ccc', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: w1 ? 800 : 700, color: '#224422', fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', opacity: !p1 ? 0.4 : 1 }}>{n1}</span>
          {canPick && <span style={{ fontSize: '0.48rem', color: 'rgba(0,0,0,0.25)' }}>✓</span>}
        </div>
        <div
          onClick={canPick ? () => onWinner(2) : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px',
            height: 26, boxSizing: 'border-box',
            background: w2 ? 'rgba(100,200,100,0.22)' : 'transparent',
            cursor: canPick ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
        >
          {w2 && <span style={{ fontSize: '0.55rem', color: '#4caf50', fontWeight: 800, flexShrink: 0 }}>▶</span>}
          <span style={{ width: 10, height: 7, background: '#ddd', borderRadius: 1, border: '1px solid #ccc', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: w2 ? 800 : 700, color: '#224422', fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', opacity: !p2 ? 0.4 : 1 }}>{n2}</span>
          {canPick && <span style={{ fontSize: '0.48rem', color: 'rgba(0,0,0,0.25)' }}>✓</span>}
        </div>
      </div>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
const REP_PANEL_H = 130; // altura fija del panel de repechaje en px

export default function LlavesFifa() {
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
    getBracket('fifa').then(r => setBracket(r.data)).catch(() => {});
  }, []);

  const handleWinner = async (matchId, w) => {
    try {
      const r = await setGanador('fifa', matchId, w);
      if (r.success) setBracket(r.data);
    } catch {}
  };

  const bk = (y1, y2, ym, x1, xm, x2) =>
    `M${x1},${y1} H${xm} V${y2} H${x1} M${xm},${ym} H${x2}`;
  const ls = { fill: 'none', stroke: 'rgba(255,255,255,0.75)', strokeWidth: 2.5 };

  const m = bracket?.matches || {};

  const cp = (id) => ({
    p1:      m[id]?.p1     ?? null,
    p2:      m[id]?.p2     ?? null,
    winner:  m[id]?.winner ?? null,
    bye:     m[id]?.bye    ?? false,
    isAdmin,
    onWinner: isAdmin && !m[id]?.bye ? (w) => handleWinner(id, w) : null,
  });

  const repEntries = Object.entries(m)
    .filter(([id, match]) => id.startsWith('rep_') && (match.p1 || match.p2))
    .sort(([a], [b]) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));

  // Cuántos partidos de repechaje se esperan (basado en partidos reales de 16avos)
  const realOctCount = Object.entries(m)
    .filter(([id, match]) => (id.startsWith('oct_l_') || id.startsWith('oct_r_')) && match.p1 && match.p2 && !match.bye)
    .length;
  const expectedRep = Math.ceil(realOctCount / 2);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      backgroundColor: '#244924',
      backgroundImage: 'linear-gradient(90deg,rgba(255,255,255,0.03) 50%,transparent 50%),linear-gradient(rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.25) 100%)',
      backgroundSize: '160px 100%,100% 100%',
      overflow: 'hidden',
    }}>

      {/* ── BRACKET PRINCIPAL ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'relative', width: 1920, height: 1080,
          transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0,
          fontFamily: "'Barlow Condensed',sans-serif", color: '#fff', overflow: 'hidden',
        }}>

          {/* HEADER */}
          <div style={{ position: 'absolute', top: 30, left: 40, right: 40, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
            <div style={{ height: 2, flex: 1, maxWidth: 300, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.7))' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', letterSpacing: 5, color: '#dfb74c', fontWeight: 600 }}>TORNEO FIFA LBZ</div>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.8rem', letterSpacing: 6, margin: '2px 0 0 0', color: '#fff', textShadow: '0 3px 6px rgba(0,0,0,0.3)' }}>FASE ELIMINATORIA</h1>
              <div style={{ width: 90, height: 3, background: '#dfb74c', margin: '4px auto 0', borderRadius: 2 }} />
            </div>
            <div style={{ height: 2, flex: 1, maxWidth: 300, background: 'linear-gradient(90deg,rgba(255,255,255,0.7),transparent)' }} />
          </div>

          {/* SVG CONECTORES */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: 1920, height: 1080, zIndex: 1 }} viewBox="0 0 1920 1080">
            {[[YOCT[0],YOCT[1],YQF[0]],[YOCT[2],YOCT[3],YQF[1]],[YOCT[4],YOCT[5],YQF[2]],[YOCT[6],YOCT[7],YQF[3]]].map(([y1,y2,ym],i)=>
              <path key={`oql${i}`} d={bk(y1,y2,ym,R_OL,M_OL_QL,L_QL)} {...ls}/>)}
            {[[YQF[0],YQF[1],YCF[0]],[YQF[2],YQF[3],YCF[1]]].map(([y1,y2,ym],i)=>
              <path key={`qcl${i}`} d={bk(y1,y2,ym,R_QL,M_QL_CL,L_CL)} {...ls}/>)}
            <path d={bk(YCF[0],YCF[1],YSF,R_CL,M_CL_SL,L_SL)} {...ls}/>
            <path d={`M${R_SL},${YSF} H${L_FI}`} {...ls}/>
            {[[YOCT[0],YOCT[1],YQF[0]],[YOCT[2],YOCT[3],YQF[1]],[YOCT[4],YOCT[5],YQF[2]],[YOCT[6],YOCT[7],YQF[3]]].map(([y1,y2,ym],i)=>
              <path key={`oqr${i}`} d={bk(y1,y2,ym,L_OR,M_OR_QR,R_QR)} {...ls}/>)}
            {[[YQF[0],YQF[1],YCF[0]],[YQF[2],YQF[3],YCF[1]]].map(([y1,y2,ym],i)=>
              <path key={`qcr${i}`} d={bk(y1,y2,ym,L_QR,M_QR_CR,R_CR)} {...ls}/>)}
            <path d={bk(YCF[0],YCF[1],YSF,L_CR,M_CR_SR,R_SR)} {...ls}/>
            <path d={`M${L_SR},${YSF} H${R_FI}`} {...ls}/>
          </svg>

          {/* TÍTULOS DE RONDA */}
          {ROUND_TITLES.map(({ label, x, top, fs }) => (
            <div key={`${label}${x}`} style={{
              position: 'absolute', top, left: x - 100, width: 200, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue',sans-serif", fontSize: fs, letterSpacing: 2,
              color: 'rgba(255,255,255,0.88)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 2,
            }}>{label}</div>
          ))}

          <div style={{ position: 'absolute', left: XC-110, top: TOP_FINAL, width: 220, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', letterSpacing: 3, color: '#dfb74c', textShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2 }}>GRAN FINAL</div>
          <div style={{ position: 'absolute', left: XC-110, top: TOP_THIRD, width: 220, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', letterSpacing: 3, color: '#c07830', textShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2 }}>3° PUESTO</div>

          {/* TARJETAS */}
          {YOCT.map((y,i) => <CARD key={`OL${i}`} x={XOL} y={y} {...cp(`oct_l_${i}`)} />)}
          {YQF.map((y,i)  => <CARD key={`QL${i}`} x={XQL} y={y} {...cp(`qf_l_${i}`)} />)}
          {YCF.map((y,i)  => <CARD key={`CL${i}`} x={XCL} y={y} {...cp(`cf_l_${i}`)} />)}
          <CARD x={XSL} y={YSF} {...cp('sf_l')} />
          <CARD x={XC} y={YFIN} w={CF} h={84} gold   {...cp('final')} />
          <CARD x={XC} y={YTHD} w={CT} h={76} bronze {...cp('third')} />
          <CARD x={XSR} y={YSF} {...cp('sf_r')} />
          {YCF.map((y,i)  => <CARD key={`CR${i}`} x={XCR} y={y} {...cp(`cf_r_${i}`)} />)}
          {YQF.map((y,i)  => <CARD key={`QR${i}`} x={XQR} y={y} {...cp(`qf_r_${i}`)} />)}
          {YOCT.map((y,i) => <CARD key={`OR${i}`} x={XOR} y={y} {...cp(`oct_r_${i}`)} />)}

        </div>
      </div>

      {/* ── PANEL REPECHAJE (fijo abajo, solo cuando N > 16) ──────────────── */}
      {showRepPanel && (
        <div style={{
          flexShrink: 0,
          height: REP_PANEL_H,
          backgroundColor: '#172e17',
          borderTop: '2px solid #dfb74c',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflow: 'hidden',
        }}>
          {/* Título */}
          <div style={{
            width: 160, flexShrink: 0, height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRight: '1px solid rgba(223,183,76,0.3)',
            padding: '0 16px', boxSizing: 'border-box',
          }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem', letterSpacing: 4, color: '#dfb74c', lineHeight: 1 }}>
              REPECHAJE
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', letterSpacing: 2, marginTop: 4, textAlign: 'center' }}>
              SEGUNDA<br/>OPORTUNIDAD
            </div>
          </div>

          {/* Partidos */}
          <div style={{
            flex: 1, height: '100%',
            display: 'flex', alignItems: 'center',
            gap: 16, padding: '0 24px',
            overflowX: 'auto',
          }}>
            {repEntries.length === 0 ? (
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
                Los jugadores que pierdan en 16avos aparecerán aquí ({expectedRep} {expectedRep === 1 ? 'partido' : 'partidos'} esperados)
              </span>
            ) : (
              repEntries.map(([id, match], idx) => (
                <REP_CARD
                  key={id}
                  p1={match.p1}
                  p2={match.p2}
                  winner={match.winner}
                  label={`Partido ${idx + 1}`}
                  isAdmin={isAdmin}
                  onWinner={isAdmin ? (w) => handleWinner(id, w) : null}
                />
              ))
            )}

            {/* Slots vacíos (partidos aún no disponibles) */}
            {Array.from({ length: Math.max(0, expectedRep - repEntries.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Barlow Condensed',sans-serif" }}>
                  Partido {repEntries.length + i + 1}
                </span>
                <div style={{ width: 170, height: 52, background: 'rgba(255,255,255,0.06)', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: "'Barlow Condensed',sans-serif" }}>POR DISPUTAR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&display=swap');`}</style>
    </div>
  );
}
