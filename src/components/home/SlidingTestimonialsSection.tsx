import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, MapPin, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { supabaseService } from '@/services/api/supabaseService';
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

const SlidingTestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

  // Filler content - will be replaced with dynamic content when available
  const mockTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Mwalimu',
      role: 'Teacher',
      location: 'Dar es Salaam',
      content: 'Haki Yangu helped me understand my land rights when my family was facing eviction. The paralegal connected me with was so knowledgeable and supportive. I got the help I needed within hours, and now my family can live in peace.',
      imageUrl: '/lovable-uploads/testimonial-1.jpg',
      rating: 5,
      category: 'Land Rights',
      featured: true
    },
    {
      id: '2',
      name: 'Juma Kimaro',
      role: 'Farmer',
      location: 'Arusha',
      content: 'As someone living in a remote village, I never thought I could access legal help. This app changed everything. Now I can get legal advice right from my phone, even without internet. It has truly empowered our community.',
      imageUrl: '/lovable-uploads/testimonial-2.jpg',
      rating: 5,
      category: 'Rural Access',
      featured: true
    },
    {
      id: '3',
      name: 'Grace Mwamba',
      role: 'Small Business Owner',
      location: 'Mwanza',
      content: 'The document templates saved me thousands of shillings. I was able to create proper contracts for my business without hiring expensive lawyers. The app is a game-changer for entrepreneurs like me!',
      imageUrl: '/lovable-uploads/testimonial-3.jpg',
      rating: 5,
      category: 'Business Law',
      featured: true
    },
    {
      id: '4',
      name: 'Ahmed Hassan',
      role: 'Student',
      location: 'Zanzibar',
      content: 'The educational videos helped me understand my rights as a tenant. When my landlord tried to increase rent unfairly, I knew exactly what to do. Knowledge is power, and LSF gave me that power.',
      imageUrl: '/lovable-uploads/testimonial-4.jpg',
      rating: 5,
      category: 'Tenant Rights',
      featured: true
    },
    {
      id: '5',
      name: 'Mary Kisanga',
      role: 'Community Leader',
      location: 'Dodoma',
      content: 'Our entire village now uses Haki Yangu. We\'ve resolved so many disputes that used to divide our community. It\'s bringing peace and understanding to our people. Justice is truly accessible now.',
      imageUrl: '/lovable-uploads/testimonial-5.jpg',
      rating: 5,
      category: 'Community Justice',
      featured: true
    },
    {
      id: '6',
      name: 'Peter Mwangi',
      role: 'Construction Worker',
      location: 'Tanga',
      content: 'I was injured at work and didn\'t know my rights. Through LSF, I learned about workers\' compensation and got the support I needed. My family\'s future is secure because of the legal help I received.',
      imageUrl: '/lovable-uploads/testimonial-6.jpg',
      rating: 5,
      category: 'Workers Rights',
      featured: true
    }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        
        // Always start with mock data to ensure visibility
        setTestimonials(mockTestimonials);
        
        // Try to fetch real testimonials from Supabase in background
        try {
          const realTestimonials = await supabaseService.getTestimonials();
          if (realTestimonials && realTestimonials.length > 0) {
            // Transform real data to match our interface
            const transformedTestimonials: Testimonial[] = realTestimonials.map((testimonial: any) => ({
              id: testimonial.id || '',
              name: testimonial.name || 'Anonymous',
              role: testimonial.role || 'Community Member',
              location: testimonial.location || 'Tanzania',
              content: testimonial.content || testimonial.story || '',
              imageUrl: testimonial.image || testimonial.photo || '/lovable-uploads/placeholder.svg',
              rating: testimonial.rating || 5,
              category: testimonial.category || 'Legal Support',
              featured: testimonial.featured || true
            }));
            setTestimonials(transformedTestimonials);
          }
        } catch (error) {
          console.log('Using mock testimonials data');
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(mockTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 6000); // Change slide every 6 seconds
      return () => clearInterval(interval);
    }
  }, [testimonials.length, isVisible]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'land rights': return 'bg-primary/20 text-primary border-primary/30';
      case 'rural access': return 'bg-secondary-teal/20 text-secondary-teal border-secondary-teal/30';
      case 'business law': return 'bg-secondary-orange/20 text-secondary-orange border-secondary-orange/30';
      case 'tenant rights': return 'bg-secondary-yellow/20 text-secondary-yellow border-secondary-yellow/30';
      case 'community justice': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'workers rights': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <section className="relative py-24 md:py-36 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-neutral-900"></div>
        <Container size="xl" className="relative z-10 h-full flex items-center">
          <div className="text-center text-white w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-8"></div>
            <Typography variant="body" className="text-white/80">
              Loading inspiring stories...
            </Typography>
          </div>
        </Container>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentSlide];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-36 lg:py-40 overflow-hidden"
    >
      {/* Background Image - using a legal/justice themed background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url('/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png')`
        }}
      ></div>
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary-dark/90 to-neutral-900/85"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/20">
            <div className="text-secondary-orange">
              <Quote className="h-6 w-6" />
            </div>
            <span className="text-secondary-orange font-bold text-sm md:text-lg uppercase tracking-wider">
              Success Stories
            </span>
          </div>
          
          <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white">
            Voices of
            <span className="block text-secondary-orange drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Justice
            </span>
          </Typography>
          
          <Typography variant="body" className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed drop-shadow-md">
            Discover how LSF has transformed lives and empowered communities across Tanzania. 
            These are real stories of hope, resilience, and the power of accessible justice.
          </Typography>
        </div>

        {/* Main Testimonial Slide */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-secondary-orange/20 rounded-full flex items-center justify-center">
                  <Quote className="h-8 w-8 text-secondary-orange" />
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xl md:text-2xl leading-relaxed text-white/95 font-light">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/20">
                    <img
                      src={currentTestimonial.imageUrl}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h4" className="text-xl font-bold text-white mb-1">
                      {currentTestimonial.name}
                    </Typography>
                    <div className="flex items-center gap-2 text-white/80">
                      <User className="h-4 w-4" />
                      <span>{currentTestimonial.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="h-4 w-4" />
                      <span>{currentTestimonial.location}</span>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getCategoryColor(currentTestimonial.category)}`}>
                  <span className="text-sm font-semibold">
                    {currentTestimonial.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary-orange text-secondary-orange" />
                  ))}
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary-orange/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Quote className="h-12 w-12 text-secondary-orange" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-secondary-teal/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Star className="h-10 w-10 text-secondary-teal" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        {testimonials.length > 1 && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-12 h-3 bg-secondary-orange rounded-full shadow-lg' 
                      : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentSlide + 1} / {testimonials.length}
            </div>
          </>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-lg shadow-secondary-orange/40"
          >
            Share Your Story
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default SlidingTestimonialsSection; // Updated sliding testimonials
