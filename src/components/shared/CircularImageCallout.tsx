
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import Typography from './Typography';

interface CircularImageCalloutProps {
  image: string;
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: string;
  link?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: 'light' | 'dark' | 'primary' | 'secondary';
}

const CircularImageCallout = ({ 
  image, 
  title, 
  description, 
  icon, 
  badge, 
  link,
  size = 'md',
  overlay = 'dark'
}: CircularImageCalloutProps) => {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80'
  };

  const overlayClasses = {
    light: 'bg-white/80',
    dark: 'bg-black/70',
    primary: 'bg-primary/80',
    secondary: 'bg-secondary-teal/80'
  };

  const textColorClasses = {
    light: 'text-neutral-dark',
    dark: 'text-white',
    primary: 'text-white',
    secondary: 'text-white'
  };

  const Component = link ? 'a' : 'div';
  const componentProps = link ? { href: link } : {};

  return (
    <Component 
      {...componentProps}
      className="group relative block"
    >
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group-hover:scale-105`}>
        {/* Background Image */}
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayClasses[overlay]} backdrop-blur-sm transition-all duration-300 group-hover:backdrop-blur-md`}></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          {badge && (
            <span className="bg-secondary-orange text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-lg">
              {badge}
            </span>
          )}
          
          {icon && (
            <div className="mb-4 opacity-90">
              {icon}
            </div>
          )}
          
          <Typography variant="h4" className={`${textColorClasses[overlay]} mb-3 text-lg font-bold leading-tight`}>
            {title}
          </Typography>
          
          <Typography variant="bodySmall" className={`${textColorClasses[overlay]}/90 leading-relaxed mb-4`}>
            {description}
          </Typography>
          
          {link && (
            <div className="flex items-center gap-2 text-secondary-orange group-hover:text-secondary-yellow transition-colors">
              <span className="text-sm font-bold">Learn More</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </Component>
  );
};

export default CircularImageCallout;
