import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const productionService = {
  getAllProduction: async () => {
    try {
      const response = await apiClient.get('/production');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getProductionById: async (id) => {
    try {
      const response = await apiClient.get(`/production/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  createProduction: async (payload) => {
    try {
      const response = await apiClient.post('/production', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  createProductionRequest: async (payload) => {
    try {
      const response = await apiClient.post('/production/request', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateProduction: async (id, payload) => {
    try {
      const response = await apiClient.put(`/production/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/production/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  deleteProduction: async (id) => {
    try {
      const response = await apiClient.delete(`/production/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
};

export default productionService;
