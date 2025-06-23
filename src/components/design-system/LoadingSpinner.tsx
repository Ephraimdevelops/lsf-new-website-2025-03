
import React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'white' | 'current';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  className = '',
  text
}: LoadingSpinnerProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorStyles = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-teal',
    white: 'text-white',
    current: 'text-current',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-transparent border-t-current',
            sizeStyles[size],
            colorStyles[color]
          )}
        />
        {text && (
          <p className={cn('text-sm font-medium', colorStyles[color])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
