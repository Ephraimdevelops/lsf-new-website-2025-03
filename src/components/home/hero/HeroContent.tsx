
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSlide } from './types';

interface HeroContentProps {
  currentSlide: HeroSlide;
}

const HeroContent = ({ currentSlide }: HeroContentProps) => {
  return (
    <div className="lg:col-span-7">
      <div className="transition-all duration-500">
        {/* Category Badge with Glow Effect */}
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-block bg-gradient-to-r from-secondary-orange to-secondary-orange/80 text-white text-lg font-bold px-8 py-4 rounded-full uppercase tracking-wider shadow-lg shadow-secondary-orange/30">
            {currentSlide.category}
          </span>
          <div className="flex items-center text-secondary-teal">
            <span className="text-6xl md:text-7xl lg:text-8xl font-bold mr-4 font-heading drop-shadow-lg">{currentSlide.stat}</span>
            <span className="text-xl md:text-2xl">{currentSlide.statLabel}</span>
          </div>
        </div>
        
        {/* Main Headlines with Enhanced Typography */}
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight font-heading drop-shadow-2xl">
          {currentSlide.title}
        </h1>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-10 text-secondary-teal font-heading drop-shadow-lg">
          {currentSlide.subtitle}
        </h2>
        
        {/* Description with Better Visual Hierarchy */}
        <div className="bg-black/30 backdrop-blur-sm border-l-4 border-secondary-orange pl-8 py-6 mb-12 rounded-r-2xl">
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-2xl leading-relaxed">
            {currentSlide.description}
          </p>
        </div>
        
        {/* Enhanced CTA Buttons */}
        <div className="flex flex-wrap gap-8">
          <Link 
            to="/legal-help"
            className="group bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-12 py-6 rounded-2xl font-bold transition-all duration-300 inline-flex items-center text-xl md:text-2xl shadow-2xl hover:shadow-primary/50 transform hover:-translate-y-2 hover:scale-105"
          >
            Get Legal Help Now
            <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link 
            to="/what-we-do"
            className="group bg-white/20 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/30 hover:border-white/70 px-12 py-6 rounded-2xl font-bold transition-all duration-300 inline-flex items-center text-xl md:text-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Learn More
            <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
