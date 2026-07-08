import Realm, { ObjectSchema } from 'realm';

export class FinancialScoreModel extends Realm.Object<FinancialScoreModel> {
  _id!: Realm.BSON.ObjectId;
  score!: number;
  cashflowScore!: number;
  emergencyScore!: number;
  debtScore!: number;
  investmentScore!: number;
  passiveScore!: number;
  level!: number;
  netWorth!: number;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'FinancialScore',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      score: 'double',
      cashflowScore: 'double',
      emergencyScore: 'double',
      debtScore: 'double',
      investmentScore: 'double',
      passiveScore: 'double',
      level: 'int',
      netWorth: { type: 'double', default: 0 },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
