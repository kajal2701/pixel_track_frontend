import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const inventoryService = {
  getAllInventory: async (params = {}) => {
    try {
      const response = await apiClient.get('/inventory', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getInventoryById: async (id) => {
    try {
      const response = await apiClient.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  createInventory: async (payload) => {
    try {
      const response = await apiClient.post('/inventory', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateInventory: async (id, payload) => {
    try {
      const response = await apiClient.put(`/inventory/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  deleteInventory: async (id) => {
    try {
      const response = await apiClient.delete(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
};

export default inventoryService;
