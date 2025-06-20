
import { useTheme } from '@/providers/ThemeProvider';
import { designTokens } from '@/styles/designTokens';

export const useDesignSystem = () => {
  const theme = useTheme();

  // Helper functions for common design operations
  const getButtonStyle = (variant: keyof typeof designTokens.components.button.variants, size: keyof typeof designTokens.components.button.sizes) => {
    const buttonVariant = designTokens.components.button.variants[variant];
    const buttonSize = designTokens.components.button.sizes[size];
    
    return {
      ...buttonVariant,
      ...buttonSize,
    };
  };

  const getCardStyle = (variant: keyof typeof designTokens.components.card.variants) => {
    return designTokens.components.card.variants[variant];
  };

  const getSectionPadding = (size: keyof typeof designTokens.components.section.padding) => {
    return designTokens.components.section.padding[size];
  };

  // Color utilities
  const getPrimaryColor = (shade: keyof typeof designTokens.colors.primary = 500) => {
    return designTokens.colors.primary[shade];
  };

  const getSecondaryColor = (variant: keyof typeof designTokens.colors.secondary) => {
    return designTokens.colors.secondary[variant];
  };

  const getNeutralColor = (shade: keyof typeof designTokens.colors.neutral) => {
    return designTokens.colors.neutral[shade];
  };

  return {
    ...theme,
    // Design helpers
    getButtonStyle,
    getCardStyle,
    getSectionPadding,
    // Color helpers
    getPrimaryColor,
    getSecondaryColor,
    getNeutralColor,
    // Direct access to tokens
    tokens: designTokens,
  };
};
