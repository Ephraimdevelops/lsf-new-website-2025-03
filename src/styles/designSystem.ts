// Design System Tokens for LSF Website
export const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      500: '#931E5C',
      600: '#7A184C',
      700: '#6B1542',
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
    },
    semantic: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Roboto', 'Noto Sans', 'Product Sans', 'system-ui', 'sans-serif'],
      heading: ['Ubuntu', 'system-ui', 'sans-serif'],
      display: ['Ubuntu', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
      '6xl': '3rem',
      '7xl': '3.75rem',
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    fontWeight: {
      normal: 300,
      medium: 400,
      semibold: 500,
      bold: 600,
      black: 700,
    }
  },

  // Spacing Scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '5rem',
    '5xl': '6rem',
    '6xl': '8rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Layout
  container: {
    maxWidth: '1280px',
    padding: '1rem',
  },

  // Grid
  grid: {
    columns: 12,
    gap: '1.5rem',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// Component Variants
export const componentVariants = {
  button: {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white font-normal',
    secondary: 'bg-secondary-teal hover:bg-secondary-teal/90 text-white font-normal',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-normal',
    ghost: 'text-primary-500 hover:bg-primary-50 font-normal',
  },
  card: {
    elevated: 'bg-white shadow-lg rounded-2xl border border-neutral-100',
    flat: 'bg-white border border-neutral-200 rounded-xl',
    minimal: 'bg-neutral-50 rounded-lg',
  },
  text: {
    heading: 'font-heading font-semibold text-neutral-700',
    subheading: 'font-heading font-medium text-neutral-700',
    body: 'font-sans font-normal text-neutral-600 leading-relaxed',
    caption: 'font-sans text-sm font-normal text-neutral-500',
  }
};