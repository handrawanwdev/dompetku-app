import Realm, { ObjectSchema } from 'realm';

export class FinancialMilestoneModel extends Realm.Object<FinancialMilestoneModel> {
  _id!: Realm.BSON.ObjectId;
  /** Matches AchievementType in utils/achievements.ts */
  type!: string;
  title!: string;
  achievedAt!: Date;

  static schema: ObjectSchema = {
    name: 'FinancialMilestone',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      type: 'string',
      title: 'string',
      achievedAt: { type: 'date', default: () => new Date() },
    },
  };
}
