import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  createProduct: async (payload) => {
    try {
      const response = await apiClient.post('/products', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateProduct: async (id, payload) => {
    try {
      const response = await apiClient.put(`/products/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
};

export default productService;
