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

const CinematicHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [isAnimating, setIsAnimating] = useState(false);

  // We don't need a loading state because we start with fallback content for instant paint
  const convexSlides = useQuery(api.hero.get);

  useEffect(() => {
    if (convexSlides !== undefined && convexSlides.length > 0) {
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
    }
  }, [convexSlides]);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  // Removed isLoading checks - we always show content now

  if (slides.length === 0) {
    // Should generally not happen due to fallbacks, but fail-safe
    return (
      <section className="relative h-screen bg-primary flex items-center">
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
      {/* Background Image with Ken Burns Effect */}
      {currentSlideData.image_url && (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <img
              key={currentSlide}
              src={currentSlideData.image_url}
              alt={currentSlideData.headline}
              fetchPriority="high" // Optimize LCP
              className="w-full h-full object-cover object-center animate-[kenBurns_20s_ease-in-out_infinite]"
              style={{
                animation: 'kenBurns 20s ease-in-out infinite',
              }}
            />
            {/* Premium Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div
          className={`max-w-4xl text-white transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
            }`}
        >
          {/* Category Badge */}
          {currentSlideData.category && (
            <span className="inline-block px-5 py-2 mb-8 text-xs font-bold uppercase tracking-[0.2em] bg-primary text-white rounded-full shadow-lg">
              {currentSlideData.category}
            </span>
          )}

          <h1 className="text-white text-4xl md:text-5xl lg:text-5xl font-black leading-[0.95] tracking-tight mb-6">
            {currentSlideData.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl leading-relaxed mb-12 font-light">
            {currentSlideData.subheadline}
          </p>

          {/* Call to Action Button */}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-6 rounded-full text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 group h-auto"
            onClick={() => window.location.href = currentSlideData.cta_link || '/legal-help'}
          >
            {currentSlideData.cta_text || 'Learn More'}
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${index === currentSlide
                  ? 'w-10 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* CSS for Ken Burns animation */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default CinematicHero;
