
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, Heart, MapPin, PlayCircle, Star } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    id: 1,
    title: "Empowering",
    subtitle: "Communities Through Justice",
    description: "Transforming lives across Tanzania by ensuring every person has access to legal protection and empowerment.",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    stat: "50K+",
    statLabel: "Lives Transformed",
    category: "Access to Justice",
    location: "Nationwide"
  },
  {
    id: 2,
    title: "Defending",
    subtitle: "Rights & Dignity",
    description: "Building a Tanzania where legal empowerment reaches every village, every woman, every family.",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    stat: "15+",
    statLabel: "Years Impact",
    category: "Legal Empowerment",
    location: "25 Regions"
  },
  {
    id: 3,
    title: "Creating",
    subtitle: "Lasting Change",
    description: "From mobile clinics to digital innovation, we're revolutionizing access to justice in Tanzania.",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    stat: "200+",
    statLabel: "Communities Reached",
    category: "Innovation",
    location: "Rural & Urban"
  }
];

const AlternativeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ 
            backgroundImage: `url(${currentSlideData.image})`,
            backgroundPosition: 'center center'
          }}
        />
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-primary/80 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
        
        {/* Animated Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary-orange/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Container size="xl" className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen py-20">
          {/* Main Content */}
          <div className="lg:col-span-8 text-white">
            {/* Location & Category Badge */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <MapPin className="h-5 w-5 text-secondary-orange" />
                <span className="text-white/90 font-medium">{currentSlideData.location}</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-secondary-orange to-secondary-orange/80 rounded-full px-8 py-3">
                <Scale className="h-5 w-5 text-white" />
                <span className="text-white font-bold uppercase tracking-wider">{currentSlideData.category}</span>
              </div>
            </div>

            {/* Main Headlines */}
            <div className="mb-8">
              <Typography variant="display" className="text-7xl md:text-8xl lg:text-9xl font-bold mb-4 leading-[0.9] text-white drop-shadow-2xl">
                {currentSlideData.title}
              </Typography>
              <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-medium text-secondary-teal drop-shadow-lg">
                {currentSlideData.subtitle}
              </Typography>
            </div>

            {/* Description */}
            <div className="bg-black/40 backdrop-blur-sm border-l-4 border-secondary-orange rounded-r-2xl p-8 mb-12">
              <Typography variant="body" className="text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl">
                {currentSlideData.description}
              </Typography>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-primary/50 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/legal-help" className="flex items-center gap-4">
                  Get Legal Help Now
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white/70 px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-sm"
                asChild
              >
                <Link to="/what-we-do" className="flex items-center gap-4">
                  <PlayCircle className="h-6 w-6" />
                  Watch Our Story
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-secondary-teal mb-2">
                  {currentSlideData.stat}
                </div>
                <div className="text-white/80 font-medium">
                  {currentSlideData.statLabel}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-secondary-orange mb-2">
                  25+
                </div>
                <div className="text-white/80 font-medium">
                  Regions Covered
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-secondary-teal mb-2">
                  100%
                </div>
                <div className="text-white/80 font-medium">
                  Free Services
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-6">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-primary font-bold uppercase tracking-wider">Quick Access</span>
                </div>
                <Typography variant="h3" className="text-neutral-dark mb-4">
                  Need Legal Help?
                </Typography>
                <Typography variant="body" className="text-neutral-gray">
                  Get immediate assistance or learn about our services
                </Typography>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-secondary-orange hover:bg-secondary-orange/90 text-white py-4 text-lg font-bold rounded-xl" asChild>
                  <Link to="/legal-help">
                    <Users className="mr-3 h-5 w-5" />
                    Find Legal Aid
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 py-4 text-lg font-bold rounded-xl" asChild>
                  <Link to="/contact">
                    <Heart className="mr-3 h-5 w-5" />
                    Contact Us
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full text-neutral-dark hover:bg-neutral-50 py-4 text-lg font-bold rounded-xl" asChild>
                  <Link to="/resources">
                    Learn More
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="flex items-center justify-center gap-4 text-sm text-neutral-gray">
                  <span>✓ 15+ Years Experience</span>
                  <span>✓ Free Services</span>
                  <span>✓ 50K+ Helped</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-8 flex gap-3 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-secondary-orange scale-125 shadow-lg shadow-secondary-orange/50' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
        >
          {isAutoPlaying ? <PlayCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6 fill-current" />}
        </button>
      </Container>
    </section>
  );
};

export default AlternativeHero;
