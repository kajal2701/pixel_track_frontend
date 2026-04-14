import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const orderService = {
  getCustomerOrders: async (customer_id, search = '') => {
    try {
      const params = { customer_id };
      if (search) params.search = search;

      const response = await apiClient.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
  createOrder: async (payload) => {
    try {
      const response = await apiClient.post('/orders', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
   getAllOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return response.data; // { data: [...], summary: {...} }
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateStatus: async (id, order_status) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { order_status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateNotes: async (id, additional_notes) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/notes`, { additional_notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  checkInventory: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}/check-inventory`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await apiClient.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
};

export default orderService;