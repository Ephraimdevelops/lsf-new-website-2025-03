
import apiClient from './client';
import { Publication, PaginatedResponse } from './types';

const publicationService = {
  // Get a paginated list of publications
  getAllPublications: async (page = 1, limit = 10, type?: string, year?: string): Promise<PaginatedResponse<Publication>> => {
    const params = { 
      page, 
      limit,
      ...(type && { type }),
      ...(year && { year })
    };
    
    try {
      return await apiClient.get('/publications', { params });
    } catch (error) {
      console.error('Error fetching publications:', error);
      throw error;
    }
  },
  
  // Get a single publication by id
  getPublicationById: async (id: string): Promise<Publication> => {
    try {
      return await apiClient.get(`/publications/${id}`);
    } catch (error) {
      console.error(`Error fetching publication with id ${id}:`, error);
      throw error;
    }
  },
  
  // Search for publications
  searchPublications: async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<Publication>> => {
    try {
      return await apiClient.get('/publications/search', { 
        params: { query, page, limit } 
      });
    } catch (error) {
      console.error('Error searching publications:', error);
      throw error;
    }
  },
  
  // Get publications by type (report, research, guide, etc.)
  getPublicationsByType: async (type: string, page = 1, limit = 10): Promise<PaginatedResponse<Publication>> => {
    try {
      return await apiClient.get(`/publications/type/${type}`, { 
        params: { page, limit } 
      });
    } catch (error) {
      console.error(`Error fetching publications for type ${type}:`, error);
      throw error;
    }
  },
  
  // Get publications by year
  getPublicationsByYear: async (year: string, page = 1, limit = 10): Promise<PaginatedResponse<Publication>> => {
    try {
      return await apiClient.get(`/publications/year/${year}`, { 
        params: { page, limit } 
      });
    } catch (error) {
      console.error(`Error fetching publications for year ${year}:`, error);
      throw error;
    }
  },
  
  // Track publication download
  trackDownload: async (publicationId: string): Promise<void> => {
    try {
      await apiClient.post(`/publications/${publicationId}/track-download`);
    } catch (error) {
      console.error(`Error tracking download for publication ${publicationId}:`, error);
      // Don't throw here - we don't want to block the download if tracking fails
    }
  }
};

export default publicationService;
