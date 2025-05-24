
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Section = ({ 
  children, 
  variant = 'default', 
  padding = 'lg',
  className = '' 
}: SectionProps) => {
  const variantClasses = {
    default: 'bg-white',
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-neutral-50',
    gradient: 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white'
  };

  const paddingClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-28'
  };

  return (
    <section className={cn(
      variantClasses[variant],
      paddingClasses[padding],
      'relative overflow-hidden',
      className
    )}>
      {children}
    </section>
  );
};

export default Section;
