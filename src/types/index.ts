// Centralized type definitions for the entire application
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface News extends BaseEntity {
  title: string;
  content: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  featured?: boolean;
  readTime?: string;
  author?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface Publication extends BaseEntity {
  title: string;
  description: string;
  excerpt?: string;
  date: string;
  image: string;
  file: string;
  type: 'report' | 'policy-brief' | 'research' | 'guide' | 'newsletter' | 'annual-report';
  featured?: boolean;
  downloadCount?: number;
  fileSize?: string;
  pages?: string;
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface Program extends BaseEntity {
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status?: 'active' | 'completed' | 'planned';
  location?: string[];
  objectives?: string[];
  approach?: string;
  beneficiaries?: {
    total?: number;
    women?: number;
    children?: number;
    disputes?: number;
  };
  geographicCoverage?: string[];
  results?: {
    title: string;
    value: string;
  }[];
  donors?: string[];
  partners?: string[];
  bestPractices?: string[];
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
  gallery?: string[];
  budget?: number;
  featured?: boolean;
}

export interface Opportunity extends BaseEntity {
  title: string;
  description: string;
  type: 'job' | 'tender' | 'grant' | 'internship' | 'volunteer' | 'partnership';
  status: 'open' | 'closed' | 'draft';
  is_open: boolean;
  deadline?: string;
  organization?: string;
  location?: string;
  requirements?: string[];
  responsibilities?: string[];
  application_url?: string;
  salary_range?: string;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'temporary';
  featured?: boolean;
}

export interface TeamMember extends BaseEntity {
  name: string;
  position: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  expertise?: string[];
  department?: string;
  featured?: boolean;
}

export interface Partner extends BaseEntity {
  name: string;
  description: string;
  logo: string;
  website?: string;
  type: 'donor' | 'implementing' | 'strategic' | 'government' | 'civil-society';
  partnership_since?: string;
  featured?: boolean;
}

export interface Resource extends BaseEntity {
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'tool';
  category: 'climate-justice' | 'gender-justice' | 'legal-empowerment' | 'general';
  url: string;
  image?: string;
  featured?: boolean;
  downloadCount?: number;
}

export interface AnalyticsEvent {
  event_name: string;
  properties: Record<string, any>;
  timestamp: number;
  user_id?: string;
  session_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  status?: string;
  location?: string;
}

// Legacy compatibility - keeping for backward compatibility
export interface NewsPost extends News {}
