import api from './api';

export const timeRecordService = {
  create: async (data) => {
    return await api.post('/time-records', data);
  },

  getAll: async (params = {}) => {
    return await api.get('/time-records', { params });
  },

  getById: async (id) => {
    return await api.get(`/time-records/${id}`);
  },

  update: async (id, data) => {
    return await api.put(`/time-records/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/time-records/${id}`);
  }
};

