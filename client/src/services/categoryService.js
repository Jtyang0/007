import api from './api';

export const categoryService = {
  create: async (data) => {
    return await api.post('/categories', data);
  },

  getAll: async () => {
    return await api.get('/categories');
  },

  update: async (id, data) => {
    return await api.put(`/categories/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};

