import Realm from 'realm';
import { ALL_MODELS } from '../models';

export const realmConfig: Realm.Configuration = {
  schema: ALL_MODELS,
  schemaVersion: 8,
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 8) {
      const oldGoals = oldRealm.objects('Goal');
      const newGoals = newRealm.objects('Goal');
      for (let i = 0; i < oldGoals.length; i++) {
        const oldGoal = oldGoals[i] as unknown as { savingId: string; name: string; target: number; emoji: string; manualAmount?: number };
        if (!oldGoal.savingId) {
          const saving = newRealm.create('Saving', {
            _id: new Realm.BSON.ObjectId(),
            name: oldGoal.name,
            target: oldGoal.target,
            balance: oldGoal.manualAmount ?? 0,
            emoji: oldGoal.emoji,
            createdAt: new Date(),
          });
          (newGoals[i] as unknown as { savingId: string }).savingId = (saving as unknown as Realm.Object & { _id: Realm.BSON.ObjectId })._id.toHexString();
        }
      }

      // New bool property's schema `default` isn't backfilled onto pre-existing
      // rows by Realm migrations (it only applies to newly-created objects) —
      // existing PassiveIncome rows predate the one-off/recurring distinction
      // and were always meant to behave as recurring, so backfill explicitly.
      const newPassiveIncomes = newRealm.objects('PassiveIncome') as unknown as Array<{ recurring: boolean }>;
      for (const p of newPassiveIncomes) {
        p.recurring = true;
      }
    }
  },
};
