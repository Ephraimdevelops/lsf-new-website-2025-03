
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import KeyActivitiesSection from '../components/focus-areas/KeyActivitiesSection';
import ResourcesSection from '../components/focus-areas/ResourcesSection';
import { Scale, Users, Gavel, Building, Leaf, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FocusArea {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  icon: React.ReactNode;
  keyActivities: string[];
  impactStats: { value: string; label: string; icon: React.ReactNode }[];
  resources: { title: string; type: string; link: string }[];
  testimonial: { quote: string; author: string; role: string };
}

const focusAreas: { [key: string]: any } = {
  'accessible-legal-aid': {
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
      { value: '24/7', label: 'Legal Helpline Availability', icon: <Scale className="h-6 w-6" /> },
      { value: '150+', label: 'Community Clinics', icon: <Building className="h-6 w-6" /> }
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
  },
  'empowered-communities': {
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
      { value: '184', label: 'Communities Served', icon: <Building className="h-6 w-6" /> },
      { value: '85%', label: 'Dispute Resolution Rate', icon: <Scale className="h-6 w-6" /> }
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
  },
  'conducive-environment': {
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
  },
  'institutional-development': {
    id: 'institutional-development',
    title: 'Institutional Development and Sustainability',
    description: 'Strengthening organizational capacity, financial sustainability, and operational effectiveness for long-term impact and resilience.',
    fullDescription: 'LSF commits to strengthening its own institution and partner networks to sustain its mission over the long haul. This includes building robust governance systems, diversifying funding sources, and investing in staff and infrastructure. Sustainable development matters because a resilient LSF can continue driving justice outcomes for decades. The impact is twofold: it ensures continuity of high-quality services and amplifies our effect by empowering partner organizations to stand on their own.',
    icon: <Building className="h-8 w-8" />,
    keyActivities: [
      'Organizational Development: Building robust governance and management systems',
      'Financial Sustainability: Diversifying funding and improving resource management',
      'Technology Integration: Leveraging digital solutions for greater efficiency',
      'Partner Capacity Building: Strengthening the broader legal aid ecosystem'
    ],
    impactStats: [
      { value: '200+', label: 'Strategic Partners', icon: <Users className="h-6 w-6" /> },
      { value: '15+', label: 'Years of Operation', icon: <Building className="h-6 w-6" /> },
      { value: '$47M+', label: 'Resources Mobilized', icon: <Scale className="h-6 w-6" /> }
    ],
    resources: [
      { title: 'Annual Report 2024', type: 'PDF', link: '#' },
      { title: 'Strategic Plan 2025-2030', type: 'PDF', link: '#' },
      { title: 'Partnership Guidelines', type: 'PDF', link: '#' }
    ],
    testimonial: {
      quote: "LSF's institutional strength and commitment to sustainability makes them an ideal partner for long-term justice initiatives.",
      author: "Dr. Sarah Mitchell",
      role: "International Development Advisor"
    }
  },
  'climate-justice': {
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
      { value: '50+', label: 'Communities Supported', icon: <Building className="h-6 w-6" /> },
      { value: '12', label: 'Policy Interventions', icon: <Gavel className="h-6 w-6" /> }
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
  },
  'digital-transformation': {
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
      { value: '500+', label: 'Digital Training Graduates', icon: <Building className="h-6 w-6" /> }
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
  }
};

const FocusAreaDetail = () => {
  const { slug } = useParams();
  const focusArea = slug ? focusAreas[slug] : null;

  if (!focusArea) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-black">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-8">Focus Area Not Found</h1>
            <Link to="/">
              <Button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Focus Areas", href: "/#focus-areas" },
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

export default FocusAreaDetail;
