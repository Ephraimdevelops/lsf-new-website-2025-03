
import apiClient from './client';
import { Publication, PaginatedResponse } from './types';

export const publicationService = {
  // Get paginated publications
  getPublications: async (page = 1, perPage = 10, category?: string, type?: string) => {
    const response = await apiClient.get<PaginatedResponse<Publication>>('/publications', {
      params: { page, per_page: perPage, category, type }
    });
    return response.data;
  },
  
  // Get a single publication by id
  getPublicationById: async (id: number) => {
    const response = await apiClient.get<Publication>(`/publications/${id}`);
    return response.data;
  },
  
  // Get recent publications
  getRecentPublications: async (limit = 3) => {
    const response = await apiClient.get<Publication[]>('/publications/recent', {
      params: { limit }
    });
    return response.data;
  },
  
  // Create a new publication (admin)
  createPublication: async (publicationData: Omit<Publication, 'id' | 'created_at' | 'updated_at' | 'downloads_count'>) => {
    const formData = new FormData();
    
    // Append all data to FormData to handle file uploads
    Object.entries(publicationData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    const response = await apiClient.post<Publication>('/publications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Update an existing publication (admin)
  updatePublication: async (id: number, publicationData: Partial<Publication>) => {
    const formData = new FormData();
    
    // Append all data to FormData to handle file uploads
    Object.entries(publicationData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
    const response = await apiClient.post<Publication>(`/publications/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Delete a publication (admin)
  deletePublication: async (id: number) => {
    const response = await apiClient.delete(`/publications/${id}`);
    return response.data;
  },
  
  // Record a download (for analytics)
  recordDownload: async (id: number) => {
    const response = await apiClient.post(`/publications/${id}/download`);
    return response.data;
  }
};
