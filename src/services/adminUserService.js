import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const adminUserService = {
  getAll: async () => {
    const response = await client.get('/admin/users');
    return response.data;
  },

  getProductionTechUsers: async () => {
    const response = await client.get('/admin/users/role/production-tech');
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/admin/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    try {
      const response = await client.post('/admin/users', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  update: async (id, data) => {
    try {
      const response = await client.put(`/admin/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  delete: async (id) => {
    try {
      const response = await client.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },
};

export default adminUserService;
