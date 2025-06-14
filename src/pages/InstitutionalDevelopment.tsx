import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import { Building, Users } from 'lucide-react';

const InstitutionalDevelopment = () => {
  const focusArea = {
    id: 'institutional-development',
    title: 'Institutional Development and Sustainability',
    description: 'Strengthening organizational capacity, financial sustainability, and operational effectiveness for long-term impact and resilience.',
    fullDescription: 'LSF commits to strengthening its own institution and partner networks to sustain its mission over the long haul. This includes building robust governance systems, diversifying funding sources, and investing in staff and infrastructure. Sustainable development matters because a resilient LSF can continue driving justice outcomes for decades. The impact is twofold: it ensures continuity of high-quality services and amplifies our effect by empowering partner organizations to stand on their own.',
    icon: <Building className="h-8 w-8" />,
    keyActivities: [
      'Organizational Development: Building robust governance and management systems',
      'Financial Sustainability: Diversifying funding and improving resource management',
      'Technology Integration: Leveraging digital solutions for greater efficiency',
      'Partner Capacity Building: Strengthening the broader legal aid ecosystem'
    ],
    impactStats: [
      { value: '200+', label: 'Strategic Partners', icon: <Users className="h-6 w-6" /> },
      { value: '15+', label: 'Years of Operation', icon: <Users className="h-6 w-6" /> },
      { value: '5+', label: 'Resources Mobilized (M)', icon: <Users className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'Annual Report 2024', type: 'PDF', link: '#' },
      { title: 'Strategic Plan 2025-2030', type: 'PDF', link: '#' },
      { title: 'Partnership Guidelines', type: 'PDF', link: '#' }
    ],
    testimonial: {
      quote: "LSF's institutional strength and commitment to sustainability makes them an ideal partner for long-term justice initiatives.",
      author: "Dr. Sarah Mitchell",
      role: "International Development Advisor"
    }
  };

  const breadcrumbItems = [
    { name: "What We Do", href: "/what-we-do" },
    { name: "Focus Areas", href: "/what-we-do#focus-areas" },
    { name: focusArea.title }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} breadcrumbItems={breadcrumbItems} />
      
      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default InstitutionalDevelopment;
