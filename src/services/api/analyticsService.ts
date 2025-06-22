
import apiClient from './client';

export interface AnalyticsData {
  visitors: {
    total: number;
    daily: Array<{ date: string; visitors: number }>;
    growth: number;
  };
  content: {
    totalNews: number;
    totalPublications: number;
    totalPrograms: number;
    totalOpportunities: number;
  };
  engagement: {
    downloads: Array<{ name: string; downloads: number }>;
    views: Array<{ name: string; views: number }>;
    topPages: Array<{ page: string; views: number }>;
  };
  recentActivity: Array<{
    id: string;
    type: 'news' | 'publication' | 'program' | 'user';
    action: string;
    description: string;
    timestamp: string;
  }>;
}

// Mock data generator for realistic analytics
const generateMockAnalytics = (): AnalyticsData => {
  // Generate visitor data for the last 30 days
  const dailyVisitors = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyVisitors.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 200) + 50
    });
  }

  return {
    visitors: {
      total: dailyVisitors.reduce((sum, day) => sum + day.visitors, 0),
      daily: dailyVisitors,
      growth: Math.floor(Math.random() * 20) + 5
    },
    content: {
      totalNews: 15,
      totalPublications: 23,
      totalPrograms: 8,
      totalOpportunities: 12
    },
    engagement: {
      downloads: [
        { name: 'Annual Report 2023', downloads: 287 },
        { name: 'Legal Aid Handbook', downloads: 194 },
        { name: 'Women\'s Land Rights Study', downloads: 156 },
        { name: 'Climate Justice Brief', downloads: 123 },
        { name: 'Digital Legal Services Guide', downloads: 98 }
      ],
      views: [
        { name: 'Women\'s Rights Workshop', views: 1245 },
        { name: 'Paralegal Training Program', views: 987 },
        { name: 'Climate Justice Initiative', views: 756 },
        { name: 'Mobile Legal Clinics', views: 543 },
        { name: 'Government Partnership', views: 432 }
      ],
      topPages: [
        { page: '/about', views: 2341 },
        { page: '/programs', views: 1876 },
        { page: '/legal-help', views: 1654 },
        { page: '/resources', views: 1432 },
        { page: '/contact', views: 1287 }
      ]
    },
    recentActivity: [
      {
        id: '1',
        type: 'publication',
        action: 'created',
        description: 'Annual Report 2023 was published',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'news',
        action: 'updated',
        description: 'Women\'s rights workshop article was edited',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'program',
        action: 'updated',
        description: 'Legal Empowerment program details modified',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'news',
        action: 'created',
        description: 'New article about climate justice published',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };
};

const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    try {
      // In a real application, this would fetch from your analytics API
      // For now, we'll return mock data that simulates real analytics
      return generateMockAnalytics();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return fallback data
      return generateMockAnalytics();
    }
  },

  trackPageView: async (page: string): Promise<void> => {
    try {
      // In a real application, this would send tracking data to your analytics service
      console.log(`Page view tracked: ${page}`);
      localStorage.setItem(`pageview_${page}`, Date.now().toString());
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  },

  trackDownload: async (resource: string): Promise<void> => {
    try {
      console.log(`Download tracked: ${resource}`);
      const downloads = JSON.parse(localStorage.getItem('downloads') || '{}');
      downloads[resource] = (downloads[resource] || 0) + 1;
      localStorage.setItem('downloads', JSON.stringify(downloads));
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  }
};

export default analyticsService;
