
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, MapPin, User } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  imageUrl: string;
  rating: number;
  category: string;
  featured: boolean;
}

const ModernTestimonialsSection = () => {
  const convexStories = useQuery(api.stories.get);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

  // Fallback data
  const fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Mwalimu',
      role: 'Teacher',
      location: 'Dar es Salaam',
      content: 'Haki Yangu helped me understand my land rights when my family was facing eviction. The paralegal connected me with was so knowledgeable and supportive. I got the help I needed within hours.',
      imageUrl: '/lovable-uploads/testimonial-1.jpg',
      rating: 5,
      category: 'Land Rights',
      featured: true
    },
    // ... (keep other fallbacks if needed, or just rely on Convex)
  ];

  useEffect(() => {
    if (convexStories) {
      const transformedStories: Testimonial[] = convexStories.map(story => ({
        id: story._id,
        name: story.personName,
        role: story.title, // Using title as role/headline for now
        location: story.location,
        content: story.story,
        imageUrl: story.imageUrl,
        rating: 5, // Default
        category: 'Success Story', // Default
        featured: story.featured || false
      }));

      if (transformedStories.length > 0) {
        setTestimonials(transformedStories);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    } else {
      // While loading or if undefined, we could show fallback or loading state
      // For now, let's initialize with fallback to avoid empty flash if desired, 
      // but typically we wait for data. 
      // Given the existing code structure, setting fallback initially is fine.
      setTestimonials(fallbackTestimonials);
    }
  }, [convexStories]);

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, isVisible]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Always show content - fallback data is always available
  if (!currentTestimonial) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-neutral-50 via-white to-primary/5 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <Quote className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Success Stories
              </Typography>
            </div>

            <Typography
              variant="h2"
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Real Stories from
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Real People
              </span>
            </Typography>

            <Typography
              variant="body"
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Hear from Tanzanians whose lives have been transformed through accessible legal support.
            </Typography>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

            {/* Left Column - Testimonial Card */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="bg-white rounded-3xl shadow-2xl border border-neutral-100 p-8 lg:p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary-orange/10 rounded-full blur-2xl"></div>

                {/* Quote Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl flex items-center justify-center shadow-lg mb-8 relative z-10">
                  <Quote className="h-8 w-8 text-white" />
                </div>

                {/* Category Badge */}
                <div className="inline-block mb-6">
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                    {currentTestimonial.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xl md:text-2xl leading-relaxed text-neutral-700 mb-8 font-light italic">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author Info with Thumbnail */}
                <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary/20 flex-shrink-0">
                    <img
                      src={currentTestimonial.imageUrl}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Typography variant="h4" className="text-xl font-bold text-neutral-800 mb-1">
                      {currentTestimonial.name}
                    </Typography>
                    <div className="flex items-center gap-2 text-neutral-600 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{currentTestimonial.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{currentTestimonial.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Full Image */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative">
                  <img
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                    }}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Floating Quote Icon */}
                  <div className="absolute top-8 right-8 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <Quote className="h-8 w-8 text-primary" />
                  </div>

                  {/* Bottom Quote */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                      <Typography variant="body" className="text-neutral-700 font-medium italic">
                        "{currentTestimonial.content.slice(0, 120)}..."
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-teal/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-orange/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <>
              {/* Previous/Next Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg text-primary p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg text-primary p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-3 mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                        ? 'bg-primary scale-125'
                        : 'bg-neutral-300 hover:bg-neutral-400'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ModernTestimonialsSection;
