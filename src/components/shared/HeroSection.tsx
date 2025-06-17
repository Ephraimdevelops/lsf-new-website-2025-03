
import { ReactNode } from 'react';

interface HeroSectionProps {
  icon: ReactNode;
  badge: string;
  title: string;
  description: string;
  backgroundImage?: string;
}

const HeroSection = ({ icon, badge, title, description, backgroundImage }: HeroSectionProps) => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Image */}
      {backgroundImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('${backgroundImage}')`
          }}
        ></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black"></div>
      )}
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary-dark/90 to-black/85"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
            <div className="text-secondary-orange">
              {icon}
            </div>
            <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
              {badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight font-heading">{title}</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl mx-auto leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
