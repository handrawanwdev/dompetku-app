import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { reloadAppAsync } from 'expo';
import { PALETTES, DEFAULT_THEME_ID, type ThemeId, type ThemeColors } from './palettes';

// ─── Colors ──────────────────────────────────────────────────────────────────
// Palet dibaca sekali saat app start (sinkron dari MMKV). Style dibuat di level
// modul, jadi ganti tema = simpan pilihan lalu reload app (lihat setThemeId).

const themeStorage = createMMKV({ id: 'dompetku-theme' });
const THEME_KEY = 'theme_id';

function readThemeId(): ThemeId {
  try {
    const saved = themeStorage.getString(THEME_KEY);
    if (saved && saved in PALETTES) return saved as ThemeId;
  } catch {}
  return DEFAULT_THEME_ID;
}

export const THEME_ID: ThemeId = readThemeId();

export const COLORS: ThemeColors = { ...PALETTES[THEME_ID].colors };

export type ColorKey = keyof ThemeColors;

export async function setThemeId(id: ThemeId) {
  themeStorage.set(THEME_KEY, id);
  await reloadAppAsync('Ganti tema');
}

export { PALETTES };
export type { ThemeId, ThemeColors };

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

// ─── Icon Sizes ──────────────────────────────────────────────────────────────

export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
  xxl: 24,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  round: 999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const SHADOWS = {
  card: Platform.select({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 12,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
  sm: Platform.select({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 18,
    },
    android: {
      elevation: 6,
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
