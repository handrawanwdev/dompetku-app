import Realm, { ObjectSchema } from 'realm';

export class DebtPaymentModel extends Realm.Object<DebtPaymentModel> {
  _id!: Realm.BSON.ObjectId;
  debtId!: string;
  amount!: number;
  date!: string;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'DebtPayment',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      debtId: 'string',
      amount: 'double',
      date: 'string',
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
