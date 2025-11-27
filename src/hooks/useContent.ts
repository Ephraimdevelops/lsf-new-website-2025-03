import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useToast } from '@/hooks/use-toast';

// Hook for Success Stories
export const useSuccessStories = () => {
  const storiesData = useQuery(api.stories.get);
  const createMutation = useMutation(api.stories.create);
  const updateMutation = useMutation(api.stories.update);
  const deleteMutation = useMutation(api.stories.remove);
  const { toast } = useToast();

  const stories = (storiesData || []).map((item: any) => ({ ...item, id: item._id }));
  const loading = storiesData === undefined;

  const createStory = async (story: any) => {
    try {
      await createMutation(story);
      toast({ title: 'Success', description: 'Story created successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create story', variant: 'destructive' });
      throw err;
    }
  };

  const updateStory = async (story: any) => {
    try {
      const { id, ...rest } = story;
      await updateMutation({ id: id as Id<"success_stories">, ...rest });
      toast({ title: 'Success', description: 'Story updated successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update story', variant: 'destructive' });
      throw err;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await deleteMutation({ id: id as Id<"success_stories"> });
      toast({ title: 'Success', description: 'Story deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete story', variant: 'destructive' });
      throw err;
    }
  };

  return { stories, loading, error: null, createStory, updateStory, deleteStory, refetch: async () => { } };
};

// Hook for Hero Slides
export const useHeroSlides = () => {
  const slidesData = useQuery(api.hero.get);
  const createMutation = useMutation(api.hero.create);
  const updateMutation = useMutation(api.hero.update);
  const deleteMutation = useMutation(api.hero.remove);
  const { toast } = useToast();

  const slides = (slidesData || []).map((item: any) => ({ ...item, id: item._id }));
  const loading = slidesData === undefined;

  const createSlide = async (slide: any) => {
    try {
      await createMutation(slide);
      toast({ title: 'Success', description: 'Hero slide created successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create hero slide', variant: 'destructive' });
      throw err;
    }
  };

  const updateSlide = async (slide: any) => {
    try {
      const { id, ...rest } = slide;
      if (id) {
        await updateMutation({ id: id as Id<"hero_slides">, ...rest });
      } else {
        await createMutation(rest);
      }
      toast({ title: 'Success', description: 'Hero slide saved successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save hero slide', variant: 'destructive' });
      throw err;
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      await deleteMutation({ id: id as Id<"hero_slides"> });
      toast({ title: 'Success', description: 'Hero slide deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete hero slide', variant: 'destructive' });
      throw err;
    }
  };

  return { slides, loading, error: null, createSlide, updateSlide, deleteSlide, refetch: async () => { } };
};

// Hook for Publications
export const usePublications = (category?: string) => {
  const publicationsData = useQuery(api.publications.get);
  const createMutation = useMutation(api.publications.create);
  const updateMutation = useMutation(api.publications.update);
  const deleteMutation = useMutation(api.publications.remove);
  const { toast } = useToast();

  let publications = (publicationsData || []).map((item: any) => ({ ...item, id: item._id }));

  if (category && category !== 'all') {
    publications = publications.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
  }

  const loading = publicationsData === undefined;

  const createPublication = async (publication: any) => {
    try {
      await createMutation(publication);
      toast({ title: 'Success', description: 'Publication created successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create publication', variant: 'destructive' });
      throw err;
    }
  };

  const updatePublication = async (publication: any) => {
    try {
      const { id, ...rest } = publication;
      if (id) {
        await updateMutation({ id: id as Id<"publications">, ...rest });
      } else {
        await createMutation(rest);
      }
      toast({ title: 'Success', description: 'Publication saved successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save publication', variant: 'destructive' });
      throw err;
    }
  };

  const deletePublication = async (id: string) => {
    try {
      await deleteMutation({ id: id as Id<"publications"> });
      toast({ title: 'Success', description: 'Publication deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete publication', variant: 'destructive' });
      throw err;
    }
  };

  return { publications, loading, error: null, createPublication, updatePublication, deletePublication, refetch: async () => { } };
};

// Hook for News
export const useNews = (category?: string) => {
  const newsData = useQuery(api.news.get);
  const createMutation = useMutation(api.news.create);
  const updateMutation = useMutation(api.news.update);
  const deleteMutation = useMutation(api.news.remove);
  const { toast } = useToast();

  let news = (newsData || []).map((item: any) => ({ ...item, id: item._id }));

  if (category && category !== 'all') {
    news = news.filter((n: any) => n.category?.toLowerCase() === category.toLowerCase());
  }

  const loading = newsData === undefined;

  const createNewsItem = async (newsItem: any) => {
    try {
      await createMutation(newsItem);
      toast({ title: 'Success', description: 'News item created successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create news item', variant: 'destructive' });
      throw err;
    }
  };

  const updateNewsItem = async (newsItem: any) => {
    try {
      const { id, ...rest } = newsItem;
      if (id) {
        await updateMutation({ id: id as Id<"news">, ...rest });
      } else {
        await createMutation(rest);
      }
      toast({ title: 'Success', description: 'News item saved successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save news item', variant: 'destructive' });
      throw err;
    }
  };

  const deleteNewsItem = async (id: string) => {
    try {
      await deleteMutation({ id: id as Id<"news"> });
      toast({ title: 'Success', description: 'News item deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete news item', variant: 'destructive' });
      throw err;
    }
  };

  return { news, loading, error: null, createNewsItem, updateNewsItem, deleteNewsItem, refetch: async () => { } };
};

// Hook for Opportunities
export const useOpportunities = (type?: string) => {
  const opportunitiesData = useQuery(api.opportunities.get);
  const createMutation = useMutation(api.opportunities.create);
  const updateMutation = useMutation(api.opportunities.update);
  const deleteMutation = useMutation(api.opportunities.remove);
  const { toast } = useToast();

  let opportunities = (opportunitiesData || []).map((item: any) => ({ ...item, id: item._id }));

  if (type && type !== 'all') {
    opportunities = opportunities.filter((o: any) => o.type?.toLowerCase() === type.toLowerCase());
  }

  const loading = opportunitiesData === undefined;

  const createOpportunity = async (opportunity: any) => {
    try {
      await createMutation(opportunity);
      toast({ title: 'Success', description: 'Opportunity created successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create opportunity', variant: 'destructive' });
      throw err;
    }
  };

  const updateOpportunity = async (opportunity: any) => {
    try {
      const { id, ...rest } = opportunity;
      if (id) {
        await updateMutation({ id: id as Id<"opportunities">, ...rest });
      } else {
        await createMutation(rest);
      }
      toast({ title: 'Success', description: 'Opportunity saved successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save opportunity', variant: 'destructive' });
      throw err;
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      await deleteMutation({ id: id as Id<"opportunities"> });
      toast({ title: 'Success', description: 'Opportunity deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete opportunity', variant: 'destructive' });
      throw err;
    }
  };

  return { opportunities, loading, error: null, createOpportunity, updateOpportunity, deleteOpportunity, refetch: async () => { } };
};
