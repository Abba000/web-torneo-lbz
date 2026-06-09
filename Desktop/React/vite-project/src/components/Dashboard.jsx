import { useAuth } from '../context/AuthContext'
import orbitalLogo from '../assets/orbital-logo.png'
import './Dashboard.css'

const balances = [
  { label: 'Cuenta principal', value: '$ 8.540.230', detail: 'Disponible hoy' },
  { label: 'Inversiones', value: '$ 2.180.450', detail: 'Rendimiento +8.4%' },
  { label: 'Ahorro viaje', value: '$ 640.900', detail: 'Meta al 72%' },
]

const transactions = [
  { name: 'Transferencia recibida', amount: '+$ 420.000', time: 'Hoy, 09:42', status: 'Completada' },
  { name: 'Pago tarjeta Orbital Black', amount: '-$ 128.900', time: 'Hoy, 08:15', status: 'Procesado' },
  { name: 'Suscripcion cloud tools', amount: '-$ 24.500', time: 'Ayer, 18:20', status: 'Programado' },
  { name: 'Plazo flexible', amount: '+$ 83.100', time: 'Ayer, 11:05', status: 'Acreditado' },
]

const goals = [
  { title: 'Fondo de emergencia', amount: '$ 1.500.000', progress: '84%' },
  { title: 'Nueva oficina', amount: '$ 780.000', progress: '58%' },
]

export default function Dashboard() {
  const { usuarioLogueado, logout } = useAuth()

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg-shape dashboard-bg-shape-one" />
      <div className="dashboard-bg-shape dashboard-bg-shape-two" />

      <nav className="navbar">
        <div className="navbar-content">
          <div className="brand-lockup">
            <img src={orbitalLogo} alt="Orbital" />
            <div>
              <span>Orbital Bank</span>
              <p>Centro financiero inteligente</p>
            </div>
          </div>

          <div className="user-section">
            <span className="welcome-text">
              Bienvenido, <strong>{usuarioLogueado}</strong>
            </span>
            <button onClick={logout} className="logout-button">
              Cerrar sesion
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="eyebrow">Resumen general</div>
            <h1>Tu dinero, ordenado en una sola vista</h1>
            <p>
              Consulta saldos, movimientos y objetivos activos con una interfaz
              clara, premium y alineada con la identidad de Orbital.
            </p>
            <div className="hero-actions">
              <button className="primary-action">Transferir</button>
              <button className="secondary-action">Ver tarjetas</button>
            </div>
          </div>

          <div className="hero-card">
            <span className="card-chip" />
            <div className="hero-card-top">
              <span>Orbital Black</span>
              <span>VISA</span>
            </div>
            <div className="hero-card-number">**** 4588</div>
            <div className="hero-card-bottom">
              <div>
                <small>Limite disponible</small>
                <strong>$ 3.200.000</strong>
              </div>
              <div>
                <small>Cierre</small>
                <strong>28 Mayo</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          {balances.map((item) => (
            <article key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel panel-wide">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Actividad reciente</span>
                <h2>Ultimos movimientos</h2>
              </div>
              <button className="text-action">Exportar</button>
            </div>

            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div key={`${transaction.name}-${transaction.time}`} className="transaction-item">
                  <div>
                    <strong>{transaction.name}</strong>
                    <p>{transaction.time}</p>
                  </div>
                  <div className="transaction-meta">
                    <strong>{transaction.amount}</strong>
                    <span>{transaction.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Objetivos</span>
                <h2>Metas activas</h2>
              </div>
            </div>

            <div className="goals-list">
              {goals.map((goal) => (
                <div key={goal.title} className="goal-item">
                  <div className="goal-row">
                    <strong>{goal.title}</strong>
                    <span>{goal.progress}</span>
                  </div>
                  <p>{goal.amount}</p>
                  <div className="goal-bar">
                    <span style={{ width: goal.progress }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Analitica</span>
                <h2>Gastos del mes</h2>
              </div>
            </div>

            <div className="insight-ring">
              <div>
                <strong>68%</strong>
                <span>consumo esencial</span>
              </div>
            </div>

            <div className="insight-list">
              <p><span /> Hogar y servicios</p>
              <p><span /> Plataforma y software</p>
              <p><span /> Ahorro automatizado</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
