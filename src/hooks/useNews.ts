import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { News } from '@/types';

interface UseNewsResult {
  news: News[];
  featuredNews: News[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchNews: (query: string) => Promise<News[]>;
}

export function useNews(search?: string, category?: string): UseNewsResult {
  const newsData = useQuery(api.news.get, {
    search: search || undefined,
    category: category === 'all' ? undefined : category
  });
  const featuredNewsData = useQuery(api.news.getFeatured);

  // Map Convex _id to id
  const news = (newsData || []).map((item: any) => ({ ...item, id: item._id }));
  const featuredNews = (featuredNewsData || []).map((item: any) => ({ ...item, id: item._id }));

  const loading = newsData === undefined || featuredNewsData === undefined;

  // Search is now handled reactively by the backend query
  const searchNews = async (query: string): Promise<News[]> => {
    // This is maintained for compatibility but the UI should rely on the reactive 'news' array
    return [];
  };

  return {
    news,
    featuredNews,
    loading,
    error: null,
    refetch: async () => { },
    searchNews,
  };
}
