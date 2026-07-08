// Financial Freedom Score engine — see docs/upgrade-system.md §5-6.

export function calcCashflowScore(monthlyIncome: number, monthlyExpense: number): number {
  if (monthlyIncome <= 0) return 0;
  const savingRate = (monthlyIncome - monthlyExpense) / monthlyIncome;
  if (savingRate < 0) return 0;
  if (savingRate < 0.1) return 40;
  if (savingRate < 0.2) return 60;
  if (savingRate < 0.4) return 80;
  return 100;
}

export function calcEmergencyFundScore(emergencyFund: number, monthlyExpense: number): number {
  if (monthlyExpense <= 0) return emergencyFund > 0 ? 100 : 20;
  const coverageMonths = emergencyFund / monthlyExpense;
  if (coverageMonths < 1) return 20;
  if (coverageMonths < 3) return 50;
  if (coverageMonths < 6) return 75;
  return 100;
}

export function calcDebtHealthScore(monthlyDebtInstallment: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return monthlyDebtInstallment > 0 ? 0 : 100;
  const debtRatio = (monthlyDebtInstallment / monthlyIncome) * 100;
  if (debtRatio > 50) return 0;
  if (debtRatio > 35) return 40;
  if (debtRatio > 20) return 70;
  return 100;
}

/**
 * No dedicated "contribution regularity" tracking yet, so investment health is
 * approximated from total invested capital relative to annual income.
 */
export function calcInvestmentHealthScore(totalInvestedValue: number, monthlyIncome: number): number {
  if (totalInvestedValue <= 0) return 0;
  const annualIncome = monthlyIncome * 12;
  if (annualIncome <= 0) return 40;
  const ratio = totalInvestedValue / annualIncome;
  if (ratio < 0.05) return 40;
  if (ratio < 0.2) return 70;
  return 100;
}

export function calcPassiveIncomeScore(passiveIncome: number, monthlyExpense: number): number {
  if (monthlyExpense <= 0) return passiveIncome > 0 ? 100 : 0;
  const passiveRatio = passiveIncome / monthlyExpense;
  if (passiveRatio <= 0) return 0;
  if (passiveRatio < 0.25) return 30;
  if (passiveRatio < 0.75) return 60;
  return 100;
}

export interface FinancialScoreInput {
  monthlyIncome: number;
  monthlyExpense: number;
  emergencyFund: number;
  monthlyDebtInstallment: number;
  totalInvestedValue: number;
  passiveIncome: number;
}

export interface FinancialScoreResult {
  score: number;
  cashflowScore: number;
  emergencyScore: number;
  debtScore: number;
  investmentScore: number;
  passiveScore: number;
}

const WEIGHTS = {
  cashflow: 0.25,
  emergency: 0.2,
  debt: 0.2,
  investment: 0.2,
  passive: 0.15,
};

export interface FinancialLevel {
  level: number;
  name: string;
  icon: string;
  min: number;
  max: number;
}

// PRD §4 — ranges are inclusive of min, exclusive of max (level 9 caps at 100 inclusive).
export const FINANCIAL_LEVELS: FinancialLevel[] = [
  { level: 0, name: 'Financial Chaos', icon: '🌪️', min: 0, max: 10 },
  { level: 1, name: 'Awareness', icon: '👁️', min: 10, max: 20 },
  { level: 2, name: 'Survivor', icon: '🛟', min: 20, max: 30 },
  { level: 3, name: 'Stable', icon: '⚖️', min: 30, max: 45 },
  { level: 4, name: 'Secure', icon: '🛡️', min: 45, max: 60 },
  { level: 5, name: 'Flexible', icon: '🤸', min: 60, max: 75 },
  { level: 6, name: 'Financial Independent', icon: '🦅', min: 75, max: 85 },
  { level: 7, name: 'Financial Freedom', icon: '🕊️', min: 85, max: 95 },
  { level: 8, name: 'Wealth Builder', icon: '🏗️', min: 95, max: 99 },
  { level: 9, name: 'Legacy', icon: '👑', min: 99, max: 101 },
];

export function getLevel(score: number): FinancialLevel {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    FINANCIAL_LEVELS.find((l) => clamped >= l.min && clamped < l.max) ??
    FINANCIAL_LEVELS[FINANCIAL_LEVELS.length - 1]
  );
}

export function getNextLevel(score: number): FinancialLevel | null {
  const current = getLevel(score);
  return FINANCIAL_LEVELS.find((l) => l.level === current.level + 1) ?? null;
}

/** Score points still needed to reach the next level; 0 if already at max level. */
export function scoreNeededForNext(score: number): number {
  const next = getNextLevel(score);
  if (!next) return 0;
  return Math.max(0, next.min - score);
}

export function computeFinancialScore(input: FinancialScoreInput): FinancialScoreResult {
  const cashflowScore = calcCashflowScore(input.monthlyIncome, input.monthlyExpense);
  const emergencyScore = calcEmergencyFundScore(input.emergencyFund, input.monthlyExpense);
  const debtScore = calcDebtHealthScore(input.monthlyDebtInstallment, input.monthlyIncome);
  const investmentScore = calcInvestmentHealthScore(input.totalInvestedValue, input.monthlyIncome);
  const passiveScore = calcPassiveIncomeScore(input.passiveIncome, input.monthlyExpense);

  const score = Math.round(
    cashflowScore * WEIGHTS.cashflow +
    emergencyScore * WEIGHTS.emergency +
    debtScore * WEIGHTS.debt +
    investmentScore * WEIGHTS.investment +
    passiveScore * WEIGHTS.passive
  );

  return { score, cashflowScore, emergencyScore, debtScore, investmentScore, passiveScore };
}
