import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Opportunity } from '@/types';

interface UseOpportunitiesResult {
  opportunities: Opportunity[];
  featuredOpportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOpportunities(): UseOpportunitiesResult {
  const opportunitiesData = useQuery(api.opportunities.get);

  // Map Convex _id to id
  const opportunities = (opportunitiesData || []).map((item: any) => ({ ...item, id: item._id }));

  // Filter featured in memory for now (or add backend query)
  const featuredOpportunities = opportunities.filter((item: any) => item.featured === true).slice(0, 3);

  const loading = opportunitiesData === undefined;

  return {
    opportunities,
    featuredOpportunities,
    loading,
    error: null,
    refetch: async () => { },
  };
}
