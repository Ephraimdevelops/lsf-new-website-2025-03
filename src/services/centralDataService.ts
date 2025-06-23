
import { 
  enhancedNewsService, 
  enhancedPublicationService, 
  enhancedAnalyticsService 
} from './api/enhancedIndex';
import { mockDataService } from './mockDataService';
import { News, Publication, Program, Opportunity, PaginatedResponse, SearchFilters } from '@/types';

/**
 * Centralized data service that coordinates all data operations
 * Provides a single interface for all data needs across the application
 */
class CentralDataService {
  // News operations
  async getNews(filters?: SearchFilters & { limit?: number; page?: number }): Promise<PaginatedResponse<News>> {
    const { limit = 10, page = 1, ...searchFilters } = filters || {};
    return enhancedNewsService.getAllNews(page, limit, searchFilters);
  }

  async getNewsById(id: string): Promise<News | null> {
    return enhancedNewsService.getNewsById(id);
  }

  async getFeaturedNews(limit = 3): Promise<News[]> {
    return enhancedNewsService.getFeaturedNews(limit);
  }

  async searchNews(query: string, limit = 10): Promise<PaginatedResponse<News>> {
    return enhancedNewsService.searchNews(query, 1, limit);
  }

  // Publications operations
  async getPublications(filters?: SearchFilters & { limit?: number; page?: number }): Promise<PaginatedResponse<Publication>> {
    const { limit = 10, page = 1, ...searchFilters } = filters || {};
    return enhancedPublicationService.getAllPublications(page, limit, searchFilters);
  }

  async getPublicationById(id: string): Promise<Publication | null> {
    return enhancedPublicationService.getPublicationById(id);
  }

  async downloadPublication(id: string): Promise<void> {
    return enhancedPublicationService.downloadPublication(id);
  }

  async searchPublications(query: string, limit = 10): Promise<PaginatedResponse<Publication>> {
    return enhancedPublicationService.searchPublications(query, 1, limit);
  }

  // Programs operations (using mock data for now)
  async getPrograms(limit?: number): Promise<PaginatedResponse<Program>> {
    return mockDataService.getAllPrograms(limit);
  }

  async getProgramById(id: string): Promise<Program | null> {
    return mockDataService.getProgramById(id);
  }

  // Opportunities operations (using mock data for now)
  async getOpportunities(limit?: number, type?: string): Promise<PaginatedResponse<Opportunity>> {
    return mockDataService.getAllOpportunities(limit, type);
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    return mockDataService.getOpportunityById(id);
  }

  // Analytics operations
  async trackEvent(eventName: string, properties: Record<string, any> = {}): Promise<void> {
    return enhancedAnalyticsService.trackEvent(eventName, properties);
  }

  async trackPageView(page: string, title?: string): Promise<void> {
    return enhancedAnalyticsService.trackPageView(page, title);
  }

  async trackDownload(resource: string, type: string): Promise<void> {
    return enhancedAnalyticsService.trackDownload(resource, type);
  }

  async trackSearch(query: string, resultsCount?: number): Promise<void> {
    return enhancedAnalyticsService.trackSearch(query, resultsCount);
  }

  // Universal search across all content types
  async universalSearch(query: string, limit = 20): Promise<{
    news: News[];
    publications: Publication[];
    programs: Program[];
    opportunities: Opportunity[];
  }> {
    try {
      const [newsResults, publicationResults, programResults, opportunityResults] = await Promise.allSettled([
        this.searchNews(query, Math.ceil(limit / 4)),
        this.searchPublications(query, Math.ceil(limit / 4)),
        Promise.resolve(mockDataService.getAllPrograms(Math.ceil(limit / 4))),
        Promise.resolve(mockDataService.getAllOpportunities(Math.ceil(limit / 4)))
      ]);

      // Track the search
      const totalResults = [newsResults, publicationResults, programResults, opportunityResults]
        .map(result => result.status === 'fulfilled' ? (result.value.data?.length || 0) : 0)
        .reduce((sum, count) => sum + count, 0);

      await this.trackSearch(query, totalResults);

      return {
        news: newsResults.status === 'fulfilled' ? newsResults.value.data : [],
        publications: publicationResults.status === 'fulfilled' ? publicationResults.value.data : [],
        programs: programResults.status === 'fulfilled' ? programResults.value.data : [],
        opportunities: opportunityResults.status === 'fulfilled' ? opportunityResults.value.data : []
      };
    } catch (error) {
      console.error('Universal search failed:', error);
      await enhancedAnalyticsService.trackError('universal_search_failed', query);
      return {
        news: [],
        publications: [],
        programs: [],
        opportunities: []
      };
    }
  }

  // Cache management
  clearAllCaches(): void {
    enhancedNewsService.clearCache();
    enhancedPublicationService.clearCache();
  }

  // Health check for all services
  async healthCheck(): Promise<{
    api: boolean;
    news: boolean;
    publications: boolean;
  }> {
    try {
      const [apiHealth, newsHealth, publicationsHealth] = await Promise.allSettled([
        fetch('/api/health').then(res => res.ok),
        this.getNews({ limit: 1 }).then(() => true),
        this.getPublications({ limit: 1 }).then(() => true)
      ]);

      return {
        api: apiHealth.status === 'fulfilled' ? apiHealth.value : false,
        news: newsHealth.status === 'fulfilled' ? newsHealth.value : false,
        publications: publicationsHealth.status === 'fulfilled' ? publicationsHealth.value : false
      };
    } catch (error) {
      return {
        api: false,
        news: false,
        publications: false
      };
    }
  }
}

// Export singleton instance
export const centralDataService = new CentralDataService();
export default centralDataService;
