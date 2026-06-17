import axios from 'axios';
import { getToken } from './auth';

const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const getInscriptosFifa = async () => {
  const { data } = await axios.get('/api/admin/inscriptos-fifa', { headers: authHeaders() });
  return data;
};

export const getInscriptosCounter = async () => {
  const { data } = await axios.get('/api/admin/inscriptos-counter', { headers: authHeaders() });
  return data;
};

export const deleteJugadorFifa = async (id) => {
  const { data } = await axios.delete(`/api/admin/jugador-fifa/${id}`, { headers: authHeaders() });
  return data;
};

export const deleteEquipoCounter = async (id) => {
  const { data } = await axios.delete(`/api/admin/equipo-counter/${id}`, { headers: authHeaders() });
  return data;
};
