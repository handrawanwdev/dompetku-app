import type { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import type { RootNavigation } from './types';

export type MenuId =
  | 'expense'
  | 'income'
  | 'transactions'
  | 'wallet'
  | 'debts'
  | 'investments'
  | 'assets'
  | 'report'
  | 'recurring'
  | 'categories'
  | 'theme'
  | 'parameters'
  | 'data'
  | 'diagnosis';

export interface MenuItem {
  label: string;
  /** Penjelasan singkat, tampil di halaman Atur menu & untuk pembaca layar. */
  hint: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  open: (nav: RootNavigation) => void;
}

/** Semua halaman yang bisa dipasang di menu utama dashboard. */
export const MENU_ITEMS: Record<MenuId, MenuItem> = {
  expense: { label: 'Uang keluar', hint: 'Catat belanja, tagihan, atau cicilan', icon: 'north-east', color: COLORS.expense, open: (n) => n.navigate('ExpenseForm', {}) },
  income: { label: 'Uang masuk', hint: 'Catat gaji atau uang yang kamu terima', icon: 'south-west', color: COLORS.income, open: (n) => n.navigate('IncomeForm', {}) },
  transactions: { label: 'Riwayat', hint: 'Semua catatan masuk dan keluar', icon: 'history', color: COLORS.primary, open: (n) => n.navigate('Tabs', { screen: 'Transaction' }) },
  wallet: { label: 'Dompet', hint: 'Saldo dan tabungan kamu sekarang', icon: 'account-balance-wallet', color: COLORS.primary, open: (n) => n.navigate('Tabs', { screen: 'Wallet' }) },
  debts: { label: 'Cicilan & utang', hint: 'Pantau sisa utang dan jatuh tempo', icon: 'credit-card', color: COLORS.obligation, open: (n) => n.navigate('Debts') },
  investments: { label: 'Investasi', hint: 'Aset untuk pertumbuhan kekayaan', icon: 'trending-up', color: COLORS.invest, open: (n) => n.navigate('Investments') },
  assets: { label: 'Aset', hint: 'Barang berharga dan nilainya sekarang', icon: 'diamond', color: COLORS.asset, open: (n) => n.navigate('Assets') },
  report: { label: 'Rekap', hint: 'Ringkasan per bulan dan per tahun', icon: 'insights', color: COLORS.need, open: (n) => n.navigate('Report') },
  recurring: { label: 'Pemasukan rutin', hint: 'Uang yang masuk otomatis tiap periode', icon: 'event-repeat', color: COLORS.income, open: (n) => n.navigate('Recurring') },
  categories: { label: 'Kategori', hint: 'Atur kategori dan jenisnya', icon: 'category', color: COLORS.want, open: (n) => n.navigate('Categories') },
  theme: { label: 'Tema', hint: 'Ganti warna app', icon: 'palette', color: COLORS.primary, open: (n) => n.navigate('Theme') },
  parameters: { label: 'Batas cicilan', hint: 'Batas aman cicilan dari pemasukan', icon: 'tune', color: COLORS.textSecondary, open: (n) => n.navigate('Parameters') },
  data: { label: 'Cadangkan data', hint: 'Simpan atau pulihkan data dari file', icon: 'save-alt', color: COLORS.saving, open: (n) => n.navigate('Data') },
  diagnosis: { label: 'Cek masalah', hint: 'Lihat catatan error app', icon: 'support', color: COLORS.textSecondary, open: (n) => n.navigate('Diagnosis') },
};

// Ubah ke false untuk menyembunyikan halaman Investasi & Aset. Datanya tetap
// tersimpan dan tetap dihitung di kekayaan bersih.
export const SHOW_INVESTMENT_AND_ASSETS = true;

const HIDDEN: MenuId[] = SHOW_INVESTMENT_AND_ASSETS ? [] : ['investments', 'assets'];

export const ALL_MENU_IDS = (Object.keys(MENU_ITEMS) as MenuId[]).filter((id) => !HIDDEN.includes(id));

export const DEFAULT_MENU: MenuId[] = ['expense', 'income', 'debts', 'investments', 'assets', 'report', 'categories', 'theme'];

/** Buang id yang sudah tidak dikenal (mis. menu lama yang dihapus). */
export function sanitizeMenu(ids: unknown): MenuId[] {
  if (!Array.isArray(ids)) return DEFAULT_MENU;
  return ids.filter((id): id is MenuId => typeof id === 'string' && ALL_MENU_IDS.includes(id as MenuId));
}
