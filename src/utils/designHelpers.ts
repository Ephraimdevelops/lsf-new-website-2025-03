
import { designTokens } from '@/styles/designTokens';

// Color utility functions
export const getColorValue = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
};

// Responsive utility functions
export const getResponsiveValue = <T>(
  values: {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
  },
  currentBreakpoint: string
): T | undefined => {
  const order = ['base', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = order.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const key = order[i] as keyof typeof values;
    if (values[key] !== undefined) {
      return values[key];
    }
  }
  
  return values.base;
};

// Typography utility functions
export const getTypographyClasses = (variant: keyof typeof designTokens.typography.fontSizes) => {
  return {
    fontSize: designTokens.typography.fontSizes[variant],
    fontFamily: designTokens.typography.fontFamilies.body,
  };
};

// Spacing utility functions
export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[size];
};

// Component variant utilities
export const getButtonVariant = (variant: keyof typeof designTokens.components.button.variants) => {
  return designTokens.components.button.variants[variant];
};

export const getCardVariant = (variant: keyof typeof designTokens.components.card.variants) => {
  return designTokens.components.card.variants[variant];
};
