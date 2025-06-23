
import React from 'react';
import { cn } from '@/lib/utils';

type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface GridProps {
  children: React.ReactNode;
  cols?: GridCols;
  gap?: GridGap;
  className?: string;
  responsive?: {
    sm?: GridCols;
    md?: GridCols;
    lg?: GridCols;
    xl?: GridCols;
  };
}

const Grid = ({ 
  children, 
  cols = 1, 
  gap = 'md',
  className = '',
  responsive
}: GridProps) => {
  const gapStyles = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const responsiveClasses = responsive ? [
    responsive.sm && `sm:grid-cols-${responsive.sm}`,
    responsive.md && `md:grid-cols-${responsive.md}`,
    responsive.lg && `lg:grid-cols-${responsive.lg}`,
    responsive.xl && `xl:grid-cols-${responsive.xl}`,
  ].filter(Boolean).join(' ') : '';

  return (
    <div className={cn(
      'grid',
      colStyles[cols],
      gapStyles[gap],
      responsiveClasses,
      className
    )}>
      {children}
    </div>
  );
};

export default Grid;
