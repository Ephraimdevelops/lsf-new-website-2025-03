import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, MapPin, User } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
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
}

const SimpleTestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Mwalimu',
      role: 'Teacher',
      location: 'Dar es Salaam',
      content: 'Haki Yangu helped me understand my land rights when my family was facing eviction. The paralegal connected me with was so knowledgeable and supportive. I got the help I needed within hours.',
      imageUrl: '/lovable-uploads/testimonial-1.jpg',
      rating: 5,
      category: 'Land Rights'
    },
    {
      id: '2',
      name: 'Juma Kimaro',
      role: 'Farmer',
      location: 'Arusha',
      content: 'As someone living in a remote village, I never thought I could access legal help. This app changed everything. Now I can get legal advice right from my phone, even without internet.',
      imageUrl: '/lovable-uploads/testimonial-2.jpg',
      rating: 5,
      category: 'Rural Access'
    },
    {
      id: '3',
      name: 'Grace Mwamba',
      role: 'Small Business Owner',
      location: 'Mwanza',
      content: 'The document templates saved me thousands of shillings. I was able to create proper contracts for my business without hiring expensive lawyers. The app is a game-changer!',
      imageUrl: '/lovable-uploads/testimonial-3.jpg',
      rating: 5,
      category: 'Business Law'
    },
    {
      id: '4',
      name: 'Ahmed Hassan',
      role: 'Student',
      location: 'Zanzibar',
      content: 'The educational videos helped me understand my rights as a tenant. When my landlord tried to increase rent unfairly, I knew exactly what to do. Knowledge is power!',
      imageUrl: '/lovable-uploads/testimonial-4.jpg',
      rating: 5,
      category: 'Tenant Rights'
    },
    {
      id: '5',
      name: 'Mary Kisanga',
      role: 'Community Leader',
      location: 'Dodoma',
      content: 'Our entire village now uses Haki Yangu. We\'ve resolved so many disputes that used to divide our community. It\'s bringing peace and understanding to our people.',
      imageUrl: '/lovable-uploads/testimonial-5.jpg',
      rating: 5,
      category: 'Community Harmony'
    },
    {
      id: '6',
      name: 'Peter Mwangi',
      role: 'Driver',
      location: 'Kilimanjaro',
      content: 'When I had an accident and the insurance company was giving me trouble, Haki Yangu connected me with a legal expert who helped me get fair compensation.',
      imageUrl: '/lovable-uploads/testimonial-6.jpg',
      rating: 5,
      category: 'Insurance Justice'
    }
  ];

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

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-36 lg:py-40 overflow-hidden"
    >
      {/* Background Image */}
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

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <Quote className="h-6 w-6 text-secondary-orange animate-pulse" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg tracking-wider">
                Success Stories
              </Typography>
            </div>
            
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
            >
              Real Stories from
              <span className="block bg-gradient-to-r from-secondary-orange via-secondary-teal to-secondary-yellow bg-clip-text text-transparent">
                Real People
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed"
            >
              Hear from Tanzanians whose lives have been transformed through accessible legal support.
            </Typography>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto relative">
            
            {/* Left Column - Testimonial Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="p-4 sm:p-6 lg:p-8 relative">
                
                {/* Quote Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary-orange to-secondary-teal rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative z-10">
                  <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>

                {/* Category Badge */}
                <div className="inline-block mb-4">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currentTestimonial.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-base sm:text-lg md:text-xl leading-relaxed text-white/95 mb-4 sm:mb-6 font-light italic">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author Info with Thumbnail */}
                <div className="flex items-center gap-3 pt-3 sm:pt-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
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
                    <Typography variant="h4" className="text-base sm:text-lg font-bold text-white mb-1">
                      {currentTestimonial.name}
                    </Typography>
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <User className="h-3 w-3" />
                      <span className="text-xs">{currentTestimonial.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{currentTestimonial.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Full Image */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="aspect-[4/5] sm:aspect-[4/5] overflow-hidden relative">
                  <img
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                    }}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Floating Quote Icon */}
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  
                  {/* Bottom Quote */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6">
                      <Typography variant="body" className="text-white font-medium italic text-sm sm:text-base">
                        "{currentTestimonial.content.slice(0, 80)}..."
                      </Typography>
                    </div>
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
                onClick={prevTestimonial}
                className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 shadow-sm border hover:bg-white text-primary p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 shadow-sm border hover:bg-white text-primary p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
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

export default SimpleTestimonialsSection;
