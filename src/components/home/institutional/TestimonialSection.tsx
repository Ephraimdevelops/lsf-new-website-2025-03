import { useState, useEffect } from 'react';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "LSF changed my life. Through their legal aid program, I was able to secure my land rights and provide a stable future for my children. The paralegals were professional, compassionate, and truly understood our community's needs.",
    author: "Amina Hassan",
    role: "Small-scale farmer",
    location: "Mwanza Region",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png"
  },
  {
    id: 2,
    quote: "The Haki Yangu app brought legal services right to my phone. I could access information about my rights, connect with legal experts, and get the support I needed without traveling long distances. Technology for justice!",
    author: "John Mwalimu",
    role: "Rural entrepreneur",
    location: "Dodoma Region",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png"
  },
  {
    id: 3,
    quote: "As a paralegal trained by LSF, I've helped over 200 families in my community access justice. The training was comprehensive, the support ongoing, and the impact immeasurable. We're building a more just Tanzania, one case at a time.",
    author: "Grace Kimario",
    role: "Community Paralegal",
    location: "Kilimanjaro Region",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Quote className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-neutral-900 mb-6">
            Voices of Impact
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
            Real stories from the communities we serve across Tanzania
          </p>
        </div>

        {/* Testimonial content */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
                  <img 
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    className="w-full h-80 object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="font-semibold text-lg">{currentTestimonial.author}</h4>
                    <p className="text-white/90">{currentTestimonial.role}</p>
                    <p className="text-white/75 text-sm">{currentTestimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quote content */}
            <div className="lg:col-span-7">
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary/20" />
                <blockquote className="text-2xl lg:text-3xl font-light text-neutral-900 leading-relaxed mb-8 pl-8">
                  "{currentTestimonial.quote}"
                </blockquote>
                
                {/* Author info */}
                <div className="flex items-center justify-between">
                  <div>
                    <cite className="not-italic">
                      <div className="font-semibold text-neutral-900 text-lg">
                        {currentTestimonial.author}
                      </div>
                      <div className="text-neutral-600">
                        {currentTestimonial.role} • {currentTestimonial.location}
                      </div>
                    </cite>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPrevious}
                      className="w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-12 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;