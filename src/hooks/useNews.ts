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

export function useNews(): UseNewsResult {
  const newsData = useQuery(api.news.get);
  const featuredNewsData = useQuery(api.news.getFeatured);

  // Map Convex _id to id
  const news = (newsData || []).map((item: any) => ({ ...item, id: item._id }));
  const featuredNews = (featuredNewsData || []).map((item: any) => ({ ...item, id: item._id }));

  const loading = newsData === undefined || featuredNewsData === undefined;

  // Search is now handled by filtering the already loaded data or a specific search query
  // For simplicity and speed, we can filter client-side since we have the data, 
  // or implement a specific search query in Convex if dataset is large.
  // The original hook had an async search. We'll simulate that for compatibility.
  const searchNews = async (query: string): Promise<News[]> => {
    if (!news) return [];
    const lowerQuery = query.toLowerCase();
    return news.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.excerpt.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    news,
    featuredNews,
    loading,
    error: null, // Convex handles errors internally usually, or we can wrap
    refetch: async () => { }, // Convex updates automatically, no need to refetch manually
    searchNews,
  };
}
