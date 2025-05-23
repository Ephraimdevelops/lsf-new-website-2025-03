
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Fatuma Mwalimu',
    location: 'Mwanza Region',
    role: 'Community Member',
    quote: 'LSF helped me understand my rights as a widow. Through their paralegal program, I was able to keep my land and provide for my children. I am now helping other women in my community.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'John Mwangi',
    location: 'Arusha Region',
    role: 'Community Paralegal',
    quote: 'The training I received from LSF transformed my life and my community. I have helped over 200 people resolve legal disputes and access justice. This work gives me purpose.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Grace Kimani',
    location: 'Dodoma Region',
    role: 'Local Government Official',
    quote: 'LSFs partnership with our district has significantly improved access to justice. The legal education programs have empowered our communities to know and exercise their rights.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories of Impact</h2>
          <p className="text-lg text-neutral-dark">
            Hear from the communities and individuals whose lives have been transformed
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-96 md:h-80">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 h-48 md:h-full">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-8 flex flex-col justify-center">
                      <Quote className="h-12 w-12 text-primary mb-4" />
                      <blockquote className="text-lg md:text-xl text-neutral-dark mb-6 italic leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <div className="font-bold text-xl text-primary">{testimonial.name}</div>
                        <div className="text-neutral-gray">{testimonial.role}</div>
                        <div className="text-sm text-neutral-gray">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
