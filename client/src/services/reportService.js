import api from './api';

export const reportService = {
  generate: async (params = {}) => {
    return await api.get('/reports', { params });
  }
};

