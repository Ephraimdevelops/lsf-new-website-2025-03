export interface Story {
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

export type CreateStoryInput = Omit<Story, 'id'>;
export type UpdateStoryInput = Partial<Story>;
