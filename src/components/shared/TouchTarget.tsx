import React from 'react';
import { cn } from '@/lib/utils';

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'min-h-[40px] min-w-[40px] p-2',
  md: 'min-h-[44px] min-w-[44px] p-3', 
  lg: 'min-h-[48px] min-w-[48px] p-4'
};

const TouchTarget = ({ 
  children, 
  className, 
  size = 'md', 
  onClick, 
  href, 
  disabled = false 
}: TouchTargetProps) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center',
    'touch-manipulation',
    'transition-all duration-200',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    sizeClasses[size],
    className
  );

  if (href && !disabled) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
};

export { TouchTarget };