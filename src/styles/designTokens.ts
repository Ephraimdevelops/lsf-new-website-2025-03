
// Design Tokens - Central source of truth for all design elements
export const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      500: '#931E5C',
      600: '#7A184C',
      700: '#6B1542',
      800: '#5A1237',
      900: '#4C0F2E',
    },
    secondary: {
      teal: '#59B5B0',
      green: '#6F8600',
      orange: '#F46F00',
      yellow: '#FFBE06',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      gray: '#909091',
      dark: '#222222',
      light: '#F1F1F1',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },

  // Typography Scale
  typography: {
    fontFamilies: {
      heading: ['Merriweather Sans', 'system-ui', 'sans-serif'],
      body: ['Calibri', 'system-ui', 'sans-serif'],
      display: ['Merriweather Sans', 'system-ui', 'sans-serif'],
    },
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeights: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.75,
    }
  },

  // Spacing Scale
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem',   // 128px
  },

  // Border Radius Scale
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadow Scale
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
    strong: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Icon Sizes
  iconSizes: {
    xs: '1rem',      // 16px
    sm: '1.25rem',   // 20px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '2.5rem',    // 40px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Component Variants
  components: {
    button: {
      sizes: {
        sm: {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          borderRadius: '0.5rem',
        },
        md: {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '0.75rem',
        },
        lg: {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
          borderRadius: '1rem',
        },
      },
      variants: {
        primary: {
          backgroundColor: '#931E5C',
          color: '#FFFFFF',
          hoverBackgroundColor: '#7A184C',
        },
        secondary: {
          backgroundColor: '#59B5B0',
          color: '#FFFFFF',
          hoverBackgroundColor: '#4A9A96',
        },
        outline: {
          backgroundColor: 'transparent',
          color: '#931E5C',
          border: '2px solid #931E5C',
          hoverBackgroundColor: '#931E5C',
          hoverColor: '#FFFFFF',
        },
      }
    },
    card: {
      variants: {
        elevated: {
          backgroundColor: '#FFFFFF',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E5E5E5',
        },
        flat: {
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem',
          border: '1px solid #D4D4D4',
        },
        minimal: {
          backgroundColor: '#FAFAFA',
          borderRadius: '0.75rem',
        },
      }
    },
    section: {
      padding: {
        sm: '3rem 0',      // 48px
        md: '4rem 0',      // 64px
        lg: '5rem 0',      // 80px
        xl: '7rem 0',      // 112px
      }
    }
  }
} as const;

// Type definitions for design tokens
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type SpacingTokens = typeof designTokens.spacing;
export type ShadowTokens = typeof designTokens.shadows;
export type IconSizeTokens = typeof designTokens.iconSizes;
export type ComponentTokens = typeof designTokens.components;
