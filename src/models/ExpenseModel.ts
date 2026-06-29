import Realm, { ObjectSchema } from 'realm';

export class ExpenseModel extends Realm.Object<ExpenseModel> {
  _id!: Realm.BSON.ObjectId;
  date!: string;
  category!: string;
  amount!: number;
  source!: string;
  note!: string;
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
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
