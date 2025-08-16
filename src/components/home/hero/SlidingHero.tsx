import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

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
    description: 'We've launched a nationwide initiative supporting women and girls to access legal support, claim land rights, and challenge discrimination. Join us in advancing gender equality through grassroots justice.',
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

interface SlidingHeroProps {
  slides?: HeroSlide[];
}

const SlidingHero = ({ slides = defaultSlides }: SlidingHeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000); // Slower transition like the news hero
      
      return () => clearInterval(timer);
    }
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

  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[100vh] bg-gradient-to-br from-primary to-secondary-teal flex items-center">
        <Container size="xl" className="text-center text-white">
          <Typography variant="h1" className="text-white mb-4">Welcome to LSF</Typography>
          <Typography variant="body" className="text-white/90">Empowering communities through access to justice</Typography>
        </Container>
      </section>
    );
  }
  
  return (
    <section className="relative h-[100vh] overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-2000 ease-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
            </div>

            {/* Content */}
            <Container size="xl" className="relative z-10 h-full flex items-center">
              <div className="max-w-4xl text-white">
                {/* Subtitle Badge */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                    <PlayCircle className="h-6 w-6" />
                    <span className="font-semibold text-sm uppercase tracking-wider">
                      {slide.subtitle}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <Typography
                  variant="h1"
                  className="text-white mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]"
                >
                  {slide.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body"
                  className="text-white/95 mb-8 text-lg md:text-xl max-w-3xl leading-relaxed [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
                >
                  {slide.description}
                </Typography>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={() => window.location.href = slide.ctaLink}
                  >
                    {slide.ctaText}
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={() => {
                      // Scroll to next section or specific content
                      const nextSection = document.querySelector('#main-content') || document.querySelector('main');
                      nextSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore More
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-12 h-3 bg-white rounded-full shadow-lg' 
                    : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </div>
        </>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
          <div 
            className="h-full bg-secondary-orange transition-all duration-8000 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      )}
    </section>
  );
};

export default SlidingHero;