import { supabase } from '@/lib/supabase';
import { SuccessStory } from '@/types';

export const storiesService = {
  async getStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getStoryById(id: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createStory(story: Omit<SuccessStory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('stories')
      .insert([story])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStory(id: string, story: Partial<SuccessStory>) {
    const { data, error } = await supabase
      .from('stories')
      .update(story)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStory(id: string) {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
