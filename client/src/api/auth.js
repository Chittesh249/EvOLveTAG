import axios from './axios';

export const login = async (email, password) => {
  const res = await axios.post('/auth/login', { email, password });
  return res.data;
};

export const signup = async (name, email, password, role = 'member') => {
  const res = await axios.post('/auth/signup', { name, email, password, role });
  return res.data;
};

export const fetchProfile = async () => {
  const res = await axios.get('/profile/me');
  return res.data.user;
};

export const updateProfile = async (data) => {
  const res = await axios.put('/profile/me', data);
  return res.data;
};
