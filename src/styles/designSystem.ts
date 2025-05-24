
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
      sans: ['Calibri', 'system-ui', 'sans-serif'],
      heading: ['Merriweather Sans', 'system-ui', 'sans-serif'],
      display: ['Panton Narrow', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
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
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-teal hover:bg-secondary-teal/90 text-white',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
    ghost: 'text-primary-500 hover:bg-primary-50',
  },
  card: {
    elevated: 'bg-white shadow-lg rounded-2xl border border-neutral-100',
    flat: 'bg-white border border-neutral-200 rounded-xl',
    minimal: 'bg-neutral-50 rounded-lg',
  },
  text: {
    heading: 'font-heading font-bold text-neutral-900',
    subheading: 'font-heading font-semibold text-neutral-800',
    body: 'font-sans text-neutral-700 leading-relaxed',
    caption: 'font-sans text-sm text-neutral-600',
  }
};
