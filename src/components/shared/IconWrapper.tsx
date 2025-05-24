
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconWrapperProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'neutral' | 'white';
  className?: string;
}

const IconWrapper = ({ 
  children, 
  size = 'md', 
  variant = 'primary',
  className = '' 
}: IconWrapperProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-2',
    md: 'w-12 h-12 p-3',
    lg: 'w-16 h-16 p-4',
    xl: 'w-20 h-20 p-5'
  };

  const variantClasses = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-teal text-white',
    neutral: 'bg-neutral-100 text-neutral-700',
    white: 'bg-white text-primary-500 shadow-md'
  };

  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center transition-all duration-300',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default IconWrapper;
