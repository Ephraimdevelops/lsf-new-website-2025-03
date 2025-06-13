
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, Scale, Users, Gavel, Building, Target, CheckCircle, Sparkles, TrendingUp, Award, Heart, Globe, Download, ExternalLink, Phone, MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Breadcrumb from '../components/shared/Breadcrumb';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

interface FocusArea {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  icon: React.ReactNode;
  objectives: string[];
  keyActivities: string[];
  targetBeneficiaries: string[];
  expectedOutcomes: string[];
  challenges: string[];
  successStories: { title: string; description: string }[];
  impactStats: { value: string; label: string; icon: React.ReactNode }[];
  resources: { title: string; type: string; link: string }[];
  testimonial: { quote: string; author: string; role: string };
}

const focusAreas: { [key: string]: FocusArea } = {
  'accessible-legal-aid': {
    id: 'accessible-legal-aid',
    title: 'Increasing Accessibility to Quality Legal Aid Services',
    description: 'Breaking down barriers to justice by bringing affordable, high-quality legal aid within reach of all communities across the country.',
    fullDescription: 'LSF, a leading national legal empowerment institution, breaks down barriers to justice by bringing affordable, high-quality legal aid within reach of all communities across the country. Through innovative outreach programs, remote clinics, and digital platforms, LSF ensures that vulnerable and marginalized individuals can secure timely legal advice and representation. This focus is equity-driven: it matters because only an accessible justice system can truly uphold rights and fairness for everyone. The impact is demonstrable – thousands of individuals have successfully navigated legal processes and regained confidence in the justice system.',
    icon: <Scale className="h-8 w-8" />,
    objectives: [
      'Expand geographic coverage of legal aid services to underserved areas',
      'Improve quality and standardization of legal aid delivery',
      'Reduce barriers to accessing legal services for marginalized communities',
      'Strengthen capacity of legal aid providers across Tanzania'
    ],
    keyActivities: [
      'Legal Helpline: 24/7 phone and digital support for immediate legal guidance',
      'Community Clinics: Mobile and fixed legal aid centers in remote areas', 
      'Online Consultation: Digital platforms connecting citizens with legal experts',
      'Paralegal Training: Comprehensive certification programs for community advocates'
    ],
    targetBeneficiaries: [
      'Women and girls facing legal challenges',
      'Rural communities with limited access to justice',
      'People living in poverty',
      'Persons with disabilities',
      'Youth and elderly populations'
    ],
    expectedOutcomes: [
      'Increased number of people accessing quality legal aid',
      'Reduced geographic and economic barriers to justice',
      'Improved legal literacy in target communities',
      'Strengthened network of legal aid providers'
    ],
    challenges: [
      'Limited resources for service expansion',
      'Geographic barriers in rural areas',
      'Cultural and language barriers',
      'Lack of awareness about available services'
    ],
    successStories: [
      {
        title: 'Mobile Legal Clinic Impact',
        description: 'Our mobile legal clinics have reached over 15,000 people in remote areas, providing crucial legal services where none existed before.'
      },
      {
        title: 'Digital Platform Success',
        description: 'Our online consultation platform has facilitated over 8,000 legal consultations, connecting rural communities with expert legal advice.'
      }
    ],
    impactStats: [
      { value: '5000+', label: 'People Served Annually', icon: <Users className="h-6 w-6" /> },
      { value: '24/7', label: 'Legal Helpline Availability', icon: <Phone className="h-6 w-6" /> },
      { value: '150+', label: 'Community Clinics', icon: <MapPin className="h-6 w-6" /> }
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
    objectives: [
      'Increase legal literacy and awareness in communities',
      'Strengthen community-based legal empowerment structures',
      'Promote women\'s legal rights and gender equality',
      'Build sustainable legal empowerment initiatives'
    ],
    keyActivities: [
      'Legal Education: Comprehensive rights awareness programs for all community members',
      'Paralegal Training: Building local capacity through certified community advocates',
      'Community Forums: Regular dialogue sessions on legal issues and solutions',
      'Youth Engagement: Targeted programs to engage young people in legal empowerment'
    ],
    targetBeneficiaries: [
      'Women and girls in rural and urban areas',
      'Community leaders and influencers',
      'Youth groups and organizations',
      'Religious and traditional leaders'
    ],
    expectedOutcomes: [
      'Increased legal knowledge in target communities',
      'Stronger community-based legal support systems',
      'Improved gender equality and women\'s rights',
      'Reduced legal disputes through community mediation'
    ],
    challenges: [
      'Traditional practices conflicting with legal rights',
      'Limited literacy levels in some communities',
      'Resistance to change in patriarchal structures',
      'Sustainability of community initiatives'
    ],
    successStories: [
      {
        title: 'Women\'s Legal Rights Campaign',
        description: 'Our community education programs have empowered over 10,000 women with knowledge of their legal rights, leading to increased reporting of violations.'
      },
      {
        title: 'Community Mediation Success',
        description: 'Trained community mediators have successfully resolved 85% of local disputes without formal court proceedings.'
      }
    ],
    impactStats: [
      { value: '4000+', label: 'Paralegals Trained', icon: <Users className="h-6 w-6" /> },
      { value: '184', label: 'Communities Served', icon: <Globe className="h-6 w-6" /> },
      { value: '85%', label: 'Dispute Resolution Rate', icon: <CheckCircle className="h-6 w-6" /> }
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
    objectives: [
      'Advocate for progressive legal and policy reforms',
      'Strengthen institutional frameworks for access to justice',
      'Promote coordination among justice sector stakeholders',
      'Monitor and evaluate justice sector performance'
    ],
    keyActivities: [
      'Legal Reform: Evidence-based advocacy for fair and inclusive laws',
      'Judicial Training: Capacity building for justice sector professionals',
      'Anti-Corruption: Initiatives to promote transparency and accountability',
      'Policy Development: Research and recommendations for systemic improvements'
    ],
    targetBeneficiaries: [
      'Civil society organizations',
      'Government institutions',
      'Legal professionals and practitioners',
      'Development partners and donors'
    ],
    expectedOutcomes: [
      'Improved legal and policy frameworks',
      'Stronger coordination in the justice sector',
      'Increased government commitment to access to justice',
      'Enhanced accountability in justice delivery'
    ],
    challenges: [
      'Political resistance to reforms',
      'Limited resources for advocacy efforts',
      'Competing priorities in government agenda',
      'Coordination challenges among stakeholders'
    ],
    successStories: [
      {
        title: 'Legal Aid Act Achievement',
        description: 'Our advocacy efforts led to the enactment of the Legal Aid Act, establishing a national framework for legal aid provision in Tanzania.'
      },
      {
        title: 'Judicial Reform Impact',
        description: 'Successfully advocated for court procedure reforms that reduced case backlogs by 40% and improved access for vulnerable populations.'
      }
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
    objectives: [
      'Strengthen organizational capacity and systems',
      'Diversify funding sources and ensure sustainability',
      'Improve operational efficiency and effectiveness',
      'Build sector-wide capacity for legal aid delivery'
    ],
    keyActivities: [
      'Organizational Development: Building robust governance and management systems',
      'Financial Sustainability: Diversifying funding and improving resource management',
      'Technology Integration: Leveraging digital solutions for greater efficiency',
      'Partner Capacity Building: Strengthening the broader legal aid ecosystem'
    ],
    targetBeneficiaries: [
      'LSF staff and management',
      'Partner organizations and grantees',
      'Legal aid sector stakeholders',
      'Donor community and investors'
    ],
    expectedOutcomes: [
      'Stronger and more resilient LSF organization',
      'Diversified and sustainable funding base',
      'Improved service delivery efficiency',
      'Enhanced sector coordination and collaboration'
    ],
    challenges: [
      'Donor dependency and funding uncertainties',
      'Limited local fundraising capacity',
      'Capacity gaps in partner organizations',
      'Competition for limited resources'
    ],
    successStories: [
      {
        title: 'Digital Transformation',
        description: 'We have successfully digitized our operations, improving efficiency by 60% and expanding our reach through technology platforms.'
      },
      {
        title: 'Partnership Network',
        description: 'Built a network of 200+ partners across Tanzania, creating a sustainable ecosystem for legal empowerment.'
      }
    ],
    impactStats: [
      { value: '200+', label: 'Strategic Partners', icon: <Users className="h-6 w-6" /> },
      { value: '15+', label: 'Years of Operation', icon: <Award className="h-6 w-6" /> },
      { value: '$5M+', label: 'Resources Mobilized', icon: <TrendingUp className="h-6 w-6" /> }
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
  }
};

const FocusAreaDetail = () => {
  const { focusAreaId } = useParams();
  const focusArea = focusAreaId ? focusAreas[focusAreaId] : null;

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
    { label: "What We Do", href: "/what-we-do" },
    { label: "Focus Areas", href: "/what-we-do#focus-areas" },
    { label: focusArea.title }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto px-4">
            <div className="inline-flex items-center space-x-3 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/20">
              <div className="text-secondary-orange">
                {focusArea.icon}
              </div>
              <span className="text-secondary-orange font-bold text-sm md:text-lg uppercase tracking-wider">
                Strategic Focus Area
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-6 md:mb-8 leading-none text-2xl md:text-4xl lg:text-6xl font-bold">
              {focusArea.title}
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-8 md:mb-12 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
              {focusArea.fullDescription}
            </Typography>

            {/* Impact Stats Callout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {focusArea.impactStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-secondary-orange mb-3 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">
                    <AnimatedCounter end={parseInt(stat.value.replace(/\D/g, '')) || 0} suffix={stat.value.replace(/\d/g, '')} />
                  </div>
                  <div className="text-white/80 text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <Link to="/what-we-do" className="inline-flex items-center text-white/80 hover:text-white mb-12 md:mb-16 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to What We Do
            </Link>
          </div>
        </Container>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h1" className="mb-6 text-4xl md:text-5xl font-bold">
              How We Make Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg">
              Our approach combines innovative methods and proven strategies to deliver meaningful results.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {focusArea.keyActivities.map((activity, index) => {
              const [title, description] = activity.split(': ');
              return (
                <div key={index} className="group text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 bg-primary/30 rounded-2xl flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  <Typography variant="h4" className="mb-3 text-primary">
                    {title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray leading-relaxed">
                    {description}
                  </Typography>
                </div>
              );
            })}
          </div>

          {/* Testimonial Block */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-8 md:p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-primary mb-8 italic">
                "{focusArea.testimonial.quote}"
              </Typography>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">{focusArea.testimonial.author}</div>
                  <div className="text-neutral-gray">{focusArea.testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-neutral-light">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Resources & Tools
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Access our comprehensive collection of guides, toolkits, and resources to support your journey.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {focusArea.resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-secondary-teal/20 rounded-2xl flex items-center justify-center mb-6">
                  {resource.type === 'PDF' ? <Download className="h-8 w-8 text-secondary-teal" /> :
                   resource.type === 'Video Guide' ? <Video className="h-8 w-8 text-secondary-teal" /> :
                   <ExternalLink className="h-8 w-8 text-secondary-teal" />}
                </div>
                <Typography variant="h4" className="mb-3">
                  {resource.title}
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  {resource.type}
                </Typography>
                <Button className="w-full bg-secondary-teal hover:bg-secondary-teal/90 text-white">
                  Access Resource
                </Button>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-secondary-orange/20 to-secondary-teal/20 rounded-3xl p-8 md:p-12">
              <Heart className="h-16 w-16 text-secondary-orange mx-auto mb-6" />
              <Typography variant="h2" className="mb-6">
                Get Involved in This Focus Area
              </Typography>
              <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
                Join our mission to strengthen this critical area of our work. Whether you need help or want to contribute, we welcome your participation.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                  Find Help Near You
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Partner With Us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default FocusAreaDetail;
