
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
import { Scale } from 'lucide-react';

const PolicyAdvocacy = () => {
  const focusArea = {
    id: 'policy-advocacy',
    title: 'Policy and Advocacy',
    description: 'Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.',
    fullDescription: 'Our advocacy approach operates at multiple levels, from grassroots community mobilization to national policy dialogue. We believe that sustainable change requires both bottom-up pressure and top-down reform, creating a comprehensive approach to justice system transformation.',
    icon: <Scale className="h-8 w-8" />,
    keyActivities: [
      'Grassroots Advocacy: Empowering communities to advocate for their rights and influence local policies',
      'National Policy: Engaging with national institutions to shape laws and policies',
      'Legal Reform: Advocating for comprehensive reforms in the justice system',
      'Evidence-Based Research: Conducting research to inform policy recommendations'
    ],
    impactStats: [
      { value: '12+', label: 'Policy Reforms Influenced' },
      { value: '50+', label: 'Government Officials Engaged' },
      { value: '25+', label: 'Civil Society Partners' }
    ],
    resources: [
      { title: 'Policy Impact Report 2024', type: 'PDF', link: '#' },
      { title: 'Advocacy Strategy Guide', type: 'PDF', link: '#' },
      { title: 'Legal Reform Toolkit', type: 'Resource Kit', link: '#' }
    ],
    testimonial: {
      quote: "Through evidence-based advocacy, we've successfully influenced 12 major policy reforms that benefit vulnerable populations across Tanzania.",
      author: "Dr. Amina Rashid",
      role: "Policy Research Director"
    }
  };

  const breadcrumbItems = [
    { label: "What We Do", href: "/what-we-do" },
    { label: focusArea.title }
  ];

  const highlights = [
    {
      title: "Legislative Advocacy",
      description: "Working directly with parliamentarians and government officials to draft and pass progressive legislation that protects citizens' rights.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "View Our Wins"
    },
    {
      title: "Community Mobilization",
      description: "Training communities to effectively advocate for their rights and engage with local government on policy issues that affect them.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Join the Movement"
    },
    {
      title: "Research & Analysis",
      description: "Conducting comprehensive research to provide evidence-based policy recommendations and track implementation progress.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Read Our Research"
    }
  ];

  const partners = [
    {
      name: "Hon. Dr. Mary Nagu",
      role: "Former Cabinet Minister",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "LSF's research and advocacy have been instrumental in shaping policies that truly serve the people of Tanzania."
    },
    {
      name: "Dr. James Kimonyo",
      role: "Parliamentary Research Director",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Their evidence-based approach to policy advocacy has transformed how we approach legal reform in Tanzania."
    },
    {
      name: "Advocate Sarah Mwamba",
      role: "Civil Society Coalition Leader",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Through coordinated advocacy efforts, we've achieved policy changes that seemed impossible just a few years ago."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} breadcrumbItems={breadcrumbItems} />
      
      <ImpactStorySection
        title="Transforming Laws, Transforming Lives"
        subtitle="Policy Impact"
        description="Every law we help shape, every policy we influence, creates ripple effects that touch thousands of lives. From improving access to justice to protecting vulnerable communities, our advocacy work creates lasting systemic change."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="See Our Policy Wins"
        stats={[
          { value: "12+", label: "Laws Influenced" },
          { value: "50+", label: "Officials Engaged" },
          { value: "25+", label: "Partner Organizations" },
          { value: "1M+", label: "Lives Impacted" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="Our Multi-Level Advocacy Approach"
        subtitle="Strategy in Action"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Voices of Change"
        subtitle="Policy Champions"
        description="Working alongside government leaders, researchers, and civil society advocates to create policies that truly serve the people of Tanzania."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default PolicyAdvocacy;
