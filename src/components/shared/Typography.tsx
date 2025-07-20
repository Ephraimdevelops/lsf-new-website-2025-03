
import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { typography, TypographyVariant } from '@/styles/typography';

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  color?: string;
}

const Typography = ({ 
  children, 
  variant = 'body', 
  className = '',
  as,
  style,
  color 
}: TypographyProps) => {
  const baseClasses = typography.classes[variant];
  
  // Font family mapping for Merriweather Sans (headings) and Calibri (body)
  const getFontFamily = (variant: TypographyVariant): string => {
    switch (variant) {
      case 'display':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return 'font-heading'; // Merriweather Sans
      case 'body':
      case 'bodySmall':
      case 'overline':
      case 'caption':
      case 'small':
        return 'font-sans'; // Calibri
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
    overline: 'span',
    caption: 'span',
    small: 'span'
  };

  const elementType = as || defaultElements[variant];
  const fontFamily = getFontFamily(variant);

  const Element = elementType as keyof JSX.IntrinsicElements;

  const colorClass = color ? `text-${color}` : '';

  return (
    <Element className={cn(baseClasses, fontFamily, colorClass, className)} style={style}>
      {children}
    </Element>
  );
};

export default Typography;
