
import { ReactNode } from 'react';

interface HeroSectionProps {
  icon: ReactNode;
  badge: string;
  title: string;
  description: string;
}

const HeroSection = ({ icon, badge, title, description }: HeroSectionProps) => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Primary Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary"></div>
      
      {/* Fading Background Image with Opacity */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/lovable-uploads/backgound lsf colours.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Additional Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center space-x-3 mb-8">
            <div className="text-secondary-orange">
              {icon}
            </div>
            <span className="text-secondary-orange font-semibold text-sm uppercase tracking-wide">
              {badge}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-heading">{title}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed font-calibri">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
