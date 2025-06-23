
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Section from '../components/shared/Section';
import Typography from '../components/shared/Typography';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Users, 
  Gavel, 
  Building, 
  Leaf, 
  Smartphone,
  ArrowRight,
  Target,
  BookOpen
} from 'lucide-react';

const Programs = () => {
  const focusAreas = [
    {
      id: 'accessible-legal-aid',
      title: 'Accessible Legal Aid Services',
      description: 'Breaking down barriers to justice by bringing affordable, high-quality legal aid within reach of all communities.',
      icon: <Scale className="h-8 w-8" />,
      stats: '5,000+ people served annually',
      link: '/focus-areas/accessible-legal-aid'
    },
    {
      id: 'empowered-communities',
      title: 'Legally Empowered Communities',
      description: 'Equipping local groups and citizens with knowledge and tools to use the law effectively.',
      icon: <Users className="h-8 w-8" />,
      stats: '4,000+ paralegals trained',
      link: '/focus-areas/empowered-communities'
    },
    {
      id: 'conducive-environment',
      title: 'Conducive Environment for Justice',
      description: 'Working systemically to create an enabling ecosystem for justice through policy and reform.',
      icon: <Gavel className="h-8 w-8" />,
      stats: '15+ policy reforms influenced',
      link: '/focus-areas/conducive-environment'
    },
    {
      id: 'institutional-development',
      title: 'Institutional Development',
      description: 'Strengthening organizational capacity and sustainability for long-term impact.',
      icon: <Building className="h-8 w-8" />,
      stats: '200+ strategic partners',
      link: '/focus-areas/institutional-development'
    },
    {
      id: 'climate-justice',
      title: 'Climate Justice',
      description: 'Protecting land rights and supporting climate-vulnerable communities.',
      icon: <Leaf className="h-8 w-8" />,
      stats: '2,000+ families protected',
      link: '/focus-areas/climate-justice'
    },
    {
      id: 'digital-transformation',
      title: 'Digital Transformation',
      description: 'Leveraging technology for wider access through digital platforms and mobile apps.',
      icon: <Smartphone className="h-8 w-8" />,
      stats: '15,000+ app users',
      link: '/focus-areas/digital-transformation'
    }
  ];

  const approaches = [
    {
      title: 'Grant Making & Management',
      description: 'Channeling resources to grassroots justice initiatives through transparent, competitive grants.',
      icon: <Target className="h-6 w-6" />,
      link: '/approaches/grant-making'
    },
    {
      title: 'Direct Implementation',
      description: 'Leading key projects directly to demonstrate best practices and fill urgent gaps.',
      icon: <Users className="h-6 w-6" />,
      link: '/approaches/direct-implementation'
    },
    {
      title: 'Policy & Advocacy',
      description: 'Shaping the policy landscape through strategic advocacy and evidence-backed briefs.',
      icon: <Gavel className="h-6 w-6" />,
      link: '/approaches/advocacy-policy'
    },
    {
      title: 'Research & Innovation',
      description: 'Investing in rigorous research and innovative solutions for evidence-based empowerment.',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/approaches/research-innovation'
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Target className="h-8 w-8" />}
        badge="OUR PROGRAMS"
        title="Strategic Focus Areas & Programs"
        description="LSF's comprehensive approach to legal empowerment operates across six strategic focus areas, each designed to address different aspects of the justice gap in Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Strategic Focus Areas */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Strategic Focus Areas
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our work is organized around six strategic focus areas that address the full spectrum 
              of legal empowerment needs across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {focusAreas.map((area, index) => (
              <Link 
                key={index}
                to={area.link}
                className="group bg-white rounded-xl border border-neutral-light p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-primary mb-6 group-hover:text-secondary-orange transition-colors">
                  {area.icon}
                </div>
                <Typography variant="h3" className="mb-4 group-hover:text-primary transition-colors">
                  {area.title}
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  {area.description}
                </Typography>
                <div className="flex items-center justify-between">
                  <Typography variant="small" className="text-secondary-orange font-semibold">
                    {area.stats}
                  </Typography>
                  <ArrowRight className="h-5 w-5 text-neutral-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Implementation Approaches */}
      <Section variant="secondary" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              How We Work
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our strategic approaches ensure that our programs create lasting impact through 
              multiple complementary pathways.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {approaches.map((approach, index) => (
              <Link 
                key={index}
                to={approach.link}
                className="group bg-white rounded-xl border border-neutral-light p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-primary mb-4 group-hover:text-secondary-teal transition-colors">
                  {approach.icon}
                </div>
                <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors">
                  {approach.title}
                </Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  {approach.description}
                </Typography>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Programs;
