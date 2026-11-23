import Realm, { ObjectSchema } from 'realm';

/**
 * Satu kewajiban (cicilan, kartu kredit, utang ke teman, dst).
 * Sisa = totalAmount − paidBefore − Σ transaksi (Expense) yang terhubung lewat debtId.
 * Pembayaran selalu dicatat sebagai transaksi biasa, jadi riwayatnya satu.
 */
export class DebtModel extends Realm.Object<DebtModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  /** Total yang harus dibayar. */
  totalAmount!: number;
  /** Sudah dibayar sebelum dicatat di app (tanpa transaksi). */
  paidBefore!: number;
  /** Cicilan per bulan; 0 = bayar bebas. */
  monthlyInstallment!: number;
  /** Tanggal jatuh tempo tiap bulan (1–31); 0 = tidak ada. */
  dueDate!: number;
  startDate!: string;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Debt',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      totalAmount: 'double',
      paidBefore: { type: 'double', default: 0 },
      monthlyInstallment: { type: 'double', default: 0 },
      dueDate: { type: 'int', default: 0 },
      startDate: 'string',
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
