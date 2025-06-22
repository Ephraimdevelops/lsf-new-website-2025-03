
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
import { Leaf, Users, TreePine } from 'lucide-react';

const ClimateJustice = () => {
  const focusArea = {
    id: 'climate-justice',
    title: 'Climate Justice and Environmental Rights',
    description: 'Integrating climate justice in legal empowerment—protecting land rights and supporting vulnerable communities affected by climate change.',
    fullDescription: 'LSF recognizes that climate change disproportionately affects the most vulnerable populations, often those already facing barriers to justice. Our climate justice work focuses on protecting land rights, supporting communities displaced by environmental changes, and advocating for policies that address climate-related legal issues. We work to ensure that environmental policies consider the rights and needs of marginalized communities, particularly women and rural populations who depend on natural resources for their livelihoods.',
    icon: <Leaf className="h-8 w-8" />,
    keyActivities: [
      'Land Rights Protection: Securing tenure for climate-vulnerable communities',
      'Environmental Advocacy: Legal support for communities affected by environmental degradation',
      'Climate Policy: Advocating for inclusive climate adaptation and mitigation policies',
      'Community Resilience: Building legal capacity for climate adaptation strategies'
    ],
    impactStats: [
      { value: '2000+', label: 'Families Protected', icon: <Users className="h-6 w-6" /> },
      { value: '50+', label: 'Communities Supported', icon: <TreePine className="h-6 w-6" /> },
      { value: '12', label: 'Policy Interventions', icon: <Leaf className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'Climate Justice Handbook', type: 'PDF', link: '#' },
      { title: 'Land Rights Guide', type: 'PDF', link: '#' },
      { title: 'Environmental Law Toolkit', type: 'Resource Kit', link: '#' }
    ],
    testimonial: {
      quote: "LSF helped our community secure our ancestral lands against illegal mining operations. Now we can protect our environment for future generations.",
      author: "Grace Mollel",
      role: "Community Leader, Arusha"
    }
  };

  const highlights = [
    {
      title: "Land Rights Protection",
      description: "Securing land tenure for communities threatened by climate change and environmental degradation.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Learn More"
    },
    {
      title: "Environmental Advocacy",
      description: "Fighting for communities affected by pollution, deforestation, and other environmental harms.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Get Support"
    },
    {
      title: "Climate Adaptation",
      description: "Building legal resilience for communities adapting to changing climate conditions.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Join Initiative"
    }
  ];

  const partners = [
    {
      name: "Dr. Neema Munuo",
      role: "Environmental Law Expert",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Climate justice is human rights. LSF's work ensures that environmental protection includes social justice."
    },
    {
      name: "Chief Mwalimu Selemani",
      role: "Traditional Leader",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Our ancestral lands are protected now thanks to LSF's legal support against mining companies."
    },
    {
      name: "Sarah Mwanza",
      role: "Climate Activist",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Young people need legal tools to fight for our climate future. LSF provides that empowerment."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} />
      
      <ImpactStorySection
        title="Protecting Our Planet, Protecting Our People"
        subtitle="Climate Justice"
        description="Climate change is not just an environmental issue - it's a justice issue. We work to ensure that the communities most affected by climate change have the legal tools and support they need to protect their rights and their future."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Join Our Climate Action"
        stats={[
          { value: "2,000+", label: "Families Protected" },
          { value: "50+", label: "Communities Served" },
          { value: "12", label: "Policy Wins" },
          { value: "1M+", label: "Acres Protected" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="Fighting for Environmental Justice"
        subtitle="Our Focus Areas"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Champions of Climate Justice"
        subtitle="Environmental Leaders"
        description="Working with traditional leaders, environmental experts, and climate activists to build a sustainable and just future for Tanzania."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default ClimateJustice;
