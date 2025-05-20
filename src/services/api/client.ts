
import axios from 'axios';

// Create a base API client with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - can be used to add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('admin-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors like 401 (unauthorized)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('admin-token');
      // You might want to redirect to login page here
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
