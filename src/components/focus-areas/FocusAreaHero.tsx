
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import AnimatedCounter from '../shared/AnimatedCounter';

interface FocusAreaHeroProps {
  focusArea: {
    id: string;
    title: string;
    fullDescription: string;
    icon: React.ReactNode;
    impactStats: { value: string; label: string; icon: React.ReactNode }[];
  };
}

const FocusAreaHero = ({ focusArea }: FocusAreaHeroProps) => {
  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/95 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto px-4">
            <div className="inline-flex items-center space-x-3 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/20">
              <div className="text-secondary-orange">
                {focusArea.icon}
              </div>
              <span className="text-secondary-orange font-bold text-sm md:text-lg uppercase tracking-wider">
                Strategic Focus Area
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-6 md:mb-8 leading-none text-3xl md:text-5xl lg:text-7xl font-bold">
              {focusArea.title}
            </Typography>
            
            <Typography variant="body" className="text-white/95 mb-8 md:mb-12 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
              {focusArea.fullDescription}
            </Typography>

            {/* Impact Stats Callout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {focusArea.impactStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-secondary-orange mb-3 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">
                    <AnimatedCounter end={parseInt(stat.value.replace(/\D/g, '')) || 0} suffix={stat.value.replace(/\d/g, '')} />
                  </div>
                  <div className="text-white/80 text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <Link to="/what-we-do" className="inline-flex items-center text-white/80 hover:text-white mb-12 md:mb-16 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to What We Do
            </Link>
          </div>
        </Container>
        
        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center">
            <Typography variant="small" className="text-white/70 mb-2">
              Scroll to explore
            </Typography>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FocusAreaHero;
