import Realm from 'realm';
import { SavingModel } from '../models/SavingModel';
import { SavingHistoryModel } from '../models/SavingHistoryModel';
import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { today } from '../utils/date';
import { formatCurrency } from '../utils/currency';

/** Kas Bebas — derived from all Income.allocationCash minus all cash-sourced Expense. */
export function getKasBebasBalance(realm: Realm): number {
  const totalCashIncome = realm.objects(IncomeModel).sum('allocationCash') ?? 0;
  const totalCashExpense = realm.objects(ExpenseModel).filtered('source == "cash"').sum('amount') ?? 0;
  return totalCashIncome - totalCashExpense;
}

export type DebtPaymentFundingResult = { ok: true } | { ok: false; error: string };

/**
 * Deducts Kas Bebas (via a synthetic 'Bayar Cicilan' Expense) or a savings pos
 * balance when a debt installment is paid. Must run inside realm.write().
 */
export function applyDebtPaymentFunding(realm: Realm, params: {
  source: string;
  savingId?: string;
  amount: number;
  lender: string;
  date: string;
}): DebtPaymentFundingResult {
  const { source, savingId, amount, lender, date } = params;

  if (source === 'savings') {
    if (!savingId) return { ok: false, error: 'Pilih pos tabungan sumber dana' };
    const saving = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(savingId));
    if (!saving) return { ok: false, error: 'Pos tabungan tidak ditemukan' };
    if (saving.balance < amount) return { ok: false, error: 'Saldo tabungan tidak mencukupi' };

    saving.balance -= amount;
    realm.create(SavingHistoryModel, {
      _id: new Realm.BSON.ObjectId(),
      savingId,
      type: 'withdraw',
      amount,
      date,
      note: `Bayar cicilan: ${lender}`,
      createdAt: new Date(),
    });
    return { ok: true };
  }

  const available = getKasBebasBalance(realm);
  if (amount > available) return { ok: false, error: 'Kas Bebas tidak mencukupi' };

  realm.create(ExpenseModel, {
    _id: new Realm.BSON.ObjectId(),
    category: 'Bayar Cicilan',
    source: 'cash',
    amount,
    date,
    note: `Cicilan ${lender}`,
    createdAt: new Date(),
  });
  return { ok: true };
}

export type SavingCashMoveResult = { ok: true } | { ok: false; error: string };

/**
 * Setor tabungan wajib dari Kas Bebas: deducts cash (via a synthetic 'Setor
 * Tabungan' Expense) and credits the savings pos. Must run inside realm.write().
 */
export function depositToSavingFromCash(realm: Realm, params: {
  savingId: string;
  amount: number;
  date: string;
  note?: string;
}): SavingCashMoveResult {
  const { savingId, amount, date, note } = params;
  const saving = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(savingId));
  if (!saving) return { ok: false, error: 'Pos tabungan tidak ditemukan' };

  const available = getKasBebasBalance(realm);
  if (amount > available) return { ok: false, error: 'Kas Bebas tidak mencukupi' };

  saving.balance += amount;
  realm.create(SavingHistoryModel, {
    _id: new Realm.BSON.ObjectId(),
    savingId,
    type: 'deposit',
    amount,
    date,
    note: note ?? '',
    createdAt: new Date(),
  });
  realm.create(ExpenseModel, {
    _id: new Realm.BSON.ObjectId(),
    category: 'Setor Tabungan',
    source: 'cash',
    amount,
    date,
    note: `Setor ke ${saving.name}${note ? ': ' + note : ''}`,
    createdAt: new Date(),
  });
  return { ok: true };
}

/**
 * Tarik tabungan wajib balik ke Kas Bebas: debits the savings pos and credits
 * cash (via a synthetic 'Tarik Tabungan' Income). Must run inside realm.write().
 */
export function withdrawFromSavingToCash(realm: Realm, params: {
  savingId: string;
  amount: number;
  date: string;
  note?: string;
}): SavingCashMoveResult {
  const { savingId, amount, date, note } = params;
  const saving = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(savingId));
  if (!saving) return { ok: false, error: 'Pos tabungan tidak ditemukan' };
  if (amount > saving.balance) return { ok: false, error: 'Saldo tabungan tidak mencukupi' };

  saving.balance -= amount;
  realm.create(SavingHistoryModel, {
    _id: new Realm.BSON.ObjectId(),
    savingId,
    type: 'withdraw',
    amount,
    date,
    note: note ?? '',
    createdAt: new Date(),
  });
  realm.create(IncomeModel, {
    _id: new Realm.BSON.ObjectId(),
    category: 'Tarik Tabungan',
    amount,
    date,
    note: `Tarik dari ${saving.name}${note ? ': ' + note : ''}`,
    allocationDebt: 0,
    allocationSavings: 0,
    allocationCash: amount,
    allocationDebtId: '',
    allocationSavingId: '',
    createdAt: new Date(),
  });
  return { ok: true };
}

export type SavingTransferResult = { ok: true } | { ok: false; error: string };

/**
 * Moves balance directly between two savings pos (no Kas Bebas involved).
 * Must run inside realm.write().
 */
export function transferBetweenSavings(realm: Realm, params: {
  fromSavingId: string;
  toSavingId: string;
  amount: number;
  date: string;
  note?: string;
}): SavingTransferResult {
  const { fromSavingId, toSavingId, amount, date, note } = params;
  if (fromSavingId === toSavingId) return { ok: false, error: 'Tabungan asal dan tujuan tidak boleh sama' };

  const from = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(fromSavingId));
  if (!from) return { ok: false, error: 'Tabungan asal tidak ditemukan' };
  const to = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(toSavingId));
  if (!to) return { ok: false, error: 'Tabungan tujuan tidak ditemukan' };
  if (amount > from.balance) return { ok: false, error: 'Saldo tabungan tidak mencukupi untuk transfer' };

  from.balance -= amount;
  realm.create(SavingHistoryModel, {
    _id: new Realm.BSON.ObjectId(),
    savingId: fromSavingId,
    type: 'transfer',
    amount,
    date,
    note: `→ ${to.name}${note ? ': ' + note : ''}`,
    createdAt: new Date(),
  });

  to.balance += amount;
  realm.create(SavingHistoryModel, {
    _id: new Realm.BSON.ObjectId(),
    savingId: toSavingId,
    type: 'transfer',
    amount,
    date,
    note: `← ${from.name}${note ? ': ' + note : ''}`,
    createdAt: new Date(),
  });
  return { ok: true };
}

export type SaleProceedsResult = { ok: true } | { ok: false; error: string };

/**
 * Routes lump-sum sale proceeds (investment or physical asset) either to a
 * chosen savings pos or to cash (logged as an "Hasil Investasi" Income row).
 * Must run inside realm.write().
 */
export function routeSaleProceeds(realm: Realm, params: {
  destination: 'cash' | 'savings';
  savingId?: string;
  amount: number;
  profit: number;
  assetName: string;
  date: string;
}): SaleProceedsResult {
  const { destination, savingId, amount, profit, assetName, date } = params;
  const profitNote = profit >= 0
    ? `profit +${formatCurrency(profit)}`
    : `rugi ${formatCurrency(Math.abs(profit))}`;

  if (destination === 'savings') {
    if (!savingId) return { ok: false, error: 'Pilih pos tabungan tujuan' };
    const saving = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(savingId));
    if (!saving) return { ok: false, error: 'Pos tabungan tidak ditemukan' };

    saving.balance += amount;
    realm.create(SavingHistoryModel, {
      _id: new Realm.BSON.ObjectId(),
      savingId,
      type: 'deposit',
      amount,
      date,
      note: `Hasil jual ${assetName} (${profitNote})`,
      createdAt: new Date(),
    });
    return { ok: true };
  }

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
    createdAt: new Date(),
  });
  return { ok: true };
}
