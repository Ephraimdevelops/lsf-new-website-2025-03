import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import { supabaseService } from '@/services/api/supabaseService';
import { heroSlides } from './heroData'; // Fallback data

interface HeroSlide {
  id: string;
  headline: string;
  subheadline?: string;
  image_url?: string;
  cta_text?: string;
  cta_link?: string;
}

const EnhancedSlidingHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const data = await supabaseService.getHeroSlides();
        if (data.length > 0) {
          setSlides(data);
        } else {
          // Use fallback data if no slides in database
          setSlides(heroSlides.map(slide => ({
            id: slide.id,
            headline: slide.title,
            subheadline: slide.subtitle,
            image_url: slide.image,
            cta_text: 'Get Legal Help',
            cta_link: '/legal-help'
          })));
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        // Use fallback data on error
        setSlides(heroSlides.map(slide => ({
          id: slide.id,
          headline: slide.title,
          subheadline: slide.subtitle,
          image_url: slide.image,
          cta_text: 'Get Legal Help',
          cta_link: '/legal-help'
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary-teal/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={currentSlideData.image_url || '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png'}
          alt={currentSlideData.headline}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <Container size="xl" className="relative h-full">
        <div className="flex items-center h-full">
          <div className="max-w-2xl text-white">
            {/* Animated Content */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {currentSlideData.headline}
              </h1>
              
              {currentSlideData.subheadline && (
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                  {currentSlideData.subheadline}
                </p>
              )}

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-semibold group"
                  onClick={() => window.location.href = currentSlideData.cta_link || '/legal-help'}
                >
                  {currentSlideData.cta_text || 'Get Legal Help'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold group"
                  onClick={() => window.location.href = 'tel:+255870119363'}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-6">
          {/* Previous/Next Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="text-white hover:bg-white/20 p-3"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="text-white hover:bg-white/20 p-3"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 text-white/80 text-sm font-medium">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
};

export default EnhancedSlidingHero;