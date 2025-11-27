
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, ArrowRight, PlayCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
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

  const convexSlides = useQuery(api.hero.get);

  useEffect(() => {
    if (convexSlides) {
      if (convexSlides.length > 0) {
        const mappedSlides = convexSlides
          .filter(s => s.isActive)
          .sort((a, b) => a.order - b.order)
          .map(s => ({
            id: s._id,
            headline: s.title,
            subheadline: s.subtitle || s.description,
            image_url: s.imageUrl,
            cta_text: s.ctaText,
            cta_link: s.ctaLink
          }));
        setSlides(mappedSlides);
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
      setIsLoading(false);
    }
  }, [convexSlides]);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 8 seconds between slides (8 + 5 more)

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
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-primary font-medium">Loading...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen bg-gradient-to-br from-primary to-secondary-teal flex items-center">
        <Container size="xl" className="text-center text-white">
          <Target className="h-16 w-16 mx-auto mb-6 opacity-50" />
          <Typography variant="h1" className="text-white mb-4">Welcome to LSF</Typography>
          <Typography variant="body" className="text-white/90">Empowering communities through access to justice</Typography>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-3000 ease-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image_url || '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png'}
                alt={slide.headline}
                className="w-full h-full object-cover transition-all duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
            </div>

            {/* Content */}
            <Container size="xl" className="relative z-10 h-full flex items-center">
              <div className="max-w-4xl text-white">
                {/* Badge */}
                {slide.subheadline && (
                  <div className={`mb-6 transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                    <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                      <Target className="h-6 w-6" />
                      <span className="font-semibold text-sm uppercase tracking-wider">
                        Legal Empowerment
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Headline */}
                <Typography
                  variant="h1"
                  className={`text-white mb-6 text-4xl md:text-5xl lg:text-7xl font-bold leading-tight [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-1000 delay-500 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  {slide.headline}
                </Typography>

                {/* Subheadline */}
                {slide.subheadline && (
                  <Typography
                    variant="body"
                    className={`text-white/95 mb-8 text-lg md:text-xl max-w-3xl leading-relaxed [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)] transition-all duration-1000 delay-700 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                  >
                    {slide.subheadline}
                  </Typography>
                )}

                {/* Call to Action Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-1000 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                  <Button
                    size="lg"
                    className="bg-primary 600-orange hover:bg-secondary-orange/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                    onClick={() => window.location.href = slide.cta_link || '/legal-help'}
                  >
                    {slide.cta_text || 'Get Legal Help'}
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                    onClick={() => window.location.href = 'tel:+255870119363'}
                  >
                    <Phone className="mr-2 h-6 w-6" />
                    Call Now
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 ${index === currentSlide
                  ? 'w-12 h-3 bg-white rounded-full shadow-lg'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </div>
        </>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
          <div
            className="h-full bg-secondary-orange transition-all duration-13000 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      )}
    </section>
  );
};

export default EnhancedSlidingHero;