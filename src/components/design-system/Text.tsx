
import React from 'react';
import { cn } from '@/lib/utils';

type TextVariant = 'body' | 'body-large' | 'body-small' | 'caption' | 'overline' | 'small';
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
    'body': 'text-[16px] leading-[24px]',
    'body-large': 'text-[18px] leading-[28px]',
    'body-small': 'text-[14px] leading-[20px]',
    'caption': 'text-[12px] leading-[16px]',
    'overline': 'text-[12px] font-bold uppercase tracking-wider leading-[16px]',
    'small': 'text-[11px] leading-[14px]',
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
