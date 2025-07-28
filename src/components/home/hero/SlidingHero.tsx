import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

// Mock data - this will be populated from admin dashboard
const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'LSF Annual Report 2024 is out Now',
    subtitle: 'Justice for Everyone:',
    description: 'Explore how LSF empowered over 400,000 Tanzanians through legal aid, digital access, and community-driven justice. Our 2024 report highlights nationwide achievements, innovations, and the future of legal empowerment in Tanzania.',
    image: '/lovable-uploads/LSF 2024 ANNUAL REPORT (Mobile Video).png',
    ctaText: 'Read the Full report',
    ctaLink: '/publications'
  },
  {
    id: '2',
    title: 'LSF Gender Justice Campaign Launches in Njombe',
    subtitle: 'Building Local Capacity',
    description: 'We’ve launched a nationwide initiative supporting women and girls to access legal support, claim land rights, and challenge discrimination. Join us in advancing gender equality through grassroots justice.',
    image: '/lovable-uploads/mama samia legal aid campaingn.jpg',
    ctaText: 'Learn More',
    ctaLink: '/News'
  },
  {
    id: '3',
    title: 'LSF Signs Landmark Partnership with NMB Bank',
    subtitle: 'Partnering for Justice: LSF & NMB Join Forces',
    description: 'LSF has signed a strategic partnership with NMB Bank to expand legal access and financial inclusion for underserved communities. This collaboration will enhance grassroots justice efforts through sustainable support and innovation.',
    image: '/lovable-uploads/lsf NMB signign.jpeg',
    ctaText: 'View Impact',
    ctaLink: '/News'
  }
];

const SlidingHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<HeroSlide[]>(defaultSlides);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
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
  
  return (
    <section className="relative bg-white overflow-hidden min-h-[100vh]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="relative container mx-auto px-6 py-20 lg:py-32 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center bg-primary/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <span className="text-white font-medium text-sm uppercase tracking-wider">
                  {slide.subtitle}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-7xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed font-light">
                {slide.description}
              </p>
              
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-medium"
                onClick={() => window.location.href = slide.ctaLink}
              >
                {slide.ctaText}
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <button 
          onClick={prevSlide}
          className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center">
        <button 
          onClick={nextSlide}
          className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default SlidingHero;