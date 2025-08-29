import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/api/supabaseService';
import { useToast } from './useToast';
import { Opportunity } from '@/types';

interface UseOpportunitiesResult {
  opportunities: Opportunity[];
  featuredOpportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOpportunities(): UseOpportunitiesResult {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const [allOpportunities, featured] = await Promise.all([
        supabaseService.getAllOpportunities(1, 50), // Get first 50 opportunities
        supabaseService.getFeaturedOpportunities(3)
      ]);
      
      setOpportunities(allOpportunities.data || []);
      setFeaturedOpportunities(featured);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
      toast({
        title: 'Error',
        description: 'Failed to fetch opportunities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    featuredOpportunities,
    loading,
    error,
    refetch: fetchOpportunities,
  };
}
