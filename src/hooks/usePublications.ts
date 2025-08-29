import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/api/supabaseService';
import { useToast } from './useToast';
import { Publication } from '@/types';

interface UsePublicationsResult {
  publications: Publication[];
  featuredPublications: Publication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchPublications: (query: string) => Promise<Publication[]>;
}

export function usePublications(): UsePublicationsResult {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [featuredPublications, setFeaturedPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const [allPublications, featured] = await Promise.all([
        supabaseService.getAllPublications(1, 50), // Get first 50 publications
        supabaseService.getFeaturedPublications(3)
      ]);
      
      setPublications(allPublications.data || []);
      setFeaturedPublications(featured);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
      toast({
        title: 'Error',
        description: 'Failed to fetch publications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const searchPublications = async (query: string): Promise<Publication[]> => {
    try {
      return await supabaseService.searchPublications(query);
    } catch (err) {
      console.error('Error searching publications:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return {
    publications,
    featuredPublications,
    loading,
    error,
    refetch: fetchPublications,
    searchPublications,
  };
}
