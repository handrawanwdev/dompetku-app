import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────

export const COLORS = {
  // Brand
  primary: '#4F46E5',
  secondary: '#06B6D4',

  // Finance categories
  income: '#10B981',
  expense: '#EF4444',
  debt: '#F59E0B',
  savings: '#3B82F6',
  investment: '#8B5CF6',
  asset: '#EC4899',

  // Background layers
  background: '#0F172A',
  surface: '#1E293B',
  card: '#243447',

  // Text
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // UI
  border: '#334155',

  // Semantic
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
} as const;

export type ColorKey = keyof typeof COLORS;

// ─── Fonts ───────────────────────────────────────────────────────────────────

export const FONTS = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  family: {
    regular: Platform.select({ ios: 'System', android: 'Roboto' }),
    mono: Platform.select({ ios: 'Courier New', android: 'monospace' }),
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const SHADOWS = {
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
} as const;

// ─── Theme (default export) ───────────────────────────────────────────────────

const theme = {
  colors: COLORS,
  fonts: FONTS,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
} as const;

export type Theme = typeof theme;

export default theme;
