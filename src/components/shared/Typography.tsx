
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { typography, TypographyVariant } from '@/styles/typography';

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Typography = ({ 
  children, 
  variant = 'body', 
  className = '',
  as 
}: TypographyProps) => {
  const baseClasses = typography.classes[variant];
  
  // Font family mapping based on variant
  const getFontFamily = (variant: TypographyVariant): string => {
    switch (variant) {
      case 'display':
        return 'font-display'; // Avenir
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return 'font-heading'; // Merriweather Sans
      case 'body':
      case 'bodySmall':
        return 'font-body'; // akzidenz-grotesk
      default:
        return 'font-sans'; // Calibri
    }
  };

  const defaultElements: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    display: 'h1',
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    bodySmall: 'p',
    caption: 'span',
    small: 'span'
  };

  const Component = as || defaultElements[variant];
  const fontFamily = getFontFamily(variant);

  return (
    <Component className={cn(baseClasses, fontFamily, className)}>
      {children}
    </Component>
  );
};

export default Typography;
