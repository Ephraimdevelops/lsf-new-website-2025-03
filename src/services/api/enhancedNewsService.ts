
import { apiClient } from './enhancedClient';
import { mockDataService } from '../mockDataService';
import { News, PaginatedResponse, SearchFilters } from '@/types';

class EnhancedNewsService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

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

  async getAllNews(page = 1, limit = 10, filters?: SearchFilters): Promise<PaginatedResponse<News>> {
    const cacheKey = this.getCacheKey('getAllNews', { page, limit, filters });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const params = { page, limit, ...filters };
      const response = await apiClient.get<PaginatedResponse<News>>('/news', { params });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn('Falling back to mock data for getAllNews');
      return mockDataService.getAllNews(limit, filters?.featured);
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    const cacheKey = this.getCacheKey('getNewsById', { id });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<News>(`/news/${id}`);
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn(`Falling back to mock data for news ID: ${id}`);
      return mockDataService.getNewsById(id);
    }
  }

  async getFeaturedNews(limit = 3): Promise<News[]> {
    const cacheKey = this.getCacheKey('getFeaturedNews', { limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<News[]>('/news/featured', { params: { limit } });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn('Falling back to mock data for featured news');
      const mockResponse = mockDataService.getAllNews(limit, true);
      return mockResponse.data;
    }
  }

  async searchNews(query: string, page = 1, limit = 10): Promise<PaginatedResponse<News>> {
    const cacheKey = this.getCacheKey('searchNews', { query, page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<PaginatedResponse<News>>('/news/search', {
        params: { query, page, limit }
      });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn(`Falling back to mock data for news search: ${query}`);
      return mockDataService.searchNews(query);
    }
  }

  async getNewsByCategory(category: string, page = 1, limit = 10): Promise<PaginatedResponse<News>> {
    const cacheKey = this.getCacheKey('getNewsByCategory', { category, page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiClient.get<PaginatedResponse<News>>(`/news/category/${category}`, {
        params: { page, limit }
      });
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.warn(`Falling back to mock data for news category: ${category}`);
      const allNews = mockDataService.getAllNews();
      const filtered = allNews.data.filter(news => news.category.toLowerCase() === category.toLowerCase());
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

export const enhancedNewsService = new EnhancedNewsService();
export default enhancedNewsService;
