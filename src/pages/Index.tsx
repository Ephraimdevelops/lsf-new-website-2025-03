import Layout from '../components/layout/Layout';
import { 
  Heart, Target, Users, Scale, ArrowRight, PlayCircle, 
  MapPin, TrendingUp, Award, CheckCircle, Globe, Briefcase,
  Lightbulb, Shield, BookOpen
} from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';

const Index = () => {
  const impactStats = [
    { number: "2.8M+", label: "Tanzanians Reached", color: "secondary-orange" },
    { number: "4,000+", label: "Trained Paralegals", color: "secondary-teal" },
    { number: "31", label: "Regions Covered", color: "secondary-yellow" },
    { number: "78%", label: "Cases Resolved", color: "white" }
  ];

  const features = [
    {
      icon: Scale,
      title: "Legal Empowerment",
      description: "Providing accessible legal aid and education to marginalized communities across Tanzania.",
      color: "primary",
      gradient: "from-primary to-primary-dark",
      stats: "2.8M+ Reached"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Training paralegals and building legal networks in 184 communities nationwide.",
      color: "secondary-teal",
      gradient: "from-secondary-teal to-secondary-teal/80",
      stats: "184 Communities"
    },
    {
      icon: Heart,
      title: "Justice for All",
      description: "Advocating for policy reforms and systemic changes that protect vulnerable populations.",
      color: "secondary-orange",
      gradient: "from-secondary-orange to-secondary-orange/80",
      stats: "15+ Reforms"
    }
  ];

  const principles = [
    {
      icon: Lightbulb,
      number: "01",
      title: "Innovation in Legal Access",
      description: "We pioneer new approaches to make legal services accessible to every Tanzanian, especially those in remote areas.",
      color: "secondary-yellow",
      gradient: "from-secondary-yellow to-secondary-yellow/80"
    },
    {
      icon: Shield,
      number: "02", 
      title: "Protection of Rights",
      description: "Our work focuses on safeguarding fundamental human rights and ensuring justice for vulnerable populations.",
      color: "primary",
      gradient: "from-primary to-primary-dark"
    },
    {
      icon: BookOpen,
      number: "03",
      title: "Legal Education & Awareness",
      description: "We believe knowledge is power. Our education programs empower communities to understand and exercise their rights.",
      color: "secondary-teal",
      gradient: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: Globe,
      number: "04",
      title: "Sustainable Impact",
      description: "We build lasting systems and partnerships that create enduring change across Tanzania's justice landscape.",
      color: "secondary-orange",
      gradient: "from-secondary-orange to-secondary-orange/80"
    }
  ];

  const successMetrics = [
    { value: "$47M+", label: "Disbursed as Grants", description: "Financial support to legal aid organizations" },
    { value: "105,562+", label: "Supported Groups", description: "Community organizations receiving assistance" },
    { value: "426,349+", label: "Legal Aid Beneficiaries", description: "Individuals receiving direct legal support" },
    { value: "39.8M+", label: "Legal Education Beneficiaries", description: "People reached through awareness programs" }
  ];

  return (
    <Layout>
      {/* Hero Section with Legal Aid Tool */}
      <Hero />

      {/* Compact News and Updates Section */}
      <CompactNewsUpdates />

     
      
      {/* Impact Metrics Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                MEASURABLE IMPACT
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold text-white">
              Real Results.
              <span className="block text-secondary-orange">Lasting Change.</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-xl leading-relaxed">
              Our commitment to transparency and accountability drives us to measure and share the concrete impact of our work across Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-secondary-orange/50 transition-all duration-300 text-center group-hover:-translate-y-2">
                  <div className="text-4xl md:text-5xl font-bold mb-3 text-secondary-orange">
                    {metric.value}
                  </div>
                  <div className="text-white font-semibold text-lg mb-2">
                    {metric.label}
                  </div>
                  <div className="text-white/70 text-sm leading-relaxed">
                    {metric.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Focus Areas Section (Legacy - keeping for backward compatibility) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
              <Target className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                OUR FOCUS
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Empowering Communities
              <span className="block text-primary">Through Legal Access</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
              We work tirelessly to ensure every Tanzanian has access to justice, legal education, and the support they need to live with dignity and security.
            </Typography>
          </div>
 {/* Our Focus Areas Section */}
      <FocusAreas />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
                  <div className={`bg-gradient-to-br ${feature.gradient} p-8 relative`}>
                    <div className="absolute top-4 right-4 text-6xl font-black text-white/20">
                      0{index + 1}
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <Typography variant="h3" className="text-white mb-4 leading-tight">
                        {feature.title}
                      </Typography>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                        <span className="text-white font-bold text-sm">{feature.stats}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <Typography variant="body" className="text-neutral-gray leading-relaxed mb-6 text-lg">
                      {feature.description}
                    </Typography>
                    
                    <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Principles Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 relative overflow-hidden">
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-8 py-4 mb-8">
              <Briefcase className="h-6 w-6 mr-4 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold text-lg">
                GUIDING PRINCIPLES
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Four Pillars of
              <span className="block text-secondary-teal">Our Mission</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
              Our work is built on these fundamental principles that guide every initiative and drive meaningful change across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {principles.map((principle, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
                  {/* Header with Number */}
                  <div className={`bg-gradient-to-br ${principle.gradient} p-8 relative`}>
                    <div className="absolute top-4 right-4 text-8xl font-black text-white/20">
                      {principle.number}
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <principle.icon className="h-8 w-8 text-white" />
                      </div>
                      <Typography variant="h3" className="text-white mb-4 leading-tight">
                        {principle.title}
                      </Typography>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <Typography variant="body" className="text-neutral-gray leading-relaxed mb-6 text-lg">
                      {principle.description}
                    </Typography>
                    
                    <div className="flex items-center text-primary font-semibold group-hover:text-secondary-orange transition-colors">
                      Explore More
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
 {/* Partners and Donors Carousel */}
      <PartnersCarousel />
      {/* Call to Action Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
              <CheckCircle className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                GET INVOLVED
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Join the Movement for
              <span className="block text-primary">Justice in Tanzania</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray mb-12 text-xl leading-relaxed max-w-4xl mx-auto">
              Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us, there's a place for you in our community.
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-orange to-secondary-orange/80 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Scale className="h-6 w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-3 font-bold">
                      Get Legal Help
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90">
                      Access free legal assistance and guidance
                    </Typography>
                  </div>
                </div>
              </Link>
              
              <Link to="/about">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/80 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-3 font-bold">
                      Learn About Us
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90">
                      Discover our story and mission
                    </Typography>
                  </div>
                </div>
              </Link>
              
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-3 font-bold">
                      Partner With Us
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90">
                      Join our network of change-makers
                    </Typography>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Index;
