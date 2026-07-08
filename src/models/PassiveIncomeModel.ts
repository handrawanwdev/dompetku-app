import Realm, { ObjectSchema } from 'realm';

export class PassiveIncomeModel extends Realm.Object<PassiveIncomeModel> {
  _id!: Realm.BSON.ObjectId;
  /** 'dividen' | 'properti' | 'bisnis' | 'royalti' | 'yield' */
  category!: string;
  amount!: number;
  /** 'monthly' | 'yearly' */
  frequency!: string;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'PassiveIncome',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      category: 'string',
      amount: 'double',
      frequency: { type: 'string', default: 'monthly' },
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
