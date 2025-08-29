import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/api/supabaseService';
import { useToast } from './useToast';
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
  const [news, setNews] = useState<News[]>([]);
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const [allNews, featured] = await Promise.all([
        supabaseService.getAllNews(1, 50), // Get first 50 news articles
        supabaseService.getFeaturedNews(5) // Get 5 featured articles for hero
      ]);
      
      setNews(allNews.data || []);
      setFeaturedNews(featured);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      toast({
        title: 'Error',
        description: 'Failed to fetch news',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const searchNews = async (query: string): Promise<News[]> => {
    try {
      return await supabaseService.searchNews(query);
    } catch (err) {
      console.error('Error searching news:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    featuredNews,
    loading,
    error,
    refetch: fetchNews,
    searchNews,
  };
}
