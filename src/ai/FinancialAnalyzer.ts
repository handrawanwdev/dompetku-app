import { FinancialScoreInput, FinancialScoreResult, computeFinancialScore, getLevel } from '../utils/financialScore';

// PRD §7 — Financial Analyzer output ("financial profile").
export interface FinancialProfile {
  income: number;
  expense: number;
  /** Percent, e.g. 30 = 30% */
  savingRate: number;
  /** Percent of income */
  debtRatio: number;
  /** Months of expense coverage */
  emergencyMonth: number;
  /** Percent of annual income */
  investmentRatio: number;
  /** Percent of monthly expense covered by passive income */
  passiveIncomeRatio: number;
  score: number;
  /** Level name, upper-snake-case (e.g. FINANCIAL_INDEPENDENT) */
  level: string;
  /** Underlying sub-scores, kept for Score Explanation (PRD §10) */
  scoreDetail: FinancialScoreResult;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Turns raw financial data into a FinancialProfile. Delegates scoring to the existing Financial Freedom Score engine so results stay consistent with the rest of the app. */
export function analyzeFinancialProfile(input: FinancialScoreInput): FinancialProfile {
  const scoreDetail = computeFinancialScore(input);
  const level = getLevel(scoreDetail.score);

  const savingRate = input.monthlyIncome > 0
    ? ((input.monthlyIncome - input.monthlyExpense) / input.monthlyIncome) * 100
    : 0;
  // No income but still owing installments is the worst case, not a safe 0% ratio —
  // mirrors calcDebtHealthScore's own monthlyIncome<=0 edge case (utils/financialScore.ts).
  const debtRatio = input.monthlyIncome > 0
    ? (input.monthlyDebtInstallment / input.monthlyIncome) * 100
    : (input.monthlyDebtInstallment > 0 ? 100 : 0);
  const emergencyMonth = input.monthlyExpense > 0
    ? input.emergencyFund / input.monthlyExpense
    : (input.emergencyFund > 0 ? 99 : 0);
  const annualIncome = input.monthlyIncome * 12;
  // Holding investments with zero recorded income shouldn't read as "no productive assets".
  const investmentRatio = annualIncome > 0
    ? (input.totalInvestedValue / annualIncome) * 100
    : (input.totalInvestedValue > 0 ? 100 : 0);
  const passiveIncomeRatio = input.monthlyExpense > 0 ? (input.passiveIncome / input.monthlyExpense) * 100 : 0;

  return {
    income: input.monthlyIncome,
    expense: input.monthlyExpense,
    savingRate: round1(savingRate),
    debtRatio: round1(debtRatio),
    emergencyMonth: round1(emergencyMonth),
    investmentRatio: round1(investmentRatio),
    passiveIncomeRatio: round1(passiveIncomeRatio),
    score: scoreDetail.score,
    level: level.name.toUpperCase().replace(/\s+/g, '_'),
    scoreDetail,
  };
}
