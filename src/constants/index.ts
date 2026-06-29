import { InvestmentType, AssetCategory } from '../types';

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

export const DEFAULT_EXPENSE_CATEGORIES: { name: string; emoji: string }[] = [
  { name: 'Makan & Minum', emoji: '🍜' },
  { name: 'Transportasi', emoji: '🚗' },
  { name: 'Belanja', emoji: '🛍️' },
  { name: 'Tagihan', emoji: '📄' },
  { name: 'Kesehatan', emoji: '🏥' },
  { name: 'Hiburan', emoji: '🎬' },
  { name: 'Pendidikan', emoji: '📚' },
  { name: 'Rumah', emoji: '🏠' },
  { name: 'Komunikasi', emoji: '📱' },
  { name: 'Lainnya', emoji: '💸' },
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
