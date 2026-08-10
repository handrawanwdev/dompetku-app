import Realm, { ObjectSchema } from 'realm';

export class ExpenseModel extends Realm.Object<ExpenseModel> {
  _id!: Realm.BSON.ObjectId;
  date!: string;
  category!: string;
  amount!: number;
  source!: string;
  /** SavingModel._id (hex) that funded this expense, when source === 'savings' */
  savingId!: string;
  note!: string;
  /** True for synthetic rows (e.g. Setor Tabungan) that just move money between
   * pockets rather than represent real spending — excluded from ratio calcs. */
  isInternal!: boolean;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Expense',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date: 'string',
      category: 'string',
      amount: 'double',
      source: { type: 'string', default: 'cash' },
      savingId: { type: 'string', default: '' },
      note: { type: 'string', default: '' },
      isInternal: { type: 'bool', default: false },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
