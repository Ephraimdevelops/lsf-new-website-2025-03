import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useToast } from '../hooks/useToast';
// We might need to adjust types if Story/CreateStoryInput don't match exactly
// import { Story, CreateStoryInput, UpdateStoryInput } from '../types/story';

interface UseStoriesResult {
  stories: any[]; // Using any for now to avoid strict type mismatch during migration
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createStory: (story: any) => Promise<void>;
  updateStory: (id: string, story: any) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
}

export function useStories(): UseStoriesResult {
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

  const updateStory = async (id: string, story: any) => {
    try {
      await updateMutation({ id: id as Id<"success_stories">, ...story });
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

  return {
    stories,
    loading,
    error: null,
    refetch: async () => { },
    createStory,
    updateStory,
    deleteStory,
  };
}
