import axios from './axios';

export const authAPI = {
  login: async (credentials) => {
    const response = await axios.post('/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
