
// Common types used across API services

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// News/Blog post types
export interface NewsPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category_id: number;
  category?: Category;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  views_count?: number;
}

// Publication types
export interface Publication {
  id: number;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
  category: string;
  type: string;
  date: string;
  downloads_count?: number;
  created_at: string;
  updated_at: string;
}

// Program types
export interface Program {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Analytics data types
export interface AnalyticsData {
  visitors_count: number;
  page_views: number;
  downloads_count: number;
  popular_pages: Array<{name: string, views: number}>;
  traffic_sources: Array<{source: string, count: number}>;
  visitor_trends: Array<{date: string, count: number}>;
}

// Opportunity types
export interface Opportunity {
  id: number;
  title: string;
  type: 'job' | 'tender' | 'grant';
  description: string;
  deadline: string;
  is_open: boolean;
  application_url?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Settings type
export interface Settings {
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
}
