
import { News, Publication, Program, Opportunity, TeamMember, Partner, Resource, PaginatedResponse } from '@/types';

// Comprehensive mock data for development and fallback
const mockNews: News[] = [
  {
    id: 'mama-samia-legal-aid',
    title: "Mama Samia Legal Aid Campaign Reaches 15,000+ Citizens",
    content: "The nationwide Mama Samia Legal Aid Campaign has successfully provided free legal services to over 15,000 vulnerable community members across Tanzania. This groundbreaking initiative, launched in collaboration with the Ministry of Justice, focuses on addressing critical legal needs in rural and underserved urban areas.\n\nThe campaign has particularly emphasized women's rights, land disputes, and family law matters, areas where legal support has historically been limited. Through mobile legal clinics and community outreach programs, the campaign has reached remote villages that previously had no access to legal aid services.\n\nKey achievements include resolving over 3,500 land disputes, providing legal representation for 2,100 women in domestic violence cases, and facilitating the registration of 1,800 birth certificates for children who previously lacked legal documentation.",
    excerpt: "The nationwide campaign provided free legal services to vulnerable communities across Tanzania, focusing on women's rights, land disputes, and family law matters.",
    date: "2024-04-30",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Legal Empowerment",
    slug: "mama-samia-legal-aid-campaign-reaches-15000-citizens",
    featured: true,
    readTime: "5 min",
    author: "LSF Communications Team",
    tags: ["legal aid", "campaign", "Tanzania", "women rights", "community service"],
    seoTitle: "Mama Samia Legal Aid Campaign - 15,000+ Citizens Served",
    seoDescription: "LSF's nationwide legal aid campaign reaches over 15,000 vulnerable community members.",
    keywords: ["legal aid", "campaign", "Tanzania", "women rights", "community service"],
    created_at: "2024-04-30T10:00:00Z"
  },
  {
    id: 'haki-yangu-app-launch',
    title: "Haki Yangu Mobile App Expands Access to Legal Services",
    content: "The Legal Services Facility has launched the revolutionary Haki Yangu mobile application, marking a significant milestone in Tanzania's digital transformation of legal services. The app has already connected over 5,000 users with legal resources, paralegal support, and essential legal information.\n\nHaki Yangu (My Rights) provides users with instant access to legal guidance, connects them with qualified paralegals in their area, and offers a comprehensive library of legal resources in both Swahili and English. The app also features an innovative dispute resolution system that helps users resolve minor conflicts without formal court proceedings.\n\nSince its launch three months ago, the app has facilitated over 2,300 legal consultations, helped resolve 890 disputes through alternative dispute resolution mechanisms, and provided legal education to thousands of users across Tanzania.",
    excerpt: "LSF's digital transformation initiative has successfully connected over 5,000 users with legal resources and support through the new Haki Yangu mobile application.",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Digital Transformation",
    slug: "haki-yangu-mobile-app-expands-access-legal-services",
    featured: true,
    readTime: "4 min",
    author: "Technology Team",
    tags: ["mobile app", "digital services", "legal technology", "innovation"],
    seoTitle: "Haki Yangu App Launch - Digital Legal Services Tanzania",
    seoDescription: "New mobile app connects 5,000+ users with legal resources and support services.",
    keywords: ["mobile app", "digital services", "legal technology", "innovation"],
    created_at: "2024-03-15T14:30:00Z"
  },
  {
    id: 'climate-justice-initiative',
    title: "New Climate Justice Initiative Tackles Environmental Legal Challenges",
    content: "The Legal Services Facility has launched a comprehensive Climate Justice Initiative to address the growing legal challenges related to environmental issues affecting communities across Tanzania. This groundbreaking program represents the first systematic approach to climate-related legal advocacy in the country.\n\nThe initiative focuses on three key areas: land rights protection for communities affected by climate change, legal advocacy for environmental regulations, and support for communities seeking compensation for climate-related damages. The program has already begun working with fishing communities along Lake Victoria and farmers in the northern regions who have been severely impacted by changing weather patterns.\n\nIn partnership with international environmental law organizations, the initiative has developed innovative legal frameworks that recognize climate change as a human rights issue, potentially setting precedents for similar programs across East Africa.",
    excerpt: "LSF launches a groundbreaking program to address climate-related legal issues affecting communities across Tanzania.",
    date: "2024-02-22",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Climate Justice",
    slug: "climate-justice-initiative-environmental-legal-challenges",
    featured: false,
    readTime: "6 min",
    author: "Policy Team",
    tags: ["climate justice", "environmental law", "sustainability", "legal support"],
    seoTitle: "Climate Justice Initiative - Environmental Legal Support",
    seoDescription: "New program addresses climate-related legal challenges in Tanzanian communities.",
    keywords: ["climate justice", "environmental law", "sustainability", "legal support"],
    created_at: "2024-02-22T09:15:00Z"
  }
];

const mockPublications: Publication[] = [
  {
    id: 'annual-report-2023',
    title: 'LSF Annual Report 2023: Advancing Justice Through Legal Empowerment',
    description: 'Our comprehensive annual report showcasing the transformative impact of legal aid services across Tanzania throughout 2023, including detailed analysis of program outcomes, beneficiary stories, and strategic recommendations for the future.',
    excerpt: 'Comprehensive overview of LSF\'s achievements, challenges, and impact in 2023, featuring detailed program analysis and beneficiary testimonials.',
    date: '2024-01-15',
    type: 'annual-report',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    file: '/downloads/lsf-annual-report-2023.pdf',
    featured: true,
    downloadCount: 1250,
    fileSize: '12.5 MB',
    pages: '84 pages',
    category: 'Impact Report',
    seoTitle: 'LSF Annual Report 2023 - Legal Services Facility Tanzania',
    seoDescription: 'Download our 2023 annual report highlighting legal empowerment achievements across Tanzania.',
    keywords: ['annual report', 'legal aid', 'Tanzania', 'justice', 'empowerment'],
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'gender-justice-policy-brief',
    title: 'Policy Brief: Strengthening Gender Justice Mechanisms in Tanzania',
    description: 'Comprehensive analysis and evidence-based recommendations for improving gender justice systems, women\'s access to legal services, and the effectiveness of gender-responsive legal frameworks in Tanzania.',
    excerpt: 'Evidence-based policy recommendations for strengthening legal protections and access to justice for women across Tanzania.',
    date: '2023-11-20',
    type: 'policy-brief',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    file: '/downloads/gender-justice-policy-brief.pdf',
    featured: true,
    downloadCount: 890,
    fileSize: '8.2 MB',
    pages: '56 pages',
    category: 'Policy Document',
    seoTitle: 'Gender Justice Policy Brief - Women\'s Rights Tanzania',
    seoDescription: 'Policy recommendations for strengthening gender justice mechanisms in Tanzania.',
    keywords: ['gender justice', 'women rights', 'policy', 'Tanzania', 'legal reform'],
    created_at: '2023-11-20T14:30:00Z'
  }
];

const mockPrograms: Program[] = [
  {
    id: 'legal-empowerment-program',
    title: 'National Legal Empowerment Program',
    description: 'Comprehensive program enhancing access to justice through community-based legal aid providers and paralegals across all regions of Tanzania.',
    image: '/lovable-uploads/background with mother umage .png',
    startDate: '2020-01-01',
    endDate: '2025-12-31',
    status: 'active',
    location: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya'],
    objectives: [
      'Train and deploy community paralegals in all 168 districts',
      'Establish sustainable legal aid centers in rural areas',
      'Provide accessible legal information and education to communities',
      'Strengthen access to justice for vulnerable populations'
    ],
    approach: 'Our approach focuses on building local capacity through comprehensive training programs for paralegals and community leaders, while establishing sustainable support systems.',
    beneficiaries: {
      total: 150000,
      women: 90000,
      children: 45000,
      disputes: 12500
    },
    geographicCoverage: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Iringa', 'Mtwara'],
    results: [
      { title: 'People Reached', value: '150,000+' },
      { title: 'Paralegals Trained', value: '500+' },
      { title: 'Legal Centers Established', value: '25' },
      { title: 'Cases Resolved', value: '12,500+' }
    ],
    donors: ['USAID', 'European Union', 'Ford Foundation', 'Open Society Foundations'],
    partners: ['Legal and Human Rights Centre', 'Tanzania Legal Aid Society', 'Women Legal Aid Centre'],
    bestPractices: [
      'Community-driven approach to legal empowerment',
      'Integration of traditional and formal justice systems',
      'Use of technology for legal information dissemination',
      'Gender-responsive service delivery'
    ],
    budget: 2500000,
    featured: true,
    created_at: '2020-01-01T00:00:00Z'
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: 'legal-officer-position',
    title: 'Senior Legal Officer - Community Programs',
    description: 'Join our dynamic team as a Senior Legal Officer to lead community-based legal empowerment initiatives and provide direct legal assistance to underserved communities.',
    type: 'job',
    status: 'open',
    is_open: true,
    deadline: '2024-07-15',
    organization: 'Legal Services Facility',
    location: 'Dar es Salaam',
    requirements: [
      'Bachelor\'s degree in Law (LLB) from a recognized institution',
      'Valid practicing certificate from Law Society of Tanzania',
      'Minimum 3 years experience in legal aid or community law',
      'Fluency in English and Swahili'
    ],
    responsibilities: [
      'Provide legal assistance and representation to community members',
      'Train and supervise community paralegals',
      'Develop legal education materials and conduct outreach programs',
      'Collaborate with local partners and stakeholders'
    ],
    application_url: 'mailto:careers@lsf.or.tz',
    salary_range: 'TZS 1,500,000 - 2,200,000',
    employment_type: 'full-time',
    featured: true,
    created_at: '2024-06-01T09:00:00Z'
  }
];

export class MockDataService {
  // News methods
  getAllNews(limit?: number, featured?: boolean): PaginatedResponse<News> {
    let filtered = mockNews;
    if (featured !== undefined) {
      filtered = filtered.filter(news => news.featured === featured);
    }
    
    const data = limit ? filtered.slice(0, limit) : filtered;
    
    return {
      data,
      meta: {
        total: filtered.length,
        page: 1,
        limit: limit || filtered.length,
        totalPages: Math.ceil(filtered.length / (limit || filtered.length))
      }
    };
  }

  getNewsById(id: string): News | null {
    return mockNews.find(news => news.id === id) || null;
  }

  searchNews(query: string): PaginatedResponse<News> {
    const filtered = mockNews.filter(news => 
      news.title.toLowerCase().includes(query.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      news.content.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      data: filtered,
      meta: {
        total: filtered.length,
        page: 1,
        limit: filtered.length,
        totalPages: 1
      }
    };
  }

  // Publications methods
  getAllPublications(limit?: number, featured?: boolean): PaginatedResponse<Publication> {
    let filtered = mockPublications;
    if (featured !== undefined) {
      filtered = filtered.filter(pub => pub.featured === featured);
    }
    
    const data = limit ? filtered.slice(0, limit) : filtered;
    
    return {
      data,
      meta: {
        total: filtered.length,
        page: 1,
        limit: limit || filtered.length,
        totalPages: Math.ceil(filtered.length / (limit || filtered.length))
      }
    };
  }

  getPublicationById(id: string): Publication | null {
    return mockPublications.find(pub => pub.id === id) || null;
  }

  // Programs methods
  getAllPrograms(limit?: number): PaginatedResponse<Program> {
    const data = limit ? mockPrograms.slice(0, limit) : mockPrograms;
    
    return {
      data,
      meta: {
        total: mockPrograms.length,
        page: 1,
        limit: limit || mockPrograms.length,
        totalPages: Math.ceil(mockPrograms.length / (limit || mockPrograms.length))
      }
    };
  }

  getProgramById(id: string): Program | null {
    return mockPrograms.find(program => program.id === id) || null;
  }

  // Opportunities methods
  getAllOpportunities(limit?: number, type?: string): PaginatedResponse<Opportunity> {
    let filtered = mockOpportunities;
    if (type) {
      filtered = filtered.filter(opp => opp.type === type);
    }
    
    const data = limit ? filtered.slice(0, limit) : filtered;
    
    return {
      data,
      meta: {
        total: filtered.length,
        page: 1,
        limit: limit || filtered.length,
        totalPages: Math.ceil(filtered.length / (limit || filtered.length))
      }
    };
  }

  getOpportunityById(id: string): Opportunity | null {
    return mockOpportunities.find(opp => opp.id === id) || null;
  }

  // Analytics tracking (mock implementation)
  trackEvent(eventName: string, properties: Record<string, any>): void {
    console.log(`Analytics: ${eventName}`, properties);
    // In a real implementation, this would send data to analytics service
  }
}

export const mockDataService = new MockDataService();
