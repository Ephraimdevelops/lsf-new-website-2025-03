import { supabase } from '@/lib/supabase';
import { News, Publication, Program, Opportunity, Resource, PaginatedResponse, SearchFilters } from '@/types';

class SupabaseService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(method: string, params?: any): string {
    return `${method}_${JSON.stringify(params || {})}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // News methods
  async getAllNews(page = 1, limit = 10, filters?: SearchFilters): Promise<PaginatedResponse<News>> {
    const cacheKey = this.getCacheKey('getAllNews', { page, limit, filters });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const offset = (page - 1) * limit;
      const { data, error, count } = await query.range(offset, offset + limit - 1);

      if (error) throw error;

      const result: PaginatedResponse<News> = {
        data: data?.map(item => ({
          ...item,
          readTime: item.read_time
        })) as News[],
        meta: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    const cacheKey = this.getCacheKey('getNewsById', { id });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return {...data, readTime: data.read_time} as News;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      return null;
    }
  }

  async getFeaturedNews(limit = 3): Promise<News[]> {
    const cacheKey = this.getCacheKey('getFeaturedNews', { limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('featured', true)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data?.map(item => ({...item, readTime: item.read_time})) as News[];
    } catch (error) {
      console.error('Error fetching featured news:', error);
      return [];
    }
  }

  // Publications methods
  async getAllPublications(page = 1, limit = 10, filters?: SearchFilters): Promise<PaginatedResponse<Publication>> {
    const cacheKey = this.getCacheKey('getAllPublications', { page, limit, filters });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      let query = supabase
        .from('publications')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const offset = (page - 1) * limit;
      const { data, error, count } = await query.range(offset, offset + limit - 1);

      if (error) throw error;

      const result: PaginatedResponse<Publication> = {
        data: data?.map(item => ({
          ...item,
          file: item.file_url,
          downloadCount: item.download_count,
          fileSize: item.file_size
        })) as Publication[],
        meta: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching publications:', error);
      throw error;
    }
  }

  async getFeaturedPublications(limit = 3): Promise<Publication[]> {
    const cacheKey = this.getCacheKey('getFeaturedPublications', { limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('featured', true)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      this.setCache(cacheKey, data?.map(item => ({
        ...item,
        file: item.file_url,
        downloadCount: item.download_count,
        fileSize: item.file_size
      })));
      return data?.map(item => ({
        ...item,
        file: item.file_url,
        downloadCount: item.download_count,
        fileSize: item.file_size
      })) as Publication[];
    } catch (error) {
      console.error('Error fetching featured publications:', error);
      return [];
    }
  }

  // Programs methods
  async getAllPrograms(page = 1, limit = 10): Promise<PaginatedResponse<Program>> {
    const cacheKey = this.getCacheKey('getAllPrograms', { page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const offset = (page - 1) * limit;
      const { data, error, count } = await supabase
        .from('programs')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const result: PaginatedResponse<Program> = {
        data: data?.map(item => ({
          ...item,
          startDate: item.start_date,
          endDate: item.end_date,
          geographicCoverage: item.geographic_coverage,
          bestPractices: item.best_practices
        })) as Program[],
        meta: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  // Opportunities methods
  async getAllOpportunities(page = 1, limit = 10): Promise<PaginatedResponse<Opportunity>> {
    const cacheKey = this.getCacheKey('getAllOpportunities', { page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const offset = (page - 1) * limit;
      const { data, error, count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact' })
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const result: PaginatedResponse<Opportunity> = {
        data: data as Opportunity[],
        meta: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw error;
    }
  }

  async getFeaturedOpportunities(limit = 3): Promise<Opportunity[]> {
    const cacheKey = this.getCacheKey('getFeaturedOpportunities', { limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('featured', true)
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data as Opportunity[];
    } catch (error) {
      console.error('Error fetching featured opportunities:', error);
      return [];
    }
  }

  // Success Stories methods
  async getAllSuccessStories(page = 1, limit = 10): Promise<any[]> {
    const cacheKey = this.getCacheKey('getAllSuccessStories', { page, limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const offset = (page - 1) * limit;
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Error fetching success stories:', error);
      return [];
    }
  }

  async getFeaturedSuccessStories(limit = 3): Promise<any[]> {
    const cacheKey = this.getCacheKey('getFeaturedSuccessStories', { limit });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Error fetching featured success stories:', error);
      return [];
    }
  }

  // Hero content methods
  async getHeroSlides(): Promise<any[]> {
    const cacheKey = this.getCacheKey('getHeroSlides');
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('status', 'active')
        .order('order', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      return [];
    }
  }

  // Team members methods
  async getAllTeamMembers(): Promise<any[]> {
    const cacheKey = this.getCacheKey('getAllTeamMembers');
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  async getTeamMemberById(id: string): Promise<any | null> {
    const cacheKey = this.getCacheKey('getTeamMemberById', { id });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching team member by ID:', error);
      return null;
    }
  }

  async getTeamMembersByType(type: 'team' | 'board'): Promise<any[]> {
    const cacheKey = this.getCacheKey('getTeamMembersByType', { type });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('type', type)
        .order('order', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Error fetching team members by type:', error);
      return [];
    }
  }

  // Enhanced opportunities methods
  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const cacheKey = this.getCacheKey('getOpportunityById', { id });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data as Opportunity;
    } catch (error) {
      console.error('Error fetching opportunity by ID:', error);
      return null;
    }
  }

  // Enhanced news methods
  async getNewsBySlug(slug: string): Promise<News | null> {
    const cacheKey = this.getCacheKey('getNewsBySlug', { slug });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return {...data, readTime: data.read_time} as News;
    } catch (error) {
      console.error('Error fetching news by slug:', error);
      return null;
    }
  }

  // Enhanced publications methods
  async getPublicationBySlug(slug: string): Promise<Publication | null> {
    const cacheKey = this.getCacheKey('getPublicationBySlug', { slug });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return {
        ...data,
        file: data.file_url,
        downloadCount: data.download_count,
        fileSize: data.file_size
      } as Publication;
    } catch (error) {
      console.error('Error fetching publication by slug:', error);
      return null;
    }
  }

  // Search methods
  async searchNews(query: string, filters?: SearchFilters): Promise<News[]> {
    const cacheKey = this.getCacheKey('searchNews', { query, filters });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      let supabaseQuery = supabase
        .from('news')
        .select('*')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .order('date', { ascending: false });

      if (filters?.featured !== undefined) {
        supabaseQuery = supabaseQuery.eq('featured', filters.featured);
      }

      if (filters?.category) {
        supabaseQuery = supabaseQuery.eq('category', filters.category);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data?.map(item => ({...item, readTime: item.read_time})) as News[];
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  async searchPublications(query: string, filters?: SearchFilters): Promise<Publication[]> {
    const cacheKey = this.getCacheKey('searchPublications', { query, filters });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      let supabaseQuery = supabase
        .from('publications')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('date', { ascending: false });

      if (filters?.featured !== undefined) {
        supabaseQuery = supabaseQuery.eq('featured', filters.featured);
      }

      if (filters?.category) {
        supabaseQuery = supabaseQuery.eq('category', filters.category);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data?.map(item => ({
        ...item,
        file: item.file_url,
        downloadCount: item.download_count,
        fileSize: item.file_size
      })) as Publication[];
    } catch (error) {
      console.error('Error searching publications:', error);
      return [];
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;