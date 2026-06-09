import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import orbitalLogo from '../assets/orbital-logo.png'
import './Login.css'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    if (!usuario.trim()) {
      setError('Por favor ingresa un usuario')
      setCargando(false)
      return
    }

    if (!contrasena) {
      setError('Por favor ingresa la contrasena')
      setCargando(false)
      return
    }

    setTimeout(() => {
      if (login(usuario, contrasena)) {
        setUsuario('')
        setContrasena('')
      } else {
        setError('Usuario o contrasena incorrectos')
      }
      setCargando(false)
    }, 500)
  }

  return (
    <div className="login-container">
      <div className="login-shell">
        <section className="login-brand-panel">
          <div className="brand-badge">Banking Experience</div>
          <img className="brand-logo" src={orbitalLogo} alt="Orbital" />
          <h1>Tu banco digital con una experiencia clara y moderna</h1>
          <p>
            Gestiona cuentas, movimientos y metas desde un panel simple,
            seguro y veloz.
          </p>
          <div className="brand-highlights">
            <div>
              <strong>24/7</strong>
              <span>Transferencias y control de saldos</span>
            </div>
            <div>
              <strong>+12k</strong>
              <span>Clientes ficticios conectados</span>
            </div>
          </div>
        </section>

        <section className="login-box">
          <div className="login-header">
            <img src={orbitalLogo} alt="Orbital" />
            <h2>Bienvenido</h2>
            <p>Inicia sesion para entrar a tu banca Orbital.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usuario">Correo electronico</label>
              <input
                id="usuario"
                type="email"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="hola@gmail.com"
                disabled={cargando}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">Contrasena</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                disabled={cargando}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={cargando}
            >
              {cargando ? 'Cargando...' : 'Iniciar sesion'}
            </button>
          </form>

          <div className="link-section">
            <p>Demo de acceso</p>
            <p>
              Usuario: <strong>hola@gmail.com</strong> | Clave:{' '}
              <strong>1234</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
