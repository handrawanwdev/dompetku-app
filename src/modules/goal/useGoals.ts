import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import { GoalModel } from '../../models/GoalModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { buildGoalInfos } from '../../services/GoalService';

/** Semua goal + progres yang dihitung dari transaksi yang ditandai. */
export function useGoals() {
  const goals = useQuery(GoalModel, (c) => c.sorted('createdAt'), []);
  const tagged = useQuery(ExpenseModel, (c) => c.filtered('goalId != ""'), []);
  return useMemo(() => buildGoalInfos(goals, tagged), [goals, tagged]);
}
