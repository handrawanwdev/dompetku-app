import Realm from 'realm';
import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { AccountModel } from '../models/AccountModel';
import { formatCurrency } from '../utils/currency';

/** Kantong utama untuk transaksi otomatis. '' kalau belum punya kantong. */
export function mainAccountId(realm: Realm): string {
  const all = realm.objects(AccountModel).sorted('createdAt');
  const main = all.filtered('isMain == true')[0] ?? all[0];
  return main ? main._id.toHexString() : '';
}

// Satu saldo, dua bagian:
// - bisa dipakai = semua pemasukan − uang keluar yang diambil dari saldo
//   (termasuk yang disisihkan ke Tabungan)
// - tabungan     = uang yang disisihkan − yang dibayar pakai tabungan
// Saldo total = bisa dipakai + tabungan.

/** Bagian saldo yang bebas dipakai. */
export function getSpendableBalance(realm: Realm): number {
  const totalIn = realm.objects(IncomeModel).sum('allocationCash') ?? 0;
  const totalOut = realm.objects(ExpenseModel).filtered('source == "cash"').sum('amount') ?? 0;
  return totalIn - totalOut;
}

/** Bagian saldo yang disisihkan sebagai tabungan. */
export function getSavingsBalance(realm: Realm): number {
  const saved = realm.objects(ExpenseModel).filtered('kind == "saving" AND source != "savings"').sum('amount') ?? 0;
  const used = realm.objects(ExpenseModel).filtered('source == "savings"').sum('amount') ?? 0;
  return saved - used;
}

/**
 * Uang yang dicatat sebagai Investasi tapi tidak terhubung ke data di halaman
 * Investasi/Aset. Dihitung sesuai modal supaya tetap masuk kekayaan bersih.
 */
export function getUntrackedInvestment(realm: Realm): number {
  return realm.objects(ExpenseModel).filtered('kind == "invest" AND assetRef == "" AND isInternal == false').sum('amount') ?? 0;
}

export function getBalances(realm: Realm) {
  const spendable = getSpendableBalance(realm);
  const savings = getSavingsBalance(realm);
  return { spendable, savings, total: spendable + savings };
}

/**
 * Hasil jual investasi/aset masuk ke saldo sebagai pemasukan.
 * Must run inside realm.write().
 */
export function routeSaleProceeds(realm: Realm, params: {
  amount: number;
  profit: number;
  assetName: string;
  date: string;
}): void {
  const { amount, profit, assetName, date } = params;
  const profitNote = profit >= 0
    ? `profit +${formatCurrency(profit)}`
    : `rugi ${formatCurrency(Math.abs(profit))}`;

  realm.create(IncomeModel, {
    _id: new Realm.BSON.ObjectId(),
    amount,
    category: 'Hasil Investasi',
    date,
    note: `Jual ${assetName} · ${profitNote}`,
    allocationDebt: 0,
    allocationSavings: 0,
    allocationCash: amount,
    allocationDebtId: '',
    allocationSavingId: '',
    type: 'active',
    accountId: mainAccountId(realm),
    createdAt: new Date(),
  });
}

/** Kategori transaksi untuk tiap tipe investasi. */
export const INVESTMENT_CATEGORY: Record<string, string> = {
  stock: 'Saham',
  mutual_fund: 'Reksa Dana',
  deposito: 'Deposito',
  bond: 'Obligasi',
  gold: 'Emas',
  property: 'Properti',
  crypto: 'Kripto',
};

/**
 * Jaga satu transaksi "Investasi" untuk pembelian investasi/aset, supaya
 * uang yang dipakai membeli ikut tercatat di riwayat dan saldo.
 * `data` null = hapus transaksinya. Must run inside realm.write().
 */
export function syncPurchaseExpense(
  realm: Realm,
  ref: string,
  data: { amount: number; date: string; category: string; note: string } | null,
  createIfMissing: boolean,
) {
  const linked = realm.objects(ExpenseModel).filtered('assetRef == $0', ref);
  if (!data) {
    realm.delete(linked);
    return;
  }
  const row = linked[0];
  if (row) {
    row.amount = data.amount;
    row.date = data.date;
    row.category = data.category;
    row.note = data.note;
  } else if (createIfMissing) {
    realm.create(ExpenseModel, {
      _id: new Realm.BSON.ObjectId(),
      kind: 'invest',
      source: 'cash',
      assetRef: ref,
      accountId: mainAccountId(realm),
      createdAt: new Date(),
      ...data,
    });
  }
}
