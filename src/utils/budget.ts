import type { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';

/** Setiap uang keluar masuk salah satu dari lima jenis ini, lewat kategorinya. */
export type SpendKind = 'need' | 'obligation' | 'want' | 'saving' | 'invest';

export const SPEND_KINDS: SpendKind[] = ['need', 'obligation', 'want', 'saving', 'invest'];

/** Jenis yang bukan pengeluaran: uangnya tetap milikmu, hanya pindah tempat. */
export const KEPT_KINDS: SpendKind[] = ['saving', 'invest'];

export function isKeptKind(kind: string) {
  return kind === 'saving' || kind === 'invest';
}

/** Target porsi dari pemasukan bulanan (total 100%). */
export const KIND_META: Record<
  SpendKind,
  { label: string; hint: string; icon: keyof typeof MaterialIcons.glyphMap; color: string; target: number }
> = {
  need: { label: 'Kebutuhan', hint: 'Makan, transport, tagihan, internet', icon: 'home', color: COLORS.need, target: 40 },
  obligation: { label: 'Kewajiban', hint: 'Cicilan, kartu kredit, utang', icon: 'receipt-long', color: COLORS.obligation, target: 20 },
  want: { label: 'Keinginan', hint: 'Jajan, hiburan, belanja', icon: 'favorite', color: COLORS.want, target: 15 },
  saving: { label: 'Tabungan', hint: 'Uang yang kamu sisihkan', icon: 'savings', color: COLORS.saving, target: 15 },
  invest: { label: 'Investasi', hint: 'Aset untuk pertumbuhan kekayaan', icon: 'trending-up', color: COLORS.invest, target: 10 },
};

export function isSpendKind(v: unknown): v is SpendKind {
  return v === 'need' || v === 'obligation' || v === 'want' || v === 'saving' || v === 'invest';
}

export function kindMeta(kind: string) {
  return KIND_META[isSpendKind(kind) ? kind : 'need'];
}

const LEGACY_KIND: Record<string, SpendKind> = {
  Hiburan: 'want',
  Belanja: 'want',
  Keinginan: 'want',
  'Setor Tabungan': 'saving',
  Tabungan: 'saving',
  'Bayar Cicilan': 'obligation',
  Cicilan: 'obligation',
  Kewajiban: 'obligation',
  Investasi: 'invest',
};

/** Peta kategori lama ke jenis, dipakai saat migrasi & import backup lama. */
export function kindFromLegacyCategory(category: string): SpendKind {
  return LEGACY_KIND[category] ?? 'need';
}

/** Nama kategori lama yang diganti. */
export const RENAMED_CATEGORIES: Record<string, string> = {
  'Bayar Cicilan': 'Cicilan',
  'Setor Tabungan': 'Tabungan',
  Komunikasi: 'Internet & Pulsa',
};
