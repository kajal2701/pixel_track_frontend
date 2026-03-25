import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (customer_number, access_code) => {
    try {
      const response = await apiClient.post('/auth/login', {
        customer_number,
        access_code,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },
};

export default authService;