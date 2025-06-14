
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
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
      { value: '12+', label: 'Policy Reforms Influenced', icon: <Scale className="h-6 w-6" /> },
      { value: '50+', label: 'Government Officials Engaged', icon: <Scale className="h-6 w-6" /> },
      { value: '25+', label: 'Civil Society Partners', icon: <Scale className="h-6 w-6" /> }
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

export default PolicyAdvocacy;
