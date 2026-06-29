import Realm, { ObjectSchema } from 'realm';

export class DebtModel extends Realm.Object<DebtModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  lender!: string;
  totalAmount!: number;
  monthlyInstallment!: number;
  remainingMonth!: number;
  /** Day of month (1–31) on which the installment is due */
  dueDate!: number;
  startDate!: string;
  note!: string;
  isActive!: boolean;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Debt',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      lender: 'string',
      totalAmount: 'double',
      monthlyInstallment: 'double',
      remainingMonth: 'int',
      dueDate: 'int',
      startDate: 'string',
      note: { type: 'string', default: '' },
      isActive: { type: 'bool', default: true },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
