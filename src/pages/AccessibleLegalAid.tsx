import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
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
    { name: "What We Do", href: "/what-we-do" },
    { name: "Focus Areas", href: "/what-we-do#focus-areas" },
    { name: focusArea.title }
  ];

  const highlights = [
    {
      title: "Mobile Legal Clinics",
      description: "Bringing justice directly to rural communities through our mobile legal aid units that travel to remote areas.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Find a Clinic"
    },
    {
      title: "Digital Legal Platform",
      description: "24/7 online legal consultation platform connecting citizens with qualified legal professionals instantly.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Get Help Online"
    },
    {
      title: "Community Paralegals",
      description: "Trained community advocates providing first-line legal support and guidance in local languages.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Meet Paralegals"
    }
  ];

  const partners = [
    {
      name: "Sarah Mwamba",
      role: "Community Paralegal",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Through LSF training, I've helped over 300 families in my community resolve legal issues and access their rights."
    },
    {
      name: "Dr. John Msami",
      role: "Legal Aid Coordinator",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Our mobile clinics have transformed access to justice in remote areas, bringing hope where there was none."
    },
    {
      name: "Amina Hassan",
      role: "Women's Rights Advocate",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "LSF's support helped me fight for my inheritance rights and now I help other women do the same."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} breadcrumbItems={breadcrumbItems} />
      
      <ImpactStorySection
        title="Every Person Deserves Access to Justice"
        subtitle="Breaking Barriers"
        description="In rural Tanzania, legal help was once a luxury only the wealthy could afford. Today, through our innovative mobile clinics and digital platforms, we're ensuring that distance and poverty no longer determine who gets justice."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Find Legal Help Near You"
        stats={[
          { value: "5,000+", label: "Lives Changed" },
          { value: "150+", label: "Communities Served" },
          { value: "24/7", label: "Support Available" },
          { value: "85%", label: "Success Rate" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="How We're Making Justice Accessible"
        subtitle="Our Approach"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Voices from the Field"
        subtitle="Community Champions"
        description="Meet the dedicated individuals who are making legal aid accessible in their communities. Their stories inspire us and show the real impact of accessible justice."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default AccessibleLegalAid;
