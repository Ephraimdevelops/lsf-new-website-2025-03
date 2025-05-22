
import apiClient from './client';
import { Program } from './types';

const programService = {
  // Get all programs
  getAllPrograms: async (): Promise<Program[]> => {
    try {
      return await apiClient.get('/programs');
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },
  
  // Get a single program by id
  getProgramById: async (id: string): Promise<Program> => {
    try {
      return await apiClient.get(`/programs/${id}`);
    } catch (error) {
      console.error(`Error fetching program with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get featured programs (for homepage)
  getFeaturedPrograms: async (): Promise<Program[]> => {
    try {
      return await apiClient.get('/programs/featured');
    } catch (error) {
      console.error('Error fetching featured programs:', error);
      throw error;
    }
  }
};

export default programService;
