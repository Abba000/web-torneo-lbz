import axios from "axios";

const BASE_URL = "/api";

export async function crearEquipo(nombre_equipo) {
  const { data } = await axios.post(`${BASE_URL}/equipos`, {
    nombre_equipo,
    state: true,
  });
  return data;
}

export async function crearJugador(nombre_completo, nickname) {
  const { data } = await axios.post(`${BASE_URL}/jugadores`, {
    nombre_completo,
    nickname,
    state: true,
  });
  return data;
}

export async function vincularJugador(id_jugador, id_equipo) {
  const { data } = await axios.post(`${BASE_URL}/jugador-equipo`, {
    id_jugador,
    id_equipo,
  });
  return data;
}
