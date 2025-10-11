import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  story?: string;
  impact?: string;
}

const SlickTestimonialsCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });
  const carouselRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Mwalimu',
      location: 'Dar es Salaam',
      role: 'Teacher',
      content: 'Haki Yangu helped me understand my land rights when my family was facing eviction. The paralegal connected me with was so knowledgeable and supportive. I got the help I needed within hours.',
      rating: 5,
      story: 'Land Rights Victory',
      impact: 'Protected family property worth $50,000'
    },
    {
      id: '2',
      name: 'Juma Kimaro',
      location: 'Arusha',
      role: 'Farmer',
      content: 'As someone living in a remote village, I never thought I could access legal help. This app changed everything. Now I can get legal advice right from my phone, even without internet.',
      rating: 5,
      story: 'Remote Justice Access',
      impact: 'Resolved contract dispute in 3 days'
    },
    {
      id: '3',
      name: 'Grace Mwamba',
      location: 'Mwanza',
      role: 'Small Business Owner',
      content: 'The document templates saved me thousands of shillings. I was able to create proper contracts for my business without hiring expensive lawyers. The app is a game-changer!',
      rating: 5,
      story: 'Business Legal Protection',
      impact: 'Saved $2,000 in legal fees'
    },
    {
      id: '4',
      name: 'Ahmed Hassan',
      location: 'Zanzibar',
      role: 'Student',
      content: 'The educational videos helped me understand my rights as a tenant. When my landlord tried to increase rent unfairly, I knew exactly what to do. Knowledge is power!',
      rating: 5,
      story: 'Tenant Rights Education',
      impact: 'Prevented illegal rent increase'
    },
    {
      id: '5',
      name: 'Mary Kisanga',
      location: 'Dodoma',
      role: 'Community Leader',
      content: 'Our entire village now uses Haki Yangu. We\'ve resolved so many disputes that used to divide our community. It\'s bringing peace and understanding to our people.',
      rating: 5,
      story: 'Community Harmony',
      impact: 'Resolved 15+ village disputes'
    },
    {
      id: '6',
      name: 'Peter Mwangi',
      location: 'Kilimanjaro',
      role: 'Driver',
      content: 'When I had an accident and the insurance company was giving me trouble, Haki Yangu connected me with a legal expert who helped me get fair compensation. I\'m forever grateful.',
      rating: 5,
      story: 'Insurance Justice',
      impact: 'Received $5,000 compensation'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    ));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      ref={sectionRef}
      className="py-5 md:py-32 bg-white relative overflow-hidden"
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

          {/* Main Carousel */}
          <div 
            ref={carouselRef}
            className="relative bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="grid lg:grid-cols-2 min-h-[500px]">
              {/* Content Side */}
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <div className="space-y-8">
                  {/* Quote Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl flex items-center justify-center shadow-lg">
                    <Quote className="h-8 w-8 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Story Badge */}
                  {currentTestimonial.story && (
                    <div className="inline-block">
                      <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                        {currentTestimonial.story}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <Typography 
                    variant="body" 
                    className="text-xl text-muted-foreground leading-relaxed italic"
                  >
                    "{currentTestimonial.content}"
                  </Typography>

                  {/* Impact */}
                  {currentTestimonial.impact && (
                    <div className="bg-secondary-teal/10 rounded-2xl p-6">
                      <Typography variant="body" className="text-secondary-teal font-semibold mb-2">
                        Impact:
                      </Typography>
                      <Typography variant="body" className="text-neutral-700">
                        {currentTestimonial.impact}
                      </Typography>
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-orange rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <Typography variant="h4" className="text-2xl font-bold mb-1">
                        {currentTestimonial.name}
                      </Typography>
                      <Typography variant="body" className="text-muted-foreground mb-1">
                        {currentTestimonial.role}
                      </Typography>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <Typography variant="bodySmall">
                          {currentTestimonial.location}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Side */}
              <div className="relative bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary-orange rounded-full flex items-center justify-center shadow-2xl mx-auto mb-8">
                    <span className="text-white font-bold text-6xl">
                      {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <Typography variant="h3" className="text-3xl font-bold text-neutral-800 mb-4">
                    {currentTestimonial.name}
                  </Typography>
                  <Typography variant="body" className="text-lg text-muted-foreground">
                    {currentTestimonial.role} • {currentTestimonial.location}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

          {/* View All Stories Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              View All Success Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SlickTestimonialsCarousel;
