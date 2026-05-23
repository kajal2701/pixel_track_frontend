import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const invoiceService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/invoices', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Generate invoice from selected completed orders
  generate: async (orderIds) => {
    try {
      const response = await apiClient.post('/invoices/generate', { order_ids: orderIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Update billing fields (extra_work, discount, GST, totals)
  update: async (id, payload) => {
    try {
      const response = await apiClient.patch(`/invoices/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Update status of invoice (Draft → Sent → Paid)
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/invoices/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Submit payment screenshot (multipart form upload)
  submitPayment: async (id, screenshotFile) => {
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      const response = await apiClient.post(`/invoices/${id}/payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Admin confirms payment
  confirmPayment: async (id) => {
    try {
      const response = await apiClient.patch(`/invoices/${id}/payment/confirm`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Get payment screenshot URL
  getPaymentScreenshotUrl: (id) => {
    return `${API_BASE_URL}/invoices/${id}/payment/screenshot`;
  },

};

export default invoiceService;
