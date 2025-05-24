
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'overline';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Typography = ({ 
  children, 
  variant = 'body', 
  className = '',
  as 
}: TypographyProps) => {
  const variantClasses = {
    display: 'font-display text-6xl md:text-7xl font-black text-neutral-900 leading-none',
    h1: 'font-heading text-4xl md:text-5xl font-bold text-neutral-900 leading-tight',
    h2: 'font-heading text-3xl md:text-4xl font-bold text-neutral-900 leading-tight',
    h3: 'font-heading text-2xl md:text-3xl font-semibold text-neutral-800 leading-snug',
    h4: 'font-heading text-xl md:text-2xl font-semibold text-neutral-800 leading-snug',
    body: 'font-sans text-lg text-neutral-700 leading-relaxed',
    caption: 'font-sans text-sm text-neutral-600 leading-normal',
    overline: 'font-sans text-xs font-medium text-neutral-500 uppercase tracking-wider'
  };

  const defaultElements = {
    display: 'h1',
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    caption: 'span',
    overline: 'span'
  };

  const Component = as || defaultElements[variant] as keyof JSX.IntrinsicElements;

  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
};

export default Typography;
