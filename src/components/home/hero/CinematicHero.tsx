import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, ArrowRight, Phone, MapPin, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { supabaseService } from '@/services/api/supabaseService';
import { heroSlides } from './heroData';

interface HeroSlide {
  id: string;
  headline: string;
  subheadline?: string;
  image_url?: string;
  cta_text?: string;
  cta_link?: string;
  stats?: Array<{ value: string; label: string; icon?: any }>;
}

const CinematicHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Enhanced stats for storytelling
  const impactStats = [
    { icon: Users, value: '426K+', label: 'Lives Transformed' },
    { icon: MapPin, value: '31', label: 'Regions Covered' },
    { icon: Award, value: '15+', label: 'Years of Impact' },
    { icon: Phone, value: '24/7', label: 'Legal Support' }
  ];

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const data = await supabaseService.getHeroSlides();
        if (data.length > 0) {
          setSlides(data);
        } else {
          // Enhanced fallback data with storytelling elements
          setSlides([
            {
              id: '1',
              headline: 'Justice for Every Tanzanian',
              subheadline: 'Empowering communities through accessible legal aid and innovative technology solutions that bridge the gap between law and people.',
              image_url: '/lovable-uploads/background with mother umage .png',
              cta_text: 'Get Legal Help',
              cta_link: '/legal-help',
              stats: impactStats.slice(0, 2)
            },
            {
              id: '2',
              headline: 'Haki Yangu Digital Platform',
              subheadline: 'Connecting communities with legal services through our revolutionary mobile app, making justice accessible at your fingertips.',
              image_url: '/lovable-uploads/haki yangu app uzinuzi.webp',
              cta_text: 'Download App',
              cta_link: '/legal-help',
              stats: impactStats.slice(1, 3)
            },
            {
              id: '3',
              headline: 'Community Paralegal Network',
              subheadline: 'Training and empowering local champions who bring legal knowledge directly to rural communities across Tanzania.',
              image_url: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
              cta_text: 'Join Our Network',
              cta_link: '/programs',
              stats: impactStats.slice(2, 4)
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setSlides([
          {
            id: '1',
            headline: 'Justice for Every Tanzanian',
            subheadline: 'Empowering communities through accessible legal aid and innovative technology solutions.',
            image_url: '/lovable-uploads/background with mother umage .png',
            cta_text: 'Get Legal Help',
            cta_link: '/legal-help',
            stats: impactStats.slice(0, 2)
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0 || !isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds for better storytelling

    return () => clearInterval(timer);
  }, [slides.length, isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary-teal/10">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary/30"></div>
          </div>
          <Typography variant="body" className="text-primary font-medium text-lg">Loading Justice...</Typography>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen bg-gradient-to-br from-primary to-secondary-teal flex items-center">
        <Container size="xl" className="text-center text-white">
          <Award className="h-20 w-20 mx-auto mb-8 opacity-80 animate-pulse" />
          <Typography variant="h1" className="text-white mb-6">Welcome to LSF</Typography>
          <Typography variant="body" className="text-white/90 text-xl">Empowering communities through access to justice</Typography>
        </Container>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Video Background (if available) */}
      {currentSlideData.image_url && (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <img 
              src={currentSlideData.image_url}
              alt={currentSlideData.headline}
              className="w-full h-full object-cover transition-all duration-2000 ease-out"
            />
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary-teal/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-orange/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <Container size="xl" className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl text-white">
          {/* Story Badge */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
              <div className="w-3 h-3 bg-secondary-orange rounded-full animate-pulse"></div>
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg tracking-wider">
                Legal Empowerment Stories
              </Typography>
            </div>
          </div>

          {/* Main Headline */}
          <Typography
            variant="h1"
            className="text-white mb-8 text-5xl md:text-6xl lg:text-8xl font-bold leading-[0.9] [text-shadow:_0_4px_8px_rgba(0,0,0,0.7)] animate-fade-in delay-300"
          >
            {currentSlideData.headline}
          </Typography>

          {/* Subheadline */}
          <Typography
            variant="body"
            className="text-white/95 mb-12 text-xl md:text-2xl max-w-4xl leading-relaxed [text-shadow:_0_2px_4px_rgba(0,0,0,0.6)] animate-fade-in delay-500"
          >
            {currentSlideData.subheadline}
          </Typography>

          {/* Impact Stats */}
          {currentSlideData.stats && (
            <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in delay-700">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                    <stat.icon className="h-8 w-8 text-secondary-orange" />
                  </div>
                  <Typography variant="display" className="text-white text-3xl font-bold mb-2">
                    {stat.value}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/80 text-sm">
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in delay-1000">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary-orange hover:from-primary-dark hover:to-secondary-orange-dark text-white font-bold px-10 py-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group text-lg"
              onClick={() => window.location.href = currentSlideData.cta_link || '/legal-help'}
            >
              {currentSlideData.cta_text || 'Get Legal Help'}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white hover:text-primary font-bold px-10 py-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group text-lg backdrop-blur-sm"
              onClick={() => window.location.href = 'tel:+255870119363'}
            >
              <Phone className="mr-3 h-6 w-6" />
              Call Now
            </Button>
          </div>
        </div>
      </Container>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-4 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-4 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-16 h-3 bg-white rounded-full shadow-lg' 
                    : 'w-4 h-4 bg-white/40 hover:bg-white/60 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Story Progress */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 z-10">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary-orange transition-all duration-8000 ease-linear"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`
              }}
            />
          </div>
        </>
      )}

      {/* Play/Pause Toggle */}
      {slides.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-8 right-8 z-20 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          <Play className={`h-6 w-6 ${isPlaying ? 'opacity-50' : ''}`} />
        </button>
      )}
    </section>
  );
};

export default CinematicHero;
