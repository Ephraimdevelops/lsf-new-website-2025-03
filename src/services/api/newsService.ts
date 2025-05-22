
import apiClient from './client';
import { NewsItem, NewsListItem, PaginatedResponse } from './types';

const newsService = {
  // Get a paginated list of news items
  getAllNews: async (page = 1, limit = 10, category?: string): Promise<PaginatedResponse<NewsListItem>> => {
    const params = { 
      page, 
      limit,
      ...(category && { category })
    };
    
    try {
      return await apiClient.get('/news', { params });
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },
  
  // Get featured news for homepage
  getFeaturedNews: async (limit = 4): Promise<NewsListItem[]> => {
    try {
      return await apiClient.get('/news/featured', { params: { limit } });
    } catch (error) {
      console.error('Error fetching featured news:', error);
      throw error;
    }
  },
  
  // Get a single news item by id
  getNewsById: async (id: string): Promise<NewsItem> => {
    try {
      return await apiClient.get(`/news/${id}`);
    } catch (error) {
      console.error(`Error fetching news with id ${id}:`, error);
      throw error;
    }
  },
  
  // Search for news
  searchNews: async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<NewsListItem>> => {
    try {
      return await apiClient.get('/news/search', { 
        params: { query, page, limit } 
      });
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },
  
  // Get news by category
  getNewsByCategory: async (category: string, page = 1, limit = 10): Promise<PaginatedResponse<NewsListItem>> => {
    try {
      return await apiClient.get('/news/category/:category', { 
        params: { category, page, limit } 
      });
    } catch (error) {
      console.error(`Error fetching news for category ${category}:`, error);
      throw error;
    }
  },
  
  // Get related news for a specific news item
  getRelatedNews: async (id: string, limit = 3): Promise<NewsListItem[]> => {
    try {
      return await apiClient.get(`/news/${id}/related`, { 
        params: { limit } 
      });
    } catch (error) {
      console.error(`Error fetching related news for id ${id}:`, error);
      throw error;
    }
  }
};

export default newsService;
