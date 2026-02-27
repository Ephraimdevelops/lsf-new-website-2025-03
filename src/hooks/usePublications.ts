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

export function usePublications(search?: string, category?: string): UsePublicationsResult {
  const normalizedCategory = category && category !== 'all' ? category.toLowerCase() : undefined;

  const publicationsData = useQuery(api.publications.get, {
    search: search || undefined,
    category: normalizedCategory
  });
  const featuredPublicationsData = useQuery(api.publications.getFeatured);

  // Map Convex _id to id and normalize field names for frontend compatibility
  const publications = (publicationsData || []).map((item: any) => ({
    ...item,
    id: item._id,
    date: item.publishedDate, // Map publishedDate to date for Publications.tsx
    excerpt: item.description, // Map description to excerpt for Publications.tsx
    image: item.coverImageUrl, // Map coverImageUrl to image for Publications.tsx
  })); // Backend now handles filtering
  const featuredPublications = (featuredPublicationsData || []).map((item: any) => ({
    ...item,
    id: item._id,
    date: item.publishedDate,
    excerpt: item.description,
    image: item.coverImageUrl,
  }));

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
