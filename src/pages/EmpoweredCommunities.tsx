
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
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

  const highlights = [
    {
      title: "Paralegal Champions",
      description: "Training community members to become certified paralegals who provide first-line legal support in their neighborhoods.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Join Training"
    },
    {
      title: "Youth Legal Clubs",
      description: "Engaging young people in legal education and empowerment activities to build the next generation of rights advocates.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Start a Club"
    },
    {
      title: "Community Forums",
      description: "Regular community meetings where legal issues are discussed and collective solutions are developed.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Attend Forum"
    }
  ];

  const partners = [
    {
      name: "Grace Mbwana",
      role: "Community Paralegal Leader",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "I've trained 50 paralegals in my district. Now every village has someone who can help with legal problems."
    },
    {
      name: "Michael Kileo",
      role: "Youth Legal Club Coordinator",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Our youth club has 200 members who are learning about their rights and helping their families navigate legal issues."
    },
    {
      name: "Fatuma Seif",
      role: "Women's Group Leader",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Through legal education, our women's group now helps members with property rights and domestic violence cases."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} />
      
      <ImpactStorySection
        title="Communities that Know Their Rights, Protect Their Rights"
        subtitle="Grassroots Power"
        description="When communities understand the law, they become powerful agents of change. Our grassroots approach has created a network of over 4,000 trained paralegals who are transforming justice from the ground up."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Become a Community Champion"
        stats={[
          { value: "4,000+", label: "Paralegals Trained" },
          { value: "184", label: "Communities Served" },
          { value: "85%", label: "Disputes Resolved" },
          { value: "50,000+", label: "People Reached" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="Building Legally Empowered Communities"
        subtitle="Our Programs"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Community Champions in Action"
        subtitle="Local Heroes"
        description="Meet the remarkable individuals who are leading legal empowerment efforts in their communities. Their dedication and impact inspire us every day."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default EmpoweredCommunities;
