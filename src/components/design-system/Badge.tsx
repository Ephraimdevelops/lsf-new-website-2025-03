
import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  rounded?: boolean;
}

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  rounded = true
}: BadgeProps) => {
  const variantStyles = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-teal text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white',
    neutral: 'bg-neutral-200 text-neutral-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium',
      variantStyles[variant],
      sizeStyles[size],
      rounded ? 'rounded-full' : 'rounded',
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
