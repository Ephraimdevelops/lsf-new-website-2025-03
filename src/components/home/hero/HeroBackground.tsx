
import { HeroSlide } from './types';

interface HeroBackgroundProps {
  currentSlide: HeroSlide;
}

const HeroBackground = ({ currentSlide }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0">
      {/* Base Image with Ken Burns Effect - Increased opacity */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[8000ms] ease-in-out transform scale-105 hover:scale-100 opacity-40"
        style={{ 
          backgroundImage: `url(${currentSlide.image})`,
          backgroundPosition: 'center center'
        }}
      ></div>
      
      {/* Sophisticated Multi-Layer Overlays - Reduced opacity to show more of the image */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-primary/65 to-black/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      
      {/* Subtle Pattern Overlay for Texture */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      
      {/* Dynamic Light Rays */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-secondary-orange/25 via-transparent to-transparent transform -skew-x-12"></div>
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-secondary-teal/25 via-transparent to-transparent transform skew-x-12"></div>
    </div>
  );
};

export default HeroBackground;
