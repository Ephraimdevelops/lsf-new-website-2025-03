
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'flat' | 'minimal';
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const Card = ({ 
  children, 
  variant = 'elevated', 
  className = '', 
  padding = 'lg',
  hover = false 
}: CardProps) => {
  const baseClasses = 'transition-all duration-300';
  
  const variantClasses = {
    elevated: 'bg-white shadow-lg rounded-2xl border border-neutral-100',
    flat: 'bg-white border border-neutral-200 rounded-xl',
    minimal: 'bg-neutral-50 rounded-lg'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
