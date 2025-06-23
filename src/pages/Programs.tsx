
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
      link: '/focus-areas/accessible-legal-aid',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-primary to-primary-dark'
    },
    {
      id: 'empowered-communities',
      title: 'Legally Empowered Communities',
      description: 'Equipping local groups and citizens with knowledge and tools to use the law effectively.',
      icon: <Users className="h-8 w-8" />,
      stats: '4,000+ paralegals trained',
      link: '/focus-areas/empowered-communities',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-secondary-teal to-teal-600'
    },
    {
      id: 'conducive-environment',
      title: 'Conducive Environment for Justice',
      description: 'Working systemically to create an enabling ecosystem for justice through policy and reform.',
      icon: <Gavel className="h-8 w-8" />,
      stats: '15+ policy reforms influenced',
      link: '/focus-areas/conducive-environment',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-secondary-green to-green-600'
    },
    {
      id: 'institutional-development',
      title: 'Institutional Development',
      description: 'Strengthening organizational capacity and sustainability for long-term impact.',
      icon: <Building className="h-8 w-8" />,
      stats: '200+ strategic partners',
      link: '/focus-areas/institutional-development',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-secondary-orange to-orange-600'
    },
    {
      id: 'climate-justice',
      title: 'Climate Justice',
      description: 'Protecting land rights and supporting climate-vulnerable communities.',
      icon: <Leaf className="h-8 w-8" />,
      stats: '2,000+ families protected',
      link: '/focus-areas/climate-justice',
      image: 'https://images.unsplash.com/photo-1569163139394-de44cb4339c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'digital-transformation',
      title: 'Digital Transformation',
      description: 'Leveraging technology for wider access through digital platforms and mobile apps.',
      icon: <Smartphone className="h-8 w-8" />,
      stats: '15,000+ app users',
      link: '/focus-areas/digital-transformation',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const approaches = [
    {
      title: 'Grant Making & Management',
      description: 'Channeling resources to grassroots justice initiatives through transparent, competitive grants.',
      icon: <Target className="h-6 w-6" />,
      link: '/approaches/grant-making',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Direct Implementation',
      description: 'Leading key projects directly to demonstrate best practices and fill urgent gaps.',
      icon: <Users className="h-6 w-6" />,
      link: '/approaches/direct-implementation',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Policy & Advocacy',
      description: 'Shaping the policy landscape through strategic advocacy and evidence-backed briefs.',
      icon: <Gavel className="h-6 w-6" />,
      link: '/approaches/advocacy-policy',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Research & Innovation',
      description: 'Investing in rigorous research and innovative solutions for evidence-based empowerment.',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/approaches/research-innovation',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
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

      {/* Strategic Focus Areas with Rich Imagery */}
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
                className="group relative overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Image */}
                <div className="relative h-80">
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${area.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {area.icon}
                  </div>
                  <Typography variant="h3" className="mb-3 text-white font-bold">
                    {area.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/90 mb-4 line-clamp-3">
                    {area.description}
                  </Typography>
                  <div className="flex items-center justify-between">
                    <Typography variant="small" className="text-secondary-orange font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {area.stats}
                    </Typography>
                    <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Implementation Approaches with Visual Cards */}
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
                className="group relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Header */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={approach.image} 
                    alt={approach.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="bg-white p-6">
                  <div className="text-primary mb-4 group-hover:text-secondary-teal transition-colors">
                    {approach.icon}
                  </div>
                  <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors">
                    {approach.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {approach.description}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="relative rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/90"></div>
            
            <div className="relative z-10 text-center py-20 px-8">
              <Typography variant="h2" className="text-white mb-6">
                Join Our Mission for Justice
              </Typography>
              <Typography variant="body" className="text-white/90 mb-8 max-w-2xl mx-auto">
                Partner with us to strengthen legal empowerment across Tanzania and create lasting change.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105">
                    Partner With Us
                    <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </button>
                </Link>
                <Link to="/legal-help">
                  <button className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105">
                    Get Legal Help
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Programs;
