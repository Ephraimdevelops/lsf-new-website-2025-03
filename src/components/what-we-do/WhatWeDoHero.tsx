
import { ArrowRight, PlayCircle, Target } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const WhatWeDoHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
        }}
      ></div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center text-white max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center space-x-3 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/20">
            <Target className="h-5 w-5 md:h-6 md:w-6 text-secondary-orange" />
            <span className="text-secondary-orange font-bold text-sm md:text-lg uppercase tracking-wider">
              Our Work
            </span>
          </div>
          
          <Typography variant="display" className="text-white mb-6 md:mb-8 leading-none text-4xl md:text-6xl lg:text-8xl font-bold">
            Justice for All.
            <span className="block text-secondary-orange">Empowerment for Each.</span>
          </Typography>
          
          <Typography variant="body" className="text-white/90 mb-8 md:mb-12 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            At the Legal Services Facility (LSF), our mission is clear: to ensure every Tanzanian—especially women, girls, and marginalized groups—can understand, access, and benefit from justice.
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16">
            <Link to="/what-we-do/grant-making">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-8 md:px-10 py-4 md:py-5 text-base md:text-lg rounded-full">
                Explore Our Grants
                <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
            <Link to="/impact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-8 md:px-10 py-4 md:py-5 text-base md:text-lg rounded-full">
                <PlayCircle className="mr-3 h-5 w-5 md:h-6 md:w-6" />
                Watch Our Impact
              </Button>
            </Link>
          </div>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-secondary-orange">2.8M+</div>
              <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">Tanzanians Reached</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-secondary-teal">4,000+</div>
              <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">Trained Paralegals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-secondary-yellow">31</div>
              <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">78%</div>
              <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">Cases Resolved</div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoHero;
