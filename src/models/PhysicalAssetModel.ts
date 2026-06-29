import Realm, { ObjectSchema } from 'realm';

export class PhysicalAssetModel extends Realm.Object<PhysicalAssetModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  /** 'laptop' | 'phone' | 'vehicle' | 'house' | 'electronics' | 'furniture' | 'other' */
  category!: string;
  purchasePrice!: number;
  purchaseDate!: string;
  /** Useful life in years */
  usefulLife!: number;
  residualValue!: number;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'PhysicalAsset',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      category: 'string',
      purchasePrice: 'double',
      purchaseDate: 'string',
      usefulLife: { type: 'int', default: 5 },
      residualValue: { type: 'double', default: 0 },
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
