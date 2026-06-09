import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const USUARIO_VALIDO = 'hola@gmail.com'
const CONTRASENA_VALIDA = '1234'

export function AuthProvider({ children }) {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null)

  const login = (usuario, contrasena) => {
    if (usuario === USUARIO_VALIDO && contrasena === CONTRASENA_VALIDA) {
      setUsuarioLogueado(usuario)
      localStorage.setItem('usuario', usuario)
      return true
    }
    return false
  }

  const logout = () => {
    setUsuarioLogueado(null)
    localStorage.removeItem('usuario')
  }

  if (!usuarioLogueado && typeof window !== 'undefined') {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado === USUARIO_VALIDO) {
      setUsuarioLogueado(usuarioGuardado)
    }
  }

  return (
    <AuthContext.Provider value={{ usuarioLogueado, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
