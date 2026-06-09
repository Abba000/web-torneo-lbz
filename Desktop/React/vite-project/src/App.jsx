import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const { usuarioLogueado } = useAuth()

  return usuarioLogueado ? <Dashboard /> : <Login />
}

export default App
