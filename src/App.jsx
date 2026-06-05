import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin from './pages/Admin'
import LlavesFifa from './pages/LlavesFifa'
import LlavesCounter from './pages/LlavesCounter'
import FormularioFifa from './pages/FormularioFifa'
import FormularioCounter from './pages/FormularioCounter'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/llaves-fifa" element={<LlavesFifa />} />
        <Route path="/llaves-counter" element={<LlavesCounter />} />
        <Route path="/formulario-fifa" element={<FormularioFifa />} />
        <Route path="/formulario-counter" element={<FormularioCounter />} />
      </Routes>
    </BrowserRouter>
  )
}
