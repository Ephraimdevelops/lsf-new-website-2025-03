
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from './types';

interface HeroNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSlideChange: (index: number) => void;
  heroSlides: HeroSlide[];
}

const HeroNavigation = ({ 
  currentSlide, 
  totalSlides, 
  onPrevSlide, 
  onNextSlide, 
  onSlideChange,
  heroSlides 
}: HeroNavigationProps) => {
  return (
    <>
      {/* Enhanced Slider Navigation */}
      <div className="absolute bottom-8 right-8 z-30 flex space-x-3">
        <button 
          onClick={onPrevSlide}
          className="bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full p-4 transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={onNextSlide}
          className="bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full p-4 transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
      
      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-8 z-30 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 border-2 shadow-lg ${
              currentSlide === index 
                ? 'bg-secondary-orange border-secondary-orange scale-125 shadow-secondary-orange/50' 
                : 'bg-white/40 border-white/60 hover:bg-white/60 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default HeroNavigation;
