import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  withCredentials: true, // allow sending HttpOnly cookies for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor: attach Authorization header when token present (fallback)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth-token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (err) {
    return config;
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default api;
