
export const typography = {
  // Font families - Updated for Merriweather Sans and Calibri
  fonts: {
    heading: ['Merriweather Sans', 'system-ui', 'sans-serif'],
    body: ['Calibri', 'system-ui', 'sans-serif'],
    display: ['Merriweather Sans', 'system-ui', 'sans-serif'],
    sans: ['Calibri', 'system-ui', 'sans-serif'],
  },

  // Font sizes and line heights - Reduced for more compact design
  sizes: {
    display: {
      fontSize: '36px',
      lineHeight: '40px',
      fontWeight: 900, // black
    },
    h1: {
      fontSize: '30px',
      lineHeight: '34px',
      fontWeight: 700, // bold
    },
    h2: {
      fontSize: '26px',
      lineHeight: '30px',
      fontWeight: 700, // bold
    },
    h3: {
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: 600, // semibold
    },
    h4: {
      fontSize: '18px',
      lineHeight: '22px',
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

  // Utility classes for consistent styling - Updated with smaller sizes
  classes: {
    display: 'text-[36px] font-black leading-[40px]',
    h1: 'text-[30px] font-bold leading-[34px]',
    h2: 'text-[26px] font-bold leading-[30px]',
    h3: 'text-[20px] font-semibold leading-[24px]',
    h4: 'text-[18px] font-semibold leading-[22px]',
    body: 'text-[16px] font-normal leading-[24px]',
    bodySmall: 'text-[14px] font-normal leading-[20px]',
    overline: 'text-[12px] font-bold leading-[16px] uppercase tracking-wider',
    caption: 'text-[12px] font-normal leading-[16px]',
    small: 'text-[11px] font-normal leading-[14px]',
  },
} as const;

export type TypographyVariant = keyof typeof typography.sizes;
