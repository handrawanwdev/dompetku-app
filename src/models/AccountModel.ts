import Realm, { ObjectSchema } from 'realm';

/** Kantong uang: rekening bank, e-wallet, tunai, dll. Saldonya dihitung dari transaksi. */
export class AccountModel extends Realm.Object<AccountModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  /** 'bank' | 'ewallet' | 'cash' | 'other' */
  type!: string;
  /** Kantong utama: dipakai otomatis untuk transaksi baru. */
  isMain!: boolean;
  /** Kantong tabungan (dipisah dari kantong harian). */
  isSavings!: boolean;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Account',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      type: { type: 'string', default: 'bank' },
      isMain: { type: 'bool', default: false },
      isSavings: { type: 'bool', default: false },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
