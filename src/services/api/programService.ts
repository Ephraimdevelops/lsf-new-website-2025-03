
import apiClient from './client';
import { Program, PaginatedResponse } from './types';

export const programService = {
  // Get paginated programs
  getPrograms: async (page = 1, perPage = 10) => {
    const response = await apiClient.get<PaginatedResponse<Program>>('/programs', {
      params: { page, per_page: perPage }
    });
    return response.data;
  },
  
  // Get a single program by slug
  getProgramBySlug: async (slug: string) => {
    const response = await apiClient.get<Program>(`/programs/${slug}`);
    return response.data;
  },
  
  // Get all programs (no pagination)
  getAllPrograms: async () => {
    const response = await apiClient.get<Program[]>('/programs/all');
    return response.data;
  },
  
  // Create a new program (admin)
  createProgram: async (programData: Omit<Program, 'id' | 'created_at' | 'updated_at'>) => {
    const formData = new FormData();
    
    // Append all data to FormData to handle image uploads
    Object.entries(programData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    const response = await apiClient.post<Program>('/programs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Update an existing program (admin)
  updateProgram: async (id: number, programData: Partial<Program>) => {
    const formData = new FormData();
    
    // Append all data to FormData to handle image uploads
    Object.entries(programData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
    const response = await apiClient.post<Program>(`/programs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Delete a program (admin)
  deleteProgram: async (id: number) => {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data;
  }
};
