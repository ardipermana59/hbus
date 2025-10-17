import axios from './axios';

export const logsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.task_id) params.append('task_id', filters.task_id);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await axios.get(`/task-logs?${params.toString()}`);
    return response.data;
  },

  getByTaskId: async (taskId) => {
    const response = await axios.get(`/task-logs/${taskId}`);
    return response.data;
  },
};
