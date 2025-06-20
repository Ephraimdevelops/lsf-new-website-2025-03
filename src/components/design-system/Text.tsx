
import React from 'react';
import { cn } from '@/lib/utils';

type TextVariant = 'body' | 'body-large' | 'body-small' | 'caption' | 'overline';
type TextColor = 'primary' | 'secondary' | 'neutral' | 'muted' | 'white';

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Text = ({ 
  variant = 'body',
  color = 'neutral',
  children, 
  className = '',
  as = 'p'
}: TextProps) => {
  const Component = as;

  const variantStyles = {
    'body': 'text-lg leading-relaxed',
    'body-large': 'text-xl leading-relaxed',
    'body-small': 'text-base leading-normal',
    'caption': 'text-sm leading-normal',
    'overline': 'text-sm font-bold uppercase tracking-wider leading-normal',
  };

  const colorStyles = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-teal',
    neutral: 'text-neutral-gray',
    muted: 'text-neutral-400',
    white: 'text-white',
  };

  return (
    <Component 
      className={cn(
        'font-sans',
        variantStyles[variant],
        colorStyles[color],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Text;
