
import apiClient from './client';
import { AnalyticsEvent } from './types';

const analyticsService = {
  // Track an event
  trackEvent: async (eventName: string, properties?: Record<string, any>): Promise<void> => {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        properties: properties || {},
        timestamp: Date.now(),
      };
      await apiClient.post('/analytics/events', event);
    } catch (error) {
      console.error('Error tracking event:', error);
      // Continue execution even if analytics fails
    }
  },
  
  // Track page view
  trackPageView: async (path: string, title: string): Promise<void> => {
    try {
      await analyticsService.trackEvent('page_view', {
        path,
        title,
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  },
  
  // Get visitor statistics for a date range
  getVisitorStats: async (startDate: string, endDate: string): Promise<{
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    avgTimeOnSite: number;
  }> => {
    try {
      return await apiClient.get('/analytics/visitors', {
        params: { startDate, endDate }
      });
    } catch (error) {
      console.error('Error fetching visitor statistics:', error);
      throw error;
    }
  },
  
  // Get content engagement statistics
  getContentStats: async (
    contentType: 'news' | 'publications', 
    startDate: string, 
    endDate: string
  ): Promise<{
    mostViewed: Array<{ id: string; title: string; views: number }>;
    totalViews: number;
    avgEngagementTime: number;
  }> => {
    try {
      return await apiClient.get(`/analytics/content/${contentType}`, {
        params: { startDate, endDate }
      });
    } catch (error) {
      console.error(`Error fetching ${contentType} statistics:`, error);
      throw error;
    }
  }
};

export default analyticsService;
