
import apiClient from './client';
import { Opportunity, PaginatedResponse } from './types';

const opportunityService = {
  // Get a paginated list of opportunities
  getAllOpportunities: async (page = 1, limit = 10, type?: string, status = 'open'): Promise<PaginatedResponse<Opportunity>> => {
    const params = { 
      page, 
      limit,
      status,
      ...(type && { type })
    };
    
    try {
      return await apiClient.get('/opportunities', { params });
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw error;
    }
  },
  
  // Get a single opportunity by id
  getOpportunityById: async (id: string): Promise<Opportunity> => {
    try {
      return await apiClient.get(`/opportunities/${id}`);
    } catch (error) {
      console.error(`Error fetching opportunity with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get opportunities by type (job, tender, grant, etc.)
  getOpportunitiesByType: async (type: string, page = 1, limit = 10): Promise<PaginatedResponse<Opportunity>> => {
    try {
      return await apiClient.get(`/opportunities/type/${type}`, { 
        params: { page, limit } 
      });
    } catch (error) {
      console.error(`Error fetching opportunities for type ${type}:`, error);
      throw error;
    }
  }
};

export default opportunityService;
