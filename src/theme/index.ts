import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────

export const COLORS = {
  // Brand — matched to index.html accent (#1d9e75)
  primary: '#1d9e75',
  secondary: '#0891b2',

  // Finance categories
  income: '#1d9e75',
  expense: '#e24b4a',
  debt: '#ef9f27',
  savings: '#185fa5',
  investment: '#6d28d9',
  asset: '#0891b2',

  // Background layers — light mode matching index.html
  background: '#f0f2f5',
  surface: '#ffffff',
  card: '#ffffff',

  // Text — dark navy like index.html --text/#1a2b45
  text: '#1a2b45',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',

  // UI
  border: '#e5e7eb',

  // Topbar / header — dark navy like index.html --dark
  topbar: '#1a2b45',

  // Input background — warm like index.html --input
  inputBg: '#fffbeb',

  // Subtle section bg
  subtleBg: '#f5f5f3',

  // Light tints for text on dark backgrounds
  incomeLight: '#6ee7b7',
  expenseLight: '#fca5a5',

  // Card backgrounds for semantic states
  successBg: '#f0fdf4',
  successBorder: '#d1fae5',

  // Semantic
  success: '#1d9e75',
  danger: '#e24b4a',
  warning: '#ef9f27',
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
