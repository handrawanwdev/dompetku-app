import Realm from 'realm';
import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { AccountModel } from '../models/AccountModel';
import { TransferModel } from '../models/TransferModel';
import { formatCurrency } from '../utils/currency';
import { LOAN_CATEGORY, loanRef } from '../utils/journal';

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
// - pindah saldo ke kantong tabungan ikut jadi tabungan, pindah keluar dari
//   kantong tabungan mengurangi tabungan (saldo total tetap)
// Saldo total = bisa dipakai + tabungan.

/**
 * Bersih pindah saldo masuk ke kantong tabungan dari kantong harian (atau dari
 * "belum masuk kantong"), dikurangi yang dipindah keluar. Antar kantong tabungan = 0.
 */
export function getSavingsTransferNet(realm: Realm): number {
  const savingsIds = new Set(
    realm.objects(AccountModel).filtered('isSavings == true').map((a) => a._id.toHexString()),
  );
  if (savingsIds.size === 0) return 0;
  let net = 0;
  for (const t of realm.objects(TransferModel)) {
    const toSavings = savingsIds.has(t.toId);
    const fromSavings = savingsIds.has(t.fromId);
    if (toSavings && !fromSavings) net += t.amount;
    else if (fromSavings && !toSavings) net -= t.amount;
  }
  return net;
}

/** Bagian saldo yang bebas dipakai. */
export function getSpendableBalance(realm: Realm, transferNet = getSavingsTransferNet(realm)): number {
  const totalIn = realm.objects(IncomeModel).sum('allocationCash') ?? 0;
  const totalOut = realm.objects(ExpenseModel).filtered('source == "cash"').sum('amount') ?? 0;
  return totalIn - totalOut - transferNet;
}

/** Bagian saldo yang disisihkan sebagai tabungan. */
export function getSavingsBalance(realm: Realm, transferNet = getSavingsTransferNet(realm)): number {
  const saved = realm.objects(ExpenseModel).filtered('kind == "saving" AND source != "savings"').sum('amount') ?? 0;
  const used = realm.objects(ExpenseModel).filtered('source == "savings"').sum('amount') ?? 0;
  return saved - used + transferNet;
}

/**
 * Uang yang dicatat sebagai Investasi tapi tidak terhubung ke data di halaman
 * Investasi/Aset. Dihitung sesuai modal supaya tetap masuk kekayaan bersih.
 */
export function getUntrackedInvestment(realm: Realm): number {
  return realm.objects(ExpenseModel).filtered('kind == "invest" AND assetRef == "" AND isInternal == false').sum('amount') ?? 0;
}

export function getBalances(realm: Realm) {
  const net = getSavingsTransferNet(realm);
  const spendable = getSpendableBalance(realm, net);
  const savings = getSavingsBalance(realm, net);
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
  /** 'investment:<id>' / 'asset:<id>' — supaya ikut terhapus bersama datanya. */
  ref: string;
}): void {
  const { amount, profit, assetName, date, ref } = params;
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
    ref,
    createdAt: new Date(),
  });
}

/**
 * Hapus semua transaksi otomatis milik satu investasi/aset (pembelian + hasil jual),
 * supaya saldo tetap konsisten saat datanya dihapus. Must run inside realm.write().
 */
export function deleteLinkedTransactions(realm: Realm, ref: string) {
  realm.delete(realm.objects(ExpenseModel).filtered('assetRef == $0', ref));
  realm.delete(realm.objects(IncomeModel).filtered('ref == $0', ref));
}

/** Uang pinjaman yang masuk ke kantong untuk satu utang. */
export function getLoanIncome(realm: Realm, debtId: string): IncomeModel | undefined {
  return realm.objects(IncomeModel).filtered('ref == $0', loanRef(debtId))[0];
}

/**
 * Jaga satu pemasukan "Pinjaman masuk" untuk utang yang uangnya diterima tunai/transfer.
 * `data` null = hapus. Must run inside realm.write().
 */
export function syncLoanIncome(
  realm: Realm,
  debtId: string,
  data: { amount: number; accountId: string; date: string; note: string } | null,
) {
  const row = getLoanIncome(realm, debtId);
  if (!data) {
    if (row) realm.delete(row);
    return;
  }
  if (row) {
    row.amount = data.amount;
    row.allocationCash = data.amount;
    row.accountId = data.accountId;
    row.note = data.note;
  } else {
    realm.create(IncomeModel, {
      _id: new Realm.BSON.ObjectId(),
      category: LOAN_CATEGORY,
      amount: data.amount,
      allocationCash: data.amount,
      date: data.date,
      note: data.note,
      type: 'active',
      accountId: data.accountId,
      ref: loanRef(debtId),
      createdAt: new Date(),
    });
  }
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
