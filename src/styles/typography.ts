export const typography = {
  fonts: {
    heading: ['Ubuntu', 'system-ui', 'sans-serif'],
    body: ['Ubuntu', 'system-ui', 'sans-serif'],
    display: ['Ubuntu', 'system-ui', 'sans-serif'],
  },

  sizes: {
    display: {
      fontSize: 'clamp(38px, 5vw, 48px)', // hero & banners
      lineHeight: '1.2',
      fontWeight: 900,
      letterSpacing: '-0.01em',
    },
    h1: {
      fontSize: 'clamp(30px, 4vw, 36px)',
      lineHeight: '1.25',
      fontWeight: 700,
      letterSpacing: '-0.005em',
    },
    h2: {
      fontSize: 'clamp(26px, 3vw, 32px)',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h3: {
      fontSize: '22px',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '18px',
      lineHeight: '1.4',
      fontWeight: 500,
      letterSpacing: '0.005em',
    },
    body: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    bodySmall: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0.005em',
    },
    overline: {
      fontSize: '12px',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '12px',
      lineHeight: '1.4',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    small: {
      fontSize: '11px',
      lineHeight: '1.4',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
  },

  classes: {
    display: 'text-[clamp(38px,5vw,48px)] font-black leading-[1.2] tracking-[-0.01em]',
    h1: 'text-[clamp(30px,4vw,36px)] font-bold leading-[1.25] tracking-[-0.005em]',
    h2: 'text-[clamp(26px,3vw,32px)] font-semibold leading-[1.3]',
    h3: 'text-[22px] font-semibold leading-[1.3]',
    h4: 'text-[18px] font-medium leading-[1.4]',
    body: 'text-[16px] font-normal leading-[1.5]',
    bodySmall: 'text-[14px] font-normal leading-[1.5]',
    overline: 'text-[12px] font-semibold leading-[1.4] tracking-[0.05em] uppercase',
    caption: 'text-[12px] font-normal leading-[1.4] tracking-[0.02em]',
    small: 'text-[11px] font-normal leading-[1.4] tracking-[0.02em]',
  },
} as const;

export type TypographyVariant = keyof typeof typography.sizes;