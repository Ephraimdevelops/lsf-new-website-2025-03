import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface HeroSlide {
  id: string;
  headline: string;
  subheadline?: string;
  image_url?: string;
  cta_text?: string;
  cta_link?: string;
  category?: string;
}

const CinematicHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const convexSlides = useQuery(api.hero.get);

  // Fallback slides for when database is empty
  const fallbackSlides: HeroSlide[] = [
    {
      id: 'fallback-1',
      headline: 'Justice is not a privilege.',
      subheadline: "It's a fundamental right for every Tanzanian.",
      image_url: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
      cta_text: 'Get Legal Help',
      cta_link: '/legal-help',
      category: 'Legal Empowerment'
    },
    {
      id: 'fallback-2',
      headline: 'Every district. Every community.',
      subheadline: 'Legal aid that reaches the unreachable.',
      image_url: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      cta_text: 'Our Programs',
      cta_link: '/programs',
      category: 'Community Impact'
    },
    {
      id: 'fallback-3',
      headline: 'Digital tools. Real solutions.',
      subheadline: 'Technology that bridges the justice gap.',
      image_url: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
      cta_text: 'Download App',
      cta_link: '/haki-yangu',
      category: 'Digital Innovation'
    }
  ];

  useEffect(() => {
    if (convexSlides !== undefined) {
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
            cta_link: s.ctaLink,
            category: s.category
          }));
        setSlides(mappedSlides);
      } else {
        setSlides(fallbackSlides);
      }
      setIsLoading(false);
    }
  }, [convexSlides]);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/70 to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          </div>
        </div>
      )}

      {/* Subtle gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent pointer-events-none" />

      {/* Content - uses container class to align with navigation */}
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="max-w-3xl text-white">
          {/* Category Badge */}
          {currentSlideData.category && (
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest bg-primary text-white rounded-full">
              {currentSlideData.category}
            </span>
          )}

          {/* Main Headline */}
          <Typography
            variant="h1"
            className="text-white mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
          >
            {currentSlideData.headline}
          </Typography>

          {/* Subheadline */}
          <Typography
            variant="body"
            className="text-white/90 mb-10 text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            {currentSlideData.subheadline}
          </Typography>

          {/* Call to Action Button */}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-5 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 group text-base"
            onClick={() => window.location.href = currentSlideData.cta_link || '/legal-help'}
          >
            {currentSlideData.cta_text || 'Learn More'}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>

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
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${index === currentSlide
                  ? 'w-12 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default CinematicHero;
