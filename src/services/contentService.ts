import api from '@/lib/axios';

// Types for all content
export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  coverImageUrl: string;
  category: string;
  publishedDate: string;
  authors?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedDate: string;
  author: string;
  tags?: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'job' | 'grant' | 'tender' | 'other';
  deadline: string;
  status: 'open' | 'closed';
  applicationLink?: string;
  requirements?: string[];
}

export interface SuccessStory {
  id: string;
  title: string;
  story: string;
  personName: string;
  location: string;
  imageUrl: string;
  impactMetrics?: {
    [key: string]: string | number;
  };
}

// Content Service
class ContentService {
  // Hero Slides
  async getHeroSlides(): Promise<HeroSlide[]> {
    const response = await api.get('/content/hero-slides');
    return response.data;
  }

  async updateHeroSlide(slide: HeroSlide): Promise<HeroSlide> {
    if (slide.id) {
      const response = await api.put(`/content/hero-slides/${slide.id}`, slide);
      return response.data;
    } else {
      const response = await api.post('/content/hero-slides', slide);
      return response.data;
    }
  }

  async deleteHeroSlide(id: string): Promise<void> {
    await api.delete(`/content/hero-slides/${id}`);
  }

  // Publications
  async getPublications(category?: string): Promise<Publication[]> {
    const params = category ? { category } : {};
    const response = await api.get('/content/publications', { params });
    return response.data;
  }

  async updatePublication(publication: Publication): Promise<Publication> {
    if (publication.id) {
      const response = await api.put(`/content/publications/${publication.id}`, publication);
      return response.data;
    } else {
      const response = await api.post('/content/publications', publication);
      return response.data;
    }
  }

  // Stories
  async getStories(): Promise<SuccessStory[]> {
    const response = await api.get('/content/stories');
    return response.data;
  }

  async updateStory(story: SuccessStory): Promise<SuccessStory> {
    if (story.id) {
      const response = await api.put(`/content/stories/${story.id}`, story);
      return response.data;
    } else {
      const response = await api.post('/content/stories', story);
      return response.data;
    }
  }

  async deleteStory(id: string): Promise<void> {
    await api.delete(`/content/stories/${id}`);
  }

  // News
  async getNews(category?: string): Promise<NewsItem[]> {
    const params = category ? { category } : {};
    const response = await api.get('/content/news', { params });
    return response.data;
  }

  async updateNewsItem(newsItem: NewsItem): Promise<NewsItem> {
    if (newsItem.id) {
      const response = await api.put(`/content/news/${newsItem.id}`, newsItem);
      return response.data;
    } else {
      const response = await api.post('/content/news', newsItem);
      return response.data;
    }
  }

  async deleteNewsItem(id: string): Promise<void> {
    await api.delete(`/content/news/${id}`);
  }

  // Opportunities
  async getOpportunities(type?: string): Promise<Opportunity[]> {
    const params = type ? { type } : {};
    const response = await api.get('/content/opportunities', { params });
    return response.data;
  }

  async updateOpportunity(opportunity: Opportunity): Promise<Opportunity> {
    if (opportunity.id) {
      const response = await api.put(`/content/opportunities/${opportunity.id}`, opportunity);
      return response.data;
    } else {
      const response = await api.post('/content/opportunities', opportunity);
      return response.data;
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    await api.delete(`/content/opportunities/${id}`);
  }

  // Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    const response = await api.get('/content/success-stories');
    return response.data;
  }

  async updateSuccessStory(story: SuccessStory): Promise<SuccessStory> {
    if (story.id) {
      const response = await api.put(`/content/success-stories/${story.id}`, story);
      return response.data;
    } else {
      const response = await api.post('/content/success-stories', story);
      return response.data;
    }
  }

  async deleteSuccessStory(id: string): Promise<void> {
    await api.delete(`/content/success-stories/${id}`);
  }

  // File Upload Helper
  async uploadFile(file: File, contentType: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    
    const response = await api.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  }
}

export const contentService = new ContentService();
export default contentService;
