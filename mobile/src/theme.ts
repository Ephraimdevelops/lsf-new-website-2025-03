export const colors = {
  burgundy: "#8A1538",
  burgundyDark: "#66102B",
  burgundySoft: "#F8EAF0",
  orange: "#F16C22",
  orangeSoft: "#FFF0E6",
  gold: "#F3B61F",
  goldSoft: "#FFF7DA",
  peach: "#FFD9C7",
  softPink: "#F3E6EF",
  teal: "#238C8C",
  tealSoft: "#E1F3F2",
  green: "#2D7856",
  greenSoft: "#E8F4ED",
  charcoal: "#222222",
  ink: "#191719",
  inkMuted: "#686168",
  line: "#E8E2E5",
  surface: "#FFFFFF",
  background: "#FFFFFF",
  warmBackground: "#FCFBFA",
  success: "#217A55",
  warning: "#A55B13",
  danger: "#B3261E",
} as const;

// Human Civic surfaces: strong colour marks the primary action; supporting
// choices sit on quiet tints so information remains easy to scan.
export const civic = {
  pageInset: 24,
  minimumTouch: 48,
  bodySize: 16,
  bodyLineHeight: 23,
  sectionGap: 32,
  cardGap: 16,
  actionCards: {
    find: { foreground: "#075D63", background: "#E6F5F3" },
    request: { foreground: colors.burgundy, background: colors.burgundySoft },
    saada: { foreground: "#A34A13", background: colors.orangeSoft },
    rights: { foreground: "#745708", background: colors.goldSoft },
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#3D1725",
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
} as const;

export const type = {
  regular: "NotoSans_400Regular",
  medium: "NotoSans_500Medium",
  semibold: "NotoSans_600SemiBold",
  bold: "NotoSans_700Bold",
  editorial: "SourceSerif4_600SemiBold",
} as const;
