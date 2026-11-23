import Realm, { ObjectSchema } from 'realm';

/** Pindah saldo antar kantong. Tidak mengubah saldo total. */
export class TransferModel extends Realm.Object<TransferModel> {
  _id!: Realm.BSON.ObjectId;
  /** AccountModel._id (hex). '' = saldo yang belum masuk kantong mana pun. */
  fromId!: string;
  toId!: string;
  amount!: number;
  note!: string;
  date!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Transfer',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      fromId: { type: 'string', default: '' },
      toId: { type: 'string', default: '' },
      amount: 'double',
      note: { type: 'string', default: '' },
      date: 'string',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
