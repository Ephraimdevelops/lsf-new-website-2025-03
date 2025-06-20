
import React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'elevated' | 'flat' | 'minimal' | 'interactive';
type CardPadding = 'sm' | 'md' | 'lg' | 'xl';

interface DesignCardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const DesignCard = ({ 
  variant = 'elevated',
  padding = 'lg',
  children,
  className = '',
  hover = false,
  onClick
}: DesignCardProps) => {
  const variantStyles = {
    elevated: 'bg-white shadow-lg border border-neutral-100 rounded-2xl',
    flat: 'bg-white border border-neutral-200 rounded-xl',
    minimal: 'bg-neutral-50 rounded-lg',
    interactive: 'bg-white shadow-lg border border-neutral-100 rounded-2xl cursor-pointer hover:shadow-2xl hover:-translate-y-1',
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div
      className={cn(
        'transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default DesignCard;
