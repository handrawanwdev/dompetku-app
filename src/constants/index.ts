import { InvestmentType, AssetCategory } from '../types';
import type { SpendKind } from '../utils/budget';

// ─── Default Income Categories ────────────────────────────────────────────────

export const DEFAULT_INCOME_CATEGORIES: { name: string; emoji: string }[] = [
  { name: 'Gaji', emoji: '💼' },
  { name: 'Freelance', emoji: '💻' },
  { name: 'Bonus', emoji: '🎁' },
  { name: 'Investasi', emoji: '📈' },
  { name: 'Bisnis', emoji: '🏪' },
  { name: 'Lainnya', emoji: '💰' },
];

// ─── Default Expense Categories ───────────────────────────────────────────────

// Tiap kategori pengeluaran punya jenis; transaksi otomatis ikut jenis kategorinya.
export const DEFAULT_EXPENSE_CATEGORIES: { name: string; emoji: string; kind: SpendKind }[] = [
  { name: 'Makan & Minum', emoji: '🍜', kind: 'need' },
  { name: 'Transportasi', emoji: '🚗', kind: 'need' },
  { name: 'Tagihan', emoji: '💡', kind: 'need' },
  { name: 'Internet & Pulsa', emoji: '📶', kind: 'need' },
  { name: 'Rumah', emoji: '🏠', kind: 'need' },
  { name: 'Kesehatan', emoji: '🏥', kind: 'need' },
  { name: 'Pendidikan', emoji: '📚', kind: 'need' },
  { name: 'Lainnya', emoji: '💸', kind: 'need' },
  { name: 'Cicilan', emoji: '🏦', kind: 'obligation' },
  { name: 'Kartu Kredit', emoji: '💳', kind: 'obligation' },
  { name: 'Utang', emoji: '🤝', kind: 'obligation' },
  { name: 'Jajan & Kopi', emoji: '☕', kind: 'want' },
  { name: 'Hiburan', emoji: '🎬', kind: 'want' },
  { name: 'Belanja', emoji: '🛍️', kind: 'want' },
  { name: 'Liburan', emoji: '✈️', kind: 'want' },
  { name: 'Tabungan', emoji: '🐷', kind: 'saving' },
  { name: 'Dana Darurat', emoji: '🆘', kind: 'saving' },
  { name: 'Reksa Dana', emoji: '📈', kind: 'invest' },
  { name: 'Saham', emoji: '📊', kind: 'invest' },
  { name: 'Emas', emoji: '🥇', kind: 'invest' },
  { name: 'Deposito', emoji: '🏦', kind: 'invest' },
  { name: 'Obligasi', emoji: '📜', kind: 'invest' },
  { name: 'Kripto', emoji: '🪙', kind: 'invest' },
  { name: 'Properti', emoji: '🏘️', kind: 'invest' },
  { name: 'Aset', emoji: '💎', kind: 'invest' },
  { name: 'Investasi lain', emoji: '🌱', kind: 'invest' },
];

// ─── Investment Types ─────────────────────────────────────────────────────────

export const INVESTMENT_TYPES: {
  value: InvestmentType;
  label: string;
  emoji: string;
}[] = [
  { value: 'stock', label: 'Saham', emoji: '📊' },
  { value: 'crypto', label: 'Kripto', emoji: '🪙' },
  { value: 'gold', label: 'Emas', emoji: '🥇' },
  { value: 'mutual_fund', label: 'Reksa Dana', emoji: '📈' },
  { value: 'bond', label: 'Obligasi', emoji: '📜' },
  { value: 'property', label: 'Properti', emoji: '🏘️' },
];

// ─── Asset Categories ─────────────────────────────────────────────────────────

export const ASSET_CATEGORIES: {
  value: AssetCategory;
  label: string;
  emoji: string;
}[] = [
  { value: 'laptop', label: 'Laptop', emoji: '💻' },
  { value: 'phone', label: 'HP', emoji: '📱' },
  { value: 'vehicle', label: 'Kendaraan', emoji: '🚗' },
  { value: 'house', label: 'Rumah', emoji: '🏠' },
  { value: 'electronics', label: 'Elektronik', emoji: '🔌' },
  { value: 'furniture', label: 'Furnitur', emoji: '🛋️' },
  { value: 'other', label: 'Lainnya', emoji: '📦' },
];

// ─── Emoji Pickers ────────────────────────────────────────────────────────────

export const SAVING_EMOJIS: string[] = [
  '💰', '🏠', '✈️', '💍', '🚗', '📚', '🏥', '🎯', '💎', '🌟',
];

export const GOAL_EMOJIS: string[] = [
  '🎯', '🏠', '✈️', '💍', '🚗', '📚', '💻', '🌟', '💎', '🏆',
];
