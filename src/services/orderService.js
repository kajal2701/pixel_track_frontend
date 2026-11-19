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
  getAllOrders: async (params = {}) => {
    try {
      const response = await apiClient.get('/orders', { params });
      return response.data; // { data: [...], summary: {...} }
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getOrdersPaginated: async ({ page = 1, limit = 10, status, search, exclude_status, sort_by, sort_order } = {}) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;
      if (exclude_status) params.exclude_status = exclude_status;
      if (sort_by) params.sort_by = sort_by;
      if (sort_order) params.sort_order = sort_order;
      const response = await apiClient.get('/orders', { params });
      return response.data; // { data, summary, pagination }
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Find an order by its string order_id (e.g. "ORD-1776521329-1")
  getOrderByOrderIdString: async (orderIdStr) => {
    try {
      const response = await apiClient.get('/orders', { params: { search: orderIdStr } });
      const orders = response.data?.data || [];
      // Return exact match on order_id string
      const match = orders.find((o) => o.order_id === orderIdStr);
      if (!match) throw { message: `Order "${orderIdStr}" not found.` };
      return { data: match };
    } catch (error) {
      throw error.response?.data || error || { message: 'Network error occurred' };
    }
  },
  confirmOrder: async (id) => {
    try {
      const response = await apiClient.post(`/orders/${id}/confirm`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  updateStatus: async (id, order_status, dispatch_location, source_locations, assigned_tech_id) => {
    try {
      const body = { order_status };
      if (dispatch_location) body.dispatch_location = dispatch_location;
      if (source_locations?.length) body.source_locations = source_locations;
      if (assigned_tech_id) body.assigned_tech_id = assigned_tech_id;
      const response = await apiClient.patch(`/orders/${id}/status`, body);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  getInventoryLocations: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}/inventory-locations`);
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

  updateOrderDetails: async (id, payload) => {
    try {
      const response = await apiClient.put(`/orders/${id}`, payload);
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

  checkInventoryPreview: async (payload) => {
    try {
      const response = await apiClient.post('/orders/check-inventory-preview', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  requestModification: async (id, payload) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/modification`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  resolveModification: async (id, payload) => {
    try {
      const response = await apiClient.post(`/orders/${id}/modification/resolve`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  overrideModification: async (id) => {
    try {
      const response = await apiClient.post(`/orders/${id}/modification/override`);
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

  editOrder: async (id, payload) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/edit`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
};

export default orderService;