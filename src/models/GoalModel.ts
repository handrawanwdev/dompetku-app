import Realm, { ObjectSchema } from 'realm';

export class GoalModel extends Realm.Object<GoalModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  target!: number;
  deadline!: string;
  savingId!: string;
  emoji!: string;
  /** Manual progress amount, used when savingId is empty (unlinked goal) */
  manualAmount!: number;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Goal',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      target: 'double',
      deadline: 'string',
      savingId: 'string',
      emoji: { type: 'string', default: '🎯' },
      manualAmount: { type: 'double', default: 0 },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
