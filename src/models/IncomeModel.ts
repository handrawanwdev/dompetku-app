import Realm, { ObjectSchema } from 'realm';

export class IncomeModel extends Realm.Object<IncomeModel> {
  _id!: Realm.BSON.ObjectId;
  date!: string;
  category!: string;
  amount!: number;
  note!: string;
  allocationDebt!: number;
  allocationSavings!: number;
  allocationCash!: number;
  /** DebtModel._id (hex) that received allocationDebt, if any */
  allocationDebtId!: string;
  /** SavingModel._id (hex) that received allocationSavings, if any */
  allocationSavingId!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Income',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date: 'string',
      category: 'string',
      amount: 'double',
      note: { type: 'string', default: '' },
      allocationDebt: { type: 'double', default: 0 },
      allocationSavings: { type: 'double', default: 0 },
      allocationCash: { type: 'double', default: 0 },
      allocationDebtId: { type: 'string', default: '' },
      allocationSavingId: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
