
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, DollarSign, Wrench, Megaphone, BookOpen, Users, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Approach {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  keyFeatures: string[];
  currentProjects: { title: string; description: string; status: string }[];
  achievements: string[];
  futureGoals: string[];
  methodology: string[];
  impact: { metric: string; value: string }[];
}

const approaches: { [key: string]: Approach } = {
  'grant-making': {
    id: 'grant-making',
    title: 'Grant Making and Management',
    description: 'For over a decade, LSF has established itself as a trusted and capable fund manager, overseeing more than USD 47 million in donor contributions through robust grant-making architecture.',
    icon: <DollarSign className="h-8 w-8" />,
    keyFeatures: [
      'Rigorous due diligence and partner selection processes',
      'Comprehensive financial accountability systems',
      'Regular monitoring and evaluation frameworks',
      'Capacity building support for grantees',
      'Technical assistance and mentorship programs'
    ],
    currentProjects: [
      {
        title: 'Community Legal Aid Network Expansion',
        description: 'Supporting 50+ community-based organizations to expand legal aid services in rural areas.',
        status: 'Active'
      },
      {
        title: 'Women\'s Legal Empowerment Initiative',
        description: 'Funding programs specifically targeting women\'s access to justice and legal awareness.',
        status: 'Active'
      },
      {
        title: 'Digital Legal Services Platform',
        description: 'Supporting technology-driven solutions for improved legal service delivery.',
        status: 'In Development'
      }
    ],
    achievements: [
      'Successfully managed over USD 47 million in donor funds',
      'Supported 200+ community-based legal aid providers',
      'Maintained 98% financial compliance rate across all grants',
      'Facilitated legal aid services to over 100,000 beneficiaries'
    ],
    futureGoals: [
      'Expand grant portfolio to USD 75 million by 2027',
      'Support 300+ legal aid providers nationwide',
      'Develop innovative financing mechanisms for sustainability',
      'Strengthen South-South learning and exchange programs'
    ],
    methodology: [
      'Competitive grant application processes',
      'Multi-stage due diligence and assessment',
      'Results-based monitoring and evaluation',
      'Regular capacity building workshops',
      'Annual partner convenings and learning exchanges'
    ],
    impact: [
      { metric: 'Total Funds Managed', value: 'USD 47M+' },
      { metric: 'Active Grantees', value: '200+' },
      { metric: 'Districts Covered', value: '184' },
      { metric: 'Compliance Rate', value: '98%' }
    ]
  },
  'direct-implementation': {
    id: 'direct-implementation',
    title: 'Direct Project Implementation',
    description: 'Since 2023, LSF has strategically expanded to include direct project implementation, enhancing agility and impact through high-impact initiatives.',
    icon: <Wrench className="h-8 w-8" />,
    keyFeatures: [
      'Agile project management and implementation',
      'Community-centered design and delivery',
      'Technology-enabled service delivery',
      'Partnership-based implementation models',
      'Real-time monitoring and adaptive management'
    ],
    currentProjects: [
      {
        title: 'Sauti ya Mwanamke',
        description: 'EU-funded project strengthening women\'s access to justice and voice in governance.',
        status: 'Active'
      },
      {
        title: 'Wanawake Tunaweza',
        description: 'Women\'s economic and legal empowerment program in rural communities.',
        status: 'Active'
      },
      {
        title: 'Mobile Legal Clinic Network',
        description: 'Direct delivery of legal services to remote and underserved communities.',
        status: 'Expanding'
      }
    ],
    achievements: [
      'Successfully launched first direct implementation projects in 2023',
      'Reached 15,000+ direct beneficiaries in first year',
      'Established mobile legal clinic services in 25 districts',
      'Achieved 95% beneficiary satisfaction rate'
    ],
    futureGoals: [
      'Scale direct implementation to 50+ districts by 2026',
      'Develop replicable implementation models',
      'Integrate technology solutions across all projects',
      'Establish permanent field offices in key regions'
    ],
    methodology: [
      'Community needs assessment and mapping',
      'Participatory project design and planning',
      'Phased implementation with continuous learning',
      'Technology integration for efficiency and reach',
      'Impact measurement and documentation'
    ],
    impact: [
      { metric: 'Direct Beneficiaries', value: '15,000+' },
      { metric: 'Districts Reached', value: '25' },
      { metric: 'Satisfaction Rate', value: '95%' },
      { metric: 'Active Projects', value: '8' }
    ]
  },
  'advocacy-policy': {
    id: 'advocacy-policy',
    title: 'Advocacy and Policy Influence',
    description: 'LSF has played a pivotal role in shaping Tanzania\'s access to justice landscape, championing the Legal Aid Act and driving nationwide legal empowerment initiatives.',
    icon: <Megaphone className="h-8 w-8" />,
    keyFeatures: [
      'Evidence-based policy research and analysis',
      'Strategic stakeholder engagement and coalition building',
      'Legislative advocacy and policy development',
      'Public awareness campaigns and mobilization',
      'Monitoring and evaluation of policy implementation'
    ],
    currentProjects: [
      {
        title: 'Legal Aid Act Implementation',
        description: 'Supporting operationalization of the Legal Aid Act and its regulations.',
        status: 'Ongoing'
      },
      {
        title: 'Mama Samia Legal Aid Campaign',
        description: 'Nationwide campaign to increase awareness and access to legal aid services.',
        status: 'Active'
      },
      {
        title: 'Justice Sector Reform Advocacy',
        description: 'Advocating for reforms to improve access to justice and legal empowerment.',
        status: 'Ongoing'
      }
    ],
    achievements: [
      'Led successful advocacy for the Legal Aid Act enactment',
      'Influenced development of Legal Aid Act regulations',
      'Launched the national Mama Samia Legal Aid Campaign',
      'Established multi-stakeholder coordination mechanisms'
    ],
    futureGoals: [
      'Advocate for additional legal and policy reforms',
      'Strengthen civil society advocacy capacity',
      'Expand policy influence at regional and continental levels',
      'Develop sustainable advocacy funding mechanisms'
    ],
    methodology: [
      'Strategic policy analysis and research',
      'Coalition building and stakeholder mobilization',
      'Legislative engagement and lobbying',
      'Public campaign development and implementation',
      'Policy monitoring and accountability mechanisms'
    ],
    impact: [
      { metric: 'Policies Influenced', value: '5+' },
      { metric: 'Campaign Reach', value: '2M+' },
      { metric: 'Stakeholder Partnerships', value: '100+' },
      { metric: 'Media Coverage', value: '500+' }
    ]
  },
  'research-learning': {
    id: 'research-learning',
    title: 'Research, Learning, and Innovation',
    description: 'LSF actively invests in research, monitoring, and learning to ensure evidence-based programming and informed policy engagement through academic partnerships.',
    icon: <BookOpen className="h-8 w-8" />,
    keyFeatures: [
      'Rigorous research methodology and design',
      'Academic and institutional partnerships',
      'Innovation labs and pilot testing',
      'Knowledge management and dissemination',
      'Capacity building for research excellence'
    ],
    currentProjects: [
      {
        title: 'Legal Empowerment Impact Study',
        description: 'Comprehensive research on the impact of legal empowerment initiatives in Tanzania.',
        status: 'Ongoing'
      },
      {
        title: 'Digital Justice Innovation Lab',
        description: 'Testing and developing technology solutions for improved access to justice.',
        status: 'Pilot Phase'
      },
      {
        title: 'Gender and Justice Research Program',
        description: 'Research on gender dimensions of access to justice and legal empowerment.',
        status: 'Active'
      }
    ],
    achievements: [
      'Published 15+ research reports and policy briefs',
      'Established partnerships with 5 academic institutions',
      'Developed innovative research methodologies for legal empowerment',
      'Created evidence base for policy advocacy and program design'
    ],
    futureGoals: [
      'Establish LSF as a leading research institution in legal empowerment',
      'Develop institutional research capacity and expertise',
      'Create a comprehensive knowledge management system',
      'Expand international research collaborations and exchanges'
    ],
    methodology: [
      'Mixed-methods research approaches',
      'Participatory research with communities',
      'Technology-enabled data collection and analysis',
      'Peer review and academic quality assurance',
      'Dissemination through multiple channels and formats'
    ],
    impact: [
      { metric: 'Research Publications', value: '15+' },
      { metric: 'Academic Partners', value: '5' },
      { metric: 'Innovation Pilots', value: '8' },
      { metric: 'Research Uptake', value: '80%' }
    ]
  },
  'partnerships-networking': {
    id: 'partnerships-networking',
    title: 'Strategic Partnerships and Networking',
    description: 'LSF\'s impact is amplified through diverse partnerships with civil society, development partners, government entities, and private sector actors to co-create solutions.',
    icon: <Users className="h-8 w-8" />,
    keyFeatures: [
      'Multi-stakeholder partnership development',
      'Strategic alliance building and management',
      'Network facilitation and coordination',
      'Resource sharing and collaboration',
      'Joint programming and implementation'
    ],
    currentProjects: [
      {
        title: 'Tanzania Legal Aid Network',
        description: 'Coordinating network of legal aid providers across Tanzania.',
        status: 'Active'
      },
      {
        title: 'East Africa Legal Empowerment Initiative',
        description: 'Regional partnership for legal empowerment knowledge sharing.',
        status: 'Developing'
      },
      {
        title: 'Private Sector Justice Alliance',
        description: 'Engaging private sector in supporting access to justice initiatives.',
        status: 'Pilot Phase'
      }
    ],
    achievements: [
      'Established partnerships with 200+ organizations',
      'Facilitated coordination among 180+ legal aid providers',
      'Created multi-sector collaboration platforms',
      'Leveraged USD 20M+ in additional resources through partnerships'
    ],
    futureGoals: [
      'Expand regional and international partnerships',
      'Strengthen private sector engagement',
      'Develop sustainable partnership models',
      'Create innovation ecosystems for justice solutions'
    ],
    methodology: [
      'Strategic partnership mapping and analysis',
      'Collaborative planning and resource mobilization',
      'Regular coordination and communication mechanisms',
      'Joint monitoring and evaluation frameworks',
      'Mutual accountability and learning systems'
    ],
    impact: [
      { metric: 'Active Partners', value: '200+' },
      { metric: 'Network Members', value: '180+' },
      { metric: 'Resources Leveraged', value: 'USD 20M+' },
      { metric: 'Joint Initiatives', value: '25+' }
    ]
  }
};

const ApproachDetail = () => {
  const { approachId } = useParams();
  const approach = approachId ? approaches[approachId] : null;

  if (!approach) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Approach Not Found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={approach.icon}
        badge="Our Approach"
        title={approach.title}
        description={approach.description}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Key Features */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark flex items-center">
                    <Target className="h-8 w-8 text-primary mr-3" />
                    Key Features
                  </h2>
                  <div className="space-y-4">
                    {approach.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                        <p className="text-neutral-gray text-lg">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Projects */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Current Projects</h2>
                  <div className="space-y-6">
                    {approach.currentProjects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-neutral-dark">{project.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            project.status === 'Active' ? 'bg-green-100 text-green-800' :
                            project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'Expanding' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-neutral-gray">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Methodology */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Methodology</h2>
                  <div className="space-y-4">
                    {approach.methodology.map((method, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-primary font-semibold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-neutral-gray text-lg">{method}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Key Achievements</h2>
                  <div className="space-y-4">
                    {approach.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-teal rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-neutral-gray text-lg">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Impact Metrics */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-neutral-dark">Impact Metrics</h3>
                    <div className="space-y-4">
                      {approach.impact.map((metric, index) => (
                        <div key={index} className="text-center p-4 bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                          <div className="text-sm text-neutral-gray">{metric.metric}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Future Goals */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-neutral-dark">Future Goals</h3>
                    <div className="space-y-3">
                      {approach.futureGoals.map((goal, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-secondary-orange rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <p className="text-sm text-neutral-gray">{goal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ApproachDetail;
