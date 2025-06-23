
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

// Extend the Axios request config to include metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

class EnhancedApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        // Add auth token if available
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time for debugging
        const endTime = new Date();
        const config = response.config as ExtendedAxiosRequestConfig;
        const duration = config.metadata?.startTime ? endTime.getTime() - config.metadata.startTime.getTime() : 0;
        console.log(`API call to ${response.config.url} took ${duration}ms`);
        
        return response.data;
      },
      (error) => {
        return this.handleError(error);
      }
    );
  }

  private async handleError(error: any): Promise<any> {
    // Network error or timeout
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'TIMEOUT') {
      console.warn('Network error detected, attempting to use mock data...');
      
      // Try to return mock data based on the endpoint
      const mockData = await this.getMockDataForEndpoint(error.config?.url || '');
      if (mockData) {
        return mockData;
      }
    }

    // HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('Unauthorized access - redirecting to login');
          // Handle unauthorized access
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Rate limit exceeded');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error(`HTTP Error ${status}:`, data);
      }
      
      throw new Error(data?.message || `HTTP Error ${status}`);
    }

    // Other errors
    console.error('Unexpected error:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }

  private async getMockDataForEndpoint(url: string): Promise<any> {
    // Dynamic mock data loading based on endpoint
    const { mockDataService } = await import('../mockDataService');
    
    if (url.includes('/news')) {
      if (url.includes('/news/')) {
        const id = url.split('/news/')[1];
        return mockDataService.getNewsById(id);
      }
      return mockDataService.getAllNews();
    }
    
    if (url.includes('/publications')) {
      if (url.includes('/publications/')) {
        const id = url.split('/publications/')[1];
        return mockDataService.getPublicationById(id);
      }
      return mockDataService.getAllPublications();
    }
    
    if (url.includes('/programs')) {
      if (url.includes('/programs/')) {
        const id = url.split('/programs/')[1];
        return mockDataService.getProgramById(id);
      }
      return mockDataService.getAllPrograms();
    }
    
    if (url.includes('/opportunities')) {
      if (url.includes('/opportunities/')) {
        const id = url.split('/opportunities/')[1];
        return mockDataService.getOpportunityById(id);
      }
      return mockDataService.getAllOpportunities();
    }

    return null;
  }

  // Generic GET method
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  // Generic POST method
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  // Generic PUT method
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  // Generic DELETE method
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }

  // Generic PATCH method
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(url, data, config);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new EnhancedApiClient();
export default apiClient;
