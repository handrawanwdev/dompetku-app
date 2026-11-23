import Realm, { ObjectSchema } from 'realm';

export class ExpenseModel extends Realm.Object<ExpenseModel> {
  _id!: Realm.BSON.ObjectId;
  date!: string;
  /** Label tampilan. Baris baru = label jenis; baris sistem mis. 'Bayar Cicilan'. */
  category!: string;
  /** 'need' | 'want' | 'saving' (lihat utils/budget) */
  kind!: string;
  amount!: number;
  /** 'cash' = dari saldo bisa dipakai, 'savings' = dibayar pakai tabungan,
   * 'adjust' = koreksi saldo tabungan (tidak menyentuh saldo bisa dipakai). */
  source!: string;
  /** Legacy, tidak dipakai lagi. */
  savingId!: string;
  /** DebtModel._id (hex) kalau transaksi ini pembayaran kewajiban. */
  debtId!: string;
  /** 'investment:<id>' / 'asset:<id>' kalau transaksi ini pembelian investasi/aset yang dicatat. */
  assetRef!: string;
  /** AccountModel._id (hex) kantong sumber. '' = belum ditentukan. */
  accountId!: string;
  /** Khusus Sisihkan ke Tabungan: kantong tabungan tujuan. '' = uang tetap di kantong asal. */
  toAccountId!: string;
  note!: string;
  /** True for system rows (koreksi saldo tabungan) — hidden from lists & ratio calcs. */
  isInternal!: boolean;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Expense',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date: 'string',
      category: 'string',
      kind: { type: 'string', default: 'need' },
      amount: 'double',
      source: { type: 'string', default: 'cash' },
      savingId: { type: 'string', default: '' },
      debtId: { type: 'string', default: '' },
      assetRef: { type: 'string', default: '' },
      accountId: { type: 'string', default: '' },
      toAccountId: { type: 'string', default: '' },
      note: { type: 'string', default: '' },
      isInternal: { type: 'bool', default: false },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
