
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import { Users } from 'lucide-react';

const EmpoweredCommunities = () => {
  const focusArea = {
    id: 'empowered-communities',
    title: 'Promoting Legally Empowered Communities',
    description: 'Investing in community-centered empowerment by equipping local groups and citizens with knowledge and tools to use the law effectively.',
    fullDescription: 'LSF invests in community-centered empowerment by equipping local groups and citizens with the knowledge and tools to use the law effectively. We support paralegal training, legal awareness workshops, and youth engagement so that rights are understood and defended from the ground up. This approach matters because empowered communities become agents of change, resolving disputes constructively and preventing abuse of power. The impact is seen in communities confidently asserting legal solutions—reducing conflicts, strengthening social cohesion, and fostering a culture of rights and responsibilities.',
    icon: <Users className="h-8 w-8" />,
    keyActivities: [
      'Legal Education: Comprehensive rights awareness programs for all community members',
      'Paralegal Training: Building local capacity through certified community advocates',
      'Community Forums: Regular dialogue sessions on legal issues and solutions',
      'Youth Engagement: Targeted programs to engage young people in legal empowerment'
    ],
    impactStats: [
      { value: '4000+', label: 'Paralegals Trained', icon: <Users className="h-6 w-6" /> },
      { value: '184', label: 'Communities Served', icon: <Users className="h-6 w-6" /> },
      { value: '85%', label: 'Dispute Resolution Rate', icon: <Users className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'Community Legal Guide', type: 'PDF', link: '#' },
      { title: 'Paralegal Training Manual', type: 'PDF', link: '#' },
      { title: 'Workshop Toolkit', type: 'Resource Kit', link: '#' }
    ],
    testimonial: {
      quote: "Through LSF's training, I became a paralegal and now help my community resolve disputes peacefully. I've assisted over 200 families.",
      author: "John Mwalimu",
      role: "Community Paralegal, Dodoma"
    }
  };

  const breadcrumbItems = [
    { label: "What We Do", href: "/what-we-do" },
    { label: "Focus Areas", href: "/what-we-do#focus-areas" },
    { label: focusArea.title }
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

export default EmpoweredCommunities;
