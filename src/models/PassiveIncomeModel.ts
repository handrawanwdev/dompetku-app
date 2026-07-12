import Realm, { ObjectSchema } from 'realm';

export class PassiveIncomeModel extends Realm.Object<PassiveIncomeModel> {
  _id!: Realm.BSON.ObjectId;
  /** 'dividen' | 'properti' | 'bisnis' | 'royalti' | 'yield' */
  category!: string;
  amount!: number;
  /** 'monthly' | 'yearly' */
  frequency!: string;
  note!: string;
  /** true = recurring stream, auto-generates Income on schedule (1st of month / 1 Jan). false = one-off realized event (e.g. dividend), already credited to cash at creation. */
  recurring!: boolean;
  /** Last period this entry auto-generated an Income for ('YYYY-MM' monthly, 'YYYY' yearly). Prevents double-generation. */
  lastGeneratedPeriod!: string;
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
      recurring: { type: 'bool', default: true },
      lastGeneratedPeriod: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
