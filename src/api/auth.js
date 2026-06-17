import axios from 'axios';

export const loginAdmin = async (usuario, password) => {
  const { data } = await axios.post('/api/auth/login', { usuario, password });
  return data;
};

export const getToken = () => localStorage.getItem('lbz_token');
export const setToken = (token) => localStorage.setItem('lbz_token', token);
export const removeToken = () => localStorage.removeItem('lbz_token');
