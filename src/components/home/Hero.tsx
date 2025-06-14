
import { useState, useEffect } from 'react';
import { heroSlides } from './hero/heroData';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import LegalAidWidget from './hero/LegalAidWidget';
import HeroNavigation from './hero/HeroNavigation';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative text-white min-h-[100vh] flex items-center overflow-hidden">
      <HeroBackground currentSlide={currentSlideData} />
      
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <HeroContent currentSlide={currentSlideData} />
          <LegalAidWidget />
        </div>
        
        <HeroNavigation
          currentSlide={currentSlide}
          totalSlides={heroSlides.length}
          onPrevSlide={prevSlide}
          onNextSlide={nextSlide}
          onSlideChange={setCurrentSlide}
          heroSlides={heroSlides}
        />
      </div>
    </section>
  );
};

export default Hero;
