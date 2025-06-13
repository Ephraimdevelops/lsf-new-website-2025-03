
export const typography = {
  // Font families - Updated for Merriweather Sans and Calibri
  fonts: {
    heading: ['Merriweather Sans', 'system-ui', 'sans-serif'],
    body: ['Calibri', 'system-ui', 'sans-serif'],
    display: ['Merriweather Sans', 'system-ui', 'sans-serif'],
    sans: ['Calibri', 'system-ui', 'sans-serif'],
  },

  // Font sizes and line heights - Increased for better readability
  sizes: {
    display: {
      fontSize: '48px',
      lineHeight: '52px',
      fontWeight: 900, // black
    },
    h1: {
      fontSize: '40px',
      lineHeight: '44px',
      fontWeight: 700, // bold
    },
    h2: {
      fontSize: '32px',
      lineHeight: '36px',
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
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 400, // normal
    },
    bodySmall: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400, // normal
    },
    overline: {
      fontSize: '14px',
      lineHeight: '18px',
      fontWeight: 700, // bold
    },
    caption: {
      fontSize: '14px',
      lineHeight: '18px',
      fontWeight: 400, // normal
    },
    small: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400, // normal
    },
  },

  // Utility classes for consistent styling - Updated with larger sizes
  classes: {
    display: 'text-[48px] font-black leading-[52px]',
    h1: 'text-[40px] font-bold leading-[44px]',
    h2: 'text-[32px] font-bold leading-[36px]',
    h3: 'text-[24px] font-semibold leading-[28px]',
    h4: 'text-[20px] font-semibold leading-[24px]',
    body: 'text-[18px] font-normal leading-[28px]',
    bodySmall: 'text-[16px] font-normal leading-[24px]',
    overline: 'text-[14px] font-bold leading-[18px] uppercase tracking-wider',
    caption: 'text-[14px] font-normal leading-[18px]',
    small: 'text-[12px] font-normal leading-[16px]',
  },
} as const;

export type TypographyVariant = keyof typeof typography.sizes;
