
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSlide } from './types';

interface HeroContentProps {
  currentSlide: HeroSlide;
}

const HeroContent = ({ currentSlide }: HeroContentProps) => {
  return (
    <div className="lg:col-span-12">
      <div className="max-w-4xl text-left transition-all duration-500">
        {/* Category Badge */}
        <div className="inline-flex items-center bg-primary/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
          <span className="text-primary font-bold uppercase tracking-wider">
            {currentSlide.category}
          </span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
          {currentSlide.title}
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mb-8 text-white/90">
          {currentSlide.subtitle}
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mb-10">
          {currentSlide.description}
        </p>
        
        {/* CTA Button */}
        <Link 
          to="/what-we-do"
          className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Read More
          <ArrowRight className="ml-3 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default HeroContent;
