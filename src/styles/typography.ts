
export const typography = {
  // Font families - Updated for Ubuntu
  fonts: {
    heading: ['Ubuntu', 'system-ui', 'sans-serif'],
    body: ['Ubuntu', 'system-ui', 'sans-serif'],
    display: ['Ubuntu', 'system-ui', 'sans-serif'],
    sans: ['Ubuntu', 'system-ui', 'sans-serif'],
  },

  // Standardized font sizes - Consistent hierarchy
  sizes: {
    display: {
      fontSize: '36px',
      lineHeight: '40px',
      fontWeight: 900, // black
    },
    h1: {
      fontSize: '32px',
      lineHeight: '36px',
      fontWeight: 700, // bold
    },
    h2: {
      fontSize: '28px',
      lineHeight: '32px',
      fontWeight: 700, // bold
    },
    h3: {
      fontSize: '24px',
      lineHeight: '28px',
      fontWeight: 600, // semibold
    },
    h4: {
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: 600, // semibold
    },
    body: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400, // normal
    },
    bodySmall: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400, // normal
    },
    overline: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 700, // bold
    },
    caption: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400, // normal
    },
    small: {
      fontSize: '11px',
      lineHeight: '14px',
      fontWeight: 400, // normal
    },
  },

  // Utility classes for consistent styling - Standardized sizes
  classes: {
    display: 'text-[36px] font-black leading-[40px]',
    h1: 'text-[32px] font-bold leading-[36px]',
    h2: 'text-[28px] font-bold leading-[32px]',
    h3: 'text-[24px] font-semibold leading-[28px]',
    h4: 'text-[20px] font-semibold leading-[24px]',
    body: 'text-[16px] font-normal leading-[24px]',
    bodySmall: 'text-[14px] font-normal leading-[20px]',
    overline: 'text-[12px] font-bold leading-[16px] uppercase tracking-wider',
    caption: 'text-[12px] font-normal leading-[16px]',
    small: 'text-[11px] font-normal leading-[14px]',
  },
} as const;

export type TypographyVariant = keyof typeof typography.sizes;
