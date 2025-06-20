
import React, { createContext, useContext, ReactNode } from 'react';
import { designTokens } from '@/styles/designTokens';

interface ThemeContextType {
  tokens: typeof designTokens;
  getColor: (path: string) => string;
  getSpacing: (key: keyof typeof designTokens.spacing) => string;
  getShadow: (key: keyof typeof designTokens.shadows) => string;
  getIconSize: (key: keyof typeof designTokens.iconSizes) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const getColor = (path: string): string => {
    const keys = path.split('.');
    let value: any = designTokens.colors;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || '#000000';
  };

  const getSpacing = (key: keyof typeof designTokens.spacing): string => {
    return designTokens.spacing[key];
  };

  const getShadow = (key: keyof typeof designTokens.shadows): string => {
    return designTokens.shadows[key];
  };

  const getIconSize = (key: keyof typeof designTokens.iconSizes): string => {
    return designTokens.iconSizes[key];
  };

  const value: ThemeContextType = {
    tokens: designTokens,
    getColor,
    getSpacing,
    getShadow,
    getIconSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
