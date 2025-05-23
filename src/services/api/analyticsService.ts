
import apiClient from './client';
import { AnalyticsEvent } from './types';

const analyticsService = {
  // Track a custom event
  trackEvent: async (eventName: string, properties: Record<string, any> = {}): Promise<void> => {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        properties,
        timestamp: Date.now(),
      };
      
      await apiClient.post('/analytics/events', event);
    } catch (error) {
      console.error('Error tracking event:', error);
      // Don't throw, analytics errors shouldn't break the app
    }
  },
  
  // Track page view
  trackPageView: async (path: string, title: string): Promise<void> => {
    try {
      await analyticsService.trackEvent('page_view', { path, title });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  },
  
  // Get visitor statistics
  getVisitorStats: async (startDate: string, endDate: string): Promise<any> => {
    try {
      return await apiClient.get('/analytics/visitors', {
        params: { start_date: startDate, end_date: endDate }
      });
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      throw error;
    }
  },
  
  // Get content engagement statistics
  getContentStats: async (
    contentType: 'news' | 'publications',
    startDate: string,
    endDate: string
  ): Promise<any> => {
    try {
      return await apiClient.get(`/analytics/${contentType}`, {
        params: { start_date: startDate, end_date: endDate }
      });
    } catch (error) {
      console.error(`Error fetching ${contentType} stats:`, error);
      throw error;
    }
  }
};

export default analyticsService;
