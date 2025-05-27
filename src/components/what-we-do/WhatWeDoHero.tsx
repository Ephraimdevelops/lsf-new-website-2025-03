
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowDown, Users, Globe, Target } from 'lucide-react';

const WhatWeDoHero = () => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
        }}
      ></div>
      
      {/* Primary Color Overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: '#931e5c', opacity: 0.85 }}
      ></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary-teal/20"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Target className="h-5 w-5 text-secondary-orange" />
                <span className="text-secondary-orange font-semibold text-sm uppercase tracking-wide">
                  Our Strategic Approach
                </span>
              </div>
              
              <Typography variant="display" className="text-white mb-6 leading-tight">
                Advancing Access to Justice
              </Typography>
              
              <Typography variant="body" className="text-white/90 text-xl max-w-2xl mb-8 leading-relaxed">
                We transform lives across Tanzania through comprehensive legal aid, community empowerment, 
                policy advocacy, and innovative digital solutions that ensure justice reaches everyone.
              </Typography>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/programs">
                  <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-semibold px-8 py-4">
                    Explore Our Programs
                  </Button>
                </Link>
                <Link to="/legal-help">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4">
                    Get Legal Help
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">150+</div>
                  <div className="text-white/80 text-sm">Active Partnerships</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-white/80 text-sm">Trained Paralegals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">15K+</div>
                  <div className="text-white/80 text-sm">Lives Impacted</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/20 rounded-xl p-6 text-center">
                    <Users className="h-8 w-8 text-secondary-orange mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Community Focused</h3>
                    <p className="text-white/80 text-sm">Grassroots legal empowerment</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-6 text-center">
                    <Globe className="h-8 w-8 text-secondary-orange mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Nationwide Reach</h3>
                    <p className="text-white/80 text-sm">Justice across Tanzania</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-6 text-center col-span-2">
                    <Target className="h-8 w-8 text-secondary-orange mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Measurable Impact</h3>
                    <p className="text-white/80 text-sm">Evidence-based solutions for lasting change</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="flex justify-center mt-16">
            <div className="animate-bounce">
              <ArrowDown className="h-6 w-6 text-white/80" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhatWeDoHero;
