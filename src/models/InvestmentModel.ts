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
  /** Whether this position has been sold (realized) */
  sold!: boolean;
  /** Total lump-sum sell proceeds, when sold */
  sellPrice!: number;
  sellDate!: string;
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
      sold: { type: 'bool', default: false },
      sellPrice: { type: 'double', default: 0 },
      sellDate: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
