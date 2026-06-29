import Realm, { ObjectSchema } from 'realm';

export class InvestmentModel extends Realm.Object<InvestmentModel> {
  _id!: Realm.BSON.ObjectId;
  /** 'stock' | 'crypto' | 'gold' | 'mutual_fund' | 'bond' | 'property' */
  type!: string;
  name!: string;
  buyPrice!: number;
  quantity!: number;
  currentPrice!: number;
  buyDate!: string;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Investment',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      type: 'string',
      name: 'string',
      buyPrice: 'double',
      quantity: 'double',
      currentPrice: 'double',
      buyDate: 'string',
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
