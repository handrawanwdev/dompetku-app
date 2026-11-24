// Palet warna yang bisa dipilih user di Pengaturan > Tema.
// Semua kombinasi teks/latar sudah dicek kontras minimal 4.5:1.

const rose = {
  // Brand
  primary: '#C93F78',
  primaryDark: '#A8325D',
  primarySoft: '#FCE4EC',
  onPrimary: '#FFFFFF',
  secondary: '#E58FAE',

  // Kategori keuangan
  income: '#23845F',
  expense: '#D03A32',
  debt: '#C9701F',
  savings: '#4F72C9',
  investment: '#7E57C9',
  asset: '#2E8FA3',

  // Jenis uang keluar
  need: '#4F72C9',
  obligation: '#7E57C9',
  want: '#C9701F',
  saving: '#23845F',
  invest: '#2A8C9E',

  // Latar
  background: '#FFF5F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Teks
  text: '#45202F',
  textSecondary: '#7A5563',
  textMuted: '#94697A',

  // UI
  border: '#F5DCE4',
  topbar: '#A8325D',
  inputBg: '#FFFAFB',
  subtleBg: '#FDEEF2',
  overlay: 'rgba(69,32,47,0.45)',
  shadow: '#8A2E55',

  // Teks di atas kartu utama (hero)
  heroText: '#FFFFFF',
  heroMuted: '#FFE3EC',
  incomeLight: '#B9F0D6',
  expenseLight: '#FFD0CB',

  // Semantic tint (latar + teks)
  successBg: '#E8F6EF',
  successBorder: '#CDEBDD',
  successText: '#1F6B4F',
  dangerBg: '#FDE8E6',
  dangerText: '#9A2A22',
  warningBg: '#FFF1DC',
  warningSoftBg: '#FFF8EA',
  warningText: '#8A4B0F',
  infoBg: '#EEF0FC',
  infoText: '#3A4BA0',

  // Semantic
  success: '#23845F',
  danger: '#D03A32',
  warning: '#C9701F',
};

export type ThemeColors = { [K in keyof typeof rose]: string };

const peach: ThemeColors = {
  ...rose,
  primary: '#C4513A',
  primaryDark: '#B44833',
  primarySoft: '#FFE4D9',
  secondary: '#F2A48C',
  // Merah pengeluaran digeser ke crimson supaya tidak tertukar dengan coral
  expense: '#B8303F',
  danger: '#B8303F',
  background: '#FFF6F1',
  text: '#45261F',
  textSecondary: '#7A5249',
  textMuted: '#91665B',
  border: '#F7DDD2',
  topbar: '#B44833',
  inputBg: '#FFFBF8',
  subtleBg: '#FFEEE6',
  overlay: 'rgba(69,38,31,0.45)',
  shadow: '#8A3E2A',
  heroMuted: '#FFF1EB',
  dangerBg: '#FCE6E8',
  dangerText: '#8F2231',
};

const lilac: ThemeColors = {
  ...rose,
  primary: '#7552D1',
  primaryDark: '#5A3FA8',
  primarySoft: '#ECE5FB',
  secondary: '#F29BC0',
  investment: '#C04F8E',
  background: '#F7F4FD',
  text: '#2F2547',
  textSecondary: '#5E5478',
  textMuted: '#736990',
  border: '#E4DCF5',
  topbar: '#5A3FA8',
  inputBg: '#FCFBFF',
  subtleBg: '#F0EBFB',
  overlay: 'rgba(47,37,71,0.45)',
  shadow: '#4B3590',
  heroMuted: '#ECE4FF',
};

const berry: ThemeColors = {
  ...rose,
  primary: '#B02A6E',
  primaryDark: '#7E1A4F',
  primarySoft: '#F8DDEB',
  secondary: '#E07BAE',
  background: '#FBF4F8',
  text: '#2E1028',
  textSecondary: '#6E4560',
  textMuted: '#8E6480',
  border: '#F1D9E6',
  topbar: '#7E1A4F',
  inputBg: '#FFFAFC',
  subtleBg: '#F9EAF2',
  overlay: 'rgba(46,16,40,0.5)',
  shadow: '#6E1645',
  heroMuted: '#FBD9EA',
};

const mint: ThemeColors = {
  ...rose,
  primary: '#1E7466',
  primaryDark: '#155A4F',
  primarySoft: '#DDF2EC',
  secondary: '#7FC8B5',
  // Hijau pemasukan/tabungan digeser ke hijau daun supaya beda dari teal tema
  income: '#2F7D32',
  saving: '#2F7D32',
  success: '#2F7D32',
  background: '#F3FAF7',
  text: '#16332D',
  textSecondary: '#46655E',
  textMuted: '#55726B',
  border: '#D6EBE4',
  topbar: '#155A4F',
  inputBg: '#FAFDFC',
  subtleBg: '#E8F5F0',
  overlay: 'rgba(22,51,45,0.45)',
  shadow: '#124A41',
  heroMuted: '#D3F1E8',
};

const ocean: ThemeColors = {
  ...rose,
  primary: '#2463A8',
  primaryDark: '#1A4C85',
  primarySoft: '#DCEAFA',
  secondary: '#7FB2E5',
  // Biru kebutuhan/tabungan digeser ke indigo supaya beda dari biru tema
  need: '#5B55C4',
  savings: '#5B55C4',
  background: '#F3F7FC',
  text: '#142B45',
  textSecondary: '#475E78',
  textMuted: '#576E87',
  border: '#D8E5F3',
  topbar: '#1A4C85',
  inputBg: '#FAFCFF',
  subtleBg: '#E8F0FA',
  overlay: 'rgba(20,43,69,0.45)',
  shadow: '#143A66',
  heroMuted: '#D6E7FB',
};

const honey: ThemeColors = {
  ...rose,
  primary: '#9A5A0E',
  primaryDark: '#7A4609',
  primarySoft: '#FBEBD3',
  secondary: '#E7B568',
  // Oranye utang/keinginan digeser ke merah bata supaya beda dari amber tema
  debt: '#B5482A',
  want: '#B5482A',
  warning: '#B5482A',
  background: '#FDF8F0',
  text: '#3A2A14',
  textSecondary: '#6B5536',
  textMuted: '#836B4B',
  border: '#F1E3CC',
  topbar: '#7A4609',
  inputBg: '#FFFDF9',
  subtleBg: '#FAF0E0',
  overlay: 'rgba(58,42,20,0.45)',
  shadow: '#6A3D08',
  heroMuted: '#FBE7C8',
};

const slate: ThemeColors = {
  ...rose,
  primary: '#3F5573',
  primaryDark: '#2C3E57',
  primarySoft: '#E2E8F0',
  secondary: '#94A6BE',
  background: '#F5F7FA',
  text: '#1E2633',
  textSecondary: '#4F5B6B',
  textMuted: '#5F6C7E',
  border: '#E0E5EC',
  topbar: '#2C3E57',
  inputBg: '#FBFCFD',
  subtleBg: '#EDF0F5',
  overlay: 'rgba(30,38,51,0.45)',
  shadow: '#1E2A3B',
  heroMuted: '#DCE4EF',
};

export const PALETTES = {
  rose: { label: 'Blush & Rose', description: 'Pink lembut, manis', colors: rose as ThemeColors },
  peach: { label: 'Peach & Coral', description: 'Hangat dan ceria', colors: peach },
  lilac: { label: 'Lilac', description: 'Ungu pastel, kalem', colors: lilac },
  berry: { label: 'Berry', description: 'Magenta pekat, berani', colors: berry },
  mint: { label: 'Mint', description: 'Hijau teal, segar', colors: mint },
  ocean: { label: 'Ocean', description: 'Biru tenang, rapi', colors: ocean },
  honey: { label: 'Honey', description: 'Amber hangat, earthy', colors: honey },
  slate: { label: 'Slate', description: 'Abu kebiruan, netral', colors: slate },
} as const;

export type ThemeId = keyof typeof PALETTES;
export const DEFAULT_THEME_ID: ThemeId = 'rose';
