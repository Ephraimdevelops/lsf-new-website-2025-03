
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
import { Smartphone, Users, Download } from 'lucide-react';

const DigitalTransformation = () => {
  const focusArea = {
    id: 'digital-transformation',
    title: 'Digital Transformation in Legal Services',
    description: 'Leveraging technology for wider access: digital case tracking, online legal aid, and digital training platforms.',
    fullDescription: 'LSF embraces digital innovation to bridge the justice gap and make legal services more accessible, efficient, and responsive to community needs. Through digital platforms, mobile applications, and online training programs, we are transforming how legal aid is delivered across Tanzania. Our digital transformation initiatives include the HakiYangu mobile app, online legal consultation platforms, and digital paralegal training modules that reach communities regardless of their geographic location.',
    icon: <Smartphone className="h-8 w-8" />,
    keyActivities: [
      'HakiYangu Mobile App: Digital platform for accessing legal aid and information',
      'Online Legal Consultation: Virtual legal advice and support services',
      'Digital Training Platforms: E-learning modules for paralegal and community education',
      'Case Management Systems: Digital tools for tracking and managing legal cases'
    ],
    impactStats: [
      { value: '15000+', label: 'App Users', icon: <Smartphone className="h-6 w-6" /> },
      { value: '1000+', label: 'Online Consultations', icon: <Users className="h-6 w-6" /> },
      { value: '500+', label: 'Digital Training Graduates', icon: <Download className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'HakiYangu User Guide', type: 'PDF', link: '#' },
      { title: 'Digital Legal Services Overview', type: 'Video', link: '#' },
      { title: 'Online Training Portal', type: 'Platform Access', link: '#' }
    ],
    testimonial: {
      quote: "The HakiYangu app connected me with a lawyer when I couldn't travel to the city. Technology truly brought justice to my doorstep.",
      author: "Ahmed Hassan",
      role: "Small Business Owner, Mwanza"
    }
  };

  const highlights = [
    {
      title: "HakiYangu Mobile App",
      description: "Revolutionary mobile platform connecting citizens with legal aid services across Tanzania.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Download App"
    },
    {
      title: "Virtual Legal Clinics",
      description: "Online consultation services bringing legal expertise to remote communities via video calls.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Book Session"
    },
    {
      title: "Digital Training Hub",
      description: "Comprehensive e-learning platform for paralegal training and legal education.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Start Learning"
    }
  ];

  const partners = [
    {
      name: "Dr. James Ngowi",
      role: "Digital Innovation Director",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Technology is democratizing access to justice. Our digital platforms have reached over 15,000 Tanzanians."
    },
    {
      name: "Amina Khamis",
      role: "Mobile App Developer",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Building HakiYangu has been rewarding. We're using local languages to make legal aid truly accessible."
    },
    {
      name: "Paul Mbwana",
      role: "Digital Training Coordinator",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Our online paralegal training has certified 500+ community advocates across Tanzania's remote areas."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} />
      
      <ImpactStorySection
        title="Justice at Your Fingertips"
        subtitle="Digital Innovation"
        description="In an age where everyone carries a smartphone, legal aid should be just a tap away. Our digital transformation is making legal services as accessible as social media, bringing justice to every corner of Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Explore Our Digital Tools"
        stats={[
          { value: "15,000+", label: "App Downloads" },
          { value: "1,000+", label: "Online Sessions" },
          { value: "500+", label: "Digital Graduates" },
          { value: "24/7", label: "Service Availability" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="Transforming Legal Aid Through Technology"
        subtitle="Digital Solutions"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Digital Innovation Team"
        subtitle="Tech for Justice"
        description="Meet the technology experts and digital innovators who are building the future of legal aid in Tanzania."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default DigitalTransformation;
