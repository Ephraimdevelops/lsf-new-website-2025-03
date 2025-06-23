
import React from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

type SectionVariant = 'default' | 'primary' | 'secondary' | 'accent';
type SectionSize = 'sm' | 'md' | 'lg' | 'xl';

interface SectionProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  size?: SectionSize;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: string;
  id?: string;
}

const Section = ({ 
  children, 
  variant = 'default',
  size = 'lg',
  className = '',
  containerSize = 'xl',
  background,
  id
}: SectionProps) => {
  const variantStyles = {
    default: 'bg-white',
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-teal text-white',
    accent: 'bg-neutral-50',
  };

  const sizeStyles = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24',
  };

  return (
    <section 
      id={id}
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={background ? { backgroundImage: `url(${background})` } : undefined}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
};

export default Section;
