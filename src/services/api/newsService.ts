
import apiClient from './client';
import { News, NewsPost, PaginatedResponse } from './types';

const newsService = {
  getAllNews: async (page = 1, limit = 10): Promise<PaginatedResponse<News>> => {
    try {
      return await apiClient.get('/news', { params: { page, limit } });
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  getNewsById: async (id: string): Promise<News> => {
    try {
      return await apiClient.get(`/news/${id}`);
    } catch (error) {
      console.error(`Error fetching news with id ${id}:`, error);
      throw error;
    }
  },

  getFeaturedNews: async (limit = 3): Promise<News[]> => {
    try {
      return await apiClient.get('/news/featured', { params: { limit } });
    } catch (error) {
      console.error('Error fetching featured news:', error);
      throw error;
    }
  },

  searchNews: async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<News>> => {
    try {
      return await apiClient.get('/news/search', {
        params: { query, page, limit }
      });
    } catch (error) {
      console.error(`Error searching news with query ${query}:`, error);
      throw error;
    }
  }
};

export default newsService;
