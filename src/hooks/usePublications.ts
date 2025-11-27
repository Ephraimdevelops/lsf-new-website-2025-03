import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  const publicationsData = useQuery(api.publications.get);
  const featuredPublicationsData = useQuery(api.publications.getFeatured);

  // Map Convex _id to id
  const publications = (publicationsData || []).map((item: any) => ({ ...item, id: item._id }));
  const featuredPublications = (featuredPublicationsData || []).map((item: any) => ({ ...item, id: item._id }));

  const loading = publicationsData === undefined || featuredPublicationsData === undefined;

  const searchPublications = async (query: string): Promise<Publication[]> => {
    if (!publications) return [];
    const lowerQuery = query.toLowerCase();
    return publications.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    publications,
    featuredPublications,
    loading,
    error: null,
    refetch: async () => { },
    searchPublications,
  };
}
