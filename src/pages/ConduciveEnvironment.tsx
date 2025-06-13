
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import { Gavel, Users, Scale } from 'lucide-react';

const ConduciveEnvironment = () => {
  const focusArea = {
    id: 'conducive-environment',
    title: 'Enhancing a Conducive Environment for Sustainable Access to Justice',
    description: 'Working systemically to create an enabling ecosystem for justice by engaging with policymakers, institutions, and civil society.',
    fullDescription: 'LSF works systemically to create an enabling ecosystem for justice by engaging with policymakers, justice institutions, and civil society. This includes advocating for fair laws, supporting reforms in judicial processes, and building networks of pro-bono professionals. A conducive environment matters because structural change—like improved legal frameworks and accountable institutions—ensures that legal empowerment endures over time. The impact is long-term: new policies enacted, more transparent governance, and improved public trust in legal institutions.',
    icon: <Gavel className="h-8 w-8" />,
    keyActivities: [
      'Legal Reform: Evidence-based advocacy for fair and inclusive laws',
      'Judicial Training: Capacity building for justice sector professionals',
      'Anti-Corruption: Initiatives to promote transparency and accountability',
      'Policy Development: Research and recommendations for systemic improvements'
    ],
    impactStats: [
      { value: '15+', label: 'Policy Reforms Influenced', icon: <Gavel className="h-6 w-6" /> },
      { value: '500+', label: 'Judges Trained', icon: <Users className="h-6 w-6" /> },
      { value: '30+', label: 'Laws Influenced', icon: <Scale className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'Policy Impact Report', type: 'PDF', link: '#' },
      { title: 'Legal Reform Toolkit', type: 'Resource Kit', link: '#' },
      { title: 'Advocacy Guidelines', type: 'PDF', link: '#' }
    ],
    testimonial: {
      quote: "LSF's policy advocacy has been instrumental in creating a more inclusive and accessible justice system for all Tanzanians.",
      author: "Hon. Dr. Tulia Ackson",
      role: "Speaker of Parliament"
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

export default ConduciveEnvironment;
