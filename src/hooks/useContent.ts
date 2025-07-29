import { useState, useEffect, useCallback } from 'react';
import contentService, { 
  HeroSlide,
  Publication,
  NewsItem,
  Opportunity,
  SuccessStory
} from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

// Hook for Success Stories
export const useStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.getStories();
      setStories(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch success stories');
      toast({
        title: 'Error',
        description: 'Failed to fetch success stories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchStories();
  }, [fetchStories]);

  return { stories, loading, error, refetch: fetchStories };
};

// Hook for Hero Slides
export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.getHeroSlides();
      setSlides(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hero slides');
      toast({
        title: 'Error',
        description: 'Failed to fetch hero slides',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchSlides();
  }, [fetchSlides]);

  const updateSlide = async (slide: HeroSlide) => {
    try {
      const updatedSlide = await contentService.updateHeroSlide(slide);
      setSlides(current => 
        current.map(s => s.id === updatedSlide.id ? updatedSlide : s)
      );
      toast({
        title: 'Success',
        description: 'Hero slide updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update hero slide',
        variant: 'destructive',
      });
    }
  };

  return { slides, loading, error, updateSlide, refetch: fetchSlides };
};

// Hook for Publications
export const usePublications = (category?: string) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.getPublications(category);
      setPublications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch publications');
      toast({
        title: 'Error',
        description: 'Failed to fetch publications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [category, toast]);

  useEffect(() => {
    void fetchPublications();
  }, [fetchPublications]);

  return { publications, loading, error, refetch: fetchPublications };
};

// Hook for News
export const useNews = (category?: string) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.getNews(category);
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news');
      toast({
        title: 'Error',
        description: 'Failed to fetch news',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [category, toast]);

  useEffect(() => {
    void fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
};

// Hook for Opportunities
export const useOpportunities = (type?: string) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.getOpportunities(type);
      setOpportunities(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch opportunities');
      toast({
        title: 'Error',
        description: 'Failed to fetch opportunities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [type, toast]);

  useEffect(() => {
    void fetchOpportunities();
  }, [fetchOpportunities]);

  return { opportunities, loading, error, refetch: fetchOpportunities };
};




