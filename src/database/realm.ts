import Realm from 'realm';
import { ALL_MODELS } from '../models';

export const realmConfig: Realm.Configuration = {
  schema: ALL_MODELS,
  schemaVersion: 11,
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 11) {
      // New string/double properties' schema `default` isn't backfilled onto
      // pre-existing rows by Realm migrations — existing Debt rows predate the
      // multi-type distinction and were always the fixed-installment kind.
      const newDebts = newRealm.objects('Debt') as unknown as Array<{ debtType: string; dueDateFull: string; currentBalance: number }>;
      for (const d of newDebts) {
        if (!d.debtType) d.debtType = 'cicilan';
        if (d.dueDateFull === undefined || d.dueDateFull === null) d.dueDateFull = '';
        if (d.currentBalance === undefined || d.currentBalance === null) d.currentBalance = 0;
      }
    }

    if (oldRealm.schemaVersion < 9) {
      // New string properties aren't reliably backfilled onto pre-existing
      // rows by Realm migrations — existing DebtPayment rows predate the
      // cash/savings funding source, so backfill explicitly.
      const newDebtPayments = newRealm.objects('DebtPayment') as unknown as Array<{ source: string; savingId: string }>;
      for (const p of newDebtPayments) {
        if (!p.source) p.source = 'cash';
        if (p.savingId === undefined || p.savingId === null) p.savingId = '';
      }
    }

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
