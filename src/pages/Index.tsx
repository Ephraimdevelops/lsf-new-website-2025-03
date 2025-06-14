
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
import Hero from '@/components/home/Hero';
import VisualImpactSection from '@/components/home/VisualImpactSection';
import CircularImageCallout from '@/components/shared/CircularImageCallout';

const Index = () => {
  const successMetrics = [
    { value: "$47M+", label: "Disbursed as Grants", description: "Financial support to legal aid organizations" },
    { value: "105,562+", label: "Supported Groups", description: "Community organizations receiving assistance" },
    { value: "426,349+", label: "Legal Aid Beneficiaries", description: "Individuals receiving direct legal support" },
    { value: "39.8M+", label: "Legal Education Beneficiaries", description: "People reached through awareness programs" }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <Hero />

      {/* New Visual Impact Section */}
      <VisualImpactSection />

      {/* Highlights Section with Circular Callouts */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,30,92,.03)_0%,transparent_50%)] bg-[length:100px_100px]"></div>
        
        <Container size="xl" className="relative z-10">
          <HighlightsSection />
          
          {/* Circular Callouts for Key Areas */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <CircularImageCallout
              image="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
              title="Legal Empowerment"
              description="Strengthening communities through legal knowledge and advocacy training."
              icon={<Scale className="h-12 w-12 text-secondary-orange" />}
              badge="Core Focus"
              link="/focus-areas/legal-empowerment"
              size="lg"
              overlay="primary"
            />
            
            <div className="flex flex-col items-center space-y-8">
              <CircularImageCallout
                image="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png"
                title="Digital Innovation"
                description="Technology solutions connecting communities to justice."
                icon={<Lightbulb className="h-8 w-8 text-secondary-teal" />}
                badge="Innovation"
                link="/focus-areas/digital-innovation"
                size="md"
                overlay="secondary"
              />
              
              <CircularImageCallout
                image="/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png"
                title="Community Networks"
                description="Building local capacity for sustainable change."
                icon={<Users className="h-8 w-8 text-primary" />}
                badge="Network"
                link="/what-we-do/capacity-building"
                size="md"
                overlay="light"
              />
            </div>
            
            <CircularImageCallout
              image="/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png"
              title="Policy Advocacy"
              description="Driving systemic change through strategic policy work."
              icon={<Shield className="h-12 w-12 text-secondary-orange" />}
              badge="Advocacy"
              link="/what-we-do/policy-advocacy"
              size="lg"
              overlay="dark"
            />
          </div>
        </Container>
      </section>

      {/* Enhanced News and Documents Section */}
      <CompactNewsUpdates />

      {/* Impact Metrics Section with Enhanced Visual Background */}
      <section className="py-28 md:py-32 relative overflow-hidden">
        {/* Multi-layer background treatment */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/background with mother umage .png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,.2)_2px,transparent_0)] bg-[length:30px_30px]"></div>

        <Container size="xl" className="relative z-10">
          <div className="text-center mb-20 space-y-9">
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30">
              <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                MEASURABLE IMPACT
              </Typography>
            </div>

            <Typography variant="display" className="text-white font-heading text-7xl lg:text-8xl">
              Real Results.
              <span className="block text-secondary-orange">Lasting Change.</span>
            </Typography>

            <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-2xl leading-relaxed">
              Our commitment to transparency and accountability drives us to measure and share the concrete impact of our work across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {successMetrics.map((metric, index) => (
              <div key={index} className="group">
                <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-10 border border-white/30 hover:border-secondary-orange/50 transition-all duration-300 text-center group-hover:-translate-y-3 hover:shadow-2xl">
                  <Typography variant="display" className="text-secondary-orange mb-6 font-heading text-4xl md:text-5xl">
                    {metric.value}
                  </Typography>
                  <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                    {metric.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/80 text-lg">
                    {metric.description}
                  </Typography>
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

      {/* Call to Action Section with Enhanced Visual Treatment */}
      <section className="py-28 md:py-32 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/backgound lsf colours.png')" }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/95 via-white/90 to-blue-50/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary-teal/5"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/5 rounded-full blur-3xl"></div>
        </div>

        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4">
              <CheckCircle className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                GET INVOLVED
              </Typography>
            </div>

            <Typography variant="display" className="font-heading text-6xl lg:text-7xl">
              Join the Movement for
              <span className="block text-primary">Justice in Tanzania</span>
            </Typography>

            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-2xl leading-relaxed">
              Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us, there's a place for you in our community.
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto pt-10">
              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-orange to-secondary-orange/80 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Scale className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                      Get Legal Help
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 text-lg">
                      Access free legal assistance and guidance
                    </Typography>
                  </div>
                </div>
              </Link>

              <Link to="/about">
                <div className="group">
                  <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/80 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                      Learn About Us
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 text-lg">
                      Discover our story and mission
                    </Typography>
                  </div>
                </div>
              </Link>

              <Link to="/contact">
                <div className="group">
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                      Partner With Us
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 text-lg">
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
