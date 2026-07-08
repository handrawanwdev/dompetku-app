import Realm from 'realm';
import { FinancialMilestoneModel } from '../models/FinancialMilestoneModel';
import { ACHIEVEMENT_DEFS, AchievementType } from '../utils/achievements';

export interface AchievementCheckInput {
  hasSavingWithBalance: boolean;
  hasPaidOffDebt: boolean;
  hasInvestment: boolean;
  score: number;
}

/** Unlocks any not-yet-achieved milestone whose condition is now met. Idempotent — safe to call on every dashboard load. */
export function checkAndUnlockAchievements(realm: Realm, input: AchievementCheckInput): AchievementType[] {
  const unlocked = new Set(realm.objects(FinancialMilestoneModel).map((m) => m.type as AchievementType));

  const shouldUnlock: Record<AchievementType, boolean> = {
    first_saving: input.hasSavingWithBalance,
    debt_killer: input.hasPaidOffDebt,
    first_investor: input.hasInvestment,
    freedom_seeker: input.score > 80,
  };

  const newlyUnlocked = ACHIEVEMENT_DEFS.filter((def) => !unlocked.has(def.type) && shouldUnlock[def.type]);
  if (!newlyUnlocked.length) return [];

  realm.write(() => {
    for (const def of newlyUnlocked) {
      realm.create(FinancialMilestoneModel, {
        type: def.type,
        title: def.title,
        achievedAt: new Date(),
      });
    }
  });

  return newlyUnlocked.map((d) => d.type);
}
