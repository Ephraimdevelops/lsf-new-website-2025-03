
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import { Scale, Users } from 'lucide-react';

const AccessibleLegalAid = () => {
  const focusArea = {
    id: 'accessible-legal-aid',
    title: 'Increasing Accessibility to Quality Legal Aid Services',
    description: 'Breaking down barriers to justice by bringing affordable, high-quality legal aid within reach of all communities across the country.',
    fullDescription: 'LSF, a leading national legal empowerment institution, breaks down barriers to justice by bringing affordable, high-quality legal aid within reach of all communities across the country. Through innovative outreach programs, remote clinics, and digital platforms, LSF ensures that vulnerable and marginalized individuals can secure timely legal advice and representation. This focus is equity-driven: it matters because only an accessible justice system can truly uphold rights and fairness for everyone. The impact is demonstrable – thousands of individuals have successfully navigated legal processes and regained confidence in the justice system.',
    icon: <Scale className="h-8 w-8" />,
    keyActivities: [
      'Legal Helpline: 24/7 phone and digital support for immediate legal guidance',
      'Community Clinics: Mobile and fixed legal aid centers in remote areas', 
      'Online Consultation: Digital platforms connecting citizens with legal experts',
      'Paralegal Training: Comprehensive certification programs for community advocates'
    ],
    impactStats: [
      { value: '5000+', label: 'People Served Annually', icon: <Users className="h-6 w-6" /> },
      { value: '24/7', label: 'Legal Helpline Availability', icon: <Users className="h-6 w-6" /> },
      { value: '150+', label: 'Community Clinics', icon: <Users className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'Know Your Rights Guide', type: 'PDF', link: '#' },
      { title: 'Legal Aid Directory', type: 'Interactive Map', link: '#' },
      { title: 'How to Access Help', type: 'Video Guide', link: '#' }
    ],
    testimonial: {
      quote: "LSF's legal clinic helped me secure my land rights and gave me confidence to stand up for what's rightfully mine.",
      author: "Maria Kibwana",
      role: "Community Member, Mbeya"
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

export default AccessibleLegalAid;
