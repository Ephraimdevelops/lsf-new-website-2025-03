
import React from 'react';
import { cn } from '@/lib/utils';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type IconColor = 'primary' | 'secondary' | 'neutral' | 'white' | 'current';

interface DesignIconProps {
  icon: React.ReactNode;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  wrapper?: boolean;
  wrapperVariant?: 'primary' | 'secondary' | 'neutral' | 'white';
}

const DesignIcon = ({ 
  icon,
  size = 'md',
  color = 'current',
  className = '',
  wrapper = false,
  wrapperVariant = 'primary'
}: DesignIconProps) => {
  const sizeStyles = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
    '3xl': 'w-16 h-16',
  };

  const colorStyles = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-teal',
    neutral: 'text-neutral-600',
    white: 'text-white',
    current: 'text-current',
  };

  const wrapperSizes = {
    xs: 'w-8 h-8 p-2',
    sm: 'w-10 h-10 p-2.5',
    md: 'w-12 h-12 p-3',
    lg: 'w-16 h-16 p-4',
    xl: 'w-20 h-20 p-5',
    '2xl': 'w-24 h-24 p-6',
    '3xl': 'w-32 h-32 p-8',
  };

  const wrapperVariantStyles = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-teal text-white',
    neutral: 'bg-neutral-100 text-neutral-700',
    white: 'bg-white text-primary-500 shadow-md',
  };

  if (wrapper) {
    return (
      <div className={cn(
        'rounded-xl flex items-center justify-center transition-all duration-300',
        wrapperSizes[size],
        wrapperVariantStyles[wrapperVariant],
        className
      )}>
        <div className={cn(sizeStyles[size])}>
          {icon}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      sizeStyles[size],
      colorStyles[color],
      className
    )}>
      {icon}
    </div>
  );
};

export default DesignIcon;
