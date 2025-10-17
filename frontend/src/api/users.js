import axios from './axios';

export const usersAPI = {
  getAll: async () => {
    const response = await axios.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await axios.post('/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  },
};
