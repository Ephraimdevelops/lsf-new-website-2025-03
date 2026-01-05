import { ArrowRight, PlayCircle, Heart, Zap, MapPin, Users, Award, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ProgramsHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const impactStats = [
    { value: "26", label: "Regions", icon: <MapPin className="h-5 w-5" /> },
    { value: "32K+", label: "Women Reached", icon: <Users className="h-5 w-5" /> },
    { value: "130+", label: "Paralegals", icon: <Award className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Fixed Background for parallax */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png')`,
        }}
      ></div>

      {/* Gradient Overlays - Strong for contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black/95"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

      {/* Animated accent orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Content - Split layout with image */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left - Text content */}
          <div className="lg:w-3/5 text-white">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
            >
              <Heart className="h-5 w-5 text-secondary-orange" />
              <span className="text-white font-bold text-sm uppercase tracking-widest">
                Our Programs & Projects
              </span>
              <div className="flex items-center gap-1 bg-secondary-orange/20 px-3 py-1 rounded-full">
                <Zap className="h-3 w-3 text-secondary-orange" />
                <span className="text-secondary-orange text-xs font-bold">Transforming Lives</span>
              </div>
            </div>

            {/* Title */}
            <Typography
              variant="h1"
              className={`text-white mb-8 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              Strategy into Action.
              <span className="block text-secondary-orange mt-2">Impact into Change.</span>
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body"
              className={`text-white/90 mb-10 text-lg md:text-xl lg:text-2xl max-w-3xl leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              LSF designs and delivers high-impact projects that bring our legal empowerment model to life — especially for women, girls, and marginalized communities across Tanzania.
            </Typography>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <a href="#flagship-programs">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Explore Flagship Projects
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </a>
              <Link to="/impact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-6 text-lg rounded-full backdrop-blur-sm transition-all">
                  <PlayCircle className="mr-3 h-5 w-5" />
                  View Impact Data
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Paralegal Image */}
          <div className={`lg:w-2/5 hidden lg:block transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="relative">
              {/* Floating animation */}
              <div className="animate-float">
                <img
                  src="/lovable-uploads/paralegal-hero.png"
                  alt="LSF Paralegal helping community members"
                  className="w-full h-auto max-h-[600px] object-contain drop-shadow-2xl"
                />
              </div>
              {/* Decorative glow behind image */}
              <div className="absolute inset-0 -z-10 blur-3xl bg-secondary-orange/20 rounded-full scale-75"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-70' : 'opacity-0'}`}>
        <div className="flex flex-col items-center text-white/70 animate-bounce">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
};

export default ProgramsHero;