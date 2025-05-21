
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
  },
  
  // Get statistics about paralegals
  getParalegalStats: async () => {
    const response = await apiClient.get('/analytics/paralegals');
    return response.data;
  },
  
  // Get statistics about legal aid services
  getLegalAidStats: async () => {
    const response = await apiClient.get('/analytics/legal-aid');
    return response.data;
  },
  
  // Get content engagement metrics (which content is most popular)
  getContentEngagement: async (contentType: 'news' | 'publications' | 'programs') => {
    const response = await apiClient.get('/analytics/engagement', {
      params: { content_type: contentType }
    });
    return response.data;
  },
  
  // Get geographic distribution of users 
  getGeographicDistribution: async () => {
    const response = await apiClient.get('/analytics/geographic');
    return response.data;
  },
  
  // Track event (for specific user interactions)
  trackEvent: async (eventName: string, eventData: any = {}) => {
    const response = await apiClient.post('/analytics/event', {
      event_name: eventName,
      event_data: eventData
    });
    return response.data;
  }
};
