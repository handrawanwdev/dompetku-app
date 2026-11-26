import Realm from 'realm';
import type { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { AccountModel } from '../models/AccountModel';
import { TransferModel } from '../models/TransferModel';
import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { GoalModel } from '../models/GoalModel';
import { getAccountBalances, getBalances, mainAccountId } from './AllocationService';
import { today } from '../utils/date';
import { OPENING_CATEGORY } from '../utils/journal';

// Kantong = tempat uang berada (BCA, Blu, GoPay, tunai).
// Saldo kantong = pemasukan ke kantong − uang keluar dari kantong ± pindah saldo.
// "Sisihkan ke Tabungan" tanpa kantong tujuan cuma menandai uang, uangnya tetap di kantong yang sama.
// Saldo total & saldo kantong dihitung di AllocationService; selisihnya = "belum masuk kantong".

export type AccountType = 'bank' | 'ewallet' | 'cash' | 'other';

export const ACCOUNT_TYPES: Record<AccountType, { label: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
  bank: { label: 'Bank', icon: 'account-balance', color: COLORS.need },
  ewallet: { label: 'E-wallet', icon: 'smartphone', color: COLORS.invest },
  cash: { label: 'Tunai', icon: 'payments', color: COLORS.saving },
  other: { label: 'Lainnya', icon: 'account-balance-wallet', color: COLORS.primary },
};

/** Nama kantong untuk teks sebaris: "BCA (Rekening gaji)", atau "BCA" kalau tanpa keterangan. */
export function accountLabel(a: { name: string; subName?: string }): string {
  return a.subName ? `${a.name} (${a.subName})` : a.name;
}

export function accountTypeMeta(type: string) {
  return ACCOUNT_TYPES[(type in ACCOUNT_TYPES ? type : 'other') as AccountType];
}

/** Nama cepat saat menambah kantong. */
export const ACCOUNT_PRESETS: { name: string; type: AccountType }[] = [
  { name: 'BCA', type: 'bank' },
  { name: 'Mandiri', type: 'bank' },
  { name: 'BRI', type: 'bank' },
  { name: 'BNI', type: 'bank' },
  { name: 'Blu', type: 'bank' },
  { name: 'Jago', type: 'bank' },
  { name: 'SeaBank', type: 'bank' },
  { name: 'GoPay', type: 'ewallet' },
  { name: 'OVO', type: 'ewallet' },
  { name: 'DANA', type: 'ewallet' },
  { name: 'ShopeePay', type: 'ewallet' },
  { name: 'Tunai', type: 'cash' },
];

export { getAccountBalances };

/** Saldo total yang belum tercatat ada di kantong mana. */
export function getUnassigned(realm: Realm, balances = getAccountBalances(realm)): number {
  let inPockets = 0;
  balances.forEach((v) => (inPockets += v));
  return getBalances(realm, balances).total - inPockets;
}

/** Kantong utama, atau kantong pertama kalau belum ada yang utama. '' kalau belum punya kantong. */
export const getMainAccountId = mainAccountId;

/** Jadikan satu kantong sebagai utama. Must run inside realm.write(). */
export function setMainAccount(realm: Realm, id: string) {
  for (const a of realm.objects(AccountModel)) a.isMain = a._id.toHexString() === id;
}

/**
 * Samakan saldo kantong dengan saldo aslinya. Must run inside realm.write().
 * Naik: ambil dulu dari saldo yang belum masuk kantong, sisanya dicatat sebagai
 * penyesuaian (menambah saldo total). Turun: kelebihannya kembali ke "belum masuk kantong".
 * isNew = kantong baru: sisanya dicatat sebagai pemasukan "Saldo awal", bukan penyesuaian.
 */
export function setAccountBalance(realm: Realm, accountId: string, target: number, isNew = false) {
  const balances = getAccountBalances(realm);
  const diff = target - (balances.get(accountId) ?? 0);
  if (Math.abs(diff) < 1) return;

  const base = { date: today(), createdAt: new Date() };
  if (diff > 0) {
    const take = Math.min(diff, Math.max(getUnassigned(realm, balances), 0));
    if (take >= 1) {
      realm.create(TransferModel, { ...base, fromId: '', toId: accountId, amount: take, note: 'Saldo awal' });
    }
    const rest = diff - take;
    if (rest >= 1) {
      if (isNew) addOpeningBalance(realm, accountId, rest);
      else addAdjustment(realm, accountId, rest);
    }
  } else {
    realm.create(TransferModel, { ...base, fromId: accountId, toId: '', amount: -diff, note: 'Penyesuaian saldo' });
  }
}

/** Pemasukan "Saldo awal" untuk kantong baru. Must run inside realm.write(). */
export function addOpeningBalance(realm: Realm, accountId: string, amount: number) {
  realm.create(IncomeModel, {
    _id: new Realm.BSON.ObjectId(),
    date: today(),
    category: OPENING_CATEGORY,
    amount,
    allocationCash: amount,
    note: '',
    isInternal: false,
    type: 'active',
    accountId,
    createdAt: new Date(),
  });
}

/**
 * Koreksi saldo total (bukan pemasukan/uang keluar sungguhan, tidak masuk rekap).
 * amount positif = tambah, negatif = kurangi. Must run inside realm.write().
 */
export function addAdjustment(realm: Realm, accountId: string, amount: number) {
  const base = { _id: new Realm.BSON.ObjectId(), date: today(), note: 'Penyesuaian saldo', isInternal: true, accountId, createdAt: new Date() };
  if (amount > 0) {
    realm.create(IncomeModel, { ...base, category: 'Penyesuaian saldo', amount, allocationCash: amount, type: 'active' });
  } else if (amount < 0) {
    realm.create(ExpenseModel, { ...base, category: 'Penyesuaian saldo', kind: 'need', source: 'cash', amount: -amount });
  }
}

/** Hapus kantong. Transaksinya tetap ada, saldonya jadi "belum masuk kantong". Must run inside realm.write(). */
export function deleteAccount(realm: Realm, account: AccountModel) {
  const id = account._id.toHexString();
  for (const i of realm.objects(IncomeModel).filtered('accountId == $0', id)) i.accountId = '';
  for (const e of realm.objects(ExpenseModel).filtered('accountId == $0', id)) e.accountId = '';
  for (const e of realm.objects(ExpenseModel).filtered('toAccountId == $0', id)) e.toAccountId = '';
  for (const g of realm.objects(GoalModel).filtered('accountId == $0', id)) g.accountId = '';
  // Saldo awal/penyesuaian kantong ini tidak berarti lagi. Pindah saldo antar kantong tetap
  // disimpan dengan id aslinya supaya riwayat tetap terbaca "kantong terhapus → GoPay",
  // bukan berubah jadi "Saldo awal". Id yang sudah tidak ada tidak dihitung di saldo kantong.
  realm.delete(realm.objects(TransferModel).filtered('(fromId == $0 AND toId == "") OR (toId == $0 AND fromId == "")', id));
  const wasMain = account.isMain;
  realm.delete(account);
  if (wasMain) {
    const next = realm.objects(AccountModel).sorted('createdAt')[0];
    if (next) next.isMain = true;
  }
}
