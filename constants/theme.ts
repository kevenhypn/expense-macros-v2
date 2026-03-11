export const COLORS = {
  background: "#0A0A0F",
  card: "#16161F",
  cardAlt: "#1E1E2A",
  border: "#2A2A3A",
  borderAlt: "#1E1E2A",
  textPrimary: "#F0F0F5",
  textSecondary: "#8888A0",
  accent: "#6C5CE7",
  success: "#00D68F",
  danger: "#FF4757",
  income: "#00D68F",
  bills: "#FF4757",
  savings: "#4DA6FF",
  white: "#FFFFFF",
  barTrack: "#1A1A2E",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;
