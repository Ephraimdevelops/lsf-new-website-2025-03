
import axios from 'axios';

// Create axios instance with fallback for missing backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Add timeout to fail fast
});

// Add request interceptor for authentication or other headers
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token or other headers if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling with fallback data
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Return mock data for development when backend is not available
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const url = error.config?.url || '';
      
      // Return mock data based on the endpoint
      if (url.includes('/programs')) {
        if (url.includes('/programs/')) {
          // Single program endpoint
          const programId = url.split('/programs/')[1];
          return getMockProgram(programId);
        }
        // All programs endpoint
        return getMockPrograms();
      }
      
      if (url.includes('/opportunities')) {
        return getMockOpportunities();
      }
      
      if (url.includes('/news')) {
        return getMockNews();
      }
      
      if (url.includes('/publications')) {
        return getMockPublications();
      }
    }
    
    // Handle other HTTP status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock data functions
const getMockPrograms = () => [
  {
    id: 'legal-empowerment',
    title: 'Legal Empowerment Program',
    description: 'Enhancing access to justice through community-based legal aid providers and paralegals across Tanzania.',
    image: '/lovable-uploads/background with mother umage .png',
    startDate: '2020-01-01',
    endDate: '2025-12-31',
    location: ['Dar es Salaam', 'Mwanza', 'Arusha'],
    objectives: [
      'Train community paralegals in all 184 districts',
      'Establish legal aid centers in rural areas',
      'Provide accessible legal information to communities',
      'Strengthen access to justice for vulnerable populations'
    ],
    approach: 'Our approach focuses on building local capacity through comprehensive training programs for paralegals and community leaders.',
    beneficiaries: {
      total: 150000,
      women: 90000,
      children: 45000,
      disputes: 12500
    },
    geographicCoverage: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya'],
    results: [
      { title: 'People Reached', value: '150,000+' },
      { title: 'Paralegals Trained', value: '500+' },
      { title: 'Legal Centers Established', value: '25' },
      { title: 'Cases Resolved', value: '12,500+' }
    ],
    donors: ['USAID', 'EU', 'Ford Foundation'],
    partners: ['Legal and Human Rights Centre', 'Tanzania Legal Aid Society'],
    bestPractices: [
      'Community-driven approach to legal empowerment',
      'Integration of traditional and formal justice systems',
      'Use of technology for legal information dissemination'
    ]
  },
  {
    id: 'gender-justice',
    title: 'Gender Justice Initiative',
    description: 'Advancing women\'s rights and addressing gender-based violence through legal advocacy and support.',
    image: '/lovable-uploads/background with mother umage .png',
    startDate: '2021-03-01',
    endDate: '2024-12-31',
    location: ['Dar es Salaam', 'Mwanza'],
    objectives: [
      'Reduce gender-based violence through legal intervention',
      'Strengthen women\'s access to justice',
      'Advocate for gender-responsive laws and policies'
    ],
    beneficiaries: {
      total: 75000,
      women: 60000,
      children: 15000,
      disputes: 3500
    }
  },
  {
    id: 'climate-justice',
    title: 'Climate Justice Program',
    description: 'Supporting communities affected by climate change through environmental law and advocacy.',
    image: '/lovable-uploads/background with mother umage .png',
    startDate: '2022-01-01',
    endDate: '2025-06-30',
    location: ['Coastal regions', 'Northern Tanzania'],
    objectives: [
      'Advocate for climate-responsive policies',
      'Support climate-affected communities legally',
      'Promote environmental rights awareness'
    ],
    beneficiaries: {
      total: 50000,
      women: 30000,
      children: 20000,
      disputes: 1200
    }
  }
];

const getMockProgram = (id: string) => {
  const programs = getMockPrograms();
  return programs.find(p => p.id === id) || programs[0];
};

const getMockOpportunities = () => ({
  data: [
    {
      id: '1',
      title: 'Legal Officer Position',
      description: 'Join our team as a Legal Officer to provide direct legal assistance to communities in need.',
      type: 'job',
      status: 'open',
      is_open: true,
      deadline: '2024-02-15',
      organization: 'Legal Services Facility',
      location: 'Dar es Salaam',
      created_at: '2024-01-01',
      application_url: 'mailto:jobs@lsf.or.tz'
    },
    {
      id: '2',
      title: 'Community Paralegal Training Grant',
      description: 'Grant opportunity for organizations interested in training community paralegals.',
      type: 'grant',
      status: 'open',
      is_open: true,
      deadline: '2024-03-01',
      organization: 'LSF Grant Program',
      location: 'Tanzania-wide',
      created_at: '2024-01-10',
      application_url: 'mailto:grants@lsf.or.tz'
    }
  ],
  meta: {
    total: 2,
    page: 1,
    limit: 10
  }
});

const getMockNews = () => [
  {
    id: '1',
    title: 'LSF Launches New Legal Aid Initiative',
    content: 'Legal Services Facility has launched a comprehensive legal aid initiative...',
    excerpt: 'New initiative aims to reach underserved communities across Tanzania.',
    date: '2024-01-15',
    image: '/lovable-uploads/background with mother umage .png',
    category: 'Programs',
    slug: 'lsf-launches-new-legal-aid-initiative'
  }
];

const getMockPublications = () => [
  {
    id: '1',
    title: 'Annual Report 2023',
    description: 'Comprehensive overview of our activities and impact in 2023.',
    date: '2024-01-01',
    image: '/lovable-uploads/background with mother umage .png',
    file: '/publications/annual-report-2023.pdf'
  }
];

export default apiClient;
