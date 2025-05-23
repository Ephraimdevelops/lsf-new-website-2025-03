
import newsService from './newsService';
import publicationService from './publicationService';
import programService from './programService';
import opportunityService from './opportunityService';
import analyticsService from './analyticsService';

export * from './types';
export { default as apiClient } from './client';

// Export all services
export { 
  newsService,
  publicationService,
  programService,
  opportunityService,
  analyticsService
};
