import Realm, { ObjectSchema } from 'realm';

/**
 * - 'tanpa_tenor': no due date at all, paid whenever (e.g. pinjam teman/keluarga). Uses totalAmount only.
 * - 'berjangka': owed in full by one fixed maturity date (e.g. pinjaman bank/koperasi). Uses totalAmount + dueDateFull.
 * - 'cicilan': fixed total paid off via a fixed monthly installment over a fixed number of months (e.g. KPR, motor). Uses totalAmount + monthlyInstallment + remainingMonth + dueDate.
 * - 'revolving': a reusable credit line (e.g. kartu kredit, paylater). totalAmount is the credit limit, currentBalance is what's currently owed against it; paying it down frees up the limit again. Uses dueDate.
 * - 'tagihan_rutin': a recurring monthly bill with no fixed total and a variable amount each cycle (e.g. listrik, internet, BPJS). Uses dueDate; monthlyInstallment is only an optional estimate.
 */
export type DebtType = 'tanpa_tenor' | 'berjangka' | 'cicilan' | 'revolving' | 'tagihan_rutin';

export class DebtModel extends Realm.Object<DebtModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  lender!: string;
  debtType!: DebtType;
  /** Meaning depends on debtType: amount owed (tanpa_tenor/berjangka/cicilan) or credit limit (revolving); unused (0) for tagihan_rutin. */
  totalAmount!: number;
  /** Fixed installment (cicilan) or an optional estimate for kewajiban/target calc (tagihan_rutin, revolving); unused (0) for tanpa_tenor/berjangka. */
  monthlyInstallment!: number;
  /** cicilan only — months left in the fixed schedule; 0 for every other type. */
  remainingMonth!: number;
  /** Day of month (1–31) the recurring due date falls on — cicilan/revolving/tagihan_rutin only; 0 for tanpa_tenor/berjangka. */
  dueDate!: number;
  /** berjangka only — the single fixed maturity/due date (YYYY-MM-DD); '' for every other type. */
  dueDateFull!: string;
  /** revolving only — current amount owed against totalAmount's credit limit, rises on usage and falls on payment; 0 for every other type. */
  currentBalance!: number;
  startDate!: string;
  note!: string;
  isActive!: boolean;
  /** Extra rupiah paid ad-hoc (e.g. allocated from income) on top of scheduled installments */
  extraPaid!: number;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Debt',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      lender: 'string',
      debtType: { type: 'string', default: 'cicilan' },
      totalAmount: 'double',
      monthlyInstallment: 'double',
      remainingMonth: 'int',
      dueDate: 'int',
      dueDateFull: { type: 'string', default: '' },
      currentBalance: { type: 'double', default: 0 },
      startDate: 'string',
      note: { type: 'string', default: '' },
      isActive: { type: 'bool', default: true },
      extraPaid: { type: 'double', default: 0 },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
