
import React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/styles/designTokens';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingVariant = 'display' | 'hero' | 'section' | 'subsection' | 'card';

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
  variant = 'section',
  children, 
  className = '',
  color = 'neutral',
  gradient = false
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const variantStyles = {
    display: 'text-6xl md:text-7xl font-black leading-tight',
    hero: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
    section: 'text-3xl md:text-4xl font-bold leading-tight',
    subsection: 'text-2xl md:text-3xl font-semibold leading-tight',
    card: 'text-xl md:text-2xl font-semibold leading-tight',
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
