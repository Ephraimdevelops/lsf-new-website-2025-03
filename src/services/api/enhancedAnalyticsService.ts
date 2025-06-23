
import { AnalyticsEvent } from '@/types';
import { apiClient } from './enhancedClient';

class EnhancedAnalyticsService {
  private events: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private isOnline = navigator.onLine;

  constructor() {
    this.setupEventListeners();
    this.startPeriodicFlush();
  }

  private setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEvents();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Page visibility for batching
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushEvents();
      }
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.flushEvents(true);
    });
  }

  private startPeriodicFlush() {
    setInterval(() => {
      if (this.isOnline && this.events.length > 0) {
        this.flushEvents();
      }
    }, this.flushInterval);
  }

  async trackEvent(eventName: string, properties: Record<string, any> = {}): Promise<void> {
    const event: AnalyticsEvent = {
      event_name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      },
      timestamp: Date.now(),
      session_id: this.getSessionId(),
    };

    this.events.push(event);

    // Flush immediately for critical events
    const criticalEvents = ['error', 'purchase', 'signup', 'login'];
    if (criticalEvents.includes(eventName) || this.events.length >= this.batchSize) {
      await this.flushEvents();
    }
  }

  private async flushEvents(synchronous = false): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      if (synchronous && navigator.sendBeacon) {
        // Use sendBeacon for synchronous sending (page unload)
        const data = JSON.stringify({ events: eventsToSend });
        navigator.sendBeacon('/api/analytics/events', data);
      } else {
        // Regular async sending
        await apiClient.post('/analytics/events', { events: eventsToSend });
      }
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Convenience methods for common events
  async trackPageView(page: string, title?: string): Promise<void> {
    return this.trackEvent('page_view', {
      page,
      title: title || document.title,
    });
  }

  async trackClick(element: string, location?: string): Promise<void> {
    return this.trackEvent('click', {
      element,
      location,
    });
  }

  async trackDownload(resource: string, type: string): Promise<void> {
    return this.trackEvent('download', {
      resource,
      type,
    });
  }

  async trackSearch(query: string, results_count?: number): Promise<void> {
    return this.trackEvent('search', {
      query,
      results_count,
    });
  }

  async trackFormSubmission(form_name: string, success: boolean): Promise<void> {
    return this.trackEvent('form_submission', {
      form_name,
      success,
    });
  }

  async trackError(error: string, context?: string): Promise<void> {
    return this.trackEvent('error', {
      error,
      context,
      stack: new Error().stack,
    });
  }

  // Performance tracking
  async trackPerformance(): Promise<void> {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        return this.trackEvent('performance', {
          load_time: perfData.loadEventEnd - perfData.loadEventStart,
          dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
          connect_time: perfData.connectEnd - perfData.connectStart,
          response_time: perfData.responseEnd - perfData.responseStart,
          dom_ready: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        });
      }
    }
  }
}

export const enhancedAnalyticsService = new EnhancedAnalyticsService();
export default enhancedAnalyticsService;
