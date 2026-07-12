import Realm, { ObjectSchema } from 'realm';

export class GoalModel extends Realm.Object<GoalModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  target!: number;
  deadline!: string;
  /** SavingModel._id (hex) — every goal must be linked to a saving pos */
  savingId!: string;
  emoji!: string;
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
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
