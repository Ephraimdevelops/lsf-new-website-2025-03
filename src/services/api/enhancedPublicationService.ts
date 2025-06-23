
import { apiClient } from './enhancedClient';
import { mockDataService } from '../mockDataService';
import { Publication, PaginatedResponse, SearchFilters } from '@/types';
import { enhancedAnalyticsService } from './enhancedAnalyticsService';

class EnhancedPublicationService {
  private cache = new Map<string, any>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes for publications

  private getCacheKey(method: string, params?: any): string {
    return `${method}_${JSON.stringify(params || {})}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  async getAllPublications(page = 1, limit = 10, filters?: SearchFilters): Promise<PaginatedResponse<Publication>> {
    const cacheKey = this.getCacheKey('getAllPublications', { page, limit, filters });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const params = { page, limit, ...filters };
      const response = await apiClient.get<PaginatedResponse<Publication>>('/publications', { params });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn('Falling back to mock data for getAllPublications');
      return mockDataService.getAllPublications(limit, filters?.featured);
    }
  }

  async getPublicationById(id: string): Promise<Publication | null> {
    const cacheKey = this.getCacheKey('getPublicationById', { id });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<Publication>(`/publications/${id}`);
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn(`Falling back to mock data for publication ID: ${id}`);
      return mockDataService.getPublicationById(id);
    }
  }

  async downloadPublication(id: string): Promise<void> {
    try {
      // Track download
      await enhancedAnalyticsService.trackDownload(id, 'publication');
      
      // Increment download count
      await apiClient.post(`/publications/${id}/download`);
      
      // Clear cache to get updated download count
      this.clearCache();
    } catch (error) {
      console.warn(`Failed to track publication download: ${id}`, error);
      // Still track the download locally
      await enhancedAnalyticsService.trackDownload(id, 'publication');
    }
  }

  async searchPublications(query: string, page = 1, limit = 10): Promise<PaginatedResponse<Publication>> {
    const cacheKey = this.getCacheKey('searchPublications', { query, page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<PaginatedResponse<Publication>>('/publications/search', {
        params: { query, page, limit }
      });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn(`Falling back to mock data for publication search: ${query}`);
      const allPubs = mockDataService.getAllPublications();
      const filtered = allPubs.data.filter(pub => 
        pub.title.toLowerCase().includes(query.toLowerCase()) ||
        pub.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: filtered.slice(0, limit),
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        }
      };
    }
  }

  async getPublicationsByType(type: string, page = 1, limit = 10): Promise<PaginatedResponse<Publication>> {
    const cacheKey = this.getCacheKey('getPublicationsByType', { type, page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<PaginatedResponse<Publication>>(`/publications/type/${type}`, {
        params: { page, limit }
      });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn(`Falling back to mock data for publication type: ${type}`);
      const allPubs = mockDataService.getAllPublications();
      const filtered = allPubs.data.filter(pub => pub.type === type);
      return {
        data: filtered.slice(0, limit),
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        }
      };
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const enhancedPublicationService = new EnhancedPublicationService();
export default enhancedPublicationService;
