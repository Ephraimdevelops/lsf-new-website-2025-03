export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;  // Rich text content
  summary: string;
  featuredImage: string;
  images: string[];
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  tags: string[];
  publishedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
  };
  readingTime?: number;
  category?: string;
}
