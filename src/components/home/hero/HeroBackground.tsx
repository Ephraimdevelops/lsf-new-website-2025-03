
import { HeroSlide } from './types';

interface HeroBackgroundProps {
  currentSlide: HeroSlide;
}

const HeroBackground = ({ currentSlide }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0">
      {/* Base Image with Ken Burns Effect */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[8000ms] ease-in-out transform scale-105 hover:scale-100"
        style={{ 
          backgroundImage: `url(${currentSlide.image})`,
          backgroundPosition: 'center center'
        }}
      ></div>
      
      {/* Sophisticated Multi-Layer Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-primary/75 to-black/90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
      
      {/* Subtle Pattern Overlay for Texture */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      
      {/* Dynamic Light Rays */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-secondary-orange/30 via-transparent to-transparent transform -skew-x-12"></div>
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-secondary-teal/30 via-transparent to-transparent transform skew-x-12"></div>
    </div>
  );
};

export default HeroBackground;
