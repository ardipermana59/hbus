import axios from './axios';

export const tasksAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.assigned_to) params.append('assigned_to', filters.assigned_to);

    const response = await axios.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await axios.post('/tasks', taskData);
    return response.data;
  },

  update: async (id, taskData) => {
    const response = await axios.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
  },

  getDashboard: async () => {
    const response = await axios.get('/dashboard');
    return response.data;
  },
};
