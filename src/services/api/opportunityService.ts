
import apiClient from './client';
import { Opportunity, PaginatedResponse } from './types';

export const opportunityService = {
  // Get paginated opportunities
  getOpportunities: async (page = 1, perPage = 10, type?: string) => {
    const response = await apiClient.get<PaginatedResponse<Opportunity>>('/opportunities', {
      params: { page, per_page: perPage, type }
    });
    return response.data;
  },
  
  // Get a single opportunity by id
  getOpportunityById: async (id: number) => {
    const response = await apiClient.get<Opportunity>(`/opportunities/${id}`);
    return response.data;
  },
  
  // Get open opportunities
  getOpenOpportunities: async (limit = 5) => {
    const response = await apiClient.get<Opportunity[]>('/opportunities/open', {
      params: { limit }
    });
    return response.data;
  },
  
  // Create a new opportunity (admin)
  createOpportunity: async (opportunityData: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post<Opportunity>('/opportunities', opportunityData);
    return response.data;
  },
  
  // Update an existing opportunity (admin)
  updateOpportunity: async (id: number, opportunityData: Partial<Opportunity>) => {
    const response = await apiClient.put<Opportunity>(`/opportunities/${id}`, opportunityData);
    return response.data;
  },
  
  // Delete an opportunity (admin)
  deleteOpportunity: async (id: number) => {
    const response = await apiClient.delete(`/opportunities/${id}`);
    return response.data;
  }
};
