
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 mb-6 md:mb-8 border border-white/20">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-sm md:text-lg">
                MEASURABLE IMPACT
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-6 md:mb-8 text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              Real Results.
              <span className="block text-secondary-orange">Lasting Change.</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed px-4">
              Our commitment to transparency and accountability drives us to measure and share the concrete impact of our work across Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:border-secondary-orange/50 transition-all duration-300 text-center group-hover:-translate-y-2">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-secondary-orange">
                    {metric.value}
                  </div>
                  <div className="text-white font-semibold text-base md:text-lg mb-2">
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

      {/* Our Focus Areas Section */}
      <FocusAreas />

      {/* Partners and Donors Carousel */}
      <PartnersCarousel />

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-5xl mx-auto px-4">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 md:px-8 py-3 md:py-4 mb-6 md:mb-8">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-sm md:text-lg">
                GET INVOLVED
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-6 md:mb-8 text-3xl md:text-5xl lg:text-6xl font-bold">
              Join the Movement for
              <span className="block text-primary">Justice in Tanzania</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray mb-8 md:mb-12 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
              Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us, there's a place for you in our community.
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-orange to-secondary-orange/80 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Scale className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-3 font-bold text-lg md:text-xl">
                      Get Legal Help
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 text-sm md:text-base">
                      Access free legal assistance and guidance
                    </Typography>
                  </div>
                </div>
              </Link>
              
              <Link to="/about">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/80 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-3 font-bold text-lg md:text-xl">
                      Learn About Us
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 text-sm md:text-base">
                      Discover our story and mission
                    </Typography>
                  </div>
                </div>
              </Link>
              
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Heart className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-3 font-bold text-lg md:text-xl">
                      Partner With Us
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 text-sm md:text-base">
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
