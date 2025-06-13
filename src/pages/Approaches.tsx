
import Layout from '../components/layout/Layout';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import ApproachHero from '../components/approaches/ApproachHero';
import ApproachDetailSection from '../components/approaches/ApproachDetailSection';
import CallToActionSection from '../components/shared/CallToActionSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { 
  DollarSign, 
  Target, 
  Megaphone, 
  BookOpen, 
  Users, 
  ArrowRight,
  CheckCircle,
  Handshake,
  Download
} from 'lucide-react';

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

      <ApproachHero approaches={approaches} />

      {/* Approaches Detail Sections */}
      {approaches.map((approach, index) => (
        <ApproachDetailSection 
          key={approach.id} 
          approach={approach} 
          index={index} 
        />
      ))}

      {/* Call to Action */}
      <CallToActionSection
        title="Partner With Us"
        subtitle="JOIN OUR MISSION"
        description="Whether you're seeking to fund innovation, implement projects, influence policy, conduct research, or build networks, we welcome collaboration that advances justice for all."
        primaryButton={{
          text: "Explore Partnership Opportunities",
          icon: <ArrowRight className="h-6 w-6" />
        }}
        secondaryButton={{
          text: "Download Partnership Guide",
          icon: <Download className="h-6 w-6" />
        }}
        badge={{
          text: "JOIN OUR MISSION",
          icon: <Handshake className="h-6 w-6" />
        }}
      />
    </Layout>
  );
};

export default Approaches;
