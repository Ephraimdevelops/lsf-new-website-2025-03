
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
import HighlightsSection from '@/components/home/HighlightsSection';
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
      {/* New Highlights Section */}
      <HighlightsSection />

      {/* Compact News and Updates Section */}
      <CompactNewsUpdates />

      {/* Impact Metrics Section - Reduced padding */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-5 md:px-6 py-2 md:py-3 mb-5 md:mb-6 border border-white/20">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-secondary-orange" />
              <Typography variant="caption" className="text-secondary-orange font-bold text-xs md:text-sm">
                MEASURABLE IMPACT
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Real Results.
              <span className="block text-secondary-orange">Lasting Change.</span>
            </Typography>
            
            <Typography variant="bodySmall" className="text-white/90 max-w-3xl mx-auto text-sm md:text-base leading-relaxed px-4">
              Our commitment to transparency and accountability drives us to measure and share the concrete impact of our work across Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {successMetrics.map((metric, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-white/20 hover:border-secondary-orange/50 transition-all duration-300 text-center group-hover:-translate-y-2">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-secondary-orange">
                    {metric.value}
                  </div>
                  <div className="text-white font-semibold text-sm md:text-base mb-1">
                    {metric.label}
                  </div>
                  <div className="text-white/70 text-xs leading-relaxed">
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

      {/* Call to Action Section - Reduced padding */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-5 md:px-6 py-2 md:py-3 mb-5 md:mb-6">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-primary" />
              <Typography variant="caption" className="text-primary font-bold text-xs md:text-sm">
                GET INVOLVED
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl font-bold">
              Join the Movement for
              <span className="block text-primary">Justice in Tanzania</span>
            </Typography>
            
            <Typography variant="bodySmall" className="text-neutral-gray mb-6 md:mb-8 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
              Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us, there's a place for you in our community.
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-orange to-secondary-orange/80 p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                      <Scale className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-2 font-bold text-base md:text-lg">
                      Get Legal Help
                    </Typography>
                    <Typography variant="small" className="text-white/90 text-xs md:text-sm">
                      Access free legal assistance and guidance
                    </Typography>
                  </div>
                </div>
              </Link>
              
              <Link to="/about">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/80 p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-2 font-bold text-base md:text-lg">
                      Learn About Us
                    </Typography>
                    <Typography variant="small" className="text-white/90 text-xs md:text-sm">
                      Discover our story and mission
                    </Typography>
                  </div>
                </div>
              </Link>
              
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                      <Heart className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-2 font-bold text-base md:text-lg">
                      Partner With Us
                    </Typography>
                    <Typography variant="small" className="text-white/90 text-xs md:text-sm">
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
