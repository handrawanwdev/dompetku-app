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

// Satu saldo, dua bagian: bisa dipakai + tabungan.
// - saldo total  = semua pemasukan − uang keluar sungguhan (tidak berubah oleh
//                  Sisihkan ke Tabungan atau pindah saldo)
// - tabungan     = saldo kantong tabungan + uang yang disisihkan tapi masih ada
//                  di kantong harian (atau tanpa kantong)
// - bisa dipakai = saldo total − tabungan
// Dengan begitu angka Tabungan di Dashboard = total grup Tabungan di Dompet.

/** Uang keluar yang benar-benar meninggalkan kantong (bukan sekadar disisihkan). */
const MOVING_EXPENSE = 'accountId != "" AND source != "adjust" AND (kind != "saving" OR source == "savings")';

/** Sisihkan ke Tabungan yang uangnya ditaruh di kantong lain (kantong tabungan). */
const SAVED_TO_POCKET = 'kind == "saving" AND source != "savings" AND source != "adjust" AND toAccountId != ""';

/** Saldo tiap kantong, key = id hex. */
export function getAccountBalances(realm: Realm): Map<string, number> {
  const map = new Map<string, number>();
  for (const a of realm.objects(AccountModel)) map.set(a._id.toHexString(), 0);
  const add = (id: string, v: number) => {
    if (map.has(id)) map.set(id, (map.get(id) ?? 0) + v);
  };
  for (const i of realm.objects(IncomeModel).filtered('accountId != ""')) add(i.accountId, i.allocationCash);
  for (const e of realm.objects(ExpenseModel).filtered(MOVING_EXPENSE)) add(e.accountId, -e.amount);
  // Sisihkan ke kantong tabungan: uang pindah dari kantong asal ke kantong tabungan.
  for (const e of realm.objects(ExpenseModel).filtered(SAVED_TO_POCKET)) {
    add(e.accountId, -e.amount);
    add(e.toAccountId, e.amount);
  }
  for (const t of realm.objects(TransferModel)) {
    add(t.fromId, -t.amount);
    add(t.toId, t.amount);
  }
  return map;
}

function savingsPocketIds(realm: Realm): Set<string> {
  return new Set(realm.objects(AccountModel).filtered('isSavings == true').map((a) => a._id.toHexString()));
}

/**
 * Tabungan yang ditandai lewat Sisihkan ke Tabungan tapi uangnya tidak berada di
 * kantong tabungan (tetap di kantong harian / tanpa kantong), dikurangi yang
 * dipakai ("bayar pakai tabungan") dari luar kantong tabungan.
 */
function getMarkedSavings(realm: Realm, savingsIds: Set<string>): number {
  let v = 0;
  for (const e of realm.objects(ExpenseModel).filtered('kind == "saving" AND source != "savings"')) {
    if (!savingsIds.has(e.toAccountId || e.accountId)) v += e.amount;
  }
  for (const e of realm.objects(ExpenseModel).filtered('source == "savings"')) {
    if (!savingsIds.has(e.accountId)) v -= e.amount;
  }
  return v;
}

export function getBalances(realm: Realm, pocketBalances = getAccountBalances(realm)) {
  const totalIn = realm.objects(IncomeModel).sum('allocationCash') ?? 0;
  const cashOut = realm.objects(ExpenseModel).filtered('source == "cash"').sum('amount') ?? 0;
  const saved = realm.objects(ExpenseModel).filtered('kind == "saving" AND source != "savings"').sum('amount') ?? 0;
  const used = realm.objects(ExpenseModel).filtered('source == "savings"').sum('amount') ?? 0;
  // Sisihkan (source cash) keluar lalu masuk lagi sebagai tabungan: saldo total tetap.
  const total = totalIn - cashOut + saved - used;

  const savingsIds = savingsPocketIds(realm);
  let inSavingsPockets = 0;
  savingsIds.forEach((id) => (inSavingsPockets += pocketBalances.get(id) ?? 0));
  /** Bagian tabungan yang uangnya masih di kantong harian. */
  const markedSavings = getMarkedSavings(realm, savingsIds);
  const savings = inSavingsPockets + markedSavings;

  return { spendable: total - savings, savings, total, markedSavings };
}

/**
 * Uang yang dicatat sebagai Investasi tapi tidak terhubung ke data di halaman
 * Investasi/Aset. Dihitung sesuai modal supaya tetap masuk kekayaan bersih.
 */
export function getUntrackedInvestment(realm: Realm): number {
  return realm.objects(ExpenseModel).filtered('kind == "invest" AND assetRef == "" AND isInternal == false').sum('amount') ?? 0;
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
