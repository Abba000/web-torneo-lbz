import axios from 'axios';
import { getToken } from './auth';

const auth = () => ({ Authorization: `Bearer ${getToken()}` });

export const getBracket   = async (game)             => (await axios.get(`/api/bracket/${game}`)).data;
export const sortear      = async (game)             => (await axios.post(`/api/bracket/${game}/sortear`, {}, { headers: auth() })).data;
export const setGanador   = async (game, matchId, w) => (await axios.put(`/api/bracket/${game}/${matchId}/ganador`, { winner: w }, { headers: auth() })).data;
export const resetBracket = async (game)             => (await axios.delete(`/api/bracket/${game}`, { headers: auth() })).data;
