export interface SuccessStory {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  location: string;
  featuredImage: string;
  images: string[];
  beneficiary: {
    name: string;
    age?: number;
    location: string;
    image?: string;
  };
  paralegal: {
    name: string;
    image?: string;
    quote?: string;
  };
  impact: {
    description: string;
    metrics?: {
      label: string;
      value: string;
    }[];
  };
  publishedAt: string;
  tags: string[];
}
