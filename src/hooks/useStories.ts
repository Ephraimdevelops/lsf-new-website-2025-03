import { useState, useEffect } from 'react';
import axios from 'axios';

interface Story {
  id: string;
  name: string;
  heading: string;
  location: string;
  publishedDate: string;
  imageUrl: string;
  thumbnailUrl?: string;
  brief: string;
  quote: string;
  category: string;
}

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
}

export const useStories = (): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('/api/stories'); // Replace with your actual API endpoint
        setStories(response.data);
      } catch (err) {
        setError('Failed to fetch stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
};
