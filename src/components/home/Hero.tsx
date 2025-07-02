
import { useState, useEffect } from 'react';
import { getHeroSlides } from './hero/heroData';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import HeroNavigation from './hero/HeroNavigation';

const Hero = () => {
  const [heroSlides, setHeroSlides] = useState(getHeroSlides());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Listen for localStorage changes to update slides dynamically
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedSlides = getHeroSlides();
      setHeroSlides(updatedSlides);
      // Reset to first slide if current slide is out of bounds
      if (currentSlide >= updatedSlides.length) {
        setCurrentSlide(0);
      }
    };

    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating && heroSlides.length > 0) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating && heroSlides.length > 0) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  // Handle case where no slides exist
  if (!heroSlides.length) {
    return (
      <section className="relative text-white min-h-[80vh] flex items-center overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-12 relative z-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-neutral-900">
            Welcome to LSF
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto">
            Please configure your hero slides in the admin panel.
          </p>
        </div>
      </section>
    );
  }

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative text-white min-h-[80vh] flex items-center overflow-hidden">
      <HeroBackground currentSlide={currentSlideData} />
      
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 gap-8 items-center">
          <HeroContent currentSlide={currentSlideData} />
        </div>
        
        {heroSlides.length > 1 && (
          <HeroNavigation
            currentSlide={currentSlide}
            totalSlides={heroSlides.length}
            onPrevSlide={prevSlide}
            onNextSlide={nextSlide}
            onSlideChange={setCurrentSlide}
            heroSlides={heroSlides}
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
