
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
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
    { label: "What We Do", href: "/what-we-do" },
    { label: "Focus Areas", href: "/what-we-do#focus-areas" },
    { label: focusArea.title }
  ];

  const highlights = [
    {
      title: "Strategic Partnerships",
      description: "Building strong alliances with local and international organizations to amplify our impact and sustainability.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Our Partners"
    },
    {
      title: "Innovation Lab",
      description: "Developing cutting-edge digital solutions and innovative approaches to improve legal aid delivery and efficiency.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Explore Innovation"
    },
    {
      title: "Capacity Building",
      description: "Strengthening partner organizations through training, resources, and technical support to expand our collective impact.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Join Network"
    }
  ];

  const partners = [
    {
      name: "Dr. Neema Lugalla",
      role: "Executive Director",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Our commitment to institutional excellence ensures we can serve Tanzanians for generations to come."
    },
    {
      name: "James Anderson",
      role: "Development Partner",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "LSF's strong governance and transparent operations make them a trusted partner for sustainable development."
    },
    {
      name: "Maria Santos",
      role: "Technology Innovation Lead",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "We're leveraging technology to make legal aid more efficient and accessible while building for the future."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} breadcrumbItems={breadcrumbItems} />
      
      <ImpactStorySection
        title="Building an Institution that Lasts"
        subtitle="Sustainable Excellence"
        description="For over 15 years, we've been building not just programs, but an institution capable of serving Tanzania's justice needs for decades. Through strategic partnerships, innovation, and unwavering commitment to excellence, we're creating lasting change."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="See Our Impact"
        stats={[
          { value: "200+", label: "Partners" },
          { value: "15+", label: "Years Strong" },
          { value: "$5M+", label: "Resources Mobilized" },
          { value: "100%", label: "Transparency Rating" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="Strengthening Our Foundation for Greater Impact"
        subtitle="Our Pillars"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Leaders Building the Future"
        subtitle="Our Team"
        description="Meet the visionary leaders and partners who are building an institution capable of driving justice outcomes for generations of Tanzanians."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default InstitutionalDevelopment;
