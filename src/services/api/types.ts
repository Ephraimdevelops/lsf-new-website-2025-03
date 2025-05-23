export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  slug: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  file: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  status?: string;
  is_open: boolean;
  deadline?: string;
  organization?: string;
  location?: string;
  created_at: string;
  application_url?: string;
}

export interface AnalyticsEvent {
  event_name: string;
  properties: Record<string, any>;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Add NewsPost type if it's missing
export interface NewsPost {
  id: number | string;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  date?: string;
  image?: string;
  category?: string;
}
