
import apiClient from './client';
import { AnalyticsEvent } from './types';

const analyticsService = {
  // Track a user event (page view, button click, etc.)
  trackEvent: async (eventName: string, properties?: Record<string, any>): Promise<void> => {
    // Only track events if analytics is enabled
    if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') {
      return;
    }
    
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        properties,
        timestamp: Date.now(),
      };
      
      await apiClient.post('/analytics/events', event);
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
      // Don't throw - analytics failures shouldn't break the app
    }
  },
  
  // Track page view
  trackPageView: async (path: string, title: string): Promise<void> => {
    return analyticsService.trackEvent('page_view', { path, title });
  },
  
  // Get visitor analytics data (for admin dashboard)
  getVisitorStats: async (startDate: string, endDate: string): Promise<any> => {
    try {
      return await apiClient.get('/analytics/visitors', { 
        params: { startDate, endDate } 
      });
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      throw error;
    }
  },
  
  // Get content analytics data (for admin dashboard)
  getContentStats: async (contentType: 'news' | 'publications', startDate: string, endDate: string): Promise<any> => {
    try {
      return await apiClient.get('/analytics/content', { 
        params: { contentType, startDate, endDate } 
      });
    } catch (error) {
      console.error(`Error fetching ${contentType} stats:`, error);
      throw error;
    }
  }
};

export default analyticsService;
