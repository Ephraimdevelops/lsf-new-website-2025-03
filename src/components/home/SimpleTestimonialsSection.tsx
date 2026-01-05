import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, MapPin } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';
import { useTestimonials } from '@/hooks/useContent';

const SimpleTestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

  const { testimonials: backendTestimonials, loading } = useTestimonials();

  // Fallback testimonials for when database is empty
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      name: 'Mariam Issa',
      role: 'Community Member',
      location: 'Dodoma Region',
      content: 'LSF paralegals helped me secure my land rights after years of disputes. Now my children have a future.',
      imageUrl: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
      rating: 5,
      category: 'Land Rights',
    },
    {
      id: 'fallback-2',
      name: 'John Mwakasege',
      role: 'Small Business Owner',
      location: 'Mwanza Region',
      content: 'The legal awareness workshops changed everything for our community. We now know our rights and how to protect them.',
      imageUrl: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      rating: 5,
      category: 'Legal Awareness',
    },
    {
      id: 'fallback-3',
      name: 'Fatuma Hassan',
      role: 'Women Group Leader',
      location: 'Tanga Region',
      content: 'Through Haki Yangu app, women in our village can now access legal help without traveling long distances.',
      imageUrl: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
      rating: 5,
      category: 'Digital Access',
    }
  ];

  const testimonials = (backendTestimonials && backendTestimonials.length > 0)
    ? backendTestimonials
    : fallbackTestimonials;

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Loading state with fallback data means we don't need empty check
  if (loading && fallbackTestimonials.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container>
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-white/20 rounded mx-auto"></div>
            <div className="h-4 w-96 bg-white/10 rounded mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
              <div className="h-64 bg-white/5 rounded-2xl"></div>
              <div className="h-64 bg-white/5 rounded-2xl"></div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef as any}
      className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden"
    >
      {/* Abstract Background Pattern - Subtle & Professional */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-secondary-teal rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs font-bold tracking-widest uppercase mb-6">
            Voices of Change
          </span>

          <Typography
            variant="h2"
            className="mb-6 text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Impact Stories
          </Typography>

          <Typography
            variant="body"
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Real stories from the communities we serve across Tanzania.
          </Typography>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative transition-all duration-500">
                <img
                  key={currentTestimonial.id} // Key ensures re-render and animation on change
                  src={currentTestimonial.imageUrl}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover animate-in fade-in duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-8 left-8 text-white">
                  <Typography variant="h4" className="text-2xl font-bold mb-1">
                    {currentTestimonial.name}
                  </Typography>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentTestimonial.location}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Quote Mark */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-secondary-orange rounded-full flex items-center justify-center shadow-lg z-20">
                <Quote className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2 text-white">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < currentTestimonial.rating ? 'text-secondary-yellow fill-current' : 'text-white/20'}`}
                  />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 animate-in slide-in-from-right-4 duration-500 key={currentIndex}">
                "{currentTestimonial.content}"
              </blockquote>

              <div className="flex items-center justify-between pt-8">
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-white/60 mb-1">
                    Program Area
                  </div>
                  <div className="text-lg font-semibold">
                    {currentTestimonial.category}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 bg-white/10 backdrop-blur-sm"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 bg-white/10 backdrop-blur-sm"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default SimpleTestimonialsSection;
