import Realm, { ObjectSchema } from 'realm';

export class SavingModel extends Realm.Object<SavingModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  target!: number;
  balance!: number;
  emoji!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Saving',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      target: 'double',
      balance: { type: 'double', default: 0 },
      emoji: { type: 'string', default: '💰' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
