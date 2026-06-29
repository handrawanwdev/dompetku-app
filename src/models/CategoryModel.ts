import Realm, { ObjectSchema } from 'realm';

export class CategoryModel extends Realm.Object<CategoryModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  /** 'income' | 'expense' */
  type!: string;
  emoji!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      type: 'string',
      emoji: { type: 'string', default: '📌' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
