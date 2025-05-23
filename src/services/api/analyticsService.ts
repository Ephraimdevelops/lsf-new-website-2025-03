
// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Simple analytics service that works without backend
const analyticsService = {
  trackPageView: (path: string, title: string) => {
    // Log page views for development
    console.log(`Page view: ${title} (${path})`);
    
    // In production, this could send to Google Analytics or other services
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title,
      });
    }
  },
  
  trackEvent: (eventName: string, properties: Record<string, any>) => {
    console.log(`Event: ${eventName}`, properties);
    
    // In production, this could send to analytics services
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }
};

export default analyticsService;
