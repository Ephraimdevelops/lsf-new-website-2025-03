import axios from 'axios';
import { supabase } from '@/lib/supabase';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  // Surface a clear error early if the API base URL is missing
  // Vercel/Render misconfigurations commonly cause "Network Error"
  // due to requests going to an undefined host.
  // eslint-disable-next-line no-console
  console.error('VITE_API_BASE_URL is not set. Define it in your environment.');
}

const api = axios.create({
  baseURL: baseUrl, // Expect values like http://localhost:4000 or https://api.example.com
  withCredentials: false,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Attach Authorization header from current Supabase session if present
api.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    const accessToken = data?.session?.access_token || localStorage.getItem('auth-token') || '';
    if (accessToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Could not attach auth token:', (e as Error)?.message);
  }
  return config;
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
