import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin from './pages/Admin'
import Login from './pages/Login'
import LlavesFifa from './pages/LlavesFifa'
import LlavesCounter from './pages/LlavesCounter'
import FormularioFifa from './pages/FormularioFifa'
import FormularioCounter from './pages/FormularioCounter'
import RutaProtegida from './components/RutaProtegida'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
        <Route path="/llaves-fifa" element={<LlavesFifa />} />
        <Route path="/llaves-counter" element={<LlavesCounter />} />
        <Route path="/formulario-fifa" element={<FormularioFifa />} />
        <Route path="/formulario-counter" element={<FormularioCounter />} />
      </Routes>
    </BrowserRouter>
  )
}
