import axios from "axios";

const BASE_URL = "/api";

export async function submitFifaRegistration({ nombre, nick }) {
  const { data } = await axios.post(`${BASE_URL}/jugadores`, {
    nombre_completo: nombre,
    nickname: nick,
    state: true,
  });
  return data;
}
