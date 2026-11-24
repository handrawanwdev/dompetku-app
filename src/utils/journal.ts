/** Pemasukan saldo awal kantong baru. */
export const OPENING_CATEGORY = 'Saldo awal';
/** Uang pinjaman yang masuk ke kantong saat mencatat utang baru. */
export const LOAN_CATEGORY = 'Pinjaman masuk';

/**
 * Uang masuk yang bukan hasil kerja/usaha. Tetap tercatat dan ikut rekap
 * (Cashflow/Laporan) sebagai kategori sendiri, tapi tidak dihitung di
 * pemasukan bulanan Dashboard supaya tren & rasio tidak melonjak.
 */
export const NON_EARNED_CATEGORIES = [OPENING_CATEGORY, LOAN_CATEGORY];

/** Potongan query Realm: kecualikan NON_EARNED_CATEGORIES. */
export const EXCLUDE_NON_EARNED = NON_EARNED_CATEGORIES.map((c) => `category != "${c}"`).join(' AND ');

/** Ref Income.ref untuk uang pinjaman dari satu utang. */
export const loanRef = (debtId: string) => `debt:${debtId}`;

/**
 * Baris pemasukan yang dikelola fitur lain, jadi tidak dibuka di form pemasukan:
 * koreksi internal, saldo awal (ubah lewat saldo kantong), uang pinjaman (ubah lewat form utang).
 */
export function isLockedIncome(i: { isInternal: boolean; category: string; ref: string }): boolean {
  return i.isInternal || i.category === OPENING_CATEGORY || i.ref.startsWith('debt:');
}
