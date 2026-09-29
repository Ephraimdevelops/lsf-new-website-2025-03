import { mockDataService } from "../mockDataService";
import type { News, PaginatedResponse, Publication, SearchFilters } from "@/types";

const emptyPage = <T>(): PaginatedResponse<T> => ({
  data: [],
  meta: { total: 0, page: 1, limit: 0, totalPages: 0 },
});

export const enhancedNewsService = {
  async getAllNews(page = 1, limit = 10, filters?: SearchFilters): Promise<PaginatedResponse<News>> {
    const response = filters?.query ? mockDataService.searchNews(filters.query) : mockDataService.getAllNews();
    return { ...response, data: response.data.slice((page - 1) * limit, page * limit) };
  },
  async getNewsById(id: string): Promise<News | null> {
    return mockDataService.getNewsById(id);
  },
  async getFeaturedNews(limit = 3): Promise<News[]> {
    return mockDataService.getAllNews(limit, true).data;
  },
  async searchNews(query: string, page = 1, limit = 10): Promise<PaginatedResponse<News>> {
    const response = mockDataService.searchNews(query);
    return { ...response, data: response.data.slice((page - 1) * limit, page * limit) };
  },
  clearCache(): void {
    return undefined;
  },
};

export const enhancedPublicationService = {
  async getAllPublications(page = 1, limit = 10, _filters?: SearchFilters): Promise<PaginatedResponse<Publication>> {
    const response = mockDataService.getAllPublications();
    return { ...response, data: response.data.slice((page - 1) * limit, page * limit) };
  },
  async getPublicationById(id: string): Promise<Publication | null> {
    return mockDataService.getPublicationById(id);
  },
  async downloadPublication(_id: string): Promise<void> {
    return undefined;
  },
  async searchPublications(query: string, page = 1, limit = 10): Promise<PaginatedResponse<Publication>> {
    const all = mockDataService.getAllPublications();
    const lower = query.toLowerCase();
    const response = {
      ...all,
      data: all.data.filter((publication) =>
        publication.title.toLowerCase().includes(lower) ||
        publication.description.toLowerCase().includes(lower) ||
        publication.category?.toLowerCase().includes(lower)
      ),
    };
    return { ...response, data: response.data.slice((page - 1) * limit, page * limit) };
  },
  clearCache(): void {
    return undefined;
  },
};

export const enhancedAnalyticsService = {
  async trackEvent(_eventName: string, _properties: Record<string, unknown> = {}): Promise<void> {
    return undefined;
  },
  async trackPageView(_page: string, _title?: string): Promise<void> {
    return undefined;
  },
  async trackDownload(_resource: string, _type: string): Promise<void> {
    return undefined;
  },
  async trackSearch(_query: string, _resultsCount?: number): Promise<void> {
    return undefined;
  },
  async trackError(_eventName: string, _context?: string): Promise<void> {
    return undefined;
  },
};

export { emptyPage };
