
// Enhanced API services with comprehensive error handling and mock data fallbacks
export { apiClient as enhancedApiClient } from './enhancedClient';
export { enhancedNewsService } from './enhancedNewsService';
export { enhancedPublicationService } from './enhancedPublicationService';
export { enhancedAnalyticsService } from './enhancedAnalyticsService';

// Legacy exports for backward compatibility
export { default as programService } from './programService';
export { default as opportunityService } from './opportunityService';

// Enhanced services as defaults
import { enhancedNewsService } from './enhancedNewsService';
import { enhancedPublicationService } from './enhancedPublicationService';
import { enhancedAnalyticsService } from './enhancedAnalyticsService';

export const newsService = enhancedNewsService;
export const publicationService = enhancedPublicationService;
export const analyticsService = enhancedAnalyticsService;
