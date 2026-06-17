import { Navigate } from 'react-router-dom';
import { getToken } from '../api/auth';

export default function RutaProtegida({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}
