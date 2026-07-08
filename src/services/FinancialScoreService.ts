import Realm from 'realm';
import dayjs from 'dayjs';
import { FinancialScoreModel } from '../models/FinancialScoreModel';
import { computeFinancialScore, getLevel, FinancialScoreInput } from '../utils/financialScore';

/**
 * Computes today's score and upserts a single snapshot per calendar day
 * (re-running later the same day updates today's row instead of stacking dupes).
 */
export function saveFinancialScoreSnapshot(realm: Realm, input: FinancialScoreInput, netWorth: number) {
  const result = computeFinancialScore(input);
  const level = getLevel(result.score).level;
  const todayStart = dayjs().startOf('day').toDate();

  realm.write(() => {
    const existing = realm
      .objects(FinancialScoreModel)
      .filtered('createdAt >= $0', todayStart)
      .sorted('createdAt', true)[0];

    if (existing) {
      existing.score = result.score;
      existing.cashflowScore = result.cashflowScore;
      existing.emergencyScore = result.emergencyScore;
      existing.debtScore = result.debtScore;
      existing.investmentScore = result.investmentScore;
      existing.passiveScore = result.passiveScore;
      existing.level = level;
      existing.netWorth = netWorth;
    } else {
      realm.create(FinancialScoreModel, {
        _id: new Realm.BSON.ObjectId(),
        score: result.score,
        cashflowScore: result.cashflowScore,
        emergencyScore: result.emergencyScore,
        debtScore: result.debtScore,
        investmentScore: result.investmentScore,
        passiveScore: result.passiveScore,
        level,
        netWorth,
        createdAt: new Date(),
      });
    }
  });

  return { ...result, level };
}
