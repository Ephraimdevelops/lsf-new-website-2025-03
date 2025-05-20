
import apiClient from './client';
import { NewsPost, PaginatedResponse } from './types';

export const newsService = {
  // Get paginated news posts
  getNewsPosts: async (page = 1, perPage = 10) => {
    const response = await apiClient.get<PaginatedResponse<NewsPost>>('/news', {
      params: { page, per_page: perPage }
    });
    return response.data;
  },
  
  // Get a single news post by slug
  getNewsPostBySlug: async (slug: string) => {
    const response = await apiClient.get<NewsPost>(`/news/${slug}`);
    return response.data;
  },
  
  // Get featured news posts
  getFeaturedNews: async (limit = 3) => {
    const response = await apiClient.get<NewsPost[]>('/news/featured', {
      params: { limit }
    });
    return response.data;
  },
  
  // Create a new news post (admin)
  createNewsPost: async (postData: Omit<NewsPost, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post<NewsPost>('/news', postData);
    return response.data;
  },
  
  // Update an existing news post (admin)
  updateNewsPost: async (id: number, postData: Partial<NewsPost>) => {
    const response = await apiClient.put<NewsPost>(`/news/${id}`, postData);
    return response.data;
  },
  
  // Delete a news post (admin)
  deleteNewsPost: async (id: number) => {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  }
};
