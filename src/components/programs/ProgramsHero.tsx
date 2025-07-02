import { ArrowRight, PlayCircle, Target, Zap, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const ProgramsHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  
  const impactStats = [
    { value: "26", label: "Regions Covered", color: "text-secondary-orange", icon: "📍" },
    { value: "32K+", label: "Women Reached", color: "text-secondary-teal", icon: "👩" },
    { value: "130+", label: "Paralegals Trained", color: "text-secondary-yellow", icon: "⚖️" },
    { value: "50K+", label: "App Users", color: "text-white", icon: "📱" }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Rotate through stats
    const intervalId = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % impactStats.length);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url('/lovable-uploads/background with mother umage .png')`,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      ></div>
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/95 to-black/90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center text-white max-w-6xl mx-auto px-4">
          <div 
            className={`inline-flex items-center space-x-3 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/20 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
          >
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-secondary-orange" />
            <span className="text-secondary-orange font-bold text-sm md:text-lg uppercase tracking-wider">
              Our Projects & Programs
            </span>
            <Badge className="bg-secondary-orange text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              Transforming Lives
            </Badge>
          </div>
          
          <Typography 
            variant="display" 
            className={`text-white mb-6 md:mb-8 leading-none text-4xl md:text-6xl lg:text-8xl font-bold transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            Strategy into Action.
            <span className="block text-secondary-orange mt-4">Impact into Change.</span>
          </Typography>
          
          <Typography 
            variant="body" 
            className={`text-white/95 mb-8 md:mb-12 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            LSF designs and supports high-impact projects that bring our legal empowerment model to life — especially for women, girls, and marginalized communities across Tanzania.
          </Typography>
          
          <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link to="#flagship-programs">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-8 md:px-10 py-4 md:py-5 text-base md:text-lg rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 shadow-2xl">
                Explore Our Flagship Projects
                <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
            <Link to="/impact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-8 md:px-10 py-4 md:py-5 text-base md:text-lg rounded-full transition-all duration-300 backdrop-blur-sm">
                <PlayCircle className="mr-3 h-5 w-5 md:h-6 md:w-6" />
                See Impact Stats
              </Button>
            </Link>
          </div>
          
          {/* Enhanced Impact Stats with Animation */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transform transition-all duration-500 ${activeStatIndex === index ? 'scale-110' : 'scale-100'} bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 group`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${stat.color} transition-all duration-500`}>
                  {stat.value}
                </div>
                <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Hero Quote Section */}
          <div className={`mt-16 md:mt-20 bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Typography variant="h2" className="text-white mb-6 text-2xl md:text-4xl italic leading-relaxed">
              "Through our projects, we don't just serve — we shift systems. We don't just fund — we empower."
            </Typography>
            <Typography variant="body" className="text-secondary-orange font-semibold text-lg">
              — LSF Executive Director
            </Typography>
          </div>
        </div>
      </Container>
      
      {/* Enhanced Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-70' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <Typography variant="small" className="text-white/70 mb-2">
            Scroll to explore
          </Typography>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center animate-bounce">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsHero;