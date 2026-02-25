
// Centralized data service for consistent data across components
export interface Publication {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  type: 'report' | 'policy-brief' | 'research' | 'guide' | 'newsletter';
  image: string;
  downloadUrl?: string;
  pdfUrl?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

// Sample publications data
const publicationsData: Publication[] = [
  {
    id: 'annual-report-2023',
    title: 'LSF Annual Report 2023: Advancing Justice Through Legal Empowerment',
    excerpt: 'Our comprehensive annual report showcasing the impact of legal aid services across Tanzania in 2023.',
    date: '2024-01-15',
    type: 'report',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/lsf-annual-report-2023.pdf',
    featured: true,
    seoTitle: 'LSF Annual Report 2023 - Legal Services Facility Tanzania',
    seoDescription: 'Download our 2023 annual report highlighting legal empowerment achievements across Tanzania.',
    keywords: ['annual report', 'legal aid', 'Tanzania', 'justice', 'empowerment']
  },
  {
    id: 'gender-justice-policy-brief',
    title: 'Policy Brief: Strengthening Gender Justice Mechanisms in Tanzania',
    excerpt: 'Analysis and recommendations for improving gender justice systems and women\'s access to legal services.',
    date: '2023-11-20',
    type: 'policy-brief',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/gender-justice-policy-brief.pdf',
    featured: true,
    seoTitle: 'Gender Justice Policy Brief - Women\'s Rights Tanzania',
    seoDescription: 'Policy recommendations for strengthening gender justice mechanisms in Tanzania.',
    keywords: ['gender justice', 'women rights', 'policy', 'Tanzania', 'legal reform']
  },
  {
    id: 'paralegal-training-guide',
    title: 'Community Paralegal Training Guide: Building Legal Capacity at Grassroots',
    excerpt: 'Comprehensive training manual for community paralegals working in rural and urban communities.',
    date: '2023-09-10',
    type: 'guide',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/paralegal-training-guide.pdf',
    featured: false,
    seoTitle: 'Paralegal Training Guide - Community Legal Education',
    seoDescription: 'Comprehensive training guide for community paralegals in Tanzania.',
    keywords: ['paralegal training', 'community education', 'legal capacity', 'grassroots']
  }
];

// Sample news data
const newsData: NewsItem[] = [
  {
    id: 'mama-samia-legal-aid',
    title: "Mama Samia Legal Aid Campaign Reaches 15,000+ Citizens",
    excerpt: "The nationwide campaign provided free legal services to vulnerable communities across Tanzania, focusing on women's rights, land disputes, and family law matters.",
    date: "2024-04-30",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Legal Empowerment",
    featured: true,
    seoTitle: "Mama Samia Legal Aid Campaign - 15,000+ Citizens Served",
    seoDescription: "LSF's nationwide legal aid campaign reaches over 15,000 vulnerable community members.",
    keywords: ['legal aid', 'campaign', 'Tanzania', 'women rights', 'community service']
  },
  {
    id: 'haki-yangu-app-launch',
    title: "Haki Yangu Mobile App Expands Access to Legal Services",
    excerpt: "LSF's digital transformation initiative has successfully connected over 5,000 users with legal resources and support through the new Haki Yangu mobile application.",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Digital Transformation",
    featured: true,
    seoTitle: "Haki Yangu App Launch - Digital Legal Services Tanzania",
    seoDescription: "New mobile app connects 5,000+ users with legal resources and support services.",
    keywords: ['mobile app', 'digital services', 'legal technology', 'innovation']
  },
  {
    id: 'climate-justice-initiative',
    title: "New Climate Justice Initiative Tackles Environmental Legal Challenges",
    excerpt: "LSF launches a groundbreaking program to address climate-related legal issues affecting communities across Tanzania.",
    date: "2024-02-22",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Climate Justice",
    featured: false,
    seoTitle: "Climate Justice Initiative - Environmental Legal Support",
    seoDescription: "New program addresses climate-related legal challenges in Tanzanian communities.",
    keywords: ['climate justice', 'environmental law', 'sustainability', 'legal support']
  }
];

export const dataService = {
  // Publications
  getPublications: (limit?: number, featured?: boolean): Publication[] => {
    let filtered = publicationsData;
    if (featured !== undefined) {
      filtered = filtered.filter(pub => pub.featured === featured);
    }
    if (limit) {
      return filtered.slice(0, limit);
    }
    return filtered;
  },

  getPublicationById: (id: string): Publication | undefined => {
    return publicationsData.find(pub => pub.id === id);
  },

  // News
  getNews: (limit?: number, featured?: boolean): NewsItem[] => {
    let filtered = newsData;
    if (featured !== undefined) {
      filtered = filtered.filter(news => news.featured === featured);
    }
    if (limit) {
      return filtered.slice(0, limit);
    }
    return filtered;
  },

  getNewsById: (id: string): NewsItem | undefined => {
    return newsData.find(news => news.id === id);
  },

  // Search functionality
  searchPublications: (query: string): Publication[] => {
    return publicationsData.filter(pub =>
      pub.title.toLowerCase().includes(query.toLowerCase()) ||
      pub.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  },

  searchNews: (query: string): NewsItem[] => {
    return newsData.filter(news =>
      news.title.toLowerCase().includes(query.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  }
};
