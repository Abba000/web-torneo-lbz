import React from 'react';

export default function LlavesFifa() {

  const Match = ({ id }) => {
    return (
      <div className="match">
        <div className="team">
          <span className="team-flag"></span>
          <span className="team-name">POR DEFINIR</span>
          <span className="team-score">-</span>
        </div>
        <div className="team">
          <span className="team-flag"></span>
          <span className="team-name">POR DEFINIR</span>
          <span className="team-score">-</span>
        </div>
      </div>
    );
  };

  return (
    <div className="page-1080p">
      {/* HEADER COPA */}
      <div className="header">
        <div className="header-deco left"></div>
        <div className="header-center">
          <div className="header-sub">FIFA WORLD CUP 2026</div>
          <h1 className="header-title">FASE ELIMINATORIA</h1>
          <div className="header-line"></div>
        </div>
        <div className="header-deco right"></div>
      </div>

      {/* LIENZO DE JUEGO */}
      <div className="bracket-canvas">

        {/* ====== OCTAVOS IZQUIERDA ====== */}
        <div className="round-col">
          <div className="round-title">OCTAVOS DE FINAL</div>
          <div className="matches-area dist-oct">
            <div className="match-wrapper line-drop-left"><Match id="ol0" /></div>
            <div className="match-wrapper line-climb-left"><Match id="ol1" /></div>
            <div className="match-wrapper line-drop-left"><Match id="ol2" /></div>
            <div className="match-wrapper line-climb-left"><Match id="ol3" /></div>
            <div className="match-wrapper line-drop-left"><Match id="ol4" /></div>
            <div className="match-wrapper line-climb-left"><Match id="ol5" /></div>
            <div className="match-wrapper line-drop-left"><Match id="ol6" /></div>
            <div className="match-wrapper line-climb-left"><Match id="ol7" /></div>
          </div>
        </div>

        {/* ====== CUARTOS IZQUIERDA ====== */}
        <div className="round-col">
          <div className="round-title">CUARTOS</div>
          <div className="matches-area dist-qf">
            <div className="match-wrapper line-drop-left"><Match id="ql0" /></div>
            <div className="match-wrapper line-climb-left"><Match id="ql1" /></div>
            <div className="match-wrapper line-drop-left"><Match id="ql2" /></div>
            <div className="match-wrapper line-climb-left"><Match id="ql3" /></div>
          </div>
        </div>

        {/* ====== SEMIFINAL IZQUIERDA ====== */}
        <div className="round-col">
          <div className="round-title">SEMIFINAL</div>
          <div className="matches-area dist-sf">
            <div className="match-wrapper line-to-final-left"><Match id="sl0" /></div>
            <div className="match-wrapper line-to-final-left"><Match id="sl1" /></div>
          </div>
        </div>

        {/* ====== GRAN FINAL CENTRAL ====== */}
        <div className="round-col central-col">
          <div className="round-title-final">GRAN FINAL</div>
          <div className="final-center-box">
            <div className="match match-final">
              <div className="team">
                <span className="team-flag"></span>
                <span className="team-name">POR DEFINIR</span>
                <span className="team-score">-</span>
              </div>
              <div className="vs-divider">VS</div>
              <div className="team">
                <span className="team-flag"></span>
                <span className="team-name">POR DEFINIR</span>
                <span className="team-score">-</span>
              </div>
            </div>
            <div className="trophy">🏆</div>
          </div>
        </div>

        {/* ====== SEMIFINAL DERECHA ====== */}
        <div className="round-col">
          <div className="round-title">SEMIFINAL</div>
          <div className="matches-area dist-sf">
            <div className="match-wrapper line-to-final-right"><Match id="sr0" /></div>
            <div className="match-wrapper line-to-final-right"><Match id="sr1" /></div>
          </div>
        </div>

        {/* ====== CUARTOS DERECHA ====== */}
        <div className="round-col">
          <div className="round-title">CUARTOS</div>
          <div className="matches-area dist-qf">
            <div className="match-wrapper line-drop-right"><Match id="qr0" /></div>
            <div className="match-wrapper line-climb-right"><Match id="qr1" /></div>
            <div className="match-wrapper line-drop-right"><Match id="qr2" /></div>
            <div className="match-wrapper line-climb-right"><Match id="qr3" /></div>
          </div>
        </div>

        {/* ====== OCTAVOS DERECHA ====== */}
        <div className="round-col">
          <div className="round-title">OCTAVOS DE FINAL</div>
          <div className="matches-area dist-oct">
            <div className="match-wrapper line-drop-right"><Match id="or0" /></div>
            <div className="match-wrapper line-climb-right"><Match id="or1" /></div>
            <div className="match-wrapper line-drop-right"><Match id="or2" /></div>
            <div className="match-wrapper line-climb-right"><Match id="or3" /></div>
            <div className="match-wrapper line-drop-right"><Match id="or4" /></div>
            <div className="match-wrapper line-climb-right"><Match id="or5" /></div>
            <div className="match-wrapper line-drop-right"><Match id="or6" /></div>
            <div className="match-wrapper line-climb-right"><Match id="or7" /></div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&display=swap');

        /* FONDO: Simulación de césped sintético premium con patrón de franjas verticales */
        .page-1080p {
          width: 1920px;
          height: 1080px;
          background-color: #244924;
          background-image: 
            linear-gradient(90deg, rgba(255,255,255,0.03) 50%, transparent 50%),
            linear-gradient(rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.25) 100%);
          background-size: 160px 100%, 100% 100%; /* Tamaño de las franjas de la cancha */
          box-sizing: border-box;
          padding: 30px 40px;
          font-family: 'Barlow Condensed', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden; 
          margin: 0 auto;
          box-shadow: inset 0 0 150px rgba(0,0,0,0.5); /* Sombra perimetral de iluminación */
        }

        /* ===== HEADER EN BLANCO Y ORO ===== */
        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          height: 90px;
          width: 100%;
        }
        .header-deco { height: 2px; flex: 1; max-width: 300px; }
        .header-deco.left { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7)); }
        .header-deco.right { background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent); }
        .header-center { text-align: center; }
        .header-sub { font-size: 0.85rem; letter-spacing: 5px; color: #dfb74c; font-weight: 600; margin: 0; }
        .header-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.8rem;
          letter-spacing: 6px;
          margin: 2px 0 0 0;
          color: #ffffff;
          text-shadow: 0 3px 6px rgba(0,0,0,0.3);
        }
        .header-line { width: 90px; height: 3px; background: #dfb74c; margin: 4px auto 0; border-radius: 2px; }

        /* ===== GRILLA FIJA DE LLAVES ===== */
        .bracket-canvas {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          width: 100%;
          height: 900px;
        }

        .round-col {
          display: flex;
          flex-direction: column;
          width: 240px;
          height: 100%;
        }
        .central-col {
          width: 280px;
        }

        .round-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.95rem;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.85);
          text-align: center;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .round-title-final {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.25rem;
          letter-spacing: 3px;
          color: #dfb74c;
          text-align: center;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }

        .matches-area {
          display: flex;
          flex-direction: column;
          height: 860px;
          position: relative;
        }

        /* Alineaciones exactas */
        .dist-oct { justify-content: flex-start; padding-top: 18px; gap: 40px; }
        .dist-qf  { justify-content: flex-start; padding-top: 68px; gap: 156px; }
        .dist-sf  { justify-content: flex-start; padding-top: 166px; gap: 388px; }

        .match-wrapper {
          position: relative;
          width: 100%;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== CUADROS DE PARTIDO: BLANCOS MODERNOS ===== */
        .match {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #ffffff;
          border-radius: 6px;
          width: 150px;
          height: 58px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
          z-index: 10;
          overflow: hidden;
          user-select: none;
        }

        .match:hover {
          border-color: #dfb74c;
          box-shadow: 0 0 20px rgba(255,255,255,0.4);
        }

        .team { display: flex; align-items: center; gap: 8px; padding: 0 10px; height: 27px; box-sizing: border-box; }
        .team:first-child { border-bottom: 1px solid #e2e8e2; }
        .team-flag { width: 16px; height: 11px; background: #ddd; border-radius: 1px; border: 1px solid #ccc; flex-shrink: 0; }
        .team-name { font-size: 0.72rem; font-weight: 700; color: #224422; flex: 1; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
        .team-score { font-size: 0.8rem; font-weight: 800; color: #111; min-width: 14px; text-align: center; }

        /* ==================== LÍNEAS BLANCAS DE CAL (PRECISIÓN) ==================== */
        
        /* Líneas pintadas de blanco tiza/cal sobre el pasto */
        const-lineas {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 0 4px rgba(0,0,0,0.15);
        }

        /* --- LADO IZQUIERDO --- */
        .line-drop-left::after, .line-climb-left::after {
          content: ''; position: absolute; right: 0; top: 50%; width: 45px; height: 3px; background: rgba(255,255,255,0.75); z-index: 1;
        }
        .dist-oct .line-drop-left::before {
          content: ''; position: absolute; right: 0; top: 50%; width: 3px; height: 50px; background: rgba(255,255,255,0.75);
        }
        .dist-oct .line-climb-left::before {
          content: ''; position: absolute; right: 0; bottom: 50%; width: 3px; height: 50px; background: rgba(255,255,255,0.75);
        }
        .dist-qf .line-drop-left::before {
          content: ''; position: absolute; right: 0; top: 50%; width: 3px; height: 108px; background: rgba(255,255,255,0.75);
        }
        .dist-qf .line-climb-left::before {
          content: ''; position: absolute; right: 0; bottom: 50%; width: 3px; height: 108px; background: rgba(255,255,255,0.75);
        }
        
        .line-to-final-left::after {
          content: ''; position: absolute; right: -65px; top: 50%; width: 110px; height: 3px; background: rgba(255,255,255,0.75); z-index: 1;
        }
        .dist-sf .line-to-final-left::before {
          content: ''; position: absolute; right: -65px; width: 3px; background: rgba(255,255,255,0.75);
        }
        .dist-sf .line-to-final-left:nth-child(1)::before { top: 50%; height: 224px; }
        .dist-sf .line-to-final-left:nth-child(2)::before { bottom: 50%; height: 224px; }

        /* --- LADO DERECHO --- */
        .line-drop-right::after, .line-climb-right::after {
          content: ''; position: absolute; left: 0; top: 50%; width: 45px; height: 3px; background: rgba(255,255,255,0.75); z-index: 1;
        }
        .dist-oct .line-drop-right::before {
          content: ''; position: absolute; left: 0; top: 50%; width: 3px; height: 50px; background: rgba(255,255,255,0.75);
        }
        .dist-oct .line-climb-right::before {
          content: ''; position: absolute; left: 0; bottom: 50%; width: 3px; height: 50px; background: rgba(255,255,255,0.75);
        }
        .dist-qf .line-drop-right::before {
          content: ''; position: absolute; left: 0; top: 50%; width: 3px; height: 108px; background: rgba(255,255,255,0.75);
        }
        .dist-qf .line-climb-right::before {
          content: ''; position: absolute; left: 0; bottom: 50%; width: 3px; height: 108px; background: rgba(255,255,255,0.75);
        }

        .line-to-final-right::after {
          content: ''; position: absolute; left: -65px; top: 50%; width: 110px; height: 3px; background: rgba(255,255,255,0.75); z-index: 1;
        }
        .dist-sf .line-to-final-right::before {
          content: ''; position: absolute; left: -65px; width: 3px; background: rgba(255,255,255,0.75);
        }
        .dist-sf .line-to-final-right:nth-child(1)::before { top: 50%; height: 224px; }
        .dist-sf .line-to-final-right:nth-child(2)::before { bottom: 50%; height: 224px; }


        /* ===== GRAN FINAL CELESTIAL Y DORADA ===== */
        .final-center-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 860px;
          padding-top: 350px;
          box-sizing: border-box;
          gap: 25px;
        }

        .match-final {
          width: 170px;
          height: 84px;
          border: 3px solid #dfb74c;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .match-final .team { height: 30px; padding: 0 12px; }
        .match-final .team-name { color: #224422; font-size: 0.78rem; font-weight: 800; }
        .match-final .team-score { color: #dfb74c; font-size: 0.9rem; font-weight: 900; }
        .match-final .team-flag { border-color: #ccc; background: #eee; }
        .match-final .team:first-child { border-bottom: 1px solid #e2e8e2; }
        
        .vs-divider {
          text-align: center; font-size: 0.65rem; font-weight: 800; letter-spacing: 4px; color: #dfb74c;
          background: #244924; border-top: 1px solid #dfb74c; border-bottom: 1px solid #dfb74c; padding: 1px 0;
        }

        .trophy { 
          font-size: 4rem; 
          text-align: center; 
          filter: drop-shadow(0 4px 15px rgba(0,0,0,0.4)); 
          animation: float 3.5s ease-in-out infinite; 
        }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}