import Realm, { ObjectSchema } from 'realm';

export class SavingHistoryModel extends Realm.Object<SavingHistoryModel> {
  _id!: Realm.BSON.ObjectId;
  savingId!: string;
  /** 'deposit' | 'withdraw' | 'transfer' */
  type!: string;
  amount!: number;
  date!: string;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'SavingHistory',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      savingId: 'string',
      type: 'string',
      amount: 'double',
      date: 'string',
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
