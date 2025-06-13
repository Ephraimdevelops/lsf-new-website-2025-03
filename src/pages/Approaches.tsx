
import Layout from '../components/layout/Layout';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import { 
  DollarSign, 
  Target, 
  Megaphone, 
  BookOpen, 
  Users, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Download,
  ExternalLink,
  Handshake,
  Globe,
  Lightbulb,
  Video,
  FileText,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumb from '@/components/shared/Breadcrumb';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

const Approaches = () => {
  const approaches = [
    {
      id: 'grant-making',
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Grant Making and Management',
      description: 'Channeling resources to grassroots justice initiatives through transparent, competitive grants with rigorous oversight.',
      fullDescription: 'LSF\'s grantmaking approach channels resources to grassroots justice initiatives across the country. We provide transparent, competitive grants to vetted legal aid organizations and community projects, ensuring funds are managed with rigorous oversight. This method matters because it leverages local expertise and promotes equity, amplifying impact through trusted partners. The result is a dynamic portfolio of projects (from rural legal clinics to youth-led rights campaigns) that are accountable and sustainable.',
      stats: [
        { value: '$2M+', label: 'Distributed Annually' },
        { value: '120+', label: 'Grants Awarded' },
        { value: '95%', label: 'Success Rate' }
      ],
      process: [
        { step: 'Apply', description: 'Submit comprehensive grant application' },
        { step: 'Review', description: 'Expert panel evaluates proposals' },
        { step: 'Award', description: 'Successful applicants receive funding' },
        { step: 'Monitor', description: 'Ongoing support and evaluation' }
      ],
      highlights: [
        {
          title: 'Rural Legal Clinic Network',
          description: 'Funded 45 rural legal clinics serving remote communities across Tanzania',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Youth Leadership Program',
          description: 'Supported youth-led legal advocacy initiatives in 12 regions',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Women\'s Rights Initiative',
          description: 'Empowered women\'s organizations with legal advocacy tools',
          image: '/lovable-uploads/background with mother umage .png'
        }
      ],
      testimonial: {
        quote: "LSF's grant enabled us to open a legal aid center that has helped over 500 families resolve land disputes.",
        author: "Grace Mwangi",
        role: "Director, Community Legal Aid Center"
      },
      color: 'from-secondary-orange to-secondary-orange/80'
    },
    {
      id: 'direct-implementation',
      icon: <Target className="h-8 w-8" />,
      title: 'Direct Project Implementation',
      description: 'Leading key projects directly to demonstrate best practices and fill urgent gaps in legal aid delivery.',
      fullDescription: 'Beyond grants, LSF directly leads key projects when needed. This includes operating legal clinics, conducting paralegal training programs, and piloting new delivery models. By implementing projects directly, LSF demonstrates best practices and can quickly adapt to emerging challenges. This direct action approach matters because it fills urgent gaps and generates lessons that inform broader efforts. The impact is visible: new program models are scaled up by partners, urgent legal needs are met, and a repository of best practices is developed.',
      stats: [
        { value: '200+', label: 'Paralegals Trained' },
        { value: '15+', label: 'Mobile Clinics' },
        { value: '8,000+', label: 'Cases Handled' }
      ],
      process: [
        { step: 'Identify', description: 'Assess urgent gaps in legal services' },
        { step: 'Design', description: 'Develop targeted intervention programs' },
        { step: 'Implement', description: 'Execute projects with local partners' },
        { step: 'Scale', description: 'Replicate successful models' }
      ],
      highlights: [
        {
          title: 'Mobile Justice Clinics',
          description: 'Bringing legal services directly to underserved rural communities',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Paralegal Certification',
          description: 'Comprehensive training program creating community legal advocates',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Digital Legal Platform',
          description: 'Innovative online platform connecting citizens with legal help',
          image: '/lovable-uploads/background with mother umage .png'
        }
      ],
      testimonial: {
        quote: "The paralegal training I received from LSF transformed my ability to help my community. I've now assisted over 150 families.",
        author: "James Mwema",
        role: "Certified Community Paralegal"
      },
      color: 'from-secondary-teal to-secondary-teal/80'
    },
    {
      id: 'advocacy-policy',
      icon: <Megaphone className="h-8 w-8" />,
      title: 'Advocacy and Policy Influence',
      description: 'Shaping the policy landscape through strategic advocacy and evidence-backed policy briefs.',
      fullDescription: 'LSF shapes the policy landscape through strategic advocacy. We craft evidence-backed policy briefs, convene multi-stakeholder forums, and engage the media and government on justice issues. This matters because legal empowerment requires supportive laws and practices; influencing policy removes systemic obstacles and protects rights at scale. The results include tangible policy wins (new guidelines, law amendments) and a stronger network of stakeholders championing justice. Through these efforts, LSF demonstrates leadership in shaping a just society and inspiring others to join the cause.',
      stats: [
        { value: '15+', label: 'Policy Reforms' },
        { value: '30+', label: 'Policy Briefs' },
        { value: '50+', label: 'Stakeholder Forums' }
      ],
      process: [
        { step: 'Research', description: 'Conduct evidence-based policy analysis' },
        { step: 'Engage', description: 'Build coalitions with key stakeholders' },
        { step: 'Advocate', description: 'Present recommendations to policymakers' },
        { step: 'Monitor', description: 'Track implementation and impact' }
      ],
      highlights: [
        {
          title: 'Legal Aid Act',
          description: 'Successfully advocated for comprehensive legal aid legislation',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Gender Equality Laws',
          description: 'Influenced amendments strengthening women\'s property rights',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Court Reforms',
          description: 'Advocated for procedural changes improving access to justice',
          image: '/lovable-uploads/background with mother umage .png'
        }
      ],
      testimonial: {
        quote: "LSF's policy advocacy has been crucial in creating a more inclusive justice framework for Tanzania.",
        author: "Hon. Dr. Mary Mwalimu",
        role: "Minister of Constitutional Affairs"
      },
      color: 'from-primary to-primary-dark'
    },
    {
      id: 'research-innovation',
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Research, Learning, and Innovation',
      description: 'Investing in rigorous research and innovative solutions to advance evidence-based legal empowerment.',
      fullDescription: 'LSF champions continuous learning by investing in rigorous research and innovative solutions. We analyze data on justice outcomes, document best practices, and pilot new technologies (like mobile legal apps). This approach matters because it grounds our work in evidence and keeps LSF at the cutting edge. The impact is evident in published studies that guide the sector, innovative tools adopted by partners, and a learning culture that drives greater results. Our transparent publication of findings also contributes to sector-wide learning.',
      stats: [
        { value: '25+', label: 'Research Studies' },
        { value: '10+', label: 'Innovation Pilots' },
        { value: '100+', label: 'Best Practices Documented' }
      ],
      process: [
        { step: 'Analyze', description: 'Study justice outcomes and trends' },
        { step: 'Research', description: 'Conduct evidence-based investigations' },
        { step: 'Innovate', description: 'Pilot new approaches and technologies' },
        { step: 'Share', description: 'Publish findings for sector learning' }
      ],
      highlights: [
        {
          title: 'Justice Sector Analysis',
          description: 'Comprehensive study on access to justice barriers in Tanzania',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Mobile Legal App',
          description: 'Innovative platform providing legal guidance via smartphones',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Impact Measurement',
          description: 'Developing new frameworks for measuring justice outcomes',
          image: '/lovable-uploads/background with mother umage .png'
        }
      ],
      testimonial: {
        quote: "LSF's research has provided invaluable insights that have shaped our understanding of effective legal aid delivery.",
        author: "Prof. David Kikoyo",
        role: "Legal Studies, University of Dar es Salaam"
      },
      color: 'from-secondary-yellow to-secondary-yellow/80'
    },
    {
      id: 'partnerships',
      icon: <Users className="h-8 w-8" />,
      title: 'Strategic Partnerships and Networking',
      description: 'Multiplying impact through strategic alliances with NGOs, government, donors, and community groups.',
      fullDescription: 'LSF multiplies its impact by forging strategic partnerships and alliances with NGOs, government agencies, donors, and community groups. We host collaboration platforms, attend national and global forums, and co-create programs with experts. This matters because collective action accelerates progress and ensures resources reach where they\'re needed most. The impact is clear: expanded program reach, shared learning across organizations, and a united voice advocating for justice. LSF\'s transparent partnerships have led to greater resource sharing and a stronger network united for justice.',
      stats: [
        { value: '200+', label: 'Active Partners' },
        { value: '25+', label: 'International Networks' },
        { value: '85%', label: 'Partnership Satisfaction' }
      ],
      process: [
        { step: 'Connect', description: 'Identify potential strategic partners' },
        { step: 'Collaborate', description: 'Develop joint programs and initiatives' },
        { step: 'Coordinate', description: 'Facilitate network activities and forums' },
        { step: 'Celebrate', description: 'Share successes and learn together' }
      ],
      highlights: [
        {
          title: 'Global Legal Empowerment Network',
          description: 'Active member contributing to international justice initiatives',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Government Partnerships',
          description: 'Collaborative programs with Ministry of Justice and courts',
          image: '/lovable-uploads/background with mother umage .png'
        },
        {
          title: 'Civil Society Coalition',
          description: 'Leading network of 50+ organizations working on justice issues',
          image: '/lovable-uploads/background with mother umage .png'
        }
      ],
      testimonial: {
        quote: "Working with LSF has strengthened our capacity to deliver quality legal aid services to our communities.",
        author: "Margaret Sanga",
        role: "Executive Director, Rural Development Trust"
      },
      color: 'from-green-500 to-green-600'
    }
  ];

  const breadcrumbItems = [
    { label: "What We Do", href: "/what-we-do" },
    { label: "Our Approaches" }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* Hero Section */}
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
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto px-4">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Target className="h-6 w-6 text-secondary-orange" />
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                Our Approaches
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-6xl font-bold">
              How We Drive
              <span className="block text-secondary-orange">Lasting Change</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-2xl max-w-4xl mx-auto leading-relaxed">
              Five integrated approaches that multiply our impact and create sustainable pathways to justice for all Tanzanians.
            </Typography>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-secondary-orange">
                  <AnimatedCounter end={200} suffix="+" />
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-secondary-teal">
                  <AnimatedCounter end={2} suffix="M+" />
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Funds Distributed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-secondary-yellow">
                  <AnimatedCounter end={15} suffix="+" />
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Policy Reforms</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-white">
                  <AnimatedCounter end={25} suffix="+" />
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Research Studies</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Approaches Detail Sections */}
      {approaches.map((approach, index) => (
        <section key={approach.id} className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-light'}`}>
          <Container size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Content */}
              <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
                  <div className="text-primary mr-3">
                    {approach.icon}
                  </div>
                  <Typography variant="overline" className="text-primary font-bold">
                    APPROACH {String(index + 1).padStart(2, '0')}
                  </Typography>
                </div>
                
                <Typography variant="h1" className="mb-6 text-4xl font-bold">
                  {approach.title}
                </Typography>
                
                <Typography variant="body" className="text-neutral-gray mb-8 text-lg leading-relaxed">
                  {approach.fullDescription}
                </Typography>

                {/* Process Flow */}
                <div className="mb-8">
                  <Typography variant="h3" className="mb-6 text-primary">
                    Our Process
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {approach.process.map((step, stepIndex) => (
                      <div key={stepIndex} className="text-center">
                        <div className={`w-12 h-12 bg-gradient-to-br ${approach.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">{stepIndex + 1}</span>
                        </div>
                        <Typography variant="h4" className="mb-2 text-sm">
                          {step.step}
                        </Typography>
                        <Typography variant="bodySmall" className="text-neutral-gray text-xs">
                          {step.description}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-primary/5 rounded-2xl p-6 mb-8">
                  <Typography variant="body" className="text-primary mb-4 italic text-lg">
                    "{approach.testimonial.quote}"
                  </Typography>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">{approach.testimonial.author}</div>
                      <div className="text-neutral-gray text-sm">{approach.testimonial.role}</div>
                    </div>
                  </div>
                </div>

                <Button size="lg" className={`bg-gradient-to-r ${approach.color} text-white hover:scale-105 transition-transform`}>
                  Learn More About This Approach
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Stats & Highlights */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                {/* Impact Stats */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-8 mb-8">
                  <Typography variant="h3" className="mb-6 text-center">
                    Impact Metrics
                  </Typography>
                  <div className="space-y-6">
                    {approach.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center justify-between">
                        <span className="text-neutral-gray">{stat.label}</span>
                        <span className="text-2xl font-bold text-primary">
                          <AnimatedCounter 
                            end={parseInt(stat.value.replace(/\D/g, '')) || 0} 
                            suffix={stat.value.replace(/\d/g, '')} 
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Highlights */}
                <div className="space-y-4">
                  <Typography variant="h3" className="mb-6">
                    Key Initiatives
                  </Typography>
                  {approach.highlights.map((highlight, hIndex) => (
                    <div key={hIndex} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${approach.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Typography variant="h4" className="mb-2">
                            {highlight.title}
                          </Typography>
                          <Typography variant="bodySmall" className="text-neutral-gray">
                            {highlight.description}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container size="xl">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <Handshake className="h-6 w-6 mr-4 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                JOIN OUR MISSION
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-white text-5xl font-bold">
              Partner With Us
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
              Whether you're seeking to fund innovation, implement projects, influence policy, conduct research, 
              or build networks, we welcome collaboration that advances justice for all.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white text-lg px-8 py-4">
                Explore Partnership Opportunities
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                <Download className="mr-3 h-6 w-6" />
                Download Partnership Guide
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Approaches;
