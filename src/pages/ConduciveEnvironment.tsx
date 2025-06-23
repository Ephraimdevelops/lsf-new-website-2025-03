
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
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

  const highlights = [
    {
      title: "Policy Reform Advocacy",
      description: "Working with government and civil society to advocate for laws and policies that promote access to justice for all.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "See Our Impact"
    },
    {
      title: "Judicial Training Programs",
      description: "Building capacity of judges, magistrates, and court officials to deliver fair and efficient justice services.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Training Schedule"
    },
    {
      title: "Transparency Initiatives",
      description: "Promoting accountability and transparency in the justice system through research, monitoring, and advocacy.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Read Reports"
    }
  ];

  const partners = [
    {
      name: "Hon. Justice Mwamba",
      role: "High Court Judge",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "LSF's judicial training programs have enhanced our understanding of human rights and improved our case management skills."
    },
    {
      name: "Dr. Amina Rashid",
      role: "Policy Research Director",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Through evidence-based advocacy, we've successfully influenced 15 major policy reforms that benefit vulnerable populations."
    },
    {
      name: "Advocate James Mollel",
      role: "Bar Association President",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "LSF's work on legal reform has strengthened the foundation of our justice system and improved access for all citizens."
    }
  ];

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} />
      
      <ImpactStorySection
        title="Creating Systems that Work for Everyone"
        subtitle="Systemic Change"
        description="True justice requires more than individual cases - it needs strong institutions, fair laws, and accountable systems. We work at the highest levels to create an environment where justice can flourish for all."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="See Our Policy Impact"
        stats={[
          { value: "15+", label: "Policy Reforms" },
          { value: "500+", label: "Officials Trained" },
          { value: "30+", label: "Laws Influenced" },
          { value: "10M+", label: "Lives Impacted" }
        ]}
      />

      <KeyActivitiesSection 
        keyActivities={focusArea.keyActivities} 
        testimonial={focusArea.testimonial}
      />

      <VisualHighlightSection
        title="Building a Justice System that Works"
        subtitle="Our Approach"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Leaders Driving Change"
        subtitle="Justice Champions"
        description="Working alongside government officials, judges, and civil society leaders to create lasting systemic change in Tanzania's justice sector."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ResourcesSection resources={focusArea.resources} />
    </Layout>
  );
};

export default ConduciveEnvironment;
