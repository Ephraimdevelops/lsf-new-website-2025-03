
import React from 'react';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'neutral' | 'white';
  gradient?: boolean;
}

const Heading = ({ 
  level = 1, 
  variant = 'h1',
  children, 
  className = '',
  color = 'neutral',
  gradient = false
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const variantStyles = {
    display: 'text-[36px] font-black leading-[40px]',
    h1: 'text-[32px] font-bold leading-[36px]',
    h2: 'text-[28px] font-bold leading-[32px]',
    h3: 'text-[24px] font-semibold leading-[28px]',
    h4: 'text-[20px] font-semibold leading-[24px]',
  };

  const colorStyles = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-teal',
    neutral: 'text-neutral-dark',
    white: 'text-white',
  };

  const gradientStyle = gradient 
    ? 'bg-gradient-to-r from-primary-500 via-secondary-teal to-primary-500 bg-clip-text text-transparent'
    : '';

  return (
    <Tag 
      className={cn(
        'font-heading',
        variantStyles[variant],
        !gradient && colorStyles[color],
        gradient && gradientStyle,
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Heading;
