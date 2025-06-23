
import React from 'react';
import { cn } from '@/lib/utils';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  className?: string;
  padding?: boolean;
  center?: boolean;
}

const Container = ({ 
  children, 
  size = 'xl',
  className = '',
  padding = true,
  center = true
}: ContainerProps) => {
  const sizeStyles = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      sizeStyles[size],
      center && 'mx-auto',
      padding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
};

export default Container;
