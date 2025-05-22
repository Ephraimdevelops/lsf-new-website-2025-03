
// Common interfaces for API responses

// Pagination interface
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// News interfaces
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
  author: string;
  tags: string[];
}

export interface NewsListItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

// Publication interfaces
export interface Publication {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  cover: string;
  fileUrl: string;
  fileSize: string;
  type: string;
  author?: string;
  tags?: string[];
}

// Program interfaces
export interface Program {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  color: string;
  objectives: string[];
  highlights?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

// Opportunity interfaces
export interface Opportunity {
  id: string;
  title: string;
  type: 'job' | 'tender' | 'grant' | 'other';
  description: string;
  deadline: string;
  location: string;
  status: 'open' | 'closed';
  fileUrl?: string;
}

// Analytics event interface
export interface AnalyticsEvent {
  event_name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}
