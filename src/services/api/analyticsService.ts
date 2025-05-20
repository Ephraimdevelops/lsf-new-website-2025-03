
import apiClient from './client';
import { AnalyticsData } from './types';

export const analyticsService = {
  // Get dashboard analytics data
  getDashboardAnalytics: async () => {
    const response = await apiClient.get<AnalyticsData>('/analytics/dashboard');
    return response.data;
  },
  
  // Get visitor stats for a date range
  getVisitorStats: async (startDate: string, endDate: string) => {
    const response = await apiClient.get('/analytics/visitors', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },
  
  // Get download stats for publications
  getDownloadStats: async (startDate: string, endDate: string) => {
    const response = await apiClient.get('/analytics/downloads', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },
  
  // Record a page view (for analytics)
  recordPageView: async (path: string) => {
    const response = await apiClient.post('/analytics/page-view', { path });
    return response.data;
  }
};
